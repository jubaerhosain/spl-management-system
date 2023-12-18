"use client"

import { redirect } from 'next/navigation'
import { useAuthContext } from "@/contexts/AuthContext"
import { useEffect } from "react";

export default function withUnAuth(Component: any) {
    return function WithUnAuth(props: any) {
        const { user } = useAuthContext();

        useEffect(() => {
            if (user) {
                redirect("/");
            }
        }, [user]);

        if (user) return null;

        return <Component {...props} />
    }
}