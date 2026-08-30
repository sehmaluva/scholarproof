import { Link, Outlet, useNavigate } from "react-router-dom";
import { Shield, LogOut } from "lucide-react";
import { getDashboardPath } from "../lib/auth";
import { Button } from "./ui";

export function Layout({
  user,
  onLogout,
}: {
  user: { username: string; role: string } | null;
  onLogout: () => void;
}) {
  const navigate = useNavigate();

  function handleLogout() {
    onLogout();
    navigate("/login", { replace: true });
  }

  const links =
    user?.role === "student"
      ? [
          { to: getDashboardPath("student"), label: "Dashboard" },
          { to: "/demo", label: "Privacy Demo" },
        ]
      : user?.role === "provider"
        ? [{ to: getDashboardPath("provider"), label: "Provider Dashboard" }]
        : user?.role === "university"
          ? [{ to: getDashboardPath("university"), label: "Issue Credentials" }]
          : [];

  return (
    <div className="glass-page min-h-screen">
      <div className="glass-orb glass-orb-a" aria-hidden="true" />
      <div className="glass-orb glass-orb-b" aria-hidden="true" />
      <div className="glass-orb glass-orb-c" aria-hidden="true" />

      <header className="sticky top-0 z-50 border-b border-white/10 glass-panel-strong">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-white/95">
            <Shield className="h-6 w-6 text-white/70" />
            <span className="text-white/90">ScholarProof</span>
          </Link>
          <nav className="flex items-center gap-4">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-white/55 hover:text-white/90 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/45">{user.username} ({user.role})</span>
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-white/8 py-6 text-center text-sm text-white/40">
        Prove you&apos;re qualified. Don&apos;t reveal why.
      </footer>
    </div>
  );
}
