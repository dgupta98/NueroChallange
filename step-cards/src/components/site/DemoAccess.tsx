import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { supabase } from "@/integrations/supabase/client";
import { DEMO_STUDENTS, DEMO_TEACHER, type DemoStudentName } from "@/lib/step-cards/demo";
import { forgetAllSpaces, saveSpace, spaceIdFor } from "@/lib/step-cards/student-spaces";
import { demoStudentSignIn } from "@/lib/student.functions";

const THEME: Record<DemoStudentName, string> = { Leo: "trains", Mia: "sea" };

/** One-tap demo sign-in for a teacher and two students, all in a made-up demo school. */
export function DemoAccess({ show = "all" }: { show?: "all" | "students" }) {
  const navigate = useNavigate();
  const studentSignIn = useServerFn(demoStudentSignIn);

  const teacher = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signInWithPassword({ email: DEMO_TEACHER.email, password: DEMO_TEACHER.password });
      if (error) throw new Error("The demo teacher couldn't sign in. Please try again.");
    },
    onSuccess: () => navigate({ to: "/dashboard" }),
  });

  const student = useMutation({
    mutationFn: (nickname: DemoStudentName) => studentSignIn({ data: { nickname } }),
    onSuccess: (spaces, nickname) => {
      forgetAllSpaces();
      for (const s of [...spaces].reverse()) {
        saveSpace({ id: spaceIdFor(s.studentId, s.token), token: s.token, nickname: s.nickname, className: s.className, avatar: s.avatar, stickerTheme: THEME[nickname] });
      }
      navigate({ to: "/student" });
    },
  });

  const busy = teacher.isPending || student.isPending;
  const error = teacher.error ?? student.error;

  return (
    <section aria-labelledby="demo-title" className="surface-quiet p-5">
      <h2 id="demo-title" className="font-display text-lg font-semibold">Try the demo</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        A made-up school with two weeks of real use: three classes, finished cards, sticker books and a lesson happening now.
      </p>
      <div className="mt-4 flex flex-col gap-3">
        {show === "all" && (
          <button type="button" className="btn-primary w-full justify-between" disabled={busy} onClick={() => teacher.mutate()}>
            <span>Teacher: {DEMO_TEACHER.name}</span>
            <span aria-hidden="true">→</span>
          </button>
        )}
        {DEMO_STUDENTS.map((s) => (
          <button
            key={s.nickname}
            type="button"
            className="btn-outline h-auto w-full flex-col items-start gap-0.5 py-3 text-left"
            disabled={busy}
            onClick={() => student.mutate(s.nickname)}
          >
            <span className="font-bold">Student: {s.nickname}</span>
            <span className="text-sm font-normal text-muted-foreground">{s.about}</span>
          </button>
        ))}
      </div>
      {busy && <p className="mt-3 text-sm text-muted-foreground" role="status">Opening the demo…</p>}
      {error && <p className="notice-error mt-3" role="alert">{error.message}</p>}
      {show === "all" && (
        <p className="mt-3 text-xs text-muted-foreground">
          Demo teacher login: {DEMO_TEACHER.email} · {DEMO_TEACHER.password}
        </p>
      )}
    </section>
  );
}
