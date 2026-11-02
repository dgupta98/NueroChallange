ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS fading_pace text NOT NULL DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS help_choice text NOT NULL DEFAULT 'same';
ALTER TABLE public.students
  ADD CONSTRAINT students_fading_pace_check CHECK (fading_pace IN ('gentle','standard','quick')),
  ADD CONSTRAINT students_help_choice_check CHECK (help_choice IN ('more','same','less'));

ALTER TABLE public.lesson_cards
  ADD COLUMN IF NOT EXISTS home_practice_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS home_practiced_at timestamptz,
  ADD COLUMN IF NOT EXISTS break_started_at timestamptz;

ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS then_activity text NOT NULL DEFAULT '';