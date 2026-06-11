"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronDown, ChevronRight, CheckCircle2, XCircle, History } from "lucide-react";
import { SubmissionHistory } from "@/lib/api";

const diffColor = (d: string) =>
    d === "Easy" ? "text-emerald-600 bg-emerald-50 border-emerald-200" :
        d === "Medium" ? "text-amber-600 bg-amber-50 border-amber-200" :
            "text-red-600 bg-red-50 border-red-200";

export function HistoryRow({ h, i }: { h: SubmissionHistory; i: number }) {
    const [open, setOpen] = useState(false);
    const score = Math.round(h.score);
    const strengths = Array.isArray(h.strengths) ? h.strengths.map(String).filter(Boolean) : [];
    const weaknesses = Array.isArray(h.weaknesses) ? h.weaknesses.map(String).filter(Boolean) : [];
    const gaps = Array.isArray(h.concept_gaps) ? h.concept_gaps.map(String).filter(Boolean) : [];

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.03 }}
            className="border-b border-mistral-navy/5 last:border-0"
        >
            <button onClick={() => setOpen(o => !o)}
                className="w-full flex items-center gap-4 px-4 py-3 hover:bg-mistral-navy/[0.02] transition-colors text-left">
                <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center font-serif font-bold text-sm border
                    ${score >= 80 ? "bg-emerald-50 border-emerald-200 text-emerald-600" :
                        score >= 50 ? "bg-amber-50 border-amber-200 text-amber-600" :
                            "bg-red-50 border-red-200 text-red-500"}`}>
                    {score}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm font-bold text-mistral-navy truncate">{h.problem_title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className={`font-mono text-[10px] px-1.5 border ${diffColor(h.difficulty)}`}>{h.difficulty}</span>
                        {h.thinking_style && <span className="font-mono text-[10px] text-mistral-navy/40">{h.thinking_style}</span>}
                    </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                        <p className="font-mono text-xs text-mistral-navy/40">
                            {new Date(h.solved_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </p>
                        <p className="font-mono text-[10px] text-mistral-navy/30">
                            {new Date(h.solved_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-mistral-navy/30 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                </div>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="px-4 pb-4 pt-1 bg-mistral-navy/[0.02] space-y-3 border-t border-mistral-navy/5">
                            {h.detailed_feedback && (
                                <div className="bg-white border-l-2 border-mistral-orange p-3">
                                    <p className="font-sans text-xs text-mistral-navy/70 leading-relaxed whitespace-pre-wrap">{h.detailed_feedback}</p>
                                </div>
                            )}
                            {strengths.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                        <span className="font-mono text-[10px] text-mistral-navy/50 uppercase tracking-wider">Strengths</span>
                                    </div>
                                    <ul className="space-y-1">
                                        {strengths.map((s, idx) => (
                                            <li key={idx} className="font-sans text-xs text-mistral-navy/70 flex items-start gap-1.5">
                                                <span className="text-emerald-500 mt-0.5">•</span>{s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {weaknesses.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <XCircle className="w-3 h-3 text-mistral-orange" />
                                        <span className="font-mono text-[10px] text-mistral-navy/50 uppercase tracking-wider">To Improve</span>
                                    </div>
                                    <ul className="space-y-1">
                                        {weaknesses.map((w, idx) => (
                                            <li key={idx} className="font-sans text-xs text-mistral-navy/70 flex items-start gap-1.5">
                                                <span className="text-mistral-orange mt-0.5">•</span>{w}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {gaps.length > 0 && (
                                <div>
                                    <span className="font-mono text-[10px] text-mistral-navy/50 uppercase tracking-wider">Concept Gaps</span>
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                        {gaps.map((g, idx) => (
                                            <span key={idx} className="font-mono text-[10px] bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5">{g}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <Link href={`/problems/${h.problem_slug}`}
                                className="inline-flex items-center gap-1 font-mono text-xs text-mistral-orange hover:underline mt-1">
                                Re-attempt <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export function HistoryList({ history }: { history: SubmissionHistory[] }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-mistral-navy" />
                    <span className="font-mono text-xs text-mistral-navy/60 uppercase tracking-wider">Submission History</span>
                </div>
                {history.length > 0 && (
                    <span className="font-mono text-xs text-mistral-navy/40">{history.length} submission{history.length !== 1 ? "s" : ""}</span>
                )}
            </div>
            {history.length === 0 ? (
                <div className="bg-white border border-dashed border-mistral-navy/20 p-8 text-center">
                    <CheckCircle2 className="w-8 h-8 text-mistral-navy/20 mx-auto mb-2" />
                    <p className="font-mono text-xs text-mistral-navy/40 mb-1">No submissions yet</p>
                    <Link href="/problems" className="inline-block mt-3 font-mono text-xs text-mistral-orange hover:underline">Start solving →</Link>
                </div>
            ) : (
                <div className="bg-white border border-mistral-navy/10 divide-y divide-mistral-navy/5">
                    {history.map((h, i) => <HistoryRow key={h.review_id} h={h} i={i} />)}
                </div>
            )}
        </motion.div>
    );
}
