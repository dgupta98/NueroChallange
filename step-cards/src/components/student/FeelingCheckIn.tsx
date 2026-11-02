import { FEELINGS, feelingImage, type FeelingValue } from "@/lib/step-cards/feelings";

/** "How do you feel?" before a set of cards. Any answer is fine; Skip is always there. */
export function FeelingCheckIn({ saving, onPick }: { saving: boolean; onPick: (f: FeelingValue) => void }) {
  return (
    <section aria-labelledby="feel-title" className="surface p-6 text-center sm:p-8">
      <h1 id="feel-title" className="font-display text-3xl font-semibold">How do you feel right now?</h1>
      <p className="mt-2 text-lg text-muted-foreground">Tap a face. Only your teacher can see it.</p>
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {FEELINGS.map((f) => (
          <li key={f.value}>
            <button
              type="button"
              disabled={saving}
              onClick={() => onPick(f.value)}
              className="btn-outline h-auto w-full flex-col gap-2 py-4 text-lg"
            >
              <img src={feelingImage(f.pictogramId)} alt="" width={80} height={80} className="h-20 w-20" />
              {f.label}
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="btn-ghost mt-4" disabled={saving} onClick={() => onPick("skipped")}>
        Skip
      </button>
    </section>
  );
}

/** After a hard feeling: offer a calm break first, without pushing it. */
export function BreakOffer({ onBreak, onStart }: { onBreak: () => void; onStart: () => void }) {
  return (
    <section aria-labelledby="offer-title" className="surface p-6 text-center sm:p-8">
      <h1 id="offer-title" className="font-display text-3xl font-semibold">Thanks for telling us.</h1>
      <p className="mt-2 text-lg text-muted-foreground">Would a short break help before you start?</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button type="button" className="btn-outline btn-lg" onClick={onBreak}>
          <span aria-hidden="true">☁</span> Take a break first
        </button>
        <button type="button" className="btn-primary btn-lg" onClick={onStart}>
          Start my cards
        </button>
      </div>
    </section>
  );
}
