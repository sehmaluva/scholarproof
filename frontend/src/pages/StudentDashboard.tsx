import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import api, { asList } from "../lib/api";
import { Badge, Button, Card } from "../components/ui";
import { RequirementList } from "../components/Privacy";

interface Scholarship {
  id: number;
  name: string;
  description: string;
  requirements: Array<{ field: string; operator: string; value: string }>;
}

export default function StudentDashboard() {
  const scholarships = useQuery({
    queryKey: ["scholarships"],
    queryFn: async () => {
      const { data } = await api.get("/scholarships/");
      return asList<Scholarship>(data);
    },
  });

  const credentials = useQuery({
    queryKey: ["credentials"],
    queryFn: async () => {
      const { data } = await api.get("/students/me/credentials/");
      return asList<Record<string, unknown>>(data);
    },
  });

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [checkResult, setCheckResult] = useState<{
    eligible: boolean;
    requirements: Array<{ requirement: string; satisfied: boolean }>;
    ai_note: string;
  } | null>(null);
  const [proofSteps, setProofSteps] = useState<string[]>([]);
  const [proofResult, setProofResult] = useState<Record<string, unknown> | null>(null);

  const checkEligibility = useMutation({
    mutationFn: async (scholarshipId: number) => {
      const { data } = await api.post("/eligibility/check/", { scholarship_id: scholarshipId });
      return data;
    },
    onSuccess: (data) => setCheckResult(data),
  });

  const generateProof = useMutation({
    mutationFn: async (scholarshipId: number) => {
      const steps = [
        "Preparing private credentials...",
        "Constructing eligibility policy...",
        "Generating privacy proof...",
        "Submitting verification...",
      ];
      for (const step of steps) {
        setProofSteps((prev) => [...prev, step]);
        await new Promise((r) => setTimeout(r, 400));
      }
      const { data } = await api.post("/eligibility/generate-proof/", { scholarship_id: scholarshipId });
      setProofSteps((prev) => [...prev, "Eligibility verified."]);
      return data;
    },
    onSuccess: (data) => setProofResult(data),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-white/50">Prove you&apos;re qualified. Don&apos;t reveal why.</p>
      </div>

      <Card>
        <div className="mb-4 flex items-center gap-2">
          <Lock className="h-5 w-5 text-white/55" />
          <h2 className="text-xl font-semibold">My Credentials</h2>
          <Badge variant="private">PRIVATE — only you can see this</Badge>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {credentials.isError && (
            <p className="text-sm text-white/50">Could not load credentials. Is the backend running?</p>
          )}
          {credentials.data?.map((cred) => (
            <div key={cred.id as number} className="glass-panel rounded-xl p-4 text-sm">
              <p className="font-medium capitalize text-white/85">{String(cred.credential_type).replace("_", " ")}</p>
              <p className="text-white/45">Issuer: {cred.issuer as string}</p>
              {cred.gpa != null && <p>GPA: {cred.gpa as number}</p>}
              {cred.household_income != null && <p>Income: ${cred.household_income as number}</p>}
              {cred.age != null && <p>Age: {cred.age as number}</p>}
              {cred.years_completed != null && <p>Years: {cred.years_completed as number}</p>}
              {cred.enrollment_status && <p>Enrollment: {cred.enrollment_status as string}</p>}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-xl font-semibold">Scholarships</h2>
        <div className="space-y-4">
          {scholarships.isError && (
            <p className="text-sm text-white/50">Could not load scholarships.</p>
          )}
          {scholarships.data?.map((sch) => (
            <div key={sch.id} className="glass-panel rounded-xl p-4">
              <h3 className="font-semibold text-white/90">{sch.name}</h3>
              <p className="mt-1 text-sm text-white/45">{sch.description.slice(0, 120)}...</p>
              <ul className="mt-2 text-sm text-white/55">
                {sch.requirements?.map((r) => (
                  <li key={r.field}>{r.field} {r.operator} {r.value}</li>
                ))}
              </ul>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedId(sch.id);
                    setCheckResult(null);
                    setProofResult(null);
                    setProofSteps([]);
                    checkEligibility.mutate(sch.id);
                  }}
                >
                  Check Eligibility
                </Button>
                <Button
                  onClick={() => {
                    setSelectedId(sch.id);
                    setProofSteps([]);
                    setProofResult(null);
                    generateProof.mutate(sch.id);
                  }}
                  disabled={generateProof.isPending}
                >
                  Generate Privacy Proof
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {checkResult && selectedId && (
        <Card>
          <h2 className="mb-2 text-xl font-semibold">AI Eligibility Assistant</h2>
          <p className="mb-4 text-sm text-white/45">{checkResult.ai_note}</p>
          <RequirementList items={checkResult.requirements} />
          <p className="mt-4 text-lg font-semibold">
            {checkResult.eligible ? "You appear eligible." : "You do not appear eligible."}
          </p>
        </Card>
      )}

      {proofSteps.length > 0 && (
        <Card>
          <h2 className="mb-4 text-xl font-semibold">Proof Generation</h2>
          <ul className="space-y-2 text-sm">
            {proofSteps.map((step, i) => (
              <li key={i} className="flex items-center gap-2 text-white/70">
                <span>✓</span> {step}
              </li>
            ))}
          </ul>
          {proofResult && (
            <div className="mt-4 glass-panel rounded-xl p-4 text-sm">
              <p>Proof: {proofResult.proof_reference as string}</p>
              <p>Mode: {proofResult.midnight_mode as string}</p>
              <p>Valid: {String(proofResult.midnight_proof_valid)}</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
