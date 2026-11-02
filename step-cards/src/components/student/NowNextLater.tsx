import type { ReactNode } from "react";

import type { Step } from "@/lib/step-cards/types";

function Tile({ label, title, picture, strong }: { label: string; title: string; picture: ReactNode; strong?: boolean }) {
  return (
    <li
      className={`flex min-w-0 flex-col items-center gap-1 rounded-xl p-2 text-center ${
        strong ? "border-2 border-primary bg-card" : "border border-border bg-secondary/60"
      }`}
    >
      <span className={`text-sm font-bold ${strong ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
      <span className="flex h-14 w-14 items-center justify-center">{picture}</span>
      <span className="line-clamp-2 text-sm font-semibold leading-snug">{title}</span>
    </li>
  );
}

function StepPicture({ step, n }: { step: Step | undefined; n: number }) {
  if (step?.pictogramUrl) return <img src={step.pictogramUrl} alt="" width={56} height={56} className="h-14 w-14 object-contain" />;
  return <span className="font-display text-2xl font-semibold text-muted-foreground">{n}</span>;
}

/**
 * Now / Next / Later: the current step, the one after, and what happens when the
 * cards are finished (the teacher's "then" activity, or the sticker being worked for).
 */
export function NowNextLater({
  now,
  next,
  index,
  pictogramOnly,
  later,
  laterPicture,
}: {
  now: Step;
  next: Step | undefined;
  index: number;
  pictogramOnly: boolean;
  later: string;
  laterPicture: ReactNode;
}) {
  const label = (s: Step | undefined, n: number) => (s ? (pictogramOnly ? `Step ${n}` : s.text.replace(/\.$/, "")) : "");
  return (
    <ol className="grid grid-cols-3 gap-2" aria-label="Now, next and later">
      <Tile strong label="Now" title={label(now, index + 1)} picture={<StepPicture step={now} n={index + 1} />} />
      {next ? (
        <Tile label="Next" title={label(next, index + 2)} picture={<StepPicture step={next} n={index + 2} />} />
      ) : (
        <Tile label="Next" title="Finished" picture={<span aria-hidden="true" className="text-3xl text-success">✓</span>} />
      )}
      <Tile label="Later" title={later} picture={laterPicture} />
    </ol>
  );
}
