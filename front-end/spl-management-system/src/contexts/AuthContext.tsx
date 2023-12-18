"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

type AuthContextValue = {
    user: any;
    login: (userData: any) => void;
    logout: () => void;
};
const AuthContext = createContext<AuthContextValue | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);

    const login = (userData: any) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = (): AuthContextValue => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};
