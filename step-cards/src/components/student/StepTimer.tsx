import { useEffect, useRef, useState } from "react";

import { speak } from "@/components/cards/StepCardView";
import { useDisplayPrefs } from "@/hooks/use-display-prefs";
import { playFinished } from "@/lib/sounds";
import { clock, formatSeconds } from "@/lib/step-cards/types";

/**
 * A calm visual timer for one step: a coloured disc that shrinks as time passes,
 * so time can be seen without reading numbers. It never starts by itself,
 * time-up is read aloud once (plus a soft note if sounds are on), and Done stays
 * available the whole time.
 */
export function StepTimer({ seconds, onClose }: { seconds: number; onClose?: (() => void) | undefined }) {
  const { sounds } = useDisplayPrefs();
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(false);
  const endsAt = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const remaining = Math.max(0, ((endsAt.current ?? Date.now()) - Date.now()) / 1000);
      setLeft(remaining);
      if (remaining <= 0) {
        setRunning(false);
        if (sounds) playFinished();
        speak("Time is up.");
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [running, sounds]);

  const finished = left <= 0;
  const fraction = Math.max(0, Math.min(1, left / seconds));

  function start() {
    endsAt.current = Date.now() + (finished ? seconds : left) * 1000;
    if (finished) setLeft(seconds);
    setRunning(true);
  }

  return (
    <div className="rounded-xl border border-border bg-secondary/60 p-4 text-left" aria-label={`Timer: ${formatSeconds(seconds)}`}>
      <div className="flex items-center gap-4">
        <TimerDisc fraction={finished ? 0 : fraction} done={finished} />
        <div className="min-w-0 flex-1">
          <p className="font-bold">
            {finished ? "Time is up" : running ? "Timer is running" : `Timer: ${formatSeconds(seconds)}`}
          </p>
          <p className="font-display text-3xl font-semibold tabular-nums" aria-live="off">{clock(left)}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {running ? (
          <button
            type="button"
            className="btn-outline flex-1"
            onClick={() => {
              setRunning(false);
              endsAt.current = null;
            }}
          >
            Pause
          </button>
        ) : (
          <button type="button" className="btn-outline flex-1" onClick={start}>
            {finished ? "Start again" : left < seconds ? "Keep going" : "Start timer"}
          </button>
        )}
        {onClose && (
          <button type="button" className="btn-ghost" onClick={onClose}>
            No timer
          </button>
        )}
      </div>
      <p className="sr-only" role="status">{finished ? "Time is up." : ""}</p>
    </div>
  );
}

/** The shrinking disc: the coloured part is the time that is left. */
function TimerDisc({ fraction, done }: { fraction: number; done: boolean }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 64 64" className="h-20 w-20 shrink-0 -rotate-90" aria-hidden="true">
      <circle cx="32" cy="32" r="30" className="fill-card stroke-border" strokeWidth="2" />
      {done ? (
        <circle cx="32" cy="32" r="12" className="fill-success" />
      ) : (
        <circle
          cx="32"
          cy="32"
          r={r / 2}
          fill="none"
          className="stroke-primary"
          strokeWidth={r}
          strokeDasharray={`${(c / 2) * fraction} ${c / 2}`}
          style={{ transition: "stroke-dasharray 250ms linear" }}
        />
      )}
    </svg>
  );
}

const CHOICES = [60, 120, 300] as const;

/** For steps without a timer: the student can choose to time themselves. */
export function ChooseTimer() {
  const [seconds, setSeconds] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  if (seconds) return <StepTimer key={seconds} seconds={seconds} onClose={() => setSeconds(null)} />;
  if (!open)
    return (
      <button type="button" className="btn-ghost w-full text-muted-foreground" onClick={() => setOpen(true)}>
        <span aria-hidden="true">⏱</span> Use a timer
      </button>
    );
  return (
    <div className="rounded-xl border border-border bg-secondary/60 p-3" role="group" aria-label="Choose a timer">
      <p className="text-center font-bold">How long?</p>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {CHOICES.map((s) => (
          <button key={s} type="button" className="btn-outline" onClick={() => setSeconds(s)}>
            {s / 60} min
          </button>
        ))}
        <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
}
