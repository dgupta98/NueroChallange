export type ReadingLevel = "grade2" | "grade4" | "grade6" | "pictogram_only";

export const READING_LEVELS: { value: ReadingLevel; label: string; hint: string }[] = [
  { value: "grade2", label: "Early reader", hint: "1–3 words per step" },
  { value: "grade4", label: "Developing reader", hint: "4–6 word sentences" },
  { value: "grade6", label: "Confident reader", hint: "Full plain-language steps" },
  { value: "pictogram_only", label: "Pictures first", hint: "1–2 words, picture led" },
];

export interface Step {
  n: number;
  text: string;
  icon_keyword?: string | undefined;
  pictogramUrl?: string | null | undefined;
  pictogramUrls?: string[] | undefined;
  isSummaryCard?: boolean | undefined;
  /** Optional visual timer for this step, in seconds. */
  timer_seconds?: number | null | undefined;
}

export type FadingPace = "gentle" | "standard" | "quick";
export type HelpChoice = "more" | "same" | "less";

export const FADING_OPTIONS: { value: "off" | FadingPace; label: string; hint: string }[] = [
  { value: "off", label: "Always every step", hint: "Cards never fade" },
  { value: "gentle", label: "Slowly", hint: "Starts fading after 5 finished runs" },
  { value: "standard", label: "Usual pace", hint: "Starts fading after 3 finished runs" },
  { value: "quick", label: "Quickly", hint: "Starts fading after 2 finished runs" },
];

export const HELP_CHOICES: { value: HelpChoice; label: string; teacherLabel: string }[] = [
  { value: "more", label: "More help", teacherLabel: "Asked for more help" },
  { value: "same", label: "The same", teacherLabel: "" },
  { value: "less", label: "Less help", teacherLabel: "Asked for less help" },
];

export const TIMER_OPTIONS = [0, 20, 30, 60, 120, 300, 600] as const;

export function formatSeconds(total: number) {
  if (total < 60) return `${total} seconds`;
  const m = Math.floor(total / 60);
  const s = total % 60;
  return s ? `${m} min ${s} s` : `${m} minute${m === 1 ? "" : "s"}`;
}

export function clock(total: number) {
  const t = Math.max(0, Math.ceil(total));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}

export const AVATARS = [
  { value: "circle", label: "Blue circle", glyph: "●" },
  { value: "star", label: "Star", glyph: "★" },
  { value: "leaf", label: "Leaf", glyph: "❦" },
  { value: "square", label: "Square", glyph: "■" },
  { value: "triangle", label: "Triangle", glyph: "▲" },
  { value: "heart", label: "Heart", glyph: "♥" },
  { value: "moon", label: "Moon", glyph: "☾" },
  { value: "sun", label: "Sun", glyph: "☀" },
] as const;

export function avatarGlyph(value: string) {
  return AVATARS.find((a) => a.value === value)?.glyph ?? "●";
}
