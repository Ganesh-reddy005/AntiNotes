"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { userApi } from "@/lib/api";
import LillyChat from "@/components/LillyChat";

export default function OnboardingPage() {
    const router = useRouter();
    const { isLoggedIn, isLoading: authLoading } = useAuth();
    const [checkingProfile, setCheckingProfile] = useState(true);
    const [completed, setCompleted] = useState(false);

    // Auth guard: redirect to /login if not authenticated
    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push("/login");
        }
    }, [authLoading, isLoggedIn, router]);

    // Check if onboarding already completed → redirect to dashboard
    useEffect(() => {
        if (!authLoading && isLoggedIn) {
            userApi
                .profile()
                .then((res) => {
                    if (res.data.onboarding_completed) {
                        router.push("/dashboard");
                    } else {
                        setCheckingProfile(false);
                    }
                })
                .catch(() => {
                    // Profile doesn't exist yet — proceed with onboarding
                    setCheckingProfile(false);
                });
        }
    }, [authLoading, isLoggedIn, router]);

    const handleComplete = (extractedProfile: any) => {
        setCompleted(true);
        setTimeout(() => {
            router.push("/dashboard");
        }, 2000);
    };

    // Loading state while checking auth/profile
    if (authLoading || checkingProfile) {
        return (
            <div className="min-h-screen bg-mistral-bg flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="grid grid-cols-2 gap-1">
                        {["bg-mistral-navy", "bg-mistral-orange", "bg-mistral-sand", "bg-mistral-yellow"].map(
                            (c, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 ${c} animate-pulse`}
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                />
                            )
                        )}
                    </div>
                    <p className="font-mono text-xs text-mistral-navy/40 uppercase tracking-widest">
                        Preparing your experience...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-mistral-bg">
            {/* Header */}
            <AnimatePresence mode="wait">
                {completed ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="pt-10 md:pt-14 pb-4 text-center relative z-10"
                    >
                        <h1 className="font-serif text-3xl md:text-4xl font-medium mb-2 text-mistral-navy">
                            You&apos;re all set!
                        </h1>
                        <p className="font-sans text-sm text-mistral-navy/60">
                            Taking you to your dashboard...
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-mistral-orange" />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="header"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="pt-10 md:pt-14 pb-4 text-center relative z-10"
                    >
                        {/* AntiNotes wordmark */}
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <div className="grid grid-cols-2 gap-0.5">
                                <div className="w-1.5 h-1.5 bg-mistral-navy" />
                                <div className="w-1.5 h-1.5 bg-mistral-orange" />
                                <div className="w-1.5 h-1.5 bg-mistral-sand" />
                                <div className="w-1.5 h-1.5 bg-mistral-yellow" />
                            </div>
                            <span className="font-serif text-lg font-bold text-mistral-navy">
                                AntiNotes<span className="text-mistral-orange">.</span>
                            </span>
                        </div>

                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="font-serif text-2xl md:text-3xl font-medium mb-2 text-mistral-navy"
                        >
                            Meet <span className="text-mistral-orange">Lilly</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.5 }}
                            className="font-sans text-xs md:text-sm text-mistral-navy/60"
                        >
                            Your personal coding companion
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat container */}
            {!completed && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                    className="flex-1 flex flex-col w-full max-w-[700px] mx-auto px-4 pb-4 relative z-10 min-h-0"
                >
                    <div className="flex-1 flex flex-col rounded-2xl overflow-hidden border border-mistral-navy/10 shadow-[0_8px_40px_rgba(15,23,42,0.04)] bg-white min-h-0">
                        <LillyChat context="onboarding" onComplete={handleComplete} />
                    </div>
                </motion.div>
            )}
        </div>
    );
}
