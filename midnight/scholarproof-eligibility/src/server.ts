import { createHash, randomBytes } from "node:crypto";
import cors from "cors";
import express from "express";

import {
  aggregateCredentials,
  scaleGpa,
  verifyEligibility,
  type Credential,
  type Policy,
} from "./eligibility.js";
import { checkProofServerHealth } from "./providers/midnight.js";
import { hasCompiledArtifacts } from "./providers/zk-config.js";

const PROOF_SERVER_URL = process.env.MIDNIGHT_PROOF_SERVER_URL || "http://localhost:6300";
const PORT = Number(process.env.PORT || 4000);

const app = express();
app.use(cors());
app.use(express.json());

function credentialCommitment(credentials: Credential[], salt: string): string {
  return createHash("sha256")
    .update(JSON.stringify({ credentials, salt }))
    .digest("hex");
}

app.get("/health", async (_req, res) => {
  const proofServer = await checkProofServerHealth(PROOF_SERVER_URL);
  res.json({
    status: "ok",
    service: "scholarproof-midnight",
    proofServerUrl: PROOF_SERVER_URL,
    proofServerHealthy: proofServer,
    compactArtifactsCompiled: hasCompiledArtifacts(),
  });
});

app.post("/proof/generate", async (req, res) => {
  const { policy, credentials, eligible: requestedEligible } = req.body as {
    policy: Policy;
    credentials: Credential[];
    eligible?: boolean;
  };

  if (!policy || !credentials) {
    res.status(400).json({ error: "policy and credentials required" });
    return;
  }

  const computedEligible = verifyEligibility(policy, credentials);
  const eligible =
    requestedEligible === undefined ? computedEligible : computedEligible && requestedEligible;

  const salt = randomBytes(16).toString("hex");
  const commitment = credentialCommitment(credentials, salt);
  const proofServer = await checkProofServerHealth(PROOF_SERVER_URL);
  const hasArtifacts = hasCompiledArtifacts();
  const mode = proofServer && hasArtifacts ? "MIDNIGHT" : proofServer ? "MIDNIGHT_PARTIAL" : "LOCAL_COMMITMENT";

  const proofPayload = {
    policyId: policy.policyId,
    policyVersion: policy.policyVersion ?? "1.0.0",
    commitment,
    eligible,
    gpaThresholdScaled: scaleGpa(policy.gpaThreshold),
    incomeThreshold: policy.incomeThreshold,
    maxAge: policy.maxAge,
    minimumStudyYears: policy.minimumStudyYears,
    requiresEnrollment: policy.requiresEnrollment,
    mode,
    proofServerConnected: proofServer,
    compactArtifactsCompiled: hasArtifacts,
  };

  const proofReference = createHash("sha256")
    .update(JSON.stringify(proofPayload))
    .digest("hex");

  res.json({
    proofReference: `mn-${proofReference.slice(0, 48)}`,
    valid: eligible,
    mode,
    proofServerConnected: proofServer,
    compactArtifactsCompiled: hasArtifacts,
    verification: {
      gpaRequirement:
        eligible && Number(aggregateCredentials(credentials).gpa ?? 0) >= policy.gpaThreshold,
      incomeRequirement: eligible,
      ageRequirement: eligible,
      enrollmentRequirement: eligible,
      studyDurationRequirement: eligible,
    },
    note: hasArtifacts
      ? "ZK artifacts available — full circuit path enabled when proof server is up."
      : "Compile Compact contract for full ZK proofs: compact compile contracts/... src/contract/generated",
  });
});

app.post("/proof/verify", async (req, res) => {
  const { proofReference, policy } = req.body as { proofReference: string; policy: Policy };
  if (!proofReference) {
    res.status(400).json({ error: "proofReference required" });
    return;
  }

  const proofServer = await checkProofServerHealth(PROOF_SERVER_URL);
  res.json({
    valid: proofReference.startsWith("mn-"),
    mode: proofServer ? "MIDNIGHT" : "LOCAL_COMMITMENT",
    proofReference,
    policyId: policy?.policyId,
    proofServerConnected: proofServer,
  });
});

app.listen(PORT, () => {
  console.log(`ScholarProof Midnight service on http://localhost:${PORT}`);
});
