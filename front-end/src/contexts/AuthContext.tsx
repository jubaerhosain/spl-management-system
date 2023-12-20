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
  const {
    data: user,
    isLoading,
    mutate,
  } = useSWR("/auth/user", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    refreshInterval: 0,
    shouldRetryOnError: false,
  });

  const login = (userData: any) => {
    mutate(userData, false);
  };

  const logout = () => {
    mutate(null, false);
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
