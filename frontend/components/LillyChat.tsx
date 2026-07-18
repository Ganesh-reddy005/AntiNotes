"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { lillyApi } from "@/lib/api";

interface LillyMessage {
    role: "lilly" | "user";
    content: string;
}

interface LillyChatProps {
    context: "onboarding" | "roadmap" | "revision" | "personal";
    onComplete?: (data: any) => void;
    onProfileUpdated?: () => void;
    topicSlug?: string;
    topicName?: string;
    className?: string;
}

const LILLY_GREETING =
    "Hey! I'm Lilly — I'll be your coding companion here at AntiNotes. Before we dive into problems, I'd love to know a bit about you. Since when have you been coding?";

const LILLY_PERSONAL_GREETING =
    "Hey! I'm Lilly, your personalization companion. Tell me how you'd like to shape your learning — if the problems feel too hard or too easy, what your goals are, or anything you'd like me to remember about you. I'll tune your experience as we chat.";

export default function LillyChat({
    context,
    onComplete,
    onProfileUpdated,
    topicSlug,
    topicName,
    className,
}: LillyChatProps) {
    const [messages, setMessages] = useState<LillyMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [profileUpdated, setProfileUpdated] = useState(false);
    const [conversationId, setConversationId] = useState<string | undefined>(undefined);
    const hasGreeted = useRef(false);

    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // Build API history from messages (convert roles for the backend)
    const buildHistory = useCallback((): { role: string; content: string }[] => {
        return messages.map((m) => ({
            role: m.role === "lilly" ? "assistant" : "user",
            content: m.content,
        }));
    }, [messages]);

    // Auto-send Lilly's greeting on mount (onboarding / personal contexts)
    useEffect(() => {
        if ((context === "onboarding" || context === "personal") && !hasGreeted.current && messages.length === 0) {
            hasGreeted.current = true;
            setIsLoading(true);
            const timer = setTimeout(() => {
                setMessages([{ role: "lilly", content: context === "personal" ? LILLY_PERSONAL_GREETING : LILLY_GREETING }]);
                setIsLoading(false);
            }, 1200);
            return () => {
                clearTimeout(timer);
                hasGreeted.current = false;
            };
        }
    }, [context, messages.length]);

    // Auto-scroll the messages container to bottom (not the whole page)
    useEffect(() => {
        const el = messagesContainerRef.current;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    }, [messages, isLoading]);

    // Focus input when loading finishes
    useEffect(() => {
        if (!isLoading) {
            inputRef.current?.focus();
        }
    }, [isLoading]);

    const sendMessage = useCallback(async () => {
        const text = inputValue.trim();
        if (!text || isLoading) return;

        const userMessage: LillyMessage = { role: "user", content: text };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputValue("");
        setIsLoading(true);
        setProfileUpdated(false);

        // Build history for API (include all messages up to but not including the latest user message)
        const history = updatedMessages.slice(0, -1).map((m) => ({
            role: m.role === "lilly" ? "assistant" : "user",
            content: m.content,
        }));

        try {
            let reply = "";
            let isComplete = false;
            let extractedProfile = null;

            if (context === "onboarding") {
                const res = await lillyApi.onboardingChat({
                    user_message: text,
                    history,
                });
                reply = res.data.reply;
                isComplete = res.data.is_complete;
                extractedProfile = res.data.extracted_profile;
            } else if (context === "roadmap" && topicSlug) {
                const res = await lillyApi.roadmapChat({
                    user_message: text,
                    history,
                    topic_slug: topicSlug,
                });
                reply = res.data.reply;
            } else if (context === "revision" && topicName) {
                const res = await lillyApi.revisionChat({
                    user_message: text,
                    history,
                    topic: topicName,
                });
                reply = res.data.reply;
            } else if (context === "personal") {
                // Streaming personalization chat — use native fetch (axios XHR
                // adapter does not expose a web ReadableStream in the browser).
                const token = typeof window !== "undefined" ? localStorage.getItem("antinotes_token") : null;
                
                // Ensure /api/v1 is included (handle misconfigured env vars)
                let base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
                if (!base.includes("/api/v1")) {
                    base = base.endsWith("/") ? `${base}api/v1` : `${base}/api/v1`;
                }
                base = base.replace(/\/$/, ""); // Remove trailing slash
                
                const url = `${base}/lilly/personal/chat`;

                const fetchRes = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({
                        user_message: text,
                        history,
                        conversation_id: conversationId,
                    }),
                });

                if (!fetchRes.ok || !fetchRes.body) {
                    throw new Error(`Stream failed: ${fetchRes.status}`);
                }

                const reader = fetchRes.body.getReader();
                const decoder = new TextDecoder();
                let buffer = "";

                // Placeholder lilly message that we stream into
                let streamed = "";
                setMessages([...updatedMessages, { role: "lilly", content: "" }]);

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n\n");
                    buffer = lines.pop() || "";
                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (!trimmed.startsWith("data:")) continue;
                        const payload = trimmed.slice(5).trim();
                        if (payload === "[DONE]") continue;
                        try {
                            const evt = JSON.parse(payload);
                            if (evt.type === "token") {
                                streamed += evt.content;
                                setMessages((prev) => {
                                    const copy = [...prev];
                                    copy[copy.length - 1] = { role: "lilly", content: streamed };
                                    return copy;
                                });
                            } else if (evt.type === "done") {
                                reply = evt.reply;
                                setConversationId(evt.conversation_id);
                                if (evt.profile_updated) {
                                    setProfileUpdated(true);
                                    // Real-time refresh of the parent dashboard
                                    // (recommended problems, profile, nudge, etc.)
                                    onProfileUpdated?.();
                                }
                            }
                        } catch {
                            /* ignore malformed chunk */
                        }
                    }
                }
            }

            // For non-streaming contexts, append the reply
            if (context !== "personal") {
                const lillyReply: LillyMessage = {
                    role: "lilly",
                    content: reply || "Hmm, let me think about that differently. Could you tell me more?",
                };
                setMessages([...updatedMessages, lillyReply]);
            }

            if (isComplete && onComplete) {
                onComplete(extractedProfile);
            }
        } catch {
            setMessages([
                ...updatedMessages,
                {
                    role: "lilly",
                    content: "Oops, something went wrong on my end. Mind trying that again?",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    }, [inputValue, isLoading, messages, context, topicSlug, topicName, onComplete, onProfileUpdated, buildHistory, conversationId]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const placeholder =
        context === "onboarding"
            ? "Tell Lilly about yourself..."
            : context === "personal"
            ? "Tell Lilly what to change about your experience..."
            : `Ask about ${topicName || "this topic"}...`;

    return (
        <div className={`flex-1 w-full flex flex-col ${className || ""}`}>
            {/* Messages area */}
            <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto px-1 py-4 space-y-4 scrollbar-thin scrollbar-thumb-mistral-navy/20 max-h-[360px]"
            >
                <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 12, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            {/* No avatar per minimal design */}
                            <div
                                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-sans leading-relaxed border ${
                                    msg.role === "user"
                                        ? "rounded-br-md bg-mistral-bg text-mistral-navy border-mistral-navy/10"
                                        : `rounded-bl-md border-mistral-navy/10 ${
                                      context === "personal"
                                        ? "bg-transparent text-mistral-navy/80"
                                        : "bg-white text-mistral-navy shadow-sm"
                                  }`
                                }`}
                            >
                                <div className="prose prose-sm max-w-none prose-p:my-0.5 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-li:leading-snug prose-headings:my-1 prose-headings:leading-snug prose-strong:font-semibold prose-pre:my-1">
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Typing indicator */}
                    {isLoading && (
                        <motion.div
                            key="typing"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-start"
                        >
                            {/* No avatar */}
                            <div className={`px-4 py-3 rounded-2xl rounded-bl-md border border-mistral-navy/10 ${
                                context === "personal" ? "bg-transparent" : "bg-white shadow-sm"
                            }`}>
                                <div className="flex items-center gap-1.5 h-5">
                                    {[0, 1, 2].map((j) => (
                                        <div
                                            key={j}
                                            className="w-2 h-2 rounded-full animate-bounce bg-mistral-orange/60"
                                            style={{
                                                animationDelay: `${j * 0.2}s`,
                                                animationDuration: "0.8s",
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={bottomRef} />
            </div>

            {/* Profile-updated confirmation chip */}
            <AnimatePresence>
                {profileUpdated && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="px-1 pb-1"
                    >
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-mono">
                            <Sparkles className="w-3 h-3" />
                            Lilly updated your profile
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Input area */}
            <div className="flex-shrink-0 px-1 pt-3">
                <div className="flex items-center gap-3">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm font-sans text-white placeholder-white/40 border border-mistral-navy/20 bg-mistral-navy focus:outline-none focus:border-mistral-orange focus:ring-1 focus:ring-mistral-orange transition-all disabled:opacity-50"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={isLoading || !inputValue.trim()}
                        className="flex items-center justify-center w-10 h-10 rounded-xl text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 bg-mistral-orange"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </button>
                </div>
                <p className="font-mono text-center mt-2 text-[10px] text-mistral-navy/40">
                    {context === "personal"
                        ? "Lilly tunes your experience as you chat — not a test, just you taking control."
                        : "Lilly is here to understand you — not judge you."}
                </p>
            </div>
        </div>
    );
}
