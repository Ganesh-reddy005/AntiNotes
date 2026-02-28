"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { tutorApi, problemsApi, Problem } from "@/lib/api";
import { Terminal, Loader2, Send, MessageSquare, ChevronRight } from "lucide-react";

interface Message { role: "user" | "assistant"; content: string; }

export default function TutorPage() {
    const { session_id } = useParams<{ session_id: string }>();
    const searchParams = useSearchParams();
    const problemSlug = searchParams.get("problem") || "";

    const [problem, setProblem] = useState<Problem | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [thinking, setThinking] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (problemSlug) {
            problemsApi.get(problemSlug).then(r => setProblem(r.data)).catch(() => { });
        }
    }, [problemSlug]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, thinking]);

    const send = async () => {
        const text = input.trim();
        if (!text || thinking) return;
        const slug = problem?.slug || problemSlug;
        if (!slug) return;

        const newMessages: Message[] = [...messages, { role: "user", content: text }];
        setMessages(newMessages);
        setInput("");
        setThinking(true);

        try {
            const history = newMessages.slice(-6).map(m => ({ role: m.role, content: m.content }));
            const res = await tutorApi.ask({
                problem_slug: slug,
                user_message: text,
                history: history.slice(0, -1), // exclude last user msg (sent separately)
                session_id: session_id !== "new" ? session_id : undefined,
            });
            setMessages(prev => [...prev, { role: "assistant", content: res.data.reply }]);
        } catch {
            setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Try again." }]);
        } finally {
            setThinking(false);
        }
    };

    return (
        <div className="h-screen bg-mistral-bg flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 bg-white border-b border-mistral-navy/10 px-5 py-3 flex items-center gap-4">
                <Link href="/problems" className="font-mono text-xs text-mistral-navy/40 hover:text-mistral-navy transition-colors">← Problems</Link>
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-mistral-orange" />
                    <span className="font-mono text-sm font-bold text-mistral-navy">Socratic Tutor</span>
                    {problem && (
                        <>
                            <span className="text-mistral-navy/20">/</span>
                            <span className="font-mono text-xs text-mistral-navy/50">{problem.title}</span>
                        </>
                    )}
                </div>
                <div className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-mistral-navy/30 bg-mistral-navy/5 px-2 py-1 border border-mistral-navy/10">
                    <span className="w-1.5 h-1.5 bg-mistral-orange animate-pulse inline-block" />
                    Socratic Mode
                </div>
            </div>

            {/* Problem Card (if loaded) */}
            {problem && (
                <div className="flex-shrink-0 bg-mistral-yellow/20 border-b border-mistral-navy/10 px-5 py-2 flex items-center gap-3">
                    <span className="font-mono text-xs text-mistral-navy/50">Working on:</span>
                    <span className="font-mono text-xs font-bold text-mistral-navy">{problem.title}</span>
                    <Link href={`/problems/${problem.slug}`} className="ml-auto font-mono text-xs text-mistral-orange hover:underline flex items-center gap-0.5">
                        Editor <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-2xl mx-auto flex flex-col gap-4">
                    {messages.length === 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                            <div className="w-12 h-12 bg-mistral-navy flex items-center justify-center mx-auto mb-4">
                                <Terminal className="w-6 h-6 text-mistral-yellow" />
                            </div>
                            <h3 className="font-serif text-xl text-mistral-navy mb-2">Ready to think.</h3>
                            <p className="font-sans text-sm text-mistral-navy/50 max-w-sm mx-auto">
                                I won't give you the answer. I'll ask you the right questions until you find it yourself.
                            </p>
                        </motion.div>
                    )}

                    <AnimatePresence initial={false}>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`max-w-[75%] px-4 py-3 text-sm font-sans leading-relaxed ${msg.role === "user"
                                        ? "bg-mistral-navy text-white"
                                        : "bg-white border border-mistral-navy/10 text-mistral-navy border-l-2 border-l-mistral-orange"
                                    }`}>
                                    {msg.role === "assistant" && (
                                        <div className="font-mono text-[10px] text-mistral-orange/70 mb-1.5 uppercase tracking-wider">Tutor</div>
                                    )}
                                    {msg.content}
                                </div>
                            </motion.div>
                        ))}

                        {thinking && (
                            <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                <div className="bg-white border border-mistral-navy/10 border-l-2 border-l-mistral-orange px-4 py-3">
                                    <div className="font-mono text-[10px] text-mistral-orange/70 mb-1.5 uppercase tracking-wider">Tutor</div>
                                    <div className="flex items-center gap-1">
                                        {[0, 1, 2].map(i => (
                                            <div key={i} className="w-1.5 h-1.5 bg-mistral-navy/30 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={bottomRef} />
                </div>
            </div>

            {/* Input bar */}
            <div className="flex-shrink-0 bg-white border-t border-mistral-navy/10 px-4 py-3">
                <div className="max-w-2xl mx-auto flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
                        placeholder="Ask a question, share your thinking..."
                        className="flex-1 px-4 py-2.5 bg-mistral-bg border border-mistral-navy/20 text-mistral-navy placeholder-mistral-navy/30 font-mono text-sm focus:outline-none focus:border-mistral-navy transition-all"
                        disabled={thinking}
                    />
                    <button
                        onClick={send}
                        disabled={thinking || !input.trim()}
                        className="flex items-center gap-2 px-4 py-2.5 bg-mistral-navy text-white font-mono text-xs border border-mistral-navy shadow-[2px_2px_0px_0px_#f97316] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#f97316] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {thinking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                </div>
                <p className="font-mono text-[10px] text-mistral-navy/30 text-center mt-2">
                    Socratic mode — I'll guide your thinking, not give answers.
                </p>
            </div>
        </div>
    );
}
