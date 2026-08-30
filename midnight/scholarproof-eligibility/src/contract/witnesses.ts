/**
 * Witness implementations for scholarproof-eligibility.compact
 * Maps private student credentials to circuit witnesses.
 */

import type { WitnessContext } from "@midnight-ntwrk/compact-runtime";
import type { ScholarProofPrivateState } from "./privateState.js";

export function studentGpaScaled(ctx: WitnessContext<unknown, ScholarProofPrivateState>): bigint {
  return BigInt(ctx.privateState.gpaScaled);
}

export function studentIncome(ctx: WitnessContext<unknown, ScholarProofPrivateState>): bigint {
  return BigInt(ctx.privateState.income);
}

export function studentAge(ctx: WitnessContext<unknown, ScholarProofPrivateState>): bigint {
  return BigInt(ctx.privateState.age);
}

export function studentYearsCompleted(ctx: WitnessContext<unknown, ScholarProofPrivateState>): bigint {
  return BigInt(ctx.privateState.yearsCompleted);
}

export function studentEnrolled(ctx: WitnessContext<unknown, ScholarProofPrivateState>): boolean {
  return ctx.privateState.enrolled;
}

export const witnesses = {
  studentGpaScaled,
  studentIncome,
  studentAge,
  studentYearsCompleted,
  studentEnrolled,
};
