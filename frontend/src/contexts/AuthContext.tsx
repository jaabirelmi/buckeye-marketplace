/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { loginUser, registerUser } from "../services/authApi";

type AuthUser = {
  email: string;
  role: string;
};

interface AuthContextValue {
  token: string;
  refreshToken: string;
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const EMAIL_KEY = "auth_email";
const ROLE_KEY = "auth_role";

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY) ?? "";
    const savedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) ?? "";
    const savedEmail = localStorage.getItem(EMAIL_KEY);
    const savedRole = localStorage.getItem(ROLE_KEY);

    if (savedToken && savedEmail && savedRole) {
      setToken(savedToken);
      setRefreshToken(savedRefreshToken);
      setUser({
        email: savedEmail,
        role: savedRole,
      });
    }
  }, []);

  function storeAuth(authToken: string, newRefreshToken: string, email: string, role: string) {
    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
    localStorage.setItem(EMAIL_KEY, email);
    localStorage.setItem(ROLE_KEY, role);

    setToken(authToken);
    setRefreshToken(newRefreshToken);
    setUser({ email, role });
  }

  function clearStoredAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(ROLE_KEY);

    setToken("");
    setRefreshToken("");
    setUser(null);
  }

  async function login(email: string, password: string): Promise<boolean> {
    try {
      setLoading(true);
      setError("");

      const data = await loginUser(email, password);
      storeAuth(data.token, data.refreshToken, data.email, data.role);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function register(email: string, password: string): Promise<boolean> {
    try {
      setLoading(true);
      setError("");

      const data = await registerUser(email, password);
      storeAuth(data.token, data.refreshToken, data.email, data.role);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearStoredAuth();
    setError("");
  }

  function clearError() {
    setError("");
  }

  const value = useMemo(
    () => ({
      token,
      refreshToken,
      user,
      isAuthenticated: !!token,
      loading,
      error,
      login,
      register,
      logout,
      clearError,
    }),
    [token, refreshToken, user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
}