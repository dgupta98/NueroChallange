import { useState } from "react";

import {
  STICKER_CATEGORIES,
  findCategory,
  stickerById,
  stickerImage,
  surpriseSticker,
  type Sticker,
} from "@/lib/step-cards/stickers";

export function StickerImage({ sticker, size = 96, faded }: { sticker: Sticker; size?: number; faded?: boolean }) {
  return (
    <img
      src={stickerImage(sticker)}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      className={`rounded-xl bg-card object-contain ${faded ? "opacity-30 grayscale" : ""}`}
      style={{ width: size, height: size }}
    />
  );
}

/** Big picture buttons for each sticker book. */
function CategoryTabs({
  value,
  onChange,
  counts,
}: {
  value: string;
  onChange: (id: string) => void;
  counts?: Record<string, number> | undefined;
}) {
  return (
    <div role="tablist" aria-label="Sticker books" className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {STICKER_CATEGORIES.map((c) => {
        const cover = stickerById(c.coverId)!;
        const have = counts ? c.stickers.filter((s) => counts[s.id]).length : null;
        return (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={value === c.id}
            onClick={() => onChange(c.id)}
            className={`flex min-h-16 items-center gap-2 rounded-xl border px-2 py-2 text-left ${
              value === c.id ? "border-primary bg-primary-soft ring-2 ring-primary/40" : "border-border bg-card"
            }`}
          >
            <StickerImage sticker={cover} size={40} />
            <span className="min-w-0">
              <span className="block text-sm font-bold leading-tight">{c.label}</span>
              {have !== null && (
                <span className="block text-xs text-muted-foreground">
                  {have} of {c.stickers.length}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * "Pick a sticker to work for": choose a book, then a sticker. Picking is two taps
 * (choose, then start) so an accidental tap never starts the cards.
 */
export function StickerPicker({
  startCategory,
  counts,
  current,
  onPick,
  onCancel,
  saving,
}: {
  startCategory: string;
  counts: Record<string, number>;
  current?: string | null | undefined;
  onPick: (sticker: Sticker, categoryId: string) => void;
  onCancel?: (() => void) | undefined;
  saving?: boolean | undefined;
}) {
  const [cat, setCat] = useState(() => findCategory(stickerById(current) ? current?.split("-")[0] : startCategory).id);
  const [chosen, setChosen] = useState<string | null>(current ?? null);
  const category = findCategory(cat);
  const picked = stickerById(chosen);

  return (
    <section aria-labelledby="picker-heading" className="space-y-5">
      <div className="text-center">
        <h1 id="picker-heading" className="font-display text-3xl font-semibold">Pick a sticker to work for</h1>
        <p className="mt-2 text-lg text-muted-foreground">When you finish these cards, it goes in your sticker book.</p>
      </div>

      <CategoryTabs value={cat} onChange={setCat} />

      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4" aria-label={`${category.label} stickers`}>
        {category.stickers.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              aria-pressed={chosen === s.id}
              onClick={() => setChosen(s.id)}
              className={`flex w-full flex-col items-center gap-1 rounded-xl border p-3 text-center ${
                chosen === s.id ? "border-primary bg-primary-soft ring-2 ring-primary/50" : "border-border bg-card"
              }`}
            >
              <StickerImage sticker={s} size={80} />
              <span className="text-sm font-bold leading-tight">{s.name}</span>
              {counts[s.id] ? <span className="text-xs text-muted-foreground">You have {counts[s.id]}</span> : null}
            </button>
          </li>
        ))}
      </ul>

      <div className="sticky bottom-3 flex flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-[var(--shadow-lift)] sm:flex-row">
        <button
          type="button"
          className="btn-primary btn-lg flex-1"
          disabled={!picked || saving}
          onClick={() => picked && onPick(picked, cat)}
        >
          {picked ? `Work for the ${picked.name}` : "Tap a sticker first"}
        </button>
        <button type="button" className="btn-outline btn-lg" disabled={saving} onClick={() => onPick(surpriseSticker(cat, counts), cat)}>
          Surprise me
        </button>
        {onCancel && (
          <button type="button" className="btn-ghost btn-lg" onClick={onCancel}>
            Keep my sticker
          </button>
        )}
      </div>
    </section>
  );
}

/** The sticker book: one page per category. Collected stickers in colour, the rest waiting quietly. */
export function StickerBook({ counts, startCategory }: { counts: Record<string, number>; startCategory: string }) {
  const [cat, setCat] = useState(() => findCategory(startCategory).id);
  const category = findCategory(cat);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const kinds = Object.keys(counts).length;

  return (
    <section aria-labelledby="stickers-heading" className="space-y-6">
      <div>
        <h1 id="stickers-heading" className="font-display text-3xl font-semibold">My sticker book</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {total === 0
            ? "Finish your first cards to get your first sticker."
            : `You have ${total} sticker${total === 1 ? "" : "s"}, ${kinds} different kind${kinds === 1 ? "" : "s"}.`}
        </p>
      </div>

      <CategoryTabs value={cat} onChange={setCat} counts={counts} />

      <div className="surface p-5">
        <h2 className="font-display text-2xl font-semibold">{category.label}</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {category.stickers.map((s) => {
            const n = counts[s.id] ?? 0;
            return (
              <li
                key={s.id}
                className={`relative flex flex-col items-center gap-2 rounded-xl border p-3 text-center ${
                  n ? "border-success/40 bg-success-soft" : "border-dashed border-border bg-card"
                }`}
              >
                {n > 1 && <span className="chip absolute right-2 top-2 px-2 py-0.5 text-xs">×{n}</span>}
                <StickerImage sticker={s} size={88} faded={!n} />
                <p className={`font-bold leading-tight ${n ? "" : "text-muted-foreground"}`}>{s.name}</p>
                <div className="flex flex-wrap justify-center gap-1">
                  {n ? (
                    s.tags.map((t) => (
                      <span key={t} className="chip px-2 py-0.5 text-xs">{t}</span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">Not yet</span>
                  )}
                </div>
                <span className="sr-only">{n ? `You have ${n}.` : "Not collected yet."}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="text-sm text-muted-foreground">Pictures: Sergio Palao, ARASAAC (CC BY-NC-SA).</p>
    </section>
  );
}
