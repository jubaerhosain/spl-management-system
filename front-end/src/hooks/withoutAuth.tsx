"use client"

import { redirect } from 'next/navigation'
import { useAuthContext } from "@/contexts/AuthContext"
import { useEffect } from "react";

export default function withoutAuth(Component: any) {
    return function WithoutAuth(props: any) {
        const { user, isLoading } = useAuthContext();

        useEffect(() => {
            if (user) {
                redirect("/");
            }
        }, [user]);

        if(isLoading) return null;

        if (user) return null;

        return <Component {...props} />
    }
}