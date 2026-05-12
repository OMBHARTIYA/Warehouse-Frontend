"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../../lib/api";
import { LoginCredentials, RegisterPayload, User } from "../../types/auth";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  registerUser: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_STORAGE_KEY = "token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await api.get("/api/auth/me");
      const nextUser = (response.data?.user ?? response.data ?? null) as User | null;
      setUser(nextUser);
    } catch {
      logout();
    }
  }, [logout]);

  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (!storedToken) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      if (isMounted) {
        setToken(storedToken);
      }

      try {
        const response = await api.get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!isMounted) {
          return;
        }

        const nextUser = (response.data?.user ?? response.data ?? null) as User | null;
        setUser(nextUser);
      } catch {
        if (isMounted) {
          logout();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, [logout]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await api.post("/api/auth/login", credentials);
    const nextToken = response.data?.token;

    if (!nextToken || typeof nextToken !== "string") {
      throw new Error("Token missing in login response.");
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    setToken(nextToken);

    const nextUser = (response.data?.user ?? null) as User | null;
    if (nextUser) {
      setUser(nextUser);
    } else {
      await refreshUser();
    }
  }, [refreshUser]);

  const registerUser = useCallback(async (payload: RegisterPayload) => {
    await api.post("/api/auth/register", payload);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      login,
      registerUser,
      logout,
      refreshUser,
    }),
    [isLoading, login, logout, refreshUser, registerUser, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
