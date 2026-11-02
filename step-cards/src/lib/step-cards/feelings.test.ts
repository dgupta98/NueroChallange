import { describe, expect, it } from "vitest";

import { suggestsBreak, teacherShouldNotice } from "./feelings";

describe("feelings check-in", () => {
  it("offers a break first when a student feels worried, sad, cross or tired", () => {
    for (const f of ["worried", "sad", "cross", "tired"]) expect(suggestsBreak(f)).toBe(true);
  });

  it("goes straight to the cards when a student feels happy or calm, or skips", () => {
    for (const f of ["happy", "calm", "skipped", null]) expect(suggestsBreak(f)).toBe(false);
  });

  it("only points out worried, sad or cross to the teacher", () => {
    expect(teacherShouldNotice("worried")).toBe(true);
    expect(teacherShouldNotice("cross")).toBe(true);
    expect(teacherShouldNotice("tired")).toBe(false);
    expect(teacherShouldNotice("happy")).toBe(false);
  });
});
