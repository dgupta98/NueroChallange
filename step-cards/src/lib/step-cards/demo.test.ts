import { describe, expect, it } from "vitest";

import { isValidCode } from "./codes";
import { DEMO_CLASS_CODES, isDemoStudentName } from "./demo";

describe("demo school", () => {
  it("uses class codes students could type themselves", () => {
    for (const code of DEMO_CLASS_CODES) expect(isValidCode(code)).toBe(true);
  });

  it("offers Leo, Mia, Alex, and River as demo students", () => {
    expect(isDemoStudentName("Leo")).toBe(true);
    expect(isDemoStudentName("Mia")).toBe(true);
    expect(isDemoStudentName("Alex")).toBe(true);
    expect(isDemoStudentName("River")).toBe(true);
    expect(isDemoStudentName("Sam")).toBe(false);
  });
});
