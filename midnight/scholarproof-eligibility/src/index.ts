import {
  createProviders,
  checkProofServerHealth,
  LOCAL_CONFIG,
  type ScholarProofPrivateState,
} from "./providers/midnight.js";
import { createPrivateStateFromCredentials } from "./contract/privateState.js";
import { hasCompiledArtifacts } from "./providers/zk-config.js";
import {
  ELIGIBLE_SP1042,
  FUTURE_LEADERS_POLICY,
  INELIGIBLE_GPA,
  verifyEligibility,
} from "./eligibility.js";

async function main() {
  console.log("ScholarProof Midnight — eligibility verification");
  console.log("==================================================");

  const providers = createProviders(LOCAL_CONFIG);
  console.log(`Network: ${providers.config.networkId}`);
  console.log(`Proof server: ${providers.config.proofServerUrl}`);

  const proofServerHealthy = await checkProofServerHealth(providers.config.proofServerUrl);
  console.log(`Proof server healthy: ${proofServerHealthy}`);
  console.log(`Compact artifacts compiled: ${hasCompiledArtifacts()}`);

  const eligible = verifyEligibility(FUTURE_LEADERS_POLICY, ELIGIBLE_SP1042);
  const ineligible = verifyEligibility(FUTURE_LEADERS_POLICY, INELIGIBLE_GPA);
  console.log(`SP-1042 eligible (Future Leaders): ${eligible}`);
  console.log(`GPA 3.1 eligible: ${ineligible}`);

  const privateState: ScholarProofPrivateState = createPrivateStateFromCredentials(ELIGIBLE_SP1042);
  console.log("Private state (witness inputs, not disclosed to provider):");
  console.log(`  gpaScaled=${privateState.gpaScaled} income=${privateState.income} age=${privateState.age}`);

  if (!hasCompiledArtifacts()) {
    console.log("\nNote: Install compact CLI and compile contract for full ZK circuit proofs.");
    console.log("  compact compile contracts/scholarproof-eligibility.compact src/contract/generated");
  }

  console.log("\nProviders initialized:");
  console.log("  - publicDataProvider (indexer)");
  console.log("  - proofProvider (http client)");
  console.log("  - privateStateProvider (level)");
  console.log("  - zkConfigProvider (scholarproof artifacts)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
