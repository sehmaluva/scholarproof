import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, getDashboardPath, useAuth } from "./lib/auth";
import { Layout } from "./components/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import UniversityDashboard from "./pages/UniversityDashboard";
import DemoPage from "./pages/DemoPage";

const queryClient = new QueryClient();

function ProtectedRoute({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <div className="py-12 text-center text-white/50">Loading…</div>;
  }
  if (user?.role !== role) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppRoutes() {
  const { user, logout } = useAuth();

  return (
    <Routes>
      <Route element={<Layout user={user} onLogout={logout} />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider"
          element={
            <ProtectedRoute role="provider">
              <ProviderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/university"
          element={
            <ProtectedRoute role="university">
              <UniversityDashboard />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
