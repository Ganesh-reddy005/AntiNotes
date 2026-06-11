"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { problemsApi, Problem } from "@/lib/api";
import { Search, Code2, ChevronRight } from "lucide-react";
import { LogOut, RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/auth";

const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];

const diffColor = (d: string) =>
    d === "Easy" ? "text-emerald-600 bg-emerald-50 border-emerald-200" :
        d === "Medium" ? "text-amber-600 bg-amber-50 border-amber-200" :
            "text-red-600 bg-red-50 border-red-200";

export default function ProblemsPage() {
    const { logout } = useAuth();
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState("All");

    useEffect(() => {
        problemsApi.list().then(r => {
            setProblems(r.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const filtered = problems.filter(p => {
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
        const matchDiff = difficulty === "All" || p.difficulty === difficulty;
        return matchSearch && matchDiff;
    });

    return (
        <div className="min-h-screen bg-mistral-bg">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-mistral-bg/80 backdrop-blur-md border-b border-mistral-navy/10">
                <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="grid grid-cols-2 gap-0.5">
                            <div className="w-1.5 h-1.5 bg-mistral-navy" /><div className="w-1.5 h-1.5 bg-mistral-orange" />
                            <div className="w-1.5 h-1.5 bg-mistral-sand" /><div className="w-1.5 h-1.5 bg-mistral-yellow" />
                        </div>
                        <span className="font-serif text-lg font-bold text-mistral-navy">AntiNotes<span className="text-mistral-orange">.</span></span>
                    </Link>
                    <div className="flex items-center gap-1">
                        <Link href="/revision" className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs text-mistral-navy/60 hover:text-mistral-navy hover:bg-mistral-navy/5 transition-all">
                            <RefreshCw className="w-3.5 h-3.5" /> Revision
                        </Link>
                        <button onClick={logout} className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs text-mistral-navy/40 hover:text-red-500 transition-all ml-2">
                            <LogOut className="w-3.5 h-3.5" /> Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="font-serif text-4xl font-medium text-mistral-navy mb-1">Problem Library</h1>
                    <p className="font-sans text-mistral-navy/50 text-sm">
                        {problems.length} problems loaded — each one a chance to reveal how you think.
                    </p>
                </motion.div>

                {/* Filters */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="flex flex-col sm:flex-row gap-3 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mistral-navy/30" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search problems or tags..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-mistral-navy/20 text-mistral-navy placeholder-mistral-navy/30 font-mono text-sm focus:outline-none focus:border-mistral-navy transition-all"
                        />
                    </div>
                    <div className="flex gap-1">
                        {DIFFICULTIES.map(d => (
                            <button
                                key={d}
                                onClick={() => setDifficulty(d)}
                                className={`px-3 py-2 font-mono text-xs border transition-all ${difficulty === d
                                    ? "bg-mistral-navy text-white border-mistral-navy shadow-[2px_2px_0px_0px_#f97316]"
                                    : "bg-white text-mistral-navy/60 border-mistral-navy/20 hover:border-mistral-navy"
                                    }`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Problem Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="grid grid-cols-2 gap-1">
                            {["bg-mistral-navy", "bg-mistral-orange", "bg-mistral-sand", "bg-mistral-yellow"].map((c, i) => (
                                <div key={i} className={`w-2 h-2 ${c} animate-pulse`} style={{ animationDelay: `${i * 0.15}s` }} />
                            ))}
                        </div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <Code2 className="w-12 h-12 text-mistral-navy/10 mx-auto mb-3" />
                        <p className="font-mono text-sm text-mistral-navy/40">No problems match your filter.</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filtered.map((p, i) => (
                            <motion.div key={p.slug}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                            >
                                <Link href={`/problems/${p.slug}`}
                                    className="block bg-white border border-mistral-navy/10 p-4 hover:border-mistral-navy hover:shadow-[4px_4px_0px_0px_#0f172a] transition-all group h-full">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="font-mono text-sm font-bold text-mistral-navy group-hover:text-mistral-orange transition-colors leading-tight">{p.title}</h3>
                                        <span className={`font-mono text-[10px] px-1.5 py-0.5 border flex-shrink-0 ${diffColor(p.difficulty)}`}>{p.difficulty}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {p.tags?.slice(0, 3).map(t => (
                                            <span key={t} className="font-mono text-[10px] bg-mistral-navy/5 text-mistral-navy/50 px-1.5 py-0.5">{t}</span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-1 font-mono text-xs text-mistral-navy/40 group-hover:text-mistral-orange transition-colors mt-auto">
                                        Solve <ChevronRight className="w-3 h-3 ml-auto" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
