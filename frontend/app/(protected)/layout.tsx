/**
 * Protected Layout — route guard for all (protected) pages.
 * Redirects unauthenticated users to /login.
 */
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { isLoggedIn, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            router.replace("/login");
        }
    }, [isLoggedIn, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-mistral-bg flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="grid grid-cols-2 gap-1">
                        <div className="w-2 h-2 bg-mistral-navy animate-pulse" />
                        <div className="w-2 h-2 bg-mistral-orange animate-pulse [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-mistral-sand animate-pulse [animation-delay:0.4s]" />
                        <div className="w-2 h-2 bg-mistral-yellow animate-pulse [animation-delay:0.6s]" />
                    </div>
                    <p className="font-mono text-xs text-mistral-navy/40 uppercase tracking-widest">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isLoggedIn) return null;

    return <>{children}</>;
}
