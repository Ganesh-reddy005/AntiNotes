"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import {
    userApi, revisionApi, roadmapApi,
    Profile, Problem, RevisionTopic, SubmissionHistory, LearningMemory, Roadmap
} from "@/lib/api";
import {
    Clock, BarChart2, BookOpen, Code2, Flame, Target, Zap, ChevronRight, Map
} from "lucide-react";

// Local components
import { DashboardNav } from "./components/DashboardNav";
import { StatCard } from "./components/StatCard";
import { HistoryList } from "./components/HistoryList";
import { LearningIntelligence } from "./components/LearningIntelligence";
import { MilestoneCard } from "./components/MilestoneCard";

const diffColor = (d: string) =>
    d === "Easy" ? "text-emerald-600 bg-emerald-50 border-emerald-200" :
        d === "Medium" ? "text-amber-600 bg-amber-50 border-amber-200" :
            "text-red-600 bg-red-50 border-red-200";

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [dueTopics, setDueTopics] = useState<RevisionTopic[]>([]);
    const [recommended, setRecommended] = useState<Problem[]>([]);
    const [history, setHistory] = useState<SubmissionHistory[]>([]);
    const [memory, setMemory] = useState<LearningMemory | null>(null);
    const [featuredRoadmap, setFeaturedRoadmap] = useState<Roadmap | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [profileRes, dueRes, recRes, histRes, memRes, roadmapRes] = await Promise.all([
                userApi.profile().catch(() => ({ data: null })),
                revisionApi.due().catch(() => ({ data: [] as RevisionTopic[] })),
                userApi.recommended().catch(() => ({ data: [] as Problem[] })),
                userApi.history().catch(() => ({ data: [] as SubmissionHistory[] })),
                userApi.memory().catch(() => ({ data: null })),
                roadmapApi.list().catch(() => ({ data: [] as Roadmap[] })),
            ]);
            if (profileRes.data) setProfile(profileRes.data as Profile);
            setDueTopics((dueRes.data as RevisionTopic[]).slice(0, 3));
            setRecommended((recRes.data as Problem[]).slice(0, 4));
            setHistory(histRes.data as SubmissionHistory[]);
            setMemory(memRes.data as LearningMemory | null);
            
            const roadmaps = roadmapRes.data as Roadmap[];
            setFeaturedRoadmap(roadmaps.find(r => r.is_featured) || roadmaps[0] || null);
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
            <DashboardNav onLogout={logout} />

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

                {/* Featured Roadmap Banner */}
                {featuredRoadmap && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                        <Link href="/roadmaps" 
                            className="flex flex-col md:flex-row items-center justify-between gap-6 bg-mistral-navy p-8 border border-mistral-navy hover:shadow-[8px_8px_0px_0px_#f97316] transition-all group">
                            <div className="space-y-2 text-left w-full">
                                <div className="flex items-center gap-2">
                                    <Map className="w-4 h-4 text-mistral-orange" />
                                    <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest">Recommended Path</span>
                                </div>
                                <h2 className="font-serif text-2xl md:text-3xl text-white group-hover:text-mistral-orange transition-colors">
                                    {featuredRoadmap.title}
                                </h2>
                                <p className="font-sans text-white/60 text-sm max-w-xl">
                                    {featuredRoadmap.description}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 bg-mistral-orange text-white px-6 py-3 font-mono text-sm font-bold group-hover:bg-white group-hover:text-mistral-navy transition-all flex-shrink-0">
                                Start Learning <ChevronRight className="w-4 h-4" />
                            </div>
                        </Link>
                    </motion.div>
                )}

                {/* Main grid */}
                <div className="grid lg:grid-cols-3 gap-6">

                    {/* Left column */}
                    <div className="lg:col-span-1 flex flex-col gap-4">

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                            <LearningIntelligence memory={memory} totalReviews={liveReviews} />
                        </motion.div>

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

                <HistoryList history={history} />

            </div>
        </div>
    );
}
