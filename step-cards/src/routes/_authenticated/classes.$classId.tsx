import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { ClassHeader } from "@/components/app/ClassHeader";
import { InstructionComposer } from "@/components/app/InstructionComposer";
import { createLesson, deleteClass } from "@/lib/lessons.functions";
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
  const remove = useServerFn(deleteClass);
  const { data: cls, isLoading } = useQuery(classQuery(classId));
  const { data: students } = useQuery(studentsQuery(classId));
  const { data: lessons } = useQuery(lessonsQuery(classId));
  const [reuseText, setReuseText] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const create = useMutation({
    mutationFn: (instruction: string) => make({ data: { classId, instruction } }),
    onSuccess: ({ lessonId }) => navigate({ to: "/lessons/$lessonId", params: { lessonId } }),
  });

  const destroy = useMutation({
    mutationFn: () => remove({ data: { classId } }),
    onSuccess: () => navigate({ to: "/dashboard" }),
  });

  if (isLoading) return <p className="text-muted-foreground">Loading class…</p>;
  if (!cls) return <p className="notice-error">We couldn't find this class.</p>;

  const queued = lessons?.filter((l) => l.status === "review") ?? [];
  const live = lessons?.find((l) => l.status === "live");
  const noStudents = students && students.length === 0;

  return (
    <div className="space-y-8">
      <ClassHeader classId={classId} name={cls.name} joinCode={cls.join_code} current="class" />

      {live && (
        <Link
          to="/lessons/$lessonId"
          params={{ lessonId: live.id }}
          className="notice-success items-center justify-between text-base"
        >
          <span><strong>Cards are live:</strong> {live.title}</span>
          <span className="font-bold underline">Open class board</span>
        </Link>
      )}

      {queued.map((q) => (
        <Link
          key={q.id}
          to="/lessons/$lessonId"
          params={{ lessonId: q.id }}
          className="notice-info items-center justify-between text-base"
        >
          <span><strong>Ready for your check:</strong> {q.title}</span>
          <span className="font-bold underline">Review cards</span>
        </Link>
      ))}

      <InstructionComposer
        initialText={reuseText}
        busy={create.isPending}
        error={create.error?.message ?? null}
        onSubmit={(text) => create.mutate(text)}
      />

      {noStudents && (
        <div className="notice-info flex-col items-start gap-3 p-5 text-sm">
          <p><strong>No students yet.</strong> Add them before sending cards — use nicknames only, no real names needed.</p>
          <Link to="/classes/$classId/students" params={{ classId }} className="btn-outline text-sm">
            Add students
          </Link>
        </div>
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

      {/* Danger zone */}
      <section className="border-t border-border pt-8">
        <h2 className="font-display text-base font-semibold text-destructive">Delete class</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Permanently removes this class, all its students, and all instruction history. This cannot be undone.
        </p>
        {!confirmDelete ? (
          <button
            type="button"
            className="btn-outline mt-3 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground text-sm"
            onClick={() => setConfirmDelete(true)}
          >
            Delete class
          </button>
        ) : (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <p className="text-sm font-medium">Delete <strong>{cls.name}</strong> and all its data?</p>
            <button
              type="button"
              className="btn-primary bg-destructive hover:bg-destructive/90 text-sm"
              disabled={destroy.isPending}
              onClick={() => destroy.mutate()}
            >
              {destroy.isPending ? "Deleting…" : "Yes, delete permanently"}
            </button>
            <button
              type="button"
              className="btn-ghost text-sm"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </button>
            {destroy.error && <p className="notice-error w-full">{destroy.error.message}</p>}
          </div>
        )}
      </section>
    </div>
  );
}
