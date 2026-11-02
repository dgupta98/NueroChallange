import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { ClassHeader } from "@/components/app/ClassHeader";
import { InstructionComposer } from "@/components/app/InstructionComposer";
import { createLesson } from "@/lib/lessons.functions";
import { classQuery, lessonsQuery, studentsQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/classes/$classId")({
  head: () => ({
    meta: [
      { title: "Class — Step Cards" },
      { name: "description", content: "Give an instruction and send personal step cards to your class." },
      { property: "og:title", content: "Class — Step Cards" },
      { property: "og:description", content: "Give an instruction and send personal step cards to your class." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ClassPage,
});

const STATUS_LABEL = { review: "Waiting for your check", live: "Live now", ended: "Finished" } as const;

function ClassPage() {
  const { classId } = Route.useParams();
  const navigate = useNavigate();
  const make = useServerFn(createLesson);
  const { data: cls, isLoading } = useQuery(classQuery(classId));
  const { data: students } = useQuery(studentsQuery(classId));
  const { data: lessons } = useQuery(lessonsQuery(classId));
  const [reuseText, setReuseText] = useState("");

  const create = useMutation({
    mutationFn: (instruction: string) => make({ data: { classId, instruction } }),
    onSuccess: ({ lessonId }) => navigate({ to: "/lessons/$lessonId", params: { lessonId } }),
  });

  if (isLoading) return <p className="text-muted-foreground">Loading class…</p>;
  if (!cls) return <p className="notice-error">We couldn't find this class.</p>;

  const active = lessons?.find((l) => l.status === "live" || l.status === "review");
  const noStudents = students && students.length === 0;

  return (
    <div className="space-y-8">
      <ClassHeader classId={classId} name={cls.name} joinCode={cls.join_code} current="class" />

      {active && (
        <Link
          to="/lessons/$lessonId"
          params={{ lessonId: active.id }}
          className={`${active.status === "live" ? "notice-success" : "notice-info"} items-center justify-between text-base`}
        >
          <span>
            <strong>{active.status === "live" ? "Cards are live:" : "Ready for your check:"}</strong> {active.title}
          </span>
          <span className="font-bold underline">{active.status === "live" ? "Open class board" : "Review cards"}</span>
        </Link>
      )}

      {noStudents ? (
        <div className="notice-info flex-col items-start gap-3 p-6 text-base">
          <p><strong>Add your students first.</strong> Use nicknames only — Step Cards never needs real names.</p>
          <Link to="/classes/$classId/students" params={{ classId }} className="btn-primary">
            Add students
          </Link>
        </div>
      ) : (
        <InstructionComposer
          initialText={reuseText}
          busy={create.isPending}
          error={create.error?.message ?? null}
          onSubmit={(text) => create.mutate(text)}
        />
      )}

      <section aria-labelledby="history-heading">
        <h2 id="history-heading" className="font-display text-xl font-semibold">Recent instructions</h2>
        {lessons?.length ? (
          <ul className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {lessons.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <Link to="/lessons/$lessonId" params={{ lessonId: l.id }} className="font-bold hover:underline">
                    {l.title}
                  </Link>
                  <p className="truncate text-sm text-muted-foreground">
                    {new Date(l.created_at).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} · {STATUS_LABEL[l.status]}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                <Link to="/lessons/$lessonId" params={{ lessonId: l.id }} className="btn-outline text-sm">
                  {l.status === "review" ? "Check cards" : "View and edit"}
                </Link>
                <button
                  type="button"
                  className="btn-ghost text-sm"
                  onClick={() => {
                    setReuseText(l.instruction);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={!!noStudents}
                >
                  Use again
                </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-muted-foreground">Your instructions will appear here, so you can reuse routines.</p>
        )}
      </section>
    </div>
  );
}
