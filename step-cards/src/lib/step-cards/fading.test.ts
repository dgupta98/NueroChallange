import { describe, expect, it } from "vitest";

import { getFadedSteps, getRoutineKey, getVisibleCardCount } from "./fading";

const steps = [1, 2, 3, 4, 5].map((n) => ({ n, text: `Step ${n}.`, icon_keyword: "wash" }));

describe("card fading", () => {
  it("shows every card for the first 2 completions", () => {
    expect(getVisibleCardCount(5, 0)).toBe(5);
    expect(getVisibleCardCount(5, 2)).toBe(5);
  });

  it("shows 75% of cards (rounded up) after 3 completions", () => {
    expect(getVisibleCardCount(5, 3)).toBe(4);
  });

  it("shows 50% of cards (rounded up) after 4 completions", () => {
    expect(getVisibleCardCount(5, 4)).toBe(3);
  });

  it("collapses to one summary card from the 5th completion", () => {
    const faded = getFadedSteps(steps, 5);
    expect(faded).toHaveLength(1);
    expect(faded[0]?.isSummaryCard).toBe(true);
    expect(faded[0]?.text).toBe("Step 1 (5 steps — tap when done)");
  });

  it("groups routines by their simplified title", () => {
    expect(getRoutineKey("Wash Your Hands!")).toBe("wash-your-hands");
  });
});

import { effectivePace } from "./fading";

describe("fading pace set by the teacher", () => {
  it("slow pace keeps every card until 5 finished runs", () => {
    expect(getVisibleCardCount(4, 4, "gentle")).toBe(4);
    expect(getVisibleCardCount(4, 5, "gentle")).toBe(3);
    expect(getVisibleCardCount(4, 9, "gentle")).toBe(1);
  });

  it("quick pace starts fading after 2 finished runs and is one card at 4", () => {
    expect(getVisibleCardCount(4, 2, "quick")).toBe(3);
    expect(getVisibleCardCount(4, 4, "quick")).toBe(1);
  });
});

describe("student's own more / less help choice", () => {
  it("more help always shows every step", () => {
    expect(effectivePace(true, "quick", "more")).toBeNull();
  });
  it("less help fades one pace quicker than the teacher set", () => {
    expect(effectivePace(true, "gentle", "less")).toBe("standard");
    expect(effectivePace(true, "standard", "less")).toBe("quick");
  });
  it("cannot turn fading on when the teacher turned it off", () => {
    expect(effectivePace(false, "standard", "less")).toBeNull();
  });
});
