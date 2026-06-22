"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { roadmapApi, problemsApi, userApi, Topic, Problem, InteractiveWidget } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { ArrowLeft, ArrowRight, BookOpen, ChevronLeft, ChevronRight, Code2, GraduationCap, Home, Zap } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { CodeTabs } from "@/components/interactive/CodeTabs";
import { MCQQuiz } from "@/components/interactive/MCQQuiz";
import { LiveCodeEditor } from "@/components/interactive/LiveCodeEditor";

// Static content imports
import IntroToIOTopic from "../content/intro-io";
import VariablesTopic from "../content/variables";
import OperatorsTopic from "../content/operators";
import ControlFlowTopic from "../content/control-flow";
import LoopsTopic from "../content/loops";
import FoundationRevisionTopic from "../content/foundation-revision";
import CollectionsTopic from "../content/collections";
import FunctionsTopic from "../content/functions";
import ClassesObjectsTopic from "../content/classes-objects";
import ArchitectRevisionTopic from "../content/architect-revision";
import ComplexityAnalysisTopic from "../content/complexity-analysis";
import ArraysListsTopic from "../content/arrays-lists";
import StringsTwoPointersTopic from "../content/strings-two-pointers";
import LinearStructuresRevisionTopic from "../content/linear-structures-revision";
import LinkedListsTopic from "../content/linked-lists";
import StacksQueuesTopic from "../content/stacks-queues";
import RecursionBacktrackingTopic from "../content/recursion-backtracking";
import DynamicStructuresRevisionTopic from "../content/dynamic-structures-revision";
import TreesBinaryTreesTopic from "../content/trees-binary-trees";
import DSAFinalRevisionTopic from "../content/dsa-final-revision";
import FoundationsIntroTopic from "../content/foundations-intro";
import DSAIntroTopic from "../content/dsa-intro";
import WarmupChallengesTopic from "../content/warmup-challenges";

const TOPIC_CONTENT_MAP: Record<string, React.FC<{ widgets: InteractiveWidget[], userLanguage: string }>> = {
    "intro-io": IntroToIOTopic as any,
    "variables": VariablesTopic as any,
    "operators": OperatorsTopic as any,
    "control-flow": ControlFlowTopic as any,
    "loops": LoopsTopic as any,
    "foundation-revision": FoundationRevisionTopic as any,
    "collections": CollectionsTopic as any,
    "functions": FunctionsTopic as any,
    "classes-objects": ClassesObjectsTopic as any,
    "architect-revision": ArchitectRevisionTopic as any,
    "complexity-analysis": ComplexityAnalysisTopic as any,
    "arrays-lists": ArraysListsTopic as any,
    "strings-two-pointers": StringsTwoPointersTopic as any,
    "linear-structures-revision": LinearStructuresRevisionTopic as any,
    "linked-lists": LinkedListsTopic as any,
    "stacks-queues": StacksQueuesTopic as any,
    "recursion-backtracking": RecursionBacktrackingTopic as any,
    "dynamic-structures-revision": DynamicStructuresRevisionTopic as any,
    "trees-binary-trees": TreesBinaryTreesTopic as any,
    "dsa-final-revision": DSAFinalRevisionTopic as any,
    "foundations-intro": FoundationsIntroTopic as any,
    "dsa-intro": DSAIntroTopic as any,
    "warmup-max-three": WarmupChallengesTopic as any,
    "warmup-count-vowels": WarmupChallengesTopic as any,
    "warmup-fizzbuzz": WarmupChallengesTopic as any,
    "warmup-fibonacci": WarmupChallengesTopic as any,
    "warmup-reverse-array": WarmupChallengesTopic as any,
    "warmup-sum-digits": WarmupChallengesTopic as any,
    "warmup-palindrome": WarmupChallengesTopic as any,
    "warmup-duplicate-number": WarmupChallengesTopic as any,
    "warmup-missing-number": WarmupChallengesTopic as any,
    "warmup-merge-arrays": WarmupChallengesTopic as any,
};

const diffColor = (d: string) =>
    d === "Easy" ? "text-emerald-600 bg-emerald-50 border-emerald-200" :
        d === "Medium" ? "text-amber-600 bg-amber-50 border-amber-200" :
            "text-red-600 bg-red-50 border-red-200";

