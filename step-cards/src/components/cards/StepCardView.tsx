import { useState, type ReactNode } from "react";

import type { Step } from "@/lib/step-cards/types";

export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

function Pictogram({ step, size }: { step: Step; size: number }) {
  const [failed, setFailed] = useState(false);
  const url = step.pictogramUrl;
  if (!url || failed) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-secondary font-display text-4xl font-semibold text-muted-foreground"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        {step.n}
      </div>
    );
  }
  return (
    <img
      src={url}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      className="rounded-xl bg-card object-contain"
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}

interface Props {
  step: Step;
  index: number;
  total: number;
  variant?: "student" | "preview" | "compact";
  pictogramOnly?: boolean;
  done?: boolean;
  active?: boolean;
  children?: ReactNode;
}

/** One step card. Same structure everywhere so it is always predictable. */
export function StepCardView({ step, index, total, variant = "preview", pictogramOnly, done, active, children }: Props) {
  const picSize = variant === "student" ? 168 : variant === "compact" ? 64 : 112;
  const label = `Step ${index + 1} of ${total}`;

  if (variant === "compact") {
    return (
      <div
        className={`flex items-center gap-4 rounded-xl border p-3 ${
          done ? "border-success/40 bg-success-soft" : active ? "border-primary bg-card" : "border-border bg-card"
        }`}
      >
        <Pictogram step={step} size={picSize} />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-bold">{step.text}</p>
        </div>
        {done && (
          <span className="chip border-success/40 text-success-foreground">
            <span aria-hidden="true">✓</span> Done
          </span>
        )}
        {children}
      </div>
    );
  }

  return (
    <article
      className={`surface relative flex flex-col items-center gap-5 p-6 text-center sm:p-8 ${
        active ? "ring-2 ring-primary/60" : ""
      } ${done ? "bg-success-soft" : ""}`}
      aria-label={`${label}: ${step.text}`}
    >
      <div className="flex w-full items-center justify-between">
        <span className="chip">{label}</span>
        <button type="button" onClick={() => speak(step.text)} className="btn-ghost text-sm" aria-label={`Read step ${index + 1} aloud`}>
          <span aria-hidden="true">🔊</span> Read aloud
        </button>
      </div>
      <Pictogram step={step} size={picSize} />
      {pictogramOnly ? (
        <p className="sr-only">{step.text}</p>
      ) : (
        <p className="step-text max-w-[28ch] font-bold">{step.text}</p>
      )}
      {done && (
        <p className="chip border-success/40 text-success-foreground">
          <span aria-hidden="true">✓</span> Done
        </p>
      )}
      {children && <div className="flex w-full flex-col gap-3">{children}</div>}
    </article>
  );
}
