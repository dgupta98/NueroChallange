import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { supabase } from "@/integrations/supabase/client";
import {
  DEMO_STUDENTS,
  DEMO_TEACHER,
  DEMO_TEACHER_2,
  type DemoStudentName,
} from "@/lib/step-cards/demo";
import { forgetAllSpaces, saveSpace, spaceIdFor } from "@/lib/step-cards/student-spaces";
import { demoStudentSignIn } from "@/lib/student.functions";

const STICKER_THEME: Record<DemoStudentName, string> = {
  Leo: "trains",
  Mia: "sea",
  Alex: "cooking",
  River: "art",
};

/** One-tap demo sign-in for two teachers and four students across two made-up schools. */
export function DemoAccess({ show = "all" }: { show?: "all" | "students" }) {
  const navigate = useNavigate();
  const studentSignIn = useServerFn(demoStudentSignIn);

  const teacher = useMutation({
    mutationFn: async (t: { email: string; password: string }) => {
      const { error } = await supabase.auth.signInWithPassword({ email: t.email, password: t.password });
      if (error) throw new Error("The demo teacher couldn't sign in. Please try again.");
    },
    onSuccess: () => navigate({ to: "/dashboard" }),
  });

  const student = useMutation({
    mutationFn: (nickname: DemoStudentName) => studentSignIn({ data: { nickname } }),
    onSuccess: (spaces, nickname) => {
      forgetAllSpaces();
      for (const s of [...spaces].reverse()) {
        saveSpace({
          id: spaceIdFor(s.studentId, s.token),
          token: s.token,
          nickname: s.nickname,
          className: s.className,
          avatar: s.avatar,
          stickerTheme: STICKER_THEME[nickname],
        });
      }
      navigate({ to: "/student" });
    },
  });

  const busy = teacher.isPending || student.isPending;
  const error = teacher.error ?? student.error;

  const riveraStudents = DEMO_STUDENTS.filter((s) => s.teacher === "Ms. Rivera");
  const chenStudents = DEMO_STUDENTS.filter((s) => s.teacher === "Mr. Chen");

  return (
    <section aria-labelledby="demo-title" className="surface-quiet p-5">
      <h2 id="demo-title" className="font-display text-lg font-semibold">Try the demo</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Two made-up schools with real lessons, finished cards, and sticker books.
      </p>

      {show === "all" && (
        <>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Teachers</p>
          <div className="mt-2 flex flex-col gap-2">
            {[DEMO_TEACHER, DEMO_TEACHER_2].map((t) => (
              <button
                key={t.email}
                type="button"
                className="btn-primary w-full justify-between"
                disabled={busy}
                onClick={() => teacher.mutate(t)}
              >
                <span>{t.name} · {t.school.replace(" (demo)", "")}</span>
                <span aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </>
      )}

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {show === "all" ? "Students" : "Try as a student"}
      </p>

      {show === "all" && (
        <p className="mt-1 text-xs text-muted-foreground">Ms. Rivera's class</p>
      )}
      <div className="mt-2 flex flex-col gap-2">
        {riveraStudents.map((s) => (
          <button
            key={s.nickname}
            type="button"
            className="btn-outline h-auto w-full flex-col items-start gap-0.5 py-3 text-left"
            disabled={busy}
            onClick={() => student.mutate(s.nickname as DemoStudentName)}
          >
            <span className="font-bold">Student: {s.nickname}</span>
            <span className="text-sm font-normal text-muted-foreground">{s.about}</span>
          </button>
        ))}
      </div>

      {show === "all" && (
        <>
          <p className="mt-3 text-xs text-muted-foreground">Mr. Chen's class</p>
          <div className="mt-2 flex flex-col gap-2">
            {chenStudents.map((s) => (
              <button
                key={s.nickname}
                type="button"
                className="btn-outline h-auto w-full flex-col items-start gap-0.5 py-3 text-left"
                disabled={busy}
                onClick={() => student.mutate(s.nickname as DemoStudentName)}
              >
                <span className="font-bold">Student: {s.nickname}</span>
                <span className="text-sm font-normal text-muted-foreground">{s.about}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {busy && <p className="mt-3 text-sm text-muted-foreground" role="status">Opening the demo…</p>}
      {error && <p className="notice-error mt-3" role="alert">{error.message}</p>}

      {show === "all" && (
        <p className="mt-3 text-xs text-muted-foreground">
          Teacher 1: {DEMO_TEACHER.email}<br />
          Teacher 2: {DEMO_TEACHER_2.email}<br />
          Password (both): {DEMO_TEACHER.password}
        </p>
      )}
    </section>
  );
}
