"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { revisionApi, RevisionTopic } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { RefreshCw, Clock, CheckCircle2, Loader2, Brain, ChevronRight, Zap, LogOut } from "lucide-react";

interface RevisionCard {
    topic: RevisionTopic;
    status: "idle" | "submitting" | "done";
}

export default function RevisionPage() {
    const { logout } = useAuth();
    const [due, setDue] = useState<RevisionCard[]>([]);
    const [suggestions, setSuggestions] = useState<RevisionTopic[]>([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState<Record<string, number>>({});

    useEffect(() => {
        (async () => {
            try {
                const [dueRes, sugRes] = await Promise.all([revisionApi.due(), revisionApi.suggestions()]);
                setDue(dueRes.data.map(t => ({ topic: t, status: "idle" })));
                setSuggestions(sugRes.data);
            } catch { } finally { setLoading(false); }
        })();
    }, []);

    const markRevised = async (topic: RevisionTopic, success: boolean) => {
        setDue(prev => prev.map(d => d.topic.topic === topic.topic ? { ...d, status: "submitting" } : d));
        try {
            await revisionApi.markRevised(topic.topic, {
                success,
                score: rating[topic.topic] ?? (success ? 80 : 40),
                time_spent_minutes: 10,
            });
            setDue(prev => prev.map(d => d.topic.topic === topic.topic ? { ...d, status: "done" } : d));
        } catch {
            setDue(prev => prev.map(d => d.topic.topic === topic.topic ? { ...d, status: "idle" } : d));
        }
    };

    const activeDue = due.filter(d => d.status !== "done");
    const completedCount = due.filter(d => d.status === "done").length;

    return (
        <div className="min-h-screen bg-mistral-bg">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-mistral-bg/80 backdrop-blur-md border-b border-mistral-navy/10">
                <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="grid grid-cols-2 gap-0.5">
                            <div className="w-1.5 h-1.5 bg-mistral-navy" /><div className="w-1.5 h-1.5 bg-mistral-orange" />
                            <div className="w-1.5 h-1.5 bg-mistral-sand" /><div className="w-1.5 h-1.5 bg-mistral-yellow" />
                        </div>
                        <span className="font-serif text-lg font-bold text-mistral-navy">AntiNotes<span className="text-mistral-orange">.</span></span>
                    </Link>
                    <button onClick={logout} className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs text-mistral-navy/40 hover:text-red-500 transition-all">
                        <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="font-serif text-4xl font-medium text-mistral-navy mb-1">Spaced Revision</h1>
                    <p className="font-sans text-sm text-mistral-navy/50">
                        Your brain forgets on a curve. We fight back.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="grid grid-cols-2 gap-1">
                            {["bg-mistral-navy", "bg-mistral-orange", "bg-mistral-sand", "bg-mistral-yellow"].map((c, i) => (
                                <div key={i} className={`w-2 h-2 ${c} animate-pulse`} style={{ animationDelay: `${i * 0.15}s` }} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 flex flex-col gap-4">
                            {/* Progress */}
                            {due.length > 0 && (
                                <div className="bg-white border border-mistral-navy/10 p-4">
                                    <div className="flex items-center justify-between mb-2 text-xs font-mono text-mistral-navy/60">
                                        <span>Session Progress</span>
                                        <span>{completedCount} / {due.length} done</span>
                                    </div>
                                    <div className="h-1.5 bg-mistral-sand overflow-hidden">
                                        <motion.div
                                            className="h-full bg-mistral-orange"
                                            animate={{ width: `${(completedCount / due.length) * 100}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Due Topics */}
                            <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-4 h-4 text-mistral-orange" />
                                <span className="font-mono text-xs text-mistral-navy/60 uppercase tracking-wider">Due Today</span>
                                <span className="font-mono text-xs bg-mistral-orange text-white px-1.5 py-0.5 ml-1">{activeDue.length}</span>
                            </div>

                            <AnimatePresence>
                                {activeDue.length === 0 && !loading && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="bg-white border border-emerald-200 p-8 text-center">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                                        <h3 className="font-serif text-xl text-mistral-navy mb-1">All caught up!</h3>
                                        <p className="font-sans text-sm text-mistral-navy/50">No revision due today. Check back tomorrow.</p>
                                    </motion.div>
                                )}

                                {activeDue.map(({ topic: t, status }) => (
                                    <motion.div key={t.topic} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                        className="bg-white border border-mistral-navy/10 p-5">
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div>
                                                <div className="font-mono text-sm font-bold text-mistral-navy mb-1">{t.topic}</div>
                                                <div className="flex items-center gap-3 text-xs font-mono text-mistral-navy/40">
                                                    <span>Seen {t.last_seen_days}d ago</span>
                                                    <span>·</span>
                                                    <span>Revision #{t.revision_number + 1}</span>
                                                    <span>·</span>
                                                    <span>Last score: {t.score}/100</span>
                                                </div>
                                            </div>
                                            {/* Confidence rating */}
                                            <div className="flex-shrink-0 flex gap-1">
                                                {[1, 2, 3, 4, 5].map(n => (
                                                    <button key={n} onClick={() => setRating(r => ({ ...r, [t.topic]: n * 20 }))}
                                                        className={`w-6 h-6 font-mono text-xs border transition-all ${(rating[t.topic] ?? 0) / 20 >= n
                                                                ? "bg-mistral-navy text-white border-mistral-navy"
                                                                : "bg-white text-mistral-navy/30 border-mistral-navy/20 hover:border-mistral-navy"
                                                            }`}>
                                                        {n}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button onClick={() => markRevised(t, true)} disabled={status === "submitting"}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-mistral-navy text-white font-mono text-xs border border-mistral-navy shadow-[2px_2px_0px_0px_#f97316] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#f97316] active:shadow-none transition-all disabled:opacity-60">
                                                {status === "submitting" ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                                Got it
                                            </button>
                                            <button onClick={() => markRevised(t, false)} disabled={status === "submitting"}
                                                className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-mistral-navy font-mono text-xs border border-mistral-navy/20 hover:border-mistral-navy transition-all disabled:opacity-60">
                                                Struggling
                                            </button>
                                            <Link href={`/problems?tag=${encodeURIComponent(t.topic)}`}
                                                className="flex items-center gap-1 px-3 py-2 font-mono text-xs text-mistral-navy/50 border border-mistral-navy/10 hover:border-mistral-navy/30 transition-all">
                                                <Zap className="w-3 h-3" /> Practice
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Suggestions */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Brain className="w-4 h-4 text-mistral-navy" />
                                <span className="font-mono text-xs text-mistral-navy/60 uppercase tracking-wider">Proactive Suggestions</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                {suggestions.slice(0, 6).map(t => (
                                    <div key={t.topic} className="bg-white border border-mistral-navy/10 p-3 flex items-center justify-between gap-2">
                                        <span className="font-mono text-xs text-mistral-navy">{t.topic}</span>
                                        <Link href={`/problems?tag=${encodeURIComponent(t.topic)}`}
                                            className="font-mono text-[10px] text-mistral-orange hover:underline flex-shrink-0 flex items-center gap-0.5">
                                            Practice <ChevronRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                ))}
                                {suggestions.length === 0 && (
                                    <div className="bg-white border border-dashed border-mistral-navy/20 p-4 text-center">
                                        <p className="font-mono text-xs text-mistral-navy/40">Submit reviews to get suggestions</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
