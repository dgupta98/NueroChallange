import type { FadingPace, HelpChoice, Step } from "./types";

/**
 * Completions needed before each fading stage, per pace:
 * [first fade to 75%, fade to 50%, collapse to one summary card].
 * "standard" is the original research rule (3, 4, 5).
 */
export const PACE_THRESHOLDS: Record<FadingPace, [number, number, number]> = {
  gentle: [5, 7, 9],
  standard: [3, 4, 5],
  quick: [2, 3, 4],
};

/** How many cards a student sees after completing the same routine `completionCount` times. */
export function getVisibleCardCount(totalCards: number, completionCount: number, pace: FadingPace = "standard") {
  const [three, half, one] = PACE_THRESHOLDS[pace];
  if (completionCount >= one) return 1;
  if (completionCount >= half) return Math.ceil(totalCards * 0.5);
  if (completionCount >= three) return Math.ceil(totalCards * 0.75);
  return totalCards;
}

export function getFadedSteps(steps: Step[], completionCount: number, pace: FadingPace = "standard"): Step[] {
  const count = getVisibleCardCount(steps.length, completionCount, pace);
  if (count >= steps.length) return steps;
  const first = steps[0];
  if (count === 1 && first)
    return [
      {
        n: 1,
        text: `${first.text.replace(/\.$/, "")} (${steps.length} steps — tap when done)`,
        icon_keyword: first.icon_keyword,
        pictogramUrl: first.pictogramUrl,
        pictogramUrls: first.pictogramUrls,
        isSummaryCard: true,
      },
    ];
  return steps.slice(0, count);
}

const QUICKER: Record<FadingPace, FadingPace> = { gentle: "standard", standard: "quick", quick: "quick" };

/**
 * Combine the teacher's fading setting with the student's own "more / less help" choice.
 * Returns null when cards should not fade at all.
 * - Teacher turned fading off: never fades, whatever the student picked.
 * - Student asked for more help: every step, no fading.
 * - Student asked for less help: one pace quicker than the teacher set.
 */
export function effectivePace(fadingEnabled: boolean, teacherPace: FadingPace, helpChoice: HelpChoice): FadingPace | null {
  if (!fadingEnabled) return null;
  if (helpChoice === "more") return null;
  if (helpChoice === "less") return QUICKER[teacherPace];
  return teacherPace;
}

export function getRoutineKey(instructionSummary: string) {
  return (instructionSummary || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 50);
}
