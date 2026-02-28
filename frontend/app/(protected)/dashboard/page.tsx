"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import {
    userApi, revisionApi,
    Profile, Problem, RevisionTopic, SubmissionHistory, LearningMemory
} from "@/lib/api";
import {
    Brain, Zap, Target, ChevronRight, ChevronDown, Clock, BarChart2,
    LogOut, BookOpen, Code2, RefreshCw, Flame, CheckCircle2, XCircle,
    History, TrendingUp, TrendingDown, Minus, Sparkles, Lock, User as UserIcon
} from "lucide-react";

// ── Navbar ─────────────────────────────────────────────────────────────────────
const AppNav = ({ onLogout }: { onLogout: () => void }) => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-mistral-bg/80 backdrop-blur-md border-b border-mistral-navy/10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
                <div className="grid grid-cols-2 gap-0.5">
                    <div className="w-1.5 h-1.5 bg-mistral-navy" />
                    <div className="w-1.5 h-1.5 bg-mistral-orange" />
                    <div className="w-1.5 h-1.5 bg-mistral-sand" />
                    <div className="w-1.5 h-1.5 bg-mistral-yellow" />
                </div>
                <span className="font-serif text-lg font-bold text-mistral-navy">
                    AntiNotes<span className="text-mistral-orange">.</span>
                </span>
            </Link>
            <div className="flex items-center gap-1">
                {[
                    { label: "Problems", href: "/problems", icon: Code2 },
                    { label: "Revision", href: "/revision", icon: RefreshCw },
                    { label: "Profile", href: "/profile", icon: UserIcon },
                ].map(({ label, href, icon: Icon }) => (
                    <Link key={href} href={href} className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs text-mistral-navy/60 hover:text-mistral-navy hover:bg-mistral-navy/5 transition-all">
                        <Icon className="w-3.5 h-3.5" /> {label}
                    </Link>
                ))}
                <button onClick={onLogout} className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs text-mistral-navy/40 hover:text-red-500 transition-all ml-2">
                    <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
            </div>
        </div>
    </nav>
);

// ── Stat Card ──────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, accent, sub }: {
    icon: any; label: string; value: string | number; accent?: boolean; sub?: string;
}) => (
    <div className={`bg-white border p-4 flex items-center gap-3 ${accent ? "border-mistral-orange shadow-[4px_4px_0px_0px_#f97316]" : "border-mistral-navy/10"}`}>
        <div className={`w-9 h-9 flex items-center justify-center flex-shrink-0 ${accent ? "bg-mistral-orange" : "bg-mistral-navy/5"}`}>
            <Icon className={`w-4 h-4 ${accent ? "text-white" : "text-mistral-navy"}`} />
        </div>
        <div>
            <p className="font-mono text-xs text-mistral-navy/50 uppercase tracking-wide">{label}</p>
            <p className="font-serif text-2xl font-bold text-mistral-navy leading-none mt-0.5">{value}</p>
            {sub && <p className="font-mono text-[10px] text-mistral-navy/30 mt-0.5">{sub}</p>}
        </div>
    </div>
);

// ── Helpers ────────────────────────────────────────────────────────────────────
const diffColor = (d: string) =>
    d === "Easy" ? "text-emerald-600 bg-emerald-50 border-emerald-200" :
        d === "Medium" ? "text-amber-600 bg-amber-50 border-amber-200" :
            "text-red-600 bg-red-50 border-red-200";

const scoreColor = (s: number) =>
    s >= 80 ? "text-emerald-600" : s >= 50 ? "text-amber-600" : "text-red-500";

const trendIcon = (t: string) =>
    t === "improving" ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> :
        t === "regressing" ? <TrendingDown className="w-3.5 h-3.5 text-red-500" /> :
            <Minus className="w-3.5 h-3.5 text-amber-500" />;

const trendColor = (t: string) =>
    t === "improving" ? "text-emerald-600 bg-emerald-50 border-emerald-200" :
        t === "regressing" ? "text-red-600 bg-red-50 border-red-200" :
            "text-amber-600 bg-amber-50 border-amber-200";

