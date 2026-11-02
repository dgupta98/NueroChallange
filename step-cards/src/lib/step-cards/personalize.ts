import { effectivePace, getFadedSteps } from "./fading";
import type { FadingPace, HelpChoice, ReadingLevel, Step } from "./types";

/**
 * Combine a reading-level rewrite with the pictures and timers found for the base steps.
 * If the rewrite changed the number of steps, fall back to the base steps so no
 * action the teacher said is ever dropped.
 */
export function mergeRewrite(base: Step[], rewrite: Step[] | undefined): Step[] {
  const source = rewrite && rewrite.length === base.length ? rewrite : base;
  return source.map((s, i) => {
    const b = base[i];
    return {
      n: i + 1,
      text: s.text,
      icon_keyword: b?.icon_keyword ?? s.icon_keyword,
      pictogramUrl: b?.pictogramUrl ?? null,
      pictogramUrls: b?.pictogramUrls ?? [],
      timer_seconds: b?.timer_seconds ?? null,
    };
  });
}

export interface StudentSettings {
  reading_level: ReadingLevel;
  completion_history: unknown;
  fading_enabled?: boolean | undefined;
  fading_pace?: string | undefined;
  help_choice?: string | undefined;
}

/** Steps a student sees: their reading-level version, faded by how often they've done this routine. */
export function stepsForStudent(
  base: Step[],
  rewrites: Partial<Record<ReadingLevel, Step[]>>,
  student: StudentSettings,
  routineKey: string,
): Step[] {
  const merged = mergeRewrite(base, rewrites[student.reading_level]);
  const pace = effectivePace(
    student.fading_enabled !== false,
    (student.fading_pace as FadingPace | undefined) ?? "standard",
    (student.help_choice as HelpChoice | undefined) ?? "same",
  );
  if (!pace) return merged;
  const history = (student.completion_history ?? {}) as Record<string, number>;
  return getFadedSteps(merged, history[routineKey] ?? 0, pace);
}
