"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

export default function withAuth(Component: any) {
  return function WithAuth(props: any) {
    const { user, isLoading } = useAuthContext();

    useEffect(() => {
      if (!user) {
        redirect("/login");
      }
    }, [user]);

    if (isLoading) return <h1>Loading...</h1>;

    if (!user) return null;

    return <Component {...props} />;
  };
}
