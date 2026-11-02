import { describe, expect, it } from "vitest";

import { fallbackFor, queriesFor, rankPictograms, scoreResult } from "./arasaac";

const r = (id: number, ...keywords: string[]) => ({ _id: id, keywords: keywords.map((keyword) => ({ keyword })) });

describe("choosing pictures for a step", () => {
  it("prefers an exact keyword match over fuzzy search results", () => {
    const results = [[r(6231, "wet towels", "baby wipes"), r(37364, "wet", "soak")]];
    expect(rankPictograms(results, "wet")[0]).toBe(37364);
  });

  it("ignores filler words like 'the' and 'your'", () => {
    expect(scoreResult(r(2566, "dry", "dry the hands"), "dry your hands")).toBe(100);
  });

  it("drops results that share no keyword with the step", () => {
    const results = [[r(10377, "physical education", "hands to the shoulders")]];
    expect(rankPictograms(results, "dry hands", "dry")).toEqual([]);
  });

  it("does not search with vague verbs like 'get'", () => {
    expect(queriesFor("hands wet", "Get your hands wet.")).toEqual(["hands wet", "hands", "wet"]);
    expect(queriesFor("pencil", "Pick up your pencil.")).toEqual(["pencil"]);
  });

  it("uses the hand-checked hand-washing picture for 'wash hands'", () => {
    expect(fallbackFor("wash hands")).toBe(8977);
  });

  it("matches verb + object from the step words before a single ambiguous keyword", () => {
    expect(fallbackFor("rinse", "Rinse your hands.")).toBe(8975);
    expect(fallbackFor("soap", "Put soap on your hands.")).toBe(35729);
    expect(fallbackFor("wet", "Get your hands wet.")).toBe(8977);
  });

  it("prefers pictures that fit the lesson, like hand-washing over dish-washing", () => {
    const results = [[r(34371, "rub", "scrub"), r(36000, "rub", "handwashing")]];
    expect(rankPictograms(results, "rub", undefined, ["hands"])[0]).toBe(36000);
  });
});
