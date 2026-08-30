import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardPath, useAuth, useRequireGuest } from "../lib/auth";
import { Button, Card } from "../components/ui";

export default function LoginPage() {
  const [username, setUsername] = useState("student");
  const [password, setPassword] = useState("demo12345");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, authLoading } = useAuth();

  useRequireGuest();

  async function handleLogin(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError("");
    try {
      const me = await login(username, password);
      navigate(getDashboardPath(me.role), { replace: true });
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return <div className="py-12 text-center text-white/50">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-md">
      <Card className="glass-panel-strong">
        <h1 className="mb-2 text-2xl font-bold text-white/95">Sign in</h1>
        <p className="mb-6 text-sm text-white/45">
          Demo: student / provider / university — password demo12345
        </p>
        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            className="glass-input w-full rounded-xl px-4 py-2.5"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <input
            className="glass-input w-full rounded-xl px-4 py-2.5"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error && <p className="text-sm text-white/60">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
