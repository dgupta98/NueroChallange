import { describe, expect, it } from "vitest";

import { independence } from "./metrics";

describe("independence metric", () => {
  it("counts steps completed without a help request", () => {
    const result = independence([
      { current_step: 4, help_count: 1, completed_at: "2026-11-01" },
      { current_step: 6, help_count: 0, completed_at: "2026-11-01" },
    ]);
    expect(result.stepsCompleted).toBe(10);
    expect(result.independentSteps).toBe(9);
    expect(result.independentPct).toBe(90);
    expect(result.routinesFinished).toBe(2);
  });

  it("has no percentage before any step is completed", () => {
    expect(independence([{ current_step: 0, help_count: 0, completed_at: null }]).independentPct).toBeNull();
  });
});
