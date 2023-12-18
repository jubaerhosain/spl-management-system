"use client"

import { redirect } from 'next/navigation'
import { useAuthContext } from "@/contexts/AuthContext"
import { useEffect } from "react";

export default function withAuth(Component: any) {
    return function WithAuth(props: any) {
        const { user } = useAuthContext();

        useEffect(() => {
            if (!user) {
                redirect("/login");
            }
        }, [user]);

        if (!user) return null;

        return <Component {...props} />
    }
}