import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ZKConfigProvider } from "@midnight-ntwrk/midnight-js-types";
import type { ProverKey, VerifierKey, ZKIR } from "@midnight-ntwrk/midnight-js-types";

export type ScholarProofCircuit = "verifyEligibility" | "setPolicy";

const GENERATED_DIR = join(import.meta.dirname, "../contract/generated");

/**
 * Reads ZK artifacts from compact compile output when available.
 * Without compiled artifacts, proof generation falls back to LOCAL_COMMITMENT mode.
 */
export class ScholarProofZkConfigProvider extends ZKConfigProvider<ScholarProofCircuit> {
  private readArtifact(circuitId: ScholarProofCircuit, suffix: string): Uint8Array {
    const path = join(GENERATED_DIR, `${circuitId}.${suffix}`);
    if (!existsSync(path)) {
      throw new Error(
        `ZK artifact missing: ${path}. Run: compact compile contracts/scholarproof-eligibility.compact src/contract/generated`
      );
    }
    return new Uint8Array(readFileSync(path));
  }

  async getZKIR(circuitId: ScholarProofCircuit): Promise<ZKIR> {
    return this.readArtifact(circuitId, "zkir") as unknown as ZKIR;
  }

  async getProverKey(circuitId: ScholarProofCircuit): Promise<ProverKey> {
    return this.readArtifact(circuitId, "prover") as unknown as ProverKey;
  }

  async getVerifierKey(circuitId: ScholarProofCircuit): Promise<VerifierKey> {
    return this.readArtifact(circuitId, "verifier") as unknown as VerifierKey;
  }
}

export function hasCompiledArtifacts(): boolean {
  return existsSync(join(GENERATED_DIR, "verifyEligibility.prover"));
}
