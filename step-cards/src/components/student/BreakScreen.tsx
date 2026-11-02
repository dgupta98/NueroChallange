import { useEffect, useState } from "react";

import { clock } from "@/lib/step-cards/types";

export const BREAK_SECONDS = 120;

/**
 * Break card: a quiet pause the student chooses. Nothing is lost, the card waits,
 * and they come back whenever they're ready — the timer is only a guide.
 */
export function BreakScreen({ startedAt, onReady, saving }: { startedAt: string; onReady: () => void; saving: boolean }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, []);

  const elapsed = Math.max(0, (now - new Date(startedAt).getTime()) / 1000);
  const left = Math.max(0, BREAK_SECONDS - elapsed);
  const pct = Math.min(100, (elapsed / BREAK_SECONDS) * 100);

  return (
    <section aria-labelledby="break-heading" className="surface flex flex-col items-center gap-6 p-8 text-center">
      <div aria-hidden="true" className="breathe flex h-32 w-32 items-center justify-center rounded-full bg-primary-soft text-5xl text-primary">
        ☁
      </div>
      <div>
        <h1 id="break-heading" className="font-display text-3xl font-semibold">Break time</h1>
        <p className="mt-2 text-lg text-muted-foreground">Breathe in slowly. Breathe out slowly. Your cards will wait for you.</p>
      </div>
      <div className="w-full max-w-sm">
        <div className="h-3 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
          <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-muted-foreground">{left > 0 ? `${clock(left)} left of your break` : "Your break time is over. Come back when you're ready."}</p>
      </div>
      <button type="button" className="btn-primary btn-lg w-full max-w-sm" onClick={onReady} disabled={saving}>
        I'm ready
      </button>
    </section>
  );
}
