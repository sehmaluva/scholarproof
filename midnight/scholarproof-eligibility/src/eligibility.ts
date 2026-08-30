/** Shared eligibility logic — mirrors Compact contract predicates. */

export interface Policy {
  policyId: string;
  policyVersion?: string;
  gpaThreshold: number;
  incomeThreshold: number;
  maxAge: number;
  minimumStudyYears: number;
  requiresEnrollment: boolean;
}

export interface Credential {
  gpa?: number | string;
  household_income?: number;
  age?: number;
  years_completed?: number;
  enrollment_status?: string;
}

export function scaleGpa(gpa: number): number {
  return Math.round(gpa * 100);
}

export function aggregateCredentials(credentials: Credential[]): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const cred of credentials) {
    if (cred.gpa != null) values.gpa = Number(cred.gpa);
    if (cred.household_income != null) values.household_income = cred.household_income;
    if (cred.age != null) values.age = cred.age;
    if (cred.years_completed != null) values.years_completed = cred.years_completed;
    if (cred.enrollment_status) values.enrollment_status = cred.enrollment_status;
  }
  return values;
}

export function verifyEligibility(policy: Policy, credentials: Credential[]): boolean {
  const v = aggregateCredentials(credentials);
  const gpa = Number(v.gpa ?? 0);
  const income = Number(v.household_income ?? 0);
  const age = Number(v.age ?? 0);
  const years = Number(v.years_completed ?? 0);
  const enrolled = String(v.enrollment_status ?? "").toLowerCase() === "active";

  if (gpa < policy.gpaThreshold) return false;
  if (income >= policy.incomeThreshold) return false;
  if (age >= policy.maxAge) return false;
  if (years < policy.minimumStudyYears) return false;
  if (policy.requiresEnrollment && !enrolled) return false;
  return true;
}

export const FUTURE_LEADERS_POLICY: Policy = {
  policyId: "future-leaders-v1",
  policyVersion: "1.0.0",
  gpaThreshold: 3.5,
  incomeThreshold: 10000,
  maxAge: 26,
  minimumStudyYears: 2,
  requiresEnrollment: true,
};

export const ELIGIBLE_SP1042: Credential[] = [
  {
    gpa: 3.82,
    household_income: 4500,
    age: 22,
    years_completed: 3,
    enrollment_status: "active",
  },
];

export const INELIGIBLE_GPA: Credential[] = [
  {
    gpa: 3.1,
    household_income: 4500,
    age: 22,
    years_completed: 3,
    enrollment_status: "active",
  },
];
