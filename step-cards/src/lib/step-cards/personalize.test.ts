import { describe, expect, it } from "vitest";

import { mergeRewrite, stepsForStudent } from "./personalize";

const base = [
  { n: 1, text: "Wet your hands.", icon_keyword: "wash", pictogramUrl: "p1" },
  { n: 2, text: "Put soap on your hands.", icon_keyword: "soap", pictogramUrl: "p2" },
  { n: 3, text: "Dry your hands.", icon_keyword: "dry", pictogramUrl: "p3" },
];

describe("personalising steps", () => {
  it("keeps the base pictures when using a reading-level rewrite", () => {
    const merged = mergeRewrite(base, [
      { n: 1, text: "Wet hands" },
      { n: 2, text: "Soap" },
      { n: 3, text: "Dry" },
    ]);
    expect(merged.map((s) => s.text)).toEqual(["Wet hands", "Soap", "Dry"]);
    expect(merged[1]?.pictogramUrl).toBe("p2");
  });

  it("falls back to the base steps if a rewrite drops a step", () => {
    const merged = mergeRewrite(base, [{ n: 1, text: "Wash" }]);
    expect(merged).toHaveLength(3);
    expect(merged[0]?.text).toBe("Wet your hands.");
  });

  it("fades to one summary card after 5 completions of the same routine", () => {
    const steps = stepsForStudent(base, {}, { reading_level: "grade6", completion_history: { "wash-hands": 5 } }, "wash-hands");
    expect(steps).toHaveLength(1);
    expect(steps[0]?.isSummaryCard).toBe(true);
  });

  it("never fades when the teacher turned fading off for that student", () => {
    const steps = stepsForStudent(
      base,
      {},
      { reading_level: "grade6", completion_history: { "wash-hands": 5 }, fading_enabled: false },
      "wash-hands",
    );
    expect(steps).toHaveLength(3);
  });
});

describe("timers on steps", () => {
  it("keeps the teacher's timer when the words are rewritten", () => {
    const merged = mergeRewrite([{ n: 1, text: "Scrub for 20 seconds.", timer_seconds: 20 }], [{ n: 1, text: "Scrub" }]);
    expect(merged[0]?.timer_seconds).toBe(20);
  });
});
