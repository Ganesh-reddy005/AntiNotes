"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { roadmapApi, RoadmapDetail, Topic } from "@/lib/api";
import { DashboardNav } from "@/app/(protected)/dashboard/components/DashboardNav";
import { useAuth } from "@/lib/auth";
import { ArrowLeft, BookOpen, CheckCircle, ChevronRight, Lock, Play, Zap, Lightbulb } from "lucide-react";

export default function RoadmapDetailPage() {
    const { slug } = useParams();
    const { logout } = useAuth();
    const [roadmap, setRoadmap] = useState<RoadmapDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        roadmapApi.get(slug as string)
            .then(res => setRoadmap(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen bg-mistral-bg flex items-center justify-center">
            <p className="font-mono text-xs text-mistral-navy/40 uppercase tracking-widest animate-pulse">Building the path...</p>
        </div>
    );

    if (!roadmap) return <div>Roadmap not found</div>;

    return (
        <div className="min-h-screen bg-mistral-bg">
            <DashboardNav onLogout={logout} />

            <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
                <Link href="/roadmaps" className="flex items-center gap-2 font-mono text-xs text-mistral-navy/40 hover:text-mistral-orange mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to roadmaps
                </Link>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                    <h1 className="font-serif text-4xl md:text-5xl font-medium text-mistral-navy mb-4">
                        {roadmap.title}
                    </h1>
                    <p className="font-sans text-mistral-navy/50 text-lg">
                        {roadmap.description.replace("(Coming Soon)", "")}
                    </p>
                </motion.div>

                {roadmap.topic_details.length > 0 ? (
                    <div className="space-y-4">
                        {(() => {
                            let moduleCount = 0;
                            return roadmap.topic_details.map((topic, i) => {
                                const isRevision = topic.slug === "foundation-revision" || topic.slug === "architect-revision";
                                if (!isRevision) moduleCount++;
                                
                                return (
                                    <motion.div 
                                        key={topic.slug}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Link 
                                            href={`/roadmaps/topics/${topic.slug}`}
                                            className={`flex items-center gap-6 bg-white border p-6 transition-all group ${
                                                isRevision 
                                                ? "border-amber-500/30 hover:border-amber-500 hover:shadow-[4px_4px_0px_0px_#f59e0b]" 
                                                : "border-mistral-navy/10 hover:border-mistral-navy hover:shadow-[4px_4px_0px_0px_#0f172a]"
                                            }`}
                                        >
                                            <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center font-mono text-lg font-bold ${
                                                isRevision ? "bg-amber-500 text-white" : "bg-mistral-navy text-white"
                                            }`}>
                                                {isRevision ? <Zap className="w-6 h-6 fill-current" /> : moduleCount}
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className={`font-mono text-lg font-bold mb-1 transition-colors ${
                                                    isRevision ? "text-amber-600 group-hover:text-amber-500" : "text-mistral-navy group-hover:text-mistral-orange"
                                                }`}>
                                                    {topic.title}
                                                </h3>
                                                <p className="font-sans text-sm text-mistral-navy/60 line-clamp-1">
                                                    {topic.description}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="font-mono text-[10px] text-mistral-navy/40 uppercase tracking-widest">
                                                    {topic.problems.length} Problems
                                                </span>
                                                <ChevronRight className={`w-5 h-5 transition-colors ${
                                                    isRevision ? "text-amber-500/40 group-hover:text-amber-500" : "text-mistral-navy/20 group-hover:text-mistral-orange"
                                                }`} />
                                            </div>
                                        </Link>
                                        {i < roadmap.topic_details.length - 1 && (
                                            <div className={`ml-12 w-0.5 h-4 my-1 ${isRevision ? "bg-amber-500/20" : "bg-mistral-navy/10"}`} />
                                        )}
                                    </motion.div>
                                );
                            });
                        })()}
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 px-6 border-2 border-dashed border-mistral-navy/10 bg-mistral-navy/[0.02]"
                    >
                        <div className="w-16 h-16 bg-mistral-navy/5 flex items-center justify-center rounded-full mb-6">
                            <Lock className="w-8 h-8 text-mistral-navy/20" />
                        </div>
                        <h3 className="font-serif text-3xl text-mistral-navy mb-3 italic">Curriculum in Development</h3>
                        <p className="font-sans text-mistral-navy/40 text-center max-w-sm mb-8">
                            We're currently building out the deep-dive modules for this path. Check back soon for Big O, Data Structures, and more.
                        </p>
                        <div className="flex items-center gap-2 px-4 py-2 bg-mistral-navy text-white font-mono text-[10px] uppercase tracking-[0.2em]">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mistral-orange opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-mistral-orange"></span>
                            </span>
                            Coming Soon
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
