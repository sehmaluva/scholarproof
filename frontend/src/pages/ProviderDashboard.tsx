import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api, { asList } from "../lib/api";
import { Badge, Card } from "../components/ui";
import { RequirementList } from "../components/Privacy";

export default function ProviderDashboard() {
  const applications = useQuery({
    queryKey: ["provider-applications"],
    queryFn: async () => {
      const { data } = await api.get("/eligibility/provider/applications/");
      return asList<Record<string, unknown>>(data);
    },
  });

  const [verification, setVerification] = useState<Record<string, unknown> | null>(null);

  async function verifyApplication(id: number) {
    const { data } = await api.get(`/eligibility/provider/applications/${id}/verification/`);
    setVerification(data);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Provider Dashboard</h1>
        <p className="text-white/50">Verify eligibility without seeing private student data.</p>
      </div>

      <Card>
        <h2 className="mb-4 text-xl font-semibold">Applications</h2>
        <div className="space-y-3">
          {applications.data?.map((app: Record<string, unknown>) => (
            <button
              key={app.id as number}
              type="button"
              onClick={() => verifyApplication(app.id as number)}
              className="w-full glass-panel rounded-xl p-4 text-left transition hover:bg-white/6 hover:border-white/15"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{app.student_id as string}</span>
                <Badge variant={app.eligible ? "success" : "danger"}>
                  {app.eligible ? "ELIGIBLE ✓" : "NOT ELIGIBLE"}
                </Badge>
              </div>
              <p className="text-sm text-white/45">{app.scholarship_name as string}</p>
            </button>
          ))}
        </div>
      </Card>

      {verification && (
        <Card>
          <h2 className="mb-4 text-xl font-semibold">Verification — {verification.student_id as string}</h2>
          <RequirementList
            items={(verification.requirement_results as Array<{ requirement: string; satisfied: boolean }>) || []}
          />
          <div className="mt-6 grid gap-2 text-sm">
            <p className="text-lg font-bold text-white/90">
              Overall: {verification.eligible ? "ELIGIBLE ✓" : "NOT ELIGIBLE"}
            </p>
            <p>Midnight proof: {verification.midnight_proof_valid ? "VALID" : "INVALID"}</p>
            <p className="text-white/45">Mode: {verification.midnight_mode as string}</p>
          </div>
          <div className="mt-6 glass-panel rounded-xl p-4 text-sm">
            <p className="font-semibold text-white/80">Private fields</p>
            <p>Exact GPA — PRIVATE 🔒</p>
            <p>Exact income — PRIVATE 🔒</p>
            <p>Exact age — PRIVATE 🔒</p>
            <p>Academic record — PRIVATE 🔒</p>
          </div>
        </Card>
      )}
    </div>
  );
}
