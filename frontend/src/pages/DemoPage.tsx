import { PrivacyComparison, BeforeAfterDemo } from "../components/Privacy";

export default function DemoPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Privacy Demo</h1>
        <p className="text-white/50">My data stays private.</p>
      </div>
      <PrivacyComparison />
      <BeforeAfterDemo />
    </div>
  );
}
