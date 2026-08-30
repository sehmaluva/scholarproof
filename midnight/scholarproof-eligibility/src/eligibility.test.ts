import { describe, expect, it } from "vitest";

import {
  ELIGIBLE_SP1042,
  FUTURE_LEADERS_POLICY,
  INELIGIBLE_GPA,
  scaleGpa,
  verifyEligibility,
} from "./eligibility.js";

describe("eligibility circuit logic", () => {
  it("eligible case SP-1042", () => {
    expect(verifyEligibility(FUTURE_LEADERS_POLICY, ELIGIBLE_SP1042)).toBe(true);
  });

  it("ineligible GPA 3.1", () => {
    expect(verifyEligibility(FUTURE_LEADERS_POLICY, INELIGIBLE_GPA)).toBe(false);
  });

  it("threshold edge GPA exactly 3.5 passes", () => {
    expect(
      verifyEligibility(FUTURE_LEADERS_POLICY, [{ ...ELIGIBLE_SP1042[0], gpa: 3.5 }])
    ).toBe(true);
  });

  it("threshold edge income at limit fails", () => {
    expect(
      verifyEligibility(FUTURE_LEADERS_POLICY, [{ ...ELIGIBLE_SP1042[0], household_income: 10000 }])
    ).toBe(false);
  });

  it("invalid proof scenario — not enrolled", () => {
    expect(
      verifyEligibility(FUTURE_LEADERS_POLICY, [
        { ...ELIGIBLE_SP1042[0], enrollment_status: "inactive" },
      ])
    ).toBe(false);
  });

  it("scales GPA for Compact uint representation", () => {
    expect(scaleGpa(3.82)).toBe(382);
    expect(scaleGpa(3.5)).toBe(350);
  });
});
