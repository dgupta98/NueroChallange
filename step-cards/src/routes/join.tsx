import { useMutation } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

import { Logo } from "@/components/brand/Logo";
import { DemoAccess } from "@/components/site/DemoAccess";
import { claimStudent, lookupClass } from "@/lib/student.functions";
import { formatCode, isValidCode, normalizeCode } from "@/lib/step-cards/codes";
import { loadSpaces, saveSpace, spaceIdFor } from "@/lib/step-cards/student-spaces";
import { avatarGlyph } from "@/lib/step-cards/types";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join your class — Step Cards" },
      { name: "description", content: "Students type their class code and tap their name to get their step cards." },
      { property: "og:title", content: "Join your class — Step Cards" },
      { property: "og:description", content: "Type your class code and tap your name." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: JoinPage,
});

function JoinPage() {
  const navigate = useNavigate();
  const lookup = useServerFn(lookupClass);
  const claim = useServerFn(claimStudent);
  const [code, setCode] = useState("");
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => setSavedCount(loadSpaces().length), []);

  const find = useMutation({ mutationFn: (c: string) => lookup({ data: { code: c } }) });
  const pick = useMutation({
    mutationFn: (studentId: string) => claim({ data: { code, studentId } }),
    onSuccess: (res) => {
      const id = spaceIdFor(res.studentId, res.token);
      saveSpace({ id, token: res.token, nickname: res.nickname, className: res.className, avatar: res.avatar });
      navigate({ to: "/student/$spaceId", params: { spaceId: id } });
    },
  });

  const step = find.data ? 2 : 1;

  return (
    <div className="hero-wash min-h-screen">
      <div className="container-page flex min-h-16 items-center justify-between py-2">
        <Logo />
        <Link to="/auth" className="btn-ghost text-sm text-muted-foreground">Teacher sign in</Link>
      </div>
      <main
        id="main"
        className={`mx-auto grid w-full gap-6 px-5 pt-4 pb-20 ${step === 1 ? "max-w-5xl lg:grid-cols-[minmax(0,36rem)_minmax(0,20rem)] lg:justify-center lg:items-start" : "max-w-xl"}`}
      >
        <div>
        <p className="text-center text-sm font-bold text-muted-foreground">Step {step} of 2</p>
        <div className="mx-auto mt-2 mb-6 h-2 max-w-xs overflow-hidden rounded-full bg-secondary" aria-hidden="true">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: step === 1 ? "50%" : "100%" }} />
        </div>

        {savedCount > 0 && step === 1 && (
          <div className="notice-info mb-5 items-center justify-between text-base">
            <span>
              This tablet already has {savedCount} class{savedCount === 1 ? "" : "es"}. You can add another one below.
            </span>
            <Link to="/student" className="btn-outline">My classes</Link>
          </div>
        )}

        {step === 1 && (
          <form
            className="surface p-7 text-center sm:p-9"
            onSubmit={(e) => {
              e.preventDefault();
              if (isValidCode(code)) find.mutate(code);
            }}
          >
            <h1 className="font-display text-3xl font-semibold">Type your class code</h1>
            <p className="mt-2 text-muted-foreground">Your teacher has it. It has 6 letters and numbers.</p>
            <label htmlFor="code" className="sr-only">Class code</label>
            <input
              id="code"
              inputMode="text"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              className="field mt-6 min-h-16 text-center font-display text-3xl tracking-[0.3em] uppercase"
              value={formatCode(code)}
              onChange={(e) => setCode(normalizeCode(e.target.value))}
              placeholder="ABC 234"
              aria-describedby="code-help"
            />
            <p id="code-help" className="mt-2 text-sm text-muted-foreground">{code.length} of 6 typed</p>
            {find.error && <p className="notice-error mt-4 text-left" role="alert">{find.error.message}</p>}
            <button type="submit" className="btn-primary btn-lg mt-6 w-full" disabled={!isValidCode(code) || find.isPending}>
              {find.isPending ? "Looking…" : "Next"}
            </button>
          </form>
        )}

        </div>
        {step === 1 && (
          <aside className="lg:sticky lg:top-6 lg:mt-8">
            <DemoAccess show="students" />
          </aside>
        )}

        {step === 2 && find.data && (
          <div className="surface p-7 sm:p-9">
            <h1 className="text-center font-display text-3xl font-semibold">Tap your name</h1>
            <p className="mt-2 text-center text-muted-foreground">{find.data.className}</p>
            {find.data.students.length === 0 ? (
              <p className="notice-info mt-6">Your teacher hasn't added names to this class yet.</p>
            ) : (
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {find.data.students.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => pick.mutate(s.id)}
                      disabled={pick.isPending}
                      className="btn-outline btn-lg w-full justify-start gap-4 py-4 text-xl"
                    >
                      <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-soft text-2xl text-primary">
                        {avatarGlyph(s.avatar)}
                      </span>
                      {s.nickname}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {pick.error && <p className="notice-error mt-4" role="alert">{pick.error.message}</p>}
            <button type="button" className="btn-ghost mt-6" onClick={() => find.reset()}>
              ← Different code
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
