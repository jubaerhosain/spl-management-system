"use client";

import fetcher from "@/api/fetcher";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import useSWR from "swr";

type AuthContextValue = {
  user: any;
  isLoading: boolean;
  login: (userData: any) => void;
  logout: () => void;
};
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);

  const { data, error, isLoading } = useSWR("/auth/user", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    refreshInterval: 0,
    shouldRetryOnError: false,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);

  const login = (userData: any) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
