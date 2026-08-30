import { Shield, Lock, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "./ui";

function GlassInset({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-white/4 p-4 backdrop-blur-md ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

export function PrivacyComparison() {
  return (
    <Card className="overflow-hidden">
      <div className="mb-6 flex items-center gap-2">
        <Shield className="h-5 w-5 text-white/60" />
        <h2 className="text-xl font-bold text-white/90">Privacy Comparison</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <GlassInset>
          <h3 className="mb-3 font-semibold text-white/70">Traditional Application</h3>
          <div className="space-y-2 text-sm text-white/50">
            <p>Student</p>
            <p className="text-white/35">↓ Upload transcript, ID, income docs, enrollment letter</p>
            <p>Scholarship Provider</p>
            <p className="text-white/65">Everything revealed</p>
          </div>
        </GlassInset>
        <GlassInset className="border-white/14 bg-white/6">
          <h3 className="mb-3 font-semibold text-white/85">ScholarProof</h3>
          <div className="space-y-2 text-sm text-white/50">
            <p>Student</p>
            <p className="text-white/40">↓ Private credentials → Midnight ZK proof</p>
            <p>Scholarship Provider</p>
            <p className="flex items-center gap-1 text-white/75">
              <CheckCircle2 className="h-4 w-4" /> Eligibility verified
            </p>
            <p className="flex items-center gap-1 text-white/60">
              <Lock className="h-4 w-4" /> Underlying information private
            </p>
          </div>
        </GlassInset>
      </div>
    </Card>
  );
}

export function BeforeAfterDemo() {
  return (
    <Card>
      <h2 className="mb-6 text-xl font-bold text-white/90">Before / After</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/45">Before</h3>
          <GlassInset className="space-y-2 text-sm">
            <Row label="GPA" value="3.82" muted />
            <Row label="Income" value="$4,500" muted />
            <Row label="Age" value="22" muted />
            <Row label="University" value="BUSE" muted />
            <Row label="Enrollment" value="Active" muted />
          </GlassInset>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/55">After</h3>
          <GlassInset className="space-y-2 text-sm border-white/14 bg-white/6">
            <Row label="GPA requirement" value="VERIFIED ✓" highlight />
            <Row label="Income requirement" value="VERIFIED ✓" highlight />
            <Row label="Age requirement" value="VERIFIED ✓" highlight />
            <Row label="Enrollment" value="VERIFIED ✓" highlight />
            <Row label="Exact values" value="🔒 PRIVATE" private />
          </GlassInset>
        </div>
      </div>
    </Card>
  );
}

function Row({
  label,
  value,
  muted,
  highlight,
  private: isPrivate,
}: {
  label: string;
  value: string;
  muted?: boolean;
  highlight?: boolean;
  private?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/8 py-2 last:border-0">
      <span className="text-white/45">{label}</span>
      <span
        className={
          muted
            ? "text-white/70"
            : highlight
              ? "text-white/85"
              : isPrivate
                ? "text-white/75"
                : "text-white/90"
        }
      >
        {value}
      </span>
    </div>
  );
}

export function RequirementList({
  items,
}: {
  items: Array<{ requirement: string; satisfied: boolean }>;
}) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.requirement}
          className="glass-panel flex items-center justify-between rounded-lg px-3 py-2 text-sm"
        >
          <span className="text-white/70">{item.requirement}</span>
          {item.satisfied ? (
            <CheckCircle2 className="h-4 w-4 text-white/70" />
          ) : (
            <XCircle className="h-4 w-4 text-white/40" />
          )}
        </li>
      ))}
    </ul>
  );
}
