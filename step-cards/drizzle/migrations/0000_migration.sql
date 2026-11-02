-- ===== Enums =====
CREATE TYPE public.org_role AS ENUM ('admin', 'teacher');
CREATE TYPE public.reading_level AS ENUM ('grade2', 'grade4', 'grade6', 'pictogram_only');
CREATE TYPE public.lesson_status AS ENUM ('review', 'live', 'ended');

-- ===== Helpers =====
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Unambiguous 6-character join code (no 0/O/1/I/L)
CREATE OR REPLACE FUNCTION public.gen_join_code()
RETURNS text LANGUAGE plpgsql VOLATILE SET search_path = public AS $$
DECLARE
  alphabet text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  result text := '';
  i int;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
  END LOOP;
  RETURN result;
END; $$;

-- ===== Profiles =====
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NULLIF(NEW.raw_user_meta_data->>'display_name', ''), NULLIF(NEW.raw_user_meta_data->>'full_name', ''), NULLIF(NEW.raw_user_meta_data->>'name', ''), split_part(NEW.email, '@', 1), 'Teacher'))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===== Organizations =====
CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  invite_code text NOT NULL UNIQUE DEFAULT public.gen_join_code(),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organizations TO authenticated;
GRANT ALL ON public.organizations TO service_role;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role public.org_role NOT NULL DEFAULT 'teacher',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (org_id, user_id)
);
CREATE INDEX organization_members_user_idx ON public.organization_members(user_id);
GRANT SELECT, DELETE ON public.organization_members TO authenticated;
GRANT ALL ON public.organization_members TO service_role;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_org_member(_org_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.organization_members WHERE org_id = _org_id AND user_id = _user_id)
$$;

CREATE OR REPLACE FUNCTION public.is_org_admin(_org_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.organization_members WHERE org_id = _org_id AND user_id = _user_id AND role = 'admin')
$$;

-- Creator of an organization becomes its admin
CREATE OR REPLACE FUNCTION public.handle_new_org()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.organization_members (org_id, user_id, role) VALUES (NEW.id, NEW.created_by, 'admin')
  ON CONFLICT (org_id, user_id) DO UPDATE SET role = 'admin';
  RETURN NEW;
END; $$;
CREATE TRIGGER on_org_created AFTER INSERT ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.handle_new_org();

CREATE POLICY "Members view their organizations" ON public.organizations FOR SELECT TO authenticated
  USING (public.is_org_member(id, auth.uid()) OR created_by = auth.uid());
CREATE POLICY "Signed-in users create organizations" ON public.organizations FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());
CREATE POLICY "Admins update organizations" ON public.organizations FOR UPDATE TO authenticated
  USING (public.is_org_admin(id, auth.uid())) WITH CHECK (public.is_org_admin(id, auth.uid()));
CREATE POLICY "Admins delete organizations" ON public.organizations FOR DELETE TO authenticated
  USING (public.is_org_admin(id, auth.uid()));

CREATE POLICY "Members view fellow members" ON public.organization_members FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_org_member(org_id, auth.uid()));
CREATE POLICY "Admins remove members or members leave" ON public.organization_members FOR DELETE TO authenticated
  USING (public.is_org_admin(org_id, auth.uid()) OR (user_id = auth.uid() AND role = 'teacher'));

