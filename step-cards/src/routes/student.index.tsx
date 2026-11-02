import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

import { StudentTopBar } from "@/components/student/StudentTopBar";
import { getSpacesSummary } from "@/lib/student.functions";
import { loadSpaces, type StudentSpace } from "@/lib/step-cards/student-spaces";
import { avatarGlyph } from "@/lib/step-cards/types";

export const Route = createFileRoute("/student/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "My classes — Step Cards" },
      { name: "description", content: "All your classes on this tablet. Tap one to see your cards." },
      { property: "og:title", content: "My classes — Step Cards" },
      { property: "og:description", content: "All your classes on this tablet. Tap one to see your cards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: StudentHome,
});

function StudentHome() {
  const [spaces, setSpaces] = useState<StudentSpace[] | null>(null);
  useEffect(() => setSpaces(loadSpaces()), []);
  const summarize = useServerFn(getSpacesSummary);

  const tokens = (spaces ?? []).map((s) => s.token);
  const { data: summary } = useQuery({
    queryKey: ["student-spaces", tokens],
    queryFn: () => summarize({ data: { tokens } }),
    enabled: tokens.length > 0,
    refetchInterval: 10_000,
  });
  const byToken = new Map((summary ?? []).map((s) => [s.token, s]));

  if (spaces === null) return null;

  const first = spaces[0];

  return (
    <div className="flex min-h-screen flex-col">
      <StudentTopBar
        avatar={first?.avatar}
        title={first ? `Hi, ${first.nickname}` : "Step Cards"}
        subtitle={spaces.length ? "My classes" : undefined}
      />
      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        {spaces.length === 0 ? (
          <div className="surface mx-auto max-w-md p-8 text-center">
            <h1 className="font-display text-2xl font-semibold">This tablet isn't set up yet</h1>
            <p className="mt-2 text-muted-foreground">Join your class with the code from your teacher.</p>
            <Link to="/join" className="btn-primary btn-lg mt-6">Join my class</Link>
          </div>
        ) : (
          <>
            <h1 className="font-display text-3xl font-semibold">My classes</h1>
            <p className="mt-2 text-lg text-muted-foreground">Tap a class to see your cards.</p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {spaces.map((s) => {
                const info = byToken.get(s.token);
                const waiting = info?.linked ? info.lessonTitle : null;
                const unlinked = info && !info.linked;
                return (
                  <li key={s.id}>
                    <Link
                      to="/student/$spaceId"
                      params={{ spaceId: s.id }}
                      className={`surface flex min-h-32 flex-col gap-3 p-5 transition-shadow hover:shadow-[var(--shadow-lift)] ${
                        waiting ? "ring-2 ring-primary/50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-2xl text-primary">
                          {avatarGlyph(s.avatar)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-xl font-bold">{info?.linked ? info.className || s.className : s.className}</p>
                          <p className="text-sm text-muted-foreground">as {s.nickname}</p>
                        </div>
                      </div>
                      {waiting ? (
                        <p className="chip self-start border-primary/40 bg-primary-soft text-primary">
                          <span aria-hidden="true">●</span> New cards: {waiting}
                        </p>
                      ) : unlinked ? (
                        <p className="text-sm text-muted-foreground">Needs joining again</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">No cards right now</p>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link to="/join" className="btn-outline btn-lg mt-6">
              <span aria-hidden="true">＋</span> Add another class
            </Link>
          </>
        )}
      </main>
    </div>
  );
}
