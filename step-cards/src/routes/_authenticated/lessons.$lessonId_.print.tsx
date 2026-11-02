import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

import { cardsQuery, lessonQuery, studentsQuery } from "@/lib/queries";
import { formatSeconds } from "@/lib/step-cards/types";

export const Route = createFileRoute("/_authenticated/lessons/$lessonId_/print")({
  head: () => ({
    meta: [
      { title: "Take-home cards — Step Cards" },
      { name: "description", content: "Printable step cards for the family journal." },
      { property: "og:title", content: "Take-home cards — Step Cards" },
      { property: "og:description", content: "Printable step cards for the family journal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrintPage,
});

function PrintPage() {
  const { lessonId } = Route.useParams();
  const { data: lesson } = useQuery(lessonQuery(lessonId));
  const { data: students } = useQuery({ ...studentsQuery(lesson?.class_id ?? ""), enabled: !!lesson });
  const { data: cards } = useQuery(cardsQuery(lessonId));
  const date = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  const byId = new Map((students ?? []).map((s) => [s.id, s]));

  if (!lesson) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-center gap-3">
        <Link to="/lessons/$lessonId" params={{ lessonId }} className="btn-ghost -ml-3 text-muted-foreground">
          ← Back to the cards
        </Link>
        <button type="button" className="btn-primary ml-auto" onClick={() => window.print()}>
          Print
        </button>
      </div>
      <p className="no-print notice-info">One page per student, ready for the daily parent journal so the routine can be practiced at home.</p>
      {(cards ?? []).map((card) => {
        const student = byId.get(card.student_id);
        if (!student) return null;
        return (
          <section key={card.id} className="print-sheet surface p-8">
            <h2 className="font-display text-2xl font-semibold">Today's steps: {lesson.title}</h2>
            <p className="mt-1 text-muted-foreground">{student.nickname} · {date}</p>
            <ol className="mt-6 space-y-5">
              {card.steps.map((step, i) => (
                <li key={i} className="flex items-center gap-5">
                  <span className="w-8 font-display text-2xl font-semibold text-subtle">{i + 1}</span>
                  {step.pictogramUrl && <img src={step.pictogramUrl} alt="" width={72} height={72} className="h-18 w-18 object-contain" />}
                  <span className="text-xl font-bold">
                    {step.text}
                    {step.timer_seconds ? <span className="block text-base font-normal text-muted-foreground">Timer: {formatSeconds(step.timer_seconds)}</span> : null}
                  </span>
                </li>
              ))}
            </ol>
            {lesson.then_activity && <p className="mt-6 text-xl font-bold">Then: {lesson.then_activity}</p>}
            <p className="mt-8 border-t border-border pt-4 text-sm text-muted-foreground">
              Practiced at home? ☐ Yes  · Pictograms by Sergio Palao, ARASAAC (Government of Aragón), CC BY-NC-SA.
            </p>
          </section>
        );
      })}
    </div>
  );
}
