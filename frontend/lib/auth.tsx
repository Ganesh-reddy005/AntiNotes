"use client";
/**
 * AuthContext — manages JWT token + user state app-wide.
 * Wrap the app in <AuthProvider> and consume with useAuth().
 */
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi, User } from "./api";

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, full_name: string) => Promise<void>;
    logout: () => void;
    isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Re-hydrate from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem("antinotes_token");
        const storedUser = localStorage.getItem("antinotes_user");
        setTimeout(() => {
            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
            setIsLoading(false);
        }, 0);
    }, []);

    const persistSession = (token: string, user: User) => {
        localStorage.setItem("antinotes_token", token);
        localStorage.setItem("antinotes_user", JSON.stringify(user));
        setToken(token);
        setUser(user);
    };

    const login = async (email: string, password: string) => {
        const res = await authApi.login(email, password);
        persistSession(res.data.access_token, res.data.user);
    };

    const register = async (email: string, password: string, full_name: string) => {
        const res = await authApi.register({ email, password, full_name });
        persistSession(res.data.access_token, res.data.user);
    };

    const logout = () => {
        localStorage.removeItem("antinotes_token");
        localStorage.removeItem("antinotes_user");
        setToken(null);
        setUser(null);
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider
            value={{ user, token, isLoading, login, register, logout, isLoggedIn: !!token }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
