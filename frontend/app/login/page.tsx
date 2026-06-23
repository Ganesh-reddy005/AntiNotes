"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Terminal, Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status === "loading") return;
        setStatus("loading");
        setError("");
        try {
            await login(email, password);
            router.push("/dashboard");
        } catch (e: unknown) {
            const err = e as { response?: { data?: { detail?: unknown } } };
            const msg = err.response?.data?.detail || "Invalid credentials";
            setError(typeof msg === "string" ? msg : JSON.stringify(msg));
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen bg-mistral-bg flex">
            {/* Left Panel — Philosophy */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 bg-mistral-navy p-12">
                <Link href="/" className="flex items-center gap-2 w-fit hover:opacity-80 transition-opacity">
                    <div className="grid grid-cols-2 gap-0.5">
                        <div className="w-1.5 h-1.5 bg-white" />
                        <div className="w-1.5 h-1.5 bg-mistral-orange" />
                        <div className="w-1.5 h-1.5 bg-white/40" />
                        <div className="w-1.5 h-1.5 bg-mistral-yellow" />
                    </div>
                    <span className="font-serif text-xl font-bold text-white">
                        AntiNotes<span className="text-mistral-orange">.</span>
                    </span>
                </Link>

                <div>
                    <blockquote className="font-serif text-4xl font-medium text-white leading-tight mb-6">
                        &quot;Wrong answers are more valuable than correct ones.&quot;
                    </blockquote>
                    <p className="font-sans text-white/50 text-sm max-w-xs leading-relaxed">
                        Antinotes doesn&apos;t grade your code. It grades your thinking. Every submission reveals
                        a pattern. Every mistake is a data point.
                    </p>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs text-white/30 uppercase tracking-widest">
                    <span className="w-2 h-2 bg-mistral-orange animate-pulse inline-block" />
                    System: Online
                </div>
            </div>

            {/* Right Panel — Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile Logo */}
                    <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden w-fit hover:opacity-80 transition-opacity">
                        <div className="grid grid-cols-2 gap-0.5">
                            <div className="w-1.5 h-1.5 bg-mistral-navy" />
                            <div className="w-1.5 h-1.5 bg-mistral-orange" />
                            <div className="w-1.5 h-1.5 bg-mistral-sand" />
                            <div className="w-1.5 h-1.5 bg-mistral-yellow" />
                        </div>
                        <span className="font-serif text-xl font-bold text-mistral-navy">
                            AntiNotes<span className="text-mistral-orange">.</span>
                        </span>
                    </Link>

                    <h1 className="font-serif text-4xl font-medium text-mistral-navy mb-2">Welcome back.</h1>
                    <p className="font-sans text-mistral-navy/50 text-sm mb-8">
                        Ready to train your thinking?
                    </p>

                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div>
                            <label className="font-mono text-xs text-mistral-navy/60 uppercase tracking-wider mb-1.5 block">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 bg-white border border-mistral-navy/20 text-mistral-navy placeholder-mistral-navy/30 font-mono text-sm focus:outline-none focus:border-mistral-navy focus:ring-1 focus:ring-mistral-navy transition-all"
                            />
                        </div>

                        <div>
                            <label className="font-mono text-xs text-mistral-navy/60 uppercase tracking-wider mb-1.5 block">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPwd ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 pr-12 bg-white border border-mistral-navy/20 text-mistral-navy placeholder-mistral-navy/30 font-mono text-sm focus:outline-none focus:border-mistral-navy focus:ring-1 focus:ring-mistral-navy transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(!showPwd)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-mistral-navy/40 hover:text-mistral-navy transition-colors"
                                >
                                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="font-mono text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2">
                                Error: {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="mt-2 w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-mistral-navy text-white font-mono text-sm font-bold uppercase tracking-wide border border-mistral-navy shadow-[4px_4px_0px_0px_#f97316] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#f97316] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0"
                        >
                            {status === "loading" ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <Terminal className="w-4 h-4 text-mistral-yellow" />
                                    Sign_In
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 font-sans text-sm text-mistral-navy/50 text-center">
                        No account?{" "}
                        <Link href="/register" className="text-mistral-orange font-medium hover:underline">
                            Create one →
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
