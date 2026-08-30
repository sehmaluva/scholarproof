/**
 * Private student credential state for Compact witness implementations.
 * Values never leave the student's device / private state store.
 */

export type ScholarProofPrivateState = {
  gpaScaled: number;
  income: number;
  age: number;
  yearsCompleted: number;
  enrolled: boolean;
};

export function createPrivateStateFromCredentials(
  credentials: Array<{
    gpa?: number | string;
    household_income?: number;
    age?: number;
    years_completed?: number;
    enrollment_status?: string;
  }>
): ScholarProofPrivateState {
  let gpa = 0;
  let income = 0;
  let age = 0;
  let yearsCompleted = 0;
  let enrolled = false;

  for (const cred of credentials) {
    if (cred.gpa != null) gpa = Number(cred.gpa);
    if (cred.household_income != null) income = cred.household_income;
    if (cred.age != null) age = cred.age;
    if (cred.years_completed != null) yearsCompleted = cred.years_completed;
    if (cred.enrollment_status?.toLowerCase() === "active") enrolled = true;
  }

  return {
    gpaScaled: Math.round(gpa * 100),
    income,
    age,
    yearsCompleted,
    enrolled,
  };
}
