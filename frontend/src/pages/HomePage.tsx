import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { getDashboardPath, useAuth } from "../lib/auth";
import { Button, Card } from "../components/ui";

export default function HomePage() {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate(getDashboardPath(user.role), { replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return <div className="py-12 text-center text-white/50">Loading…</div>;
  }

  return (
    <div className="space-y-8 text-center">
      <div className="mx-auto max-w-2xl">
        <div className="glass-panel-strong mx-auto flex h-20 w-20 items-center justify-center rounded-2xl">
          <Shield className="h-12 w-12 text-white/60" />
        </div>
        <h1 className="mt-4 text-4xl font-bold text-white/95">ScholarProof</h1>
        <p className="mt-2 text-lg text-white/50">
          Privacy-preserving scholarship eligibility. Prove you&apos;re qualified. Don&apos;t reveal why.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/login">
            <Button>Get Started</Button>
          </Link>
          <Link to="/demo">
            <Button variant="secondary">View Privacy Demo</Button>
          </Link>
        </div>
      </div>
      <Card className="mx-auto max-w-xl text-left">
        <h2 className="font-semibold text-white/80">Hackathon Demo Flow</h2>
        <ol className="mt-4 list-inside list-decimal space-y-2 text-sm text-white/55">
          <li>Log in as student SP-1042</li>
          <li>View private credentials</li>
          <li>Check eligibility for Future Leaders Scholarship</li>
          <li>Generate Midnight privacy proof</li>
          <li>Switch to provider — see ELIGIBLE without GPA/income/age</li>
        </ol>
      </Card>
    </div>
  );
}
