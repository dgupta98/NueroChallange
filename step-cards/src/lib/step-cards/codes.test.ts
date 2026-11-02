import { describe, expect, it } from "vitest";

import { formatCode, isValidCode, normalizeCode } from "./codes";

describe("join codes", () => {
  it("normalizes what a student types to 6 uppercase characters", () => {
    expect(normalizeCode(" abc-234x9 ")).toBe("ABC234");
  });

  it("rejects codes with look-alike characters", () => {
    expect(isValidCode("ABC2O4")).toBe(false);
    expect(isValidCode("ABC214")).toBe(false);
  });

  it("accepts a well-formed 6 character code", () => {
    expect(isValidCode("ABC234")).toBe(true);
  });

  it("formats codes in two groups of 3", () => {
    expect(formatCode("ABC234")).toBe("ABC 234");
  });
});
