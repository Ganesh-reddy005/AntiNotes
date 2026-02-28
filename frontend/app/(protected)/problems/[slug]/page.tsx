"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { problemsApi, reviewApi, sessionApi, Problem, Review, userApi, Profile } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
    Terminal, Loader2, ChevronRight, MessageSquare,
    CheckCircle2, XCircle, AlertTriangle
} from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const LANG_MAP: Record<string, string> = {
    python: "python", cpp: "cpp", java: "java", javascript: "javascript",
};

const diffColor = (d: string) =>
    d === "Easy" ? "text-emerald-600 bg-emerald-50 border-emerald-100" :
        d === "Medium" ? "text-amber-600 bg-amber-50 border-amber-100" :
            "text-red-600 bg-red-50 border-red-100";

// ── Full-width Review Panel ───────────────────────────────────────────────────
function ReviewPanel({ review, onTutor }: { review: Review; onTutor: () => void }) {
    const score = Math.round(Number(review.score) || 0);
    const thinkingStyle = String(review.thinking_style || "—");
    const detailedFeedback = String(review.detailed_feedback || "");
    const strengths = Array.isArray(review.strengths) ? review.strengths.map((s: any) => String(s)).filter(Boolean) : [];
    const weaknesses = Array.isArray(review.weaknesses) ? review.weaknesses.map((w: any) => String(w)).filter(Boolean) : [];
    const conceptGaps = Array.isArray(review.concept_gaps) ? review.concept_gaps.map((c: any) => String(c)).filter(Boolean) : [];

    const scoreColor = score >= 80 ? "text-emerald-600 border-emerald-200 bg-emerald-50"
        : score >= 50 ? "text-amber-600 border-amber-200 bg-amber-50"
            : "text-red-500 border-red-200 bg-red-50";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="border-t border-mistral-navy/10 bg-white"
        >
            {/* Review header bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-mistral-navy/8 bg-mistral-bg">
                <div className="flex items-center gap-4">
                    {/* Score */}
                    <div className={`flex items-center gap-1.5 px-3 py-1 border font-serif text-2xl font-bold ${scoreColor}`}>
                        {score}<span className="font-mono text-xs font-normal opacity-60 ml-0.5">/100</span>
                    </div>
                    <div>
                        <p className="font-mono text-[10px] text-mistral-navy/40 uppercase tracking-wider">Thinking Style</p>
                        <p className="font-mono text-sm font-bold text-mistral-orange">{thinkingStyle}</p>
                    </div>
                </div>
                <button onClick={onTutor}
                    className="flex items-center gap-2 px-4 py-2 bg-mistral-navy text-white font-mono text-xs border border-mistral-navy shadow-[3px_3px_0px_0px_#f97316] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#f97316] active:shadow-none transition-all">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Ask AI Tutor
                    <ChevronRight className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Review body — 3 column grid, scrollable */}
            <div className="grid md:grid-cols-3 gap-0 divide-x divide-mistral-navy/8 max-h-96 overflow-y-auto">

                {/* Col 1: Feedback */}
                <div className="p-5">
                    <p className="font-mono text-xs text-mistral-navy/40 uppercase tracking-wider mb-3">Feedback</p>
                    <p className="font-sans text-sm text-mistral-navy/80 leading-relaxed whitespace-pre-wrap">{detailedFeedback}</p>
                </div>

                {/* Col 2: Strengths + Weaknesses */}
                <div className="p-5 space-y-4">
                    {strengths.length > 0 && (
                        <div>
                            <div className="flex items-center gap-1.5 mb-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span className="font-mono text-xs text-mistral-navy/50 uppercase tracking-wider">Strengths</span>
                            </div>
                            <ul className="space-y-1.5">
                                {strengths.map((s, i) => (
                                    <li key={i} className="font-sans text-sm text-mistral-navy/75 flex items-start gap-1.5">
                                        <span className="text-emerald-500 mt-0.5 flex-shrink-0">•</span>{s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {weaknesses.length > 0 && (
                        <div>
                            <div className="flex items-center gap-1.5 mb-2">
                                <XCircle className="w-4 h-4 text-mistral-orange" />
                                <span className="font-mono text-xs text-mistral-navy/50 uppercase tracking-wider">To Improve</span>
                            </div>
                            <ul className="space-y-1.5">
                                {weaknesses.map((w, i) => (
                                    <li key={i} className="font-sans text-sm text-mistral-navy/75 flex items-start gap-1.5">
                                        <span className="text-mistral-orange mt-0.5 flex-shrink-0">•</span>{w}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Col 3: Concept Gaps */}
                <div className="p-5">
                    {conceptGaps.length > 0 && (
                        <div>
                            <p className="font-mono text-xs text-mistral-navy/40 uppercase tracking-wider mb-3">Concept Gaps</p>
                            <div className="flex flex-wrap gap-2">
                                {conceptGaps.map((c, i) => (
                                    <span key={i} className="font-mono text-xs bg-red-50 text-red-700 border border-red-200 px-2.5 py-1">{c}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProblemSolvePage() {
    const { slug } = useParams<{ slug: string }>();
    const { user } = useAuth();
    const router = useRouter();

    const [problem, setProblem] = useState<Problem | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("python");
    const [submitting, setSubmitting] = useState(false);
    const [review, setReview] = useState<Review | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const [pRes, profRes] = await Promise.all([
                    problemsApi.get(slug),
                    userApi.profile().catch(() => null),
                ]);
                setProblem(pRes.data);
                setCode(pRes.data.starter_code || "");
                if (profRes) {
                    setProfile(profRes.data);
                    setLanguage(LANG_MAP[profRes.data.primary_language] || "python");
                }
            } catch {
                setError("Problem not found");
            } finally {
                setLoading(false);
            }
        })();
    }, [slug]);

    const handleSubmit = async () => {
        if (!problem || submitting) return;
        setSubmitting(true);
        setReview(null);
        setError("");
        try {
            const res = await reviewApi.submit({ problem_slug: slug, code, language });
            setReview(res.data);
        } catch (e: any) {
            const detail = e.response?.data?.detail;
            let msg = "Review failed. Check your API key.";
            if (typeof detail === "string") msg = detail;
            else if (Array.isArray(detail)) msg = detail.map((err: any) => err.msg || JSON.stringify(err)).join(" · ");
            else if (detail) msg = JSON.stringify(detail);
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const openTutor = async () => {
        if (!problem) return;
        try {
            const res = await sessionApi.create(problem.slug);
            router.push(`/tutor/${res.data.id}`);
        } catch {
            router.push(`/tutor/new?problem=${problem.slug}`);
        }
    };

    if (loading) return (
        <div className="h-screen bg-mistral-bg flex items-center justify-center">
            <div className="grid grid-cols-2 gap-1">
                {["bg-mistral-navy", "bg-mistral-orange", "bg-mistral-sand", "bg-mistral-yellow"].map((c, i) => (
                    <div key={i} className={`w-2 h-2 ${c} animate-pulse`} style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
            </div>
        </div>
    );

    if (error && !problem) return (
        <div className="h-screen bg-mistral-bg flex items-center justify-center">
            <div className="text-center">
                <p className="font-mono text-sm text-mistral-navy/50">{error}</p>
                <Link href="/problems" className="mt-4 inline-block font-mono text-xs text-mistral-orange hover:underline">← Back to problems</Link>
            </div>
        </div>
    );

    return (
        <div className="h-screen bg-mistral-bg flex flex-col overflow-hidden">

            {/* ── Top bar ── */}
            <div className="flex-shrink-0 bg-white border-b border-mistral-navy/10 px-4 py-2 flex items-center gap-4 z-10">
                <Link href="/problems" className="font-mono text-xs text-mistral-navy/40 hover:text-mistral-navy transition-colors">
                    ← Problems
                </Link>
                <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-mistral-navy">{problem?.title}</span>
                    {problem && <span className={`font-mono text-[10px] px-1.5 py-0.5 border ${diffColor(problem.difficulty)}`}>{problem.difficulty}</span>}
                    {problem?.tags?.slice(0, 2).map(t => (
                        <span key={t} className="font-mono text-[10px] bg-mistral-navy/5 text-mistral-navy/40 px-1.5 py-0.5 hidden sm:inline">{t}</span>
                    ))}
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <select value={language} onChange={e => setLanguage(e.target.value)}
                        className="font-mono text-xs bg-white border border-mistral-navy/20 text-mistral-navy px-2 py-1 focus:outline-none focus:border-mistral-navy">
                        {Object.keys(LANG_MAP).map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <button onClick={openTutor}
                        className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs border border-mistral-navy/20 text-mistral-navy/60 hover:border-mistral-navy hover:text-mistral-navy transition-all">
                        <MessageSquare className="w-3.5 h-3.5" /> Ask AI
                    </button>
                    <button onClick={handleSubmit} disabled={submitting}
                        className="flex items-center gap-2 px-4 py-1.5 bg-mistral-navy text-white font-mono text-xs border border-mistral-navy shadow-[2px_2px_0px_0px_#f97316] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#f97316] active:shadow-none transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                        {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Terminal className="w-3 h-3 text-mistral-yellow" />}
                        {submitting ? "Reviewing..." : "Submit"}
                    </button>
                </div>
            </div>

            {/* ── Main area: problem left | editor right (fills available height) ── */}
            <div className="flex-1 flex overflow-hidden min-h-0">

                {/* Problem description */}
                <div className="w-[340px] flex-shrink-0 border-r border-mistral-navy/10 overflow-y-auto bg-white">
                    <div className="p-5">
                        <h2 className="font-serif text-base font-medium text-mistral-navy mb-3">Problem</h2>
                        <div className="font-sans text-sm text-mistral-navy/70 leading-relaxed whitespace-pre-wrap">
                            {problem?.description}
                        </div>
                    </div>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1 overflow-hidden">
                    <MonacoEditor
                        height="100%"
                        language={language}
                        value={code}
                        onChange={(val) => setCode(val || "")}
                        theme="vs-light"
                        options={{
                            fontSize: 14,
                            fontFamily: "JetBrains Mono, monospace",
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            padding: { top: 16, bottom: 16 },
                            lineNumbers: "on",
                            renderLineHighlight: "gutter",
                            wordWrap: "on",
                            automaticLayout: true,
                            tabSize: 4,
                        }}
                    />
                </div>
            </div>

            {/* ── Bottom: full-width review / loading / error ── */}
            <AnimatePresence mode="wait">
                {submitting && (
                    <motion.div key="loading"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="flex-shrink-0 border-t border-mistral-navy/10 bg-mistral-bg px-6 py-4 flex items-center gap-4">
                        <div className="grid grid-cols-2 gap-1">
                            {["bg-mistral-navy", "bg-mistral-orange", "bg-mistral-sand", "bg-mistral-yellow"].map((c, i) => (
                                <div key={i} className={`w-1.5 h-1.5 ${c} animate-pulse`} style={{ animationDelay: `${i * 0.15}s` }} />
                            ))}
                        </div>
                        <p className="font-mono text-xs text-mistral-navy/50">Analyzing your code...</p>
                    </motion.div>
                )}

                {error && !submitting && (
                    <motion.div key="err"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="flex-shrink-0 border-t border-red-200 bg-red-50 px-6 py-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <p className="font-mono text-xs text-red-600">{error}</p>
                    </motion.div>
                )}

                {review && !submitting && (
                    <ReviewPanel key="review" review={review} onTutor={openTutor} />
                )}
            </AnimatePresence>
        </div>
    );
}
