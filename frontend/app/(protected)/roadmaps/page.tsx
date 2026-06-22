"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { roadmapApi, Roadmap } from "@/lib/api";
import { DashboardNav } from "@/app/(protected)/dashboard/components/DashboardNav";
import { useAuth } from "@/lib/auth";
import { BookOpen, ChevronRight, Compass, Layout, Map } from "lucide-react";

export default function RoadmapsPage() {
    const { logout } = useAuth();
    const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        roadmapApi.list()
            .then(res => {
                const orderedSlugs = ["programming-foundations", "foundations-warmups", "dsa-fundamentals"];
                const sorted = [...res.data].sort((a, b) => {
                    const idxA = orderedSlugs.indexOf(a.slug);
                    const idxB = orderedSlugs.indexOf(b.slug);
                    return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
                });
                setRoadmaps(sorted);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-mistral-bg flex items-center justify-center">
            <p className="font-mono text-xs text-mistral-navy/40 uppercase tracking-widest animate-pulse">Mapping out paths...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-mistral-bg">
            <DashboardNav onLogout={logout} />

            <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 space-y-10">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-2 mb-2">
                        <Compass className="w-5 h-5 text-mistral-orange" />
                        <span className="font-mono text-xs text-mistral-navy/60 uppercase tracking-widest">Guidance</span>
                    </div>
                    <h1 className="font-serif text-4xl md:text-5xl font-medium text-mistral-navy mb-4">
                        Learning <span className="italic text-mistral-orange">Roadmaps.</span>
                    </h1>
                    <p className="font-sans text-mistral-navy/50 text-base max-w-2xl">
                        Structured paths to help you master DSA topics step-by-step. 
                        Don't just solve problems—understand the patterns behind them.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roadmaps.map((roadmap, i) => {
                        const isWarmup = roadmap.slug === "foundations-warmups";
                        return (
                            <motion.div 
                                key={roadmap.slug}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link 
                                    href={`/roadmaps/${roadmap.slug}`}
                                    className={`block bg-white border p-6 h-full transition-all group ${
                                        isWarmup 
                                        ? "border-amber-500/30 hover:border-amber-500 hover:shadow-[4px_4px_0px_0px_#f59e0b]" 
                                        : "border-mistral-navy/10 hover:border-mistral-navy hover:shadow-[4px_4px_0px_0px_#0f172a]"
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <Map className={`w-6 h-6 ${isWarmup ? "text-amber-500" : "text-mistral-orange"}`} />
                                        {roadmap.is_featured ? (
                                            <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                                                isWarmup ? "bg-amber-500/10 text-amber-500" : "bg-mistral-orange/10 text-mistral-orange"
                                            }`}>Featured</span>
                                        ) : roadmap.topics.length === 0 ? (
                                            <span className="font-mono text-[10px] bg-mistral-navy/5 text-mistral-navy/40 px-2 py-0.5 rounded-full">Coming Soon</span>
                                        ) : null}
                                    </div>
                                    <h3 className={`font-mono text-lg font-bold text-mistral-navy mb-2 transition-colors ${
                                        isWarmup ? "group-hover:text-amber-500" : "group-hover:text-mistral-orange"
                                    }`}>
                                        {roadmap.title}
                                    </h3>
                                    <p className="font-sans text-sm text-mistral-navy/60 mb-6 line-clamp-2">
                                        {roadmap.description}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="font-mono text-xs text-mistral-navy/40">
                                            {roadmap.topics.length > 0 ? `${roadmap.topics.length} Topics` : "Module in development"}
                                        </span>
                                        {roadmap.topics.length > 0 ? (
                                            <div className={`flex items-center gap-1 font-mono text-xs ${
                                                isWarmup ? "text-amber-500" : "text-mistral-orange"
                                            }`}>
                                                View Path <ChevronRight className="w-4 h-4" />
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 font-mono text-[10px] text-mistral-navy/20 uppercase tracking-widest">
                                                Locked
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