-- Profiles: self, plus fellow organization members can see display names
CREATE POLICY "Users view own and org members' profiles" ON public.profiles FOR SELECT TO authenticated
  USING (
    id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.organization_members me
      JOIN public.organization_members them ON them.org_id = me.org_id
      WHERE me.user_id = auth.uid() AND them.user_id = profiles.id
    )
  );
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- ===== Classes =====
CREATE TABLE public.classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  teacher_id uuid NOT NULL,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
  join_code text NOT NULL UNIQUE DEFAULT public.gen_join_code(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX classes_teacher_idx ON public.classes(teacher_id);
CREATE INDEX classes_org_idx ON public.classes(org_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classes TO authenticated;
GRANT ALL ON public.classes TO service_role;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.can_access_class(_class_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.classes c
    WHERE c.id = _class_id
      AND (c.teacher_id = _user_id OR (c.org_id IS NOT NULL AND public.is_org_admin(c.org_id, _user_id)))
  )
$$;

CREATE POLICY "Teachers and org admins view classes" ON public.classes FOR SELECT TO authenticated
  USING (teacher_id = auth.uid() OR (org_id IS NOT NULL AND public.is_org_admin(org_id, auth.uid())));
CREATE POLICY "Teachers create own classes" ON public.classes FOR INSERT TO authenticated
  WITH CHECK (teacher_id = auth.uid() AND (org_id IS NULL OR public.is_org_member(org_id, auth.uid())));
CREATE POLICY "Teachers update own classes" ON public.classes FOR UPDATE TO authenticated
  USING (teacher_id = auth.uid()) WITH CHECK (teacher_id = auth.uid() AND (org_id IS NULL OR public.is_org_member(org_id, auth.uid())));
CREATE POLICY "Teachers delete own classes" ON public.classes FOR DELETE TO authenticated
  USING (teacher_id = auth.uid());

-- ===== Students (nickname only — no real names, photos or diagnoses) =====
CREATE TABLE public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  nickname text NOT NULL CHECK (char_length(nickname) BETWEEN 1 AND 24),
  reading_level public.reading_level NOT NULL DEFAULT 'grade4',
  pictogram_only boolean NOT NULL DEFAULT false,
  avatar text NOT NULL DEFAULT 'circle',
  completion_history jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX students_class_idx ON public.students(class_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.students TO authenticated;
GRANT ALL ON public.students TO service_role;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Class staff view students" ON public.students FOR SELECT TO authenticated USING (public.can_access_class(class_id, auth.uid()));
CREATE POLICY "Class staff add students" ON public.students FOR INSERT TO authenticated WITH CHECK (public.can_access_class(class_id, auth.uid()));
CREATE POLICY "Class staff update students" ON public.students FOR UPDATE TO authenticated USING (public.can_access_class(class_id, auth.uid())) WITH CHECK (public.can_access_class(class_id, auth.uid()));
CREATE POLICY "Class staff remove students" ON public.students FOR DELETE TO authenticated USING (public.can_access_class(class_id, auth.uid()));

-- ===== Lessons (one spoken instruction) =====
CREATE TABLE public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  created_by uuid NOT NULL,
  title text NOT NULL,
  instruction text NOT NULL,
  routine_key text NOT NULL DEFAULT '',
  status public.lesson_status NOT NULL DEFAULT 'review',
  created_at timestamptz NOT NULL DEFAULT now(),
  approved_at timestamptz,
  ended_at timestamptz
);
CREATE INDEX lessons_class_idx ON public.lessons(class_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lessons TO authenticated;
GRANT ALL ON public.lessons TO service_role;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Class staff view lessons" ON public.lessons FOR SELECT TO authenticated USING (public.can_access_class(class_id, auth.uid()));
CREATE POLICY "Class staff create lessons" ON public.lessons FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid() AND public.can_access_class(class_id, auth.uid()));
CREATE POLICY "Class staff update lessons" ON public.lessons FOR UPDATE TO authenticated USING (public.can_access_class(class_id, auth.uid())) WITH CHECK (public.can_access_class(class_id, auth.uid()));
CREATE POLICY "Class staff delete lessons" ON public.lessons FOR DELETE TO authenticated USING (public.can_access_class(class_id, auth.uid()));

-- ===== Lesson cards (one personalised card set per student) =====
CREATE TABLE public.lesson_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  current_step int NOT NULL DEFAULT 0,
  help_step int,
  help_requested_at timestamptz,
  help_count int NOT NULL DEFAULT 0,
  completed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (lesson_id, student_id)
);
CREATE INDEX lesson_cards_class_idx ON public.lesson_cards(class_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_cards TO authenticated;
GRANT ALL ON public.lesson_cards TO service_role;
ALTER TABLE public.lesson_cards ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER lesson_cards_updated_at BEFORE UPDATE ON public.lesson_cards FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "Class staff view cards" ON public.lesson_cards FOR SELECT TO authenticated USING (public.can_access_class(class_id, auth.uid()));
CREATE POLICY "Class staff create cards" ON public.lesson_cards FOR INSERT TO authenticated WITH CHECK (public.can_access_class(class_id, auth.uid()));
CREATE POLICY "Class staff update cards" ON public.lesson_cards FOR UPDATE TO authenticated USING (public.can_access_class(class_id, auth.uid())) WITH CHECK (public.can_access_class(class_id, auth.uid()));
CREATE POLICY "Class staff delete cards" ON public.lesson_cards FOR DELETE TO authenticated USING (public.can_access_class(class_id, auth.uid()));

-- ===== Student devices (server-only; students never sign in) =====
CREATE TABLE public.student_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.student_devices TO service_role;
ALTER TABLE public.student_devices ENABLE ROW LEVEL SECURITY;
-- No policies: only trusted server code (service role) reads or writes devices.

-- Live updates for the teacher board
ALTER TABLE public.lesson_cards REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lesson_cards;