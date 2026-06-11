"use client";
import { motion } from "framer-motion";
import { Brain, Lock, Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LearningMemory } from "@/lib/api";

const trendIcon = (t: string) =>
    t === "improving" ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> :
        t === "regressing" ? <TrendingDown className="w-3.5 h-3.5 text-red-500" /> :
            <Minus className="w-3.5 h-3.5 text-amber-500" />;

const trendColor = (t: string) =>
    t === "improving" ? "text-emerald-600 bg-emerald-50 border-emerald-200" :
        t === "regressing" ? "text-red-600 bg-red-50 border-red-200" :
            "text-amber-600 bg-amber-50 border-amber-200";

export function LearningIntelligence({ memory, totalReviews }: { memory: LearningMemory | null; totalReviews: number }) {
    const UNLOCK_AT = 5;
    const progress = Math.min(totalReviews, UNLOCK_AT);

    if (!memory) {
        return (
            <div className="bg-white border border-mistral-navy/10 p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-4 h-4 text-mistral-orange" />
                    <span className="font-mono text-xs text-mistral-navy/60 uppercase tracking-wider">Learning Intelligence</span>
                    <Lock className="w-3 h-3 text-mistral-navy/30 ml-auto" />
                </div>
                {/* Progress to unlock */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <p className="font-sans text-xs text-mistral-navy/50">Unlocks after {UNLOCK_AT} reviews</p>
                        <span className="font-mono text-xs text-mistral-orange">{progress}/{UNLOCK_AT}</span>
                    </div>
                    <div className="h-1.5 bg-mistral-navy/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(progress / UNLOCK_AT) * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-mistral-orange"
                        />
                    </div>
                    <p className="font-sans text-xs text-mistral-navy/40 mt-2">
                        Solve {UNLOCK_AT - progress} more problem{UNLOCK_AT - progress !== 1 ? "s" : ""} to unlock your AI-generated learning analysis.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-mistral-navy/10 p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-mistral-orange" />
                    <span className="font-mono text-xs text-mistral-navy/60 uppercase tracking-wider">Learning Intelligence</span>
                </div>
                <span className={`flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 border ${trendColor(memory.progress_trend)}`}>
                    {trendIcon(memory.progress_trend)}
                    {memory.progress_trend}
                </span>
            </div>

            {/* AI Summary */}
            <p className="font-sans text-xs text-mistral-navy/70 leading-relaxed mb-4 bg-mistral-navy/[0.03] border-l-2 border-mistral-orange p-3">
                {memory.summary}
            </p>

            <div className="space-y-3 text-xs">
                {/* Topics */}
                {memory.topics_covered.length > 0 && (
                    <div>
                        <p className="font-mono text-[10px] text-mistral-navy/40 uppercase tracking-wider mb-1.5">Topics Covered</p>
                        <div className="flex flex-wrap gap-1">
                            {memory.topics_covered.map((t, i) => (
                                <span key={i} className="font-mono text-[10px] bg-mistral-navy/5 text-mistral-navy/60 px-2 py-0.5 border border-mistral-navy/10">{t}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Breakthroughs */}
                {memory.key_breakthroughs.length > 0 && (
                    <div>
                        <p className="font-mono text-[10px] text-emerald-600 uppercase tracking-wider mb-1.5">Key Breakthroughs</p>
                        <ul className="space-y-1">
                            {memory.key_breakthroughs.map((b, i) => (
                                <li key={i} className="font-sans text-xs text-mistral-navy/70 flex items-start gap-1.5">
                                    <span className="text-emerald-500 mt-0.5 flex-shrink-0">★</span>{b}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Struggles */}
                {memory.persistent_struggles.length > 0 && (
                    <div>
                        <p className="font-mono text-[10px] text-mistral-orange uppercase tracking-wider mb-1.5">Persistent Struggles</p>
                        <ul className="space-y-1">
                            {memory.persistent_struggles.map((s, i) => (
                                <li key={i} className="font-sans text-xs text-mistral-navy/70 flex items-start gap-1.5">
                                    <span className="text-mistral-orange mt-0.5 flex-shrink-0">⚠</span>{s}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <p className="font-mono text-[10px] text-mistral-navy/30 pt-1">
                    Based on {memory.num_reviews_analyzed} reviews · Updated {new Date(memory.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </p>
            </div>
        </div>
    );
}
