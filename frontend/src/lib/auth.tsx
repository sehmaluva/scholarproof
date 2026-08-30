import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { fetchMe, login as apiLogin } from "./api";

export type AuthUser = {
  username: string;
  role: string;
  student_id?: string;
  university_name?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  authLoading: boolean;
  login: (username: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  refreshUser: () => Promise<AuthUser | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function getDashboardPath(role: string): string {
  switch (role) {
    case "student":
      return "/student";
    case "provider":
      return "/provider";
    case "university":
      return "/university";
    default:
      return "/";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setUser(null);
      setAuthLoading(false);
      return null;
    }

    setAuthLoading(true);
    try {
      const me = await fetchMe();
      setUser(me);
      return me;
    } catch {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
      return null;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (username: string, password: string) => {
    await apiLogin(username, password);
    const me = await fetchMe();
    setUser(me);
    return me;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

/** Redirect authenticated users to their role dashboard. */
export function useRequireGuest() {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate(getDashboardPath(user.role), { replace: true });
    }
  }, [user, authLoading, navigate]);
}
