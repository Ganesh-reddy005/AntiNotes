"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { tutorApi } from "@/lib/api";
import {
    MessageSquare, X, Minus, Maximize2, Send, Loader2, Terminal, GripVertical
} from "lucide-react";

export interface TutorMessage {
    role: "user" | "assistant";
    content: string;
}

interface Props {
    problemSlug: string;
    sessionId?: string;
    isOpen: boolean;
    onClose: () => void;
    messages: TutorMessage[];
    onMessages: (msgs: TutorMessage[]) => void;
}

type WindowState = "normal" | "minimized" | "maximized";

export default function FloatingTutor({
    problemSlug,
    sessionId,
    isOpen,
    onClose,
    messages,
    onMessages,
}: Props) {
    const [input, setInput] = useState("");
    const [thinking, setThinking] = useState(false);
    const [winState, setWinState] = useState<WindowState>("normal");
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dragControls = useDragControls();

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (winState !== "minimized") {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, thinking, winState]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && winState !== "minimized") {
            setTimeout(() => inputRef.current?.focus(), 150);
        }
    }, [isOpen, winState]);

    const send = useCallback(async () => {
        const text = input.trim();
        if (!text || thinking || !problemSlug) return;

        const updated: TutorMessage[] = [...messages, { role: "user", content: text }];
        onMessages(updated);
        setInput("");
        setThinking(true);

        try {
            const history = updated.slice(-6).map(m => ({ role: m.role, content: m.content }));
            const res = await tutorApi.ask({
                problem_slug: problemSlug,
                user_message: text,
                history: history.slice(0, -1),
                session_id: sessionId,
            });
            
            // Check if reply is empty (safety fallback)
            const reply = res.data.reply || "I'm processing that. Could you rephrase your question?";
            onMessages([...updated, { role: "assistant", content: reply }]);
        } catch {
            onMessages([...updated, { role: "assistant", content: "Something went wrong. Try again." }]);
        } finally {
            setThinking(false);
        }
    }, [input, thinking, problemSlug, messages, onMessages, sessionId]);

    const unreadCount = messages.filter(m => m.role === "assistant").length;

    // ── Size classes ─────────────────────────────────────────────────────────────
    const sizeClass =
        winState === "maximized"
            ? "fixed inset-4 w-auto h-auto"
            : winState === "minimized"
                ? "w-64 h-12"
                : "w-[380px] h-[520px]";

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                key="floating-tutor"
                drag={winState === "normal"}
                dragControls={dragControls}
                dragListener={false}
                dragMomentum={false}
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className={`
                    fixed bottom-6 right-6 z-50 flex flex-col
                    bg-white border border-mistral-navy/15
                    shadow-[6px_6px_0px_0px_rgba(15,23,42,0.12)]
                    overflow-hidden
                    ${sizeClass}
                `}
            >
                {/* ── Title bar (Drag Handle) ── */}
                <div
                    onPointerDown={(e) => dragControls.start(e)}
                    className={`
                        flex-shrink-0 flex items-center gap-2 px-3 py-2.5
                        bg-mistral-navy text-white border-b border-white/10
                        ${winState === "normal" ? "cursor-grab active:cursor-grabbing" : "cursor-default"}
                    `}
                >
                    {/* Drag handle */}
                    <GripVertical className="w-3.5 h-3.5 opacity-40 flex-shrink-0" />

                    <MessageSquare className="w-3.5 h-3.5 text-mistral-orange flex-shrink-0" />
                    <span className="font-mono text-xs font-bold flex-1 truncate">
                        AI Tutor
                        {messages.length > 0 && winState === "minimized" && (
                            <span className="ml-1.5 bg-mistral-orange text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                                {unreadCount}
                            </span>
                        )}
                    </span>

                    {/* Window controls */}
                    <div className="flex items-center gap-1 ml-auto">
                        <button
                            onClick={() => setWinState(s => s === "minimized" ? "normal" : "minimized")}
                            className="w-5 h-5 flex items-center justify-center hover:bg-white/10 rounded transition-colors"
                            title={winState === "minimized" ? "Restore" : "Minimize"}
                        >
                            <Minus className="w-3 h-3" />
                        </button>
                        <button
                            onClick={() => setWinState(s => s === "maximized" ? "normal" : "maximized")}
                            className="w-5 h-5 flex items-center justify-center hover:bg-white/10 rounded transition-colors"
                            title={winState === "maximized" ? "Restore" : "Maximize"}
                        >
                            <Maximize2 className="w-3 h-3" />
                        </button>
                        <button
                            onClick={onClose}
                            className="w-5 h-5 flex items-center justify-center hover:bg-red-500/80 rounded transition-colors"
                            title="Close (chat history saved)"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* ── Body (hidden when minimized) ── */}
                {winState !== "minimized" && (
                    <>
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-3 py-4 bg-mistral-bg scroll-smooth">
                            <div className="flex flex-col gap-3">
                                {messages.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-10"
                                    >
                                        <div className="w-10 h-10 bg-mistral-navy flex items-center justify-center mx-auto mb-3">
                                            <Terminal className="w-5 h-5 text-mistral-yellow" />
                                        </div>
                                        <p className="font-serif text-sm text-mistral-navy mb-1">Ready to guide you.</p>
                                        <p className="font-sans text-xs text-mistral-navy/50 px-4 text-balance">
                                            I won&apos;t give you the answer — I&apos;ll ask the right questions.
                                        </p>
                                    </motion.div>
                                )}

                                <AnimatePresence initial={false}>
                                    {messages.map((msg, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`
                                                    max-w-[85%] px-3 py-2 text-xs font-sans leading-relaxed
                                                    ${msg.role === "user"
                                                        ? "bg-mistral-navy text-white shadow-sm"
                                                        : "bg-white border border-mistral-navy/10 text-mistral-navy border-l-2 border-l-mistral-orange shadow-sm"
                                                    }
                                                `}
                                            >
                                                {msg.role === "assistant" && (
                                                    <div className="font-mono text-[9px] text-mistral-orange/70 mb-1 uppercase tracking-wider">
                                                        Tutor
                                                    </div>
                                                )}
                                                <span className="whitespace-pre-wrap">{msg.content}</span>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {thinking && (
                                        <motion.div
                                            key="thinking"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex justify-start"
                                        >
                                            <div className="bg-white border border-mistral-navy/10 border-l-2 border-l-mistral-orange px-3 py-2 shadow-sm">
                                                <div className="font-mono text-[9px] text-mistral-orange/70 mb-1.5 uppercase tracking-wider">
                                                    Tutor
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {[0, 1, 2].map(j => (
                                                        <div
                                                            key={j}
                                                            className="w-1.5 h-1.5 bg-mistral-navy/30 rounded-full animate-bounce"
                                                            style={{ animationDelay: `${j * 0.15}s` }}
                                                        />
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
                        <div className="flex-shrink-0 bg-white border-t border-mistral-navy/10 px-3 py-2.5">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
                                    placeholder="Ask or share your thinking..."
                                    className="
                                        flex-1 px-3 py-2 bg-mistral-bg border border-mistral-navy/20
                                        text-mistral-navy placeholder-mistral-navy/30
                                        font-mono text-xs focus:outline-none focus:border-mistral-navy transition-all
                                    "
                                    disabled={thinking}
                                />
                                <button
                                    onClick={send}
                                    disabled={thinking || !input.trim()}
                                    className="
                                        flex items-center justify-center w-9 h-9
                                        bg-mistral-navy text-white border border-mistral-navy
                                        shadow-[2px_2px_0px_0px_#f97316]
                                        hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#f97316]
                                        active:shadow-none transition-all
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                    "
                                >
                                    {thinking
                                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        : <Send className="w-3.5 h-3.5" />
                                    }
                                </button>
                            </div>
                            <p className="font-mono text-[9px] text-mistral-navy/25 mt-1.5 text-center">
                                Socratic mode · guided hints only
                            </p>
                        </div>
                    </>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