export default function TopicDetailPage() {
    const { slug } = useParams();
    const { logout } = useAuth();
    const [topic, setTopic] = useState<Topic | null>(null);
    const [widgets, setWidgets] = useState<InteractiveWidget[]>([]);
    const [problems, setProblems] = useState<Problem[]>([]);
    const [roadmapTopics, setRoadmapTopics] = useState<Topic[]>([]);
    const [userLanguage, setUserLanguage] = useState<string>("python");
    const [roadmapSlug, setRoadmapSlug] = useState<string>("programming-foundations");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        const params = new URLSearchParams(window.location.search);
        const rSlug = params.get("roadmap") || "programming-foundations";
        setRoadmapSlug(rSlug);

        const fetchData = async () => {
            try {
                // Fetch the topic and widgets first
                const [topicRes, widgetsRes, profileRes, roadmapRes] = await Promise.all([
                    roadmapApi.getTopic(slug as string),
                    roadmapApi.getWidgets(slug as string).catch(() => ({ data: [] })),
                    userApi.profile().catch(() => ({ data: { primary_language: "python" } })),
                    roadmapApi.get(rSlug).catch(() => null)
                ]);
                
                setTopic(topicRes.data);
                setWidgets(widgetsRes.data);
                setUserLanguage(profileRes.data.primary_language || "python");

                // Fetch roadmap topics for the sidebar
                if (roadmapRes && roadmapRes.data.topics) {
                    const tPromises = roadmapRes.data.topics.map((tSlug: string) => 
                        roadmapApi.getTopic(tSlug).then(res => res.data).catch(() => null)
                    );
                    const tDetails = await Promise.all(tPromises);
                    setRoadmapTopics(tDetails.filter(t => t !== null) as Topic[]);
                }
                
                // Fetch problem details
                const problemPromises = (topicRes.data.problems || []).map(pSlug => 
                    problemsApi.get(pSlug).then(res => res.data).catch(() => null)
                );
                const problemDetails = await Promise.all(problemPromises);
                setProblems(problemDetails.filter(p => p !== null) as Problem[]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    const currentTopicIndex = roadmapTopics.findIndex(t => t.slug === slug);
    const nextTopic = currentTopicIndex !== -1 && currentTopicIndex < roadmapTopics.length - 1 
        ? roadmapTopics[currentTopicIndex + 1] 
        : null;

    if (loading) return (
        <div className="min-h-screen bg-mistral-bg flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-mistral-orange border-t-transparent rounded-full animate-spin" />
                <p className="font-mono text-xs text-mistral-navy/40 uppercase tracking-widest">Opening Tutorial...</p>
            </div>
        </div>
    );

    if (!topic) return <div>Topic not found</div>;

    return (
        <div className="min-h-screen bg-mistral-bg flex flex-col">
            {/* Slim Immersive Header */}
            <header className="h-14 bg-white border-b border-mistral-navy/10 flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href={`/roadmaps/${roadmapSlug}`} className="p-2 hover:bg-mistral-bg rounded-full transition-colors text-mistral-navy/40 hover:text-mistral-navy">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div className="h-4 w-px bg-mistral-navy/10" />
                    <div>
                        {(topic.slug.includes("revision") || topic.slug.includes("milestone") || topic.slug.endsWith("-intro")) ? (
                            <span className="font-mono text-[10px] uppercase tracking-widest text-amber-500 block leading-none mb-1 flex items-center gap-1 font-bold">
                                <Zap className="w-2.5 h-2.5 fill-current" /> Special Milestone
                            </span>
                        ) : (
                            <span className="font-mono text-[10px] uppercase tracking-widest text-mistral-navy/40 block leading-none mb-1">Module {topic.order || 1}</span>
                        )}
                        <h2 className="font-sans font-bold text-sm text-mistral-navy leading-none">{topic.title}</h2>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-mistral-navy/5 rounded-full border border-mistral-navy/10 group relative cursor-pointer hover:bg-white transition-all">
                        <span className="font-mono text-[9px] uppercase tracking-tighter text-mistral-navy/40">Mode:</span>
                        <select 
                            value={userLanguage} 
                            onChange={(e) => setUserLanguage(e.target.value)}
                            className="bg-transparent font-mono text-[10px] font-bold text-mistral-navy uppercase tracking-widest outline-none cursor-pointer appearance-none pr-1"
                        >
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="cpp">C++</option>
                            <option value="javascript">JavaScript</option>
                        </select>
                        <Zap className="w-2.5 h-2.5 text-mistral-orange group-hover:scale-125 transition-transform" />
                    </div>
                    <Link href="/dashboard" className="p-2 hover:bg-mistral-bg rounded-full transition-colors text-mistral-navy/40 hover:text-mistral-navy">
                        <Home className="w-4 h-4" />
                    </Link>
                    <button onClick={logout} className="font-mono text-[10px] text-mistral-navy/40 hover:text-red-500 uppercase tracking-widest ml-2">Exit</button>
                </div>
            </header>

            <main className="flex-grow overflow-y-auto">
                <div className="max-w-[1600px] mx-auto px-6 py-12 grid lg:grid-cols-12 gap-8">
                    
                    {/* Left: Module Sidebar */}
                    <div className="hidden lg:block lg:col-span-2 space-y-6">
                        <div className="sticky top-24">
                            <h4 className="font-mono text-[10px] uppercase tracking-widest text-mistral-navy/40 mb-6">Curriculum</h4>
                            <div className="space-y-1 border-l border-mistral-navy/5">
                                {roadmapTopics.map((t) => {
                                    const isRevision = t.slug.includes("revision") || t.slug.includes("milestone") || t.slug.endsWith("-intro");
                                    const isActive = t.slug === slug;
                                    
                                    return (
                                        <Link 
                                            key={t.slug} 
                                            href={`/roadmaps/topics/${t.slug}?roadmap=${roadmapSlug}`}
                                            className={`block pl-4 py-2 text-[11px] font-mono uppercase tracking-wider transition-all border-l-2 -ml-px ${
                                                isActive 
                                                ? (isRevision ? "text-amber-500 border-amber-500 font-bold bg-amber-500/5" : "text-mistral-orange border-mistral-orange font-bold bg-mistral-orange/5")
                                                : (isRevision ? "text-amber-500/60 border-transparent hover:text-amber-500 hover:border-amber-500/20" : "text-mistral-navy/40 border-transparent hover:text-mistral-navy hover:border-mistral-navy/20")
                                            }`}
                                        >
                                            {isRevision && <Zap className="w-2.5 h-2.5 inline-block mr-1.5 -mt-0.5 fill-current" />}
                                            {t.title}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Middle: Teaching Content */}
                    <div className="lg:col-span-7 space-y-8 text-left border-x border-mistral-navy/5 px-8">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="flex items-center gap-2 mb-6">
                                <GraduationCap className="w-5 h-5 text-mistral-orange" />
                                <span className="font-mono text-xs text-mistral-navy/60 uppercase tracking-widest">Tutorial</span>
                            </div>
                            
                            {/* Render static hybrid content if exists, otherwise fallback to markdown */}
                            {topic.slug in TOPIC_CONTENT_MAP ? (
                                <div className="font-sans text-mistral-navy/80 leading-relaxed">
                                    {React.createElement(TOPIC_CONTENT_MAP[topic.slug], { widgets, userLanguage })}
                                </div>
                            ) : (
                                <div className="prose prose-mistral max-w-none prose-headings:font-serif prose-headings:font-medium prose-p:font-sans prose-p:text-mistral-navy/80 prose-p:leading-relaxed prose-strong:text-mistral-navy prose-code:text-mistral-orange prose-code:bg-mistral-orange/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none text-left">
                                    <ReactMarkdown 
                                        rehypePlugins={[rehypeRaw]}
                                        components={{
                                            codetabs: CodeTabs,
                                            mcqquiz: MCQQuiz,
                                            livecodeeditor: LiveCodeEditor
                                        } as any}
                                    >
                                        {topic.content || "Content coming soon..."}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Right: Problems & Info */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="sticky top-24">
                            <div className="bg-white border border-mistral-navy/10 p-6 shadow-sm mb-6">
                                <h4 className="font-mono text-[10px] uppercase tracking-widest text-mistral-navy/40 mb-4 flex items-center gap-2">
                                    <Zap className="w-3 h-3 text-mistral-orange" /> Difficulty Suggestion
                                </h4>
                                <div className="flex items-center justify-between">
                                    <span className="font-sans text-sm text-mistral-navy/60">Estimated Time</span>
                                    <span className="font-mono text-sm font-bold text-mistral-navy">15-20 mins</span>
                                </div>
                            </div>

                            {problems.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Code2 className="w-4 h-4 text-mistral-navy" />
                                        <span className="font-mono text-xs text-mistral-navy/60 uppercase tracking-wider">Practice Problems</span>
                                    </div>
                                    <div className="space-y-3">
                                        {problems.map((p, i) => (
                                            <motion.div 
                                                key={p.slug} 
                                                initial={{ opacity: 0, x: 20 }} 
                                                animate={{ opacity: 1, x: 0 }} 
                                                transition={{ delay: i * 0.1 }}
                                            >
                                                <Link href={`/problems/${p.slug}`}
                                                    className="block bg-white border border-mistral-navy/10 p-4 hover:border-mistral-navy hover:shadow-[4px_4px_0px_0px_#0f172a] transition-all group">
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <h3 className="font-mono text-sm font-bold text-mistral-navy group-hover:text-mistral-orange transition-colors leading-tight">{p.title}</h3>
                                                        <span className={`font-mono text-[10px] px-1.5 py-0.5 border flex-shrink-0 ${diffColor(p.difficulty)}`}>{p.difficulty}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 font-mono text-xs text-mistral-navy/40 group-hover:text-mistral-orange transition-colors">
                                                        Solve Challenge <ChevronRight className="w-3 h-3 ml-auto" />
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