// ── Expandable history row ─────────────────────────────────────────────────────
function HistoryRow({ h, i }: { h: SubmissionHistory; i: number }) {
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

// ── Learning Memory Card ───────────────────────────────────────────────────────
function LearningMemoryCard({ memory, totalReviews }: { memory: LearningMemory | null; totalReviews: number }) {
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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-mistral-navy/10 p-5">
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
        </motion.div>
    );
}

// ── Next Milestone Card ────────────────────────────────────────────────────────
function MilestoneCard({ solved }: { solved: number }) {
    const milestones = [5, 10, 25, 50, 100];
    const next = milestones.find(m => m > solved) ?? milestones[milestones.length - 1];
    const prev = milestones[milestones.indexOf(next) - 1] ?? 0;
    const pct = Math.min(((solved - prev) / (next - prev)) * 100, 100);

    return (
        <div className="bg-white border border-mistral-navy/10 p-5">
            <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-mistral-navy" />
                <span className="font-mono text-xs text-mistral-navy/60 uppercase tracking-wider">Next Milestone</span>
            </div>
            <div className="flex justify-between items-baseline mb-2">
                <span className="font-serif text-2xl font-bold text-mistral-navy">{solved}</span>
                <span className="font-mono text-xs text-mistral-navy/40">/ {next} problems</span>
            </div>
            <div className="h-2 bg-mistral-navy/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-mistral-navy to-mistral-orange"
                />
            </div>
            <p className="font-mono text-[10px] text-mistral-navy/40 mt-2">
                {next - solved} more to reach the <span className="text-mistral-orange font-bold">{next}</span> problems milestone
            </p>
        </div>
    );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function DashboardPage() {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [dueTopics, setDueTopics] = useState<RevisionTopic[]>([]);
    const [recommended, setRecommended] = useState<Problem[]>([]);
    const [history, setHistory] = useState<SubmissionHistory[]>([]);
    const [memory, setMemory] = useState<LearningMemory | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            // Each call is independently fault-tolerant — profile 404 must NOT block history
            const [profileRes, dueRes, recRes, histRes, memRes] = await Promise.all([
                userApi.profile().catch(() => ({ data: null })),
                revisionApi.due().catch(() => ({ data: [] as RevisionTopic[] })),
                userApi.recommended().catch(() => ({ data: [] as Problem[] })),
                userApi.history().catch(() => ({ data: [] as SubmissionHistory[] })),
                userApi.memory().catch(() => ({ data: null })),
            ]);
            if (profileRes.data) setProfile(profileRes.data as Profile);
            setDueTopics((dueRes.data as RevisionTopic[]).slice(0, 3));
            setRecommended((recRes.data as Problem[]).slice(0, 4));
            setHistory(histRes.data as SubmissionHistory[]);
            setMemory(memRes.data as LearningMemory | null);
        } catch {
            /* unexpected error */
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const onVisible = () => { if (document.visibilityState === "visible") fetchData(); };
        document.addEventListener("visibilitychange", onVisible);
        return () => document.removeEventListener("visibilitychange", onVisible);
    }, []);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

    const goalLabels: Record<string, string> = {
        get_job: "Landing a job",
        faang: "Cracking FAANG",
        startup: "Building startups",
        learn_for_fun: "Deep learning",
    };

    // Live stats derived from history (more accurate than stale profile counters)
    const liveSolved = new Set(history.filter(h => h.score > 60).map(h => h.problem_slug)).size;
    const liveReviews = history.length;
    const avgScore = history.length > 0
        ? Math.round(history.reduce((s, h) => s + h.score, 0) / history.length)
        : 0;

    if (loading) return (
        <div className="min-h-screen bg-mistral-bg flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="grid grid-cols-2 gap-1">
                    {["bg-mistral-navy", "bg-mistral-orange", "bg-mistral-sand", "bg-mistral-yellow"].map((c, i) => (
                        <div key={i} className={`w-2 h-2 ${c} animate-pulse`} style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                </div>
                <p className="font-mono text-xs text-mistral-navy/40 uppercase tracking-widest">Loading your workspace...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-mistral-bg">
            <AppNav onLogout={logout} />

            <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 space-y-10">

                {/* Greeting */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="font-serif text-4xl md:text-5xl font-medium text-mistral-navy mb-1">
                        {greeting}, <span className="italic text-mistral-orange">{user?.full_name?.split(" ")[0]}.</span>
                    </h1>
                    <p className="font-sans text-mistral-navy/50 text-sm">
                        {profile
                            ? `Working towards ${goalLabels[profile.goal || "learn_for_fun"] || "mastery"}.`
                            : "Set up your profile to personalize your experience."}
                    </p>
                </motion.div>

                {/* Stats Row — live computed */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <StatCard icon={Flame} label="Day Streak" value={`${profile?.current_streak ?? 0}d`} accent />
                    <StatCard icon={Code2} label="Solved" value={liveSolved} sub="distinct problems" />
                    <StatCard icon={Target} label="Reviews" value={liveReviews} />
                    <StatCard icon={BarChart2} label="Avg Score" value={avgScore > 0 ? `${avgScore}` : "—"} sub="across all reviews" />
                </motion.div>

                {/* Main grid */}
                <div className="grid lg:grid-cols-3 gap-6">

                    {/* Left column */}
                    <div className="lg:col-span-1 flex flex-col gap-4">

                        {/* Learning Intelligence card (replaces Cognitive Profile) */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                            <LearningMemoryCard memory={memory} totalReviews={liveReviews} />
                        </motion.div>

                        {/* Next Milestone */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <MilestoneCard solved={liveSolved} />
                        </motion.div>

                        {/* Revision Due */}
                        {dueTopics.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                                className="bg-white border border-mistral-navy/10 p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <Clock className="w-4 h-4 text-mistral-orange" />
                                    <span className="font-mono text-xs text-mistral-navy/60 uppercase tracking-wider">Due Today</span>
                                    <span className="ml-auto font-mono text-xs bg-mistral-orange text-white px-1.5 py-0.5">{dueTopics.length}</span>
                                </div>
                                <div className="space-y-2">
                                    {dueTopics.map(t => (
                                        <div key={t.topic} className="flex items-center justify-between text-xs">
                                            <span className="font-mono text-mistral-navy">{t.topic}</span>
                                            <span className="text-mistral-navy/40">{t.last_seen_days}d ago</span>
                                        </div>
                                    ))}
                                </div>
                                <Link href="/revision" className="flex items-center gap-1 mt-4 font-mono text-xs text-mistral-orange hover:underline">
                                    Start revision <ChevronRight className="w-3 h-3" />
                                </Link>
                            </motion.div>
                        )}
                    </div>

                    {/* Right — Recommended Problems */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-mistral-navy" />
                                <span className="font-mono text-xs text-mistral-navy/60 uppercase tracking-wider">
                                    {profile ? `Recommended for ${profile.skill_level}s` : "Recommended Problems"}
                                </span>
                            </div>
                            <Link href="/problems" className="font-mono text-xs text-mistral-orange hover:underline">Browse all →</Link>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                            {recommended.map((p, i) => (
                                <motion.div key={p.slug} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
                                    <Link href={`/problems/${p.slug}`}
                                        className="block bg-white border border-mistral-navy/10 p-4 hover:border-mistral-navy hover:shadow-[4px_4px_0px_0px_#0f172a] transition-all group">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className="font-mono text-sm font-bold text-mistral-navy group-hover:text-mistral-orange transition-colors leading-tight">{p.title}</h3>
                                            <span className={`font-mono text-[10px] px-1.5 py-0.5 border flex-shrink-0 ${diffColor(p.difficulty)}`}>{p.difficulty}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {p.tags?.slice(0, 2).map(t => (
                                                <span key={t} className="font-mono text-[10px] bg-mistral-navy/5 text-mistral-navy/50 px-1.5 py-0.5">{t}</span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-1 font-mono text-xs text-mistral-navy/40 group-hover:text-mistral-orange transition-colors">
                                            <Zap className="w-3 h-3" /> Solve <ChevronRight className="w-3 h-3 ml-auto" />
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                            {recommended.length === 0 && (
                                <div className="col-span-2 bg-white border border-dashed border-mistral-navy/20 p-8 text-center">
                                    <Code2 className="w-8 h-8 text-mistral-navy/20 mx-auto mb-2" />
                                    <p className="font-mono text-xs text-mistral-navy/40 mb-1">No unsolved problems left at your level 🎉</p>
                                    <Link href="/problems" className="font-mono text-xs text-mistral-orange hover:underline">Browse all problems →</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Submission History */}
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

            </div>
        </div>
    );
}
