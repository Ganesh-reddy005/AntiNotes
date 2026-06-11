"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { onboardingApi } from "@/lib/api";

const STEPS = [
    {
        id: "coding_level",
        label: "skill_level",
        question: "How would you honestly describe your coding level?",
        options: [
            { value: "beginner", label: "Beginner", desc: "I know the basics but struggle with DSA" },
            { value: "intermediate", label: "Intermediate", desc: "I can solve easy problems but medium trips me up" },
            { value: "advanced", label: "Advanced", desc: "I'm preparing for FAANG-level interviews" },
        ],
    },
    {
        id: "goal",
        label: "goal",
        question: "What's your primary goal?",
        options: [
            { value: "get_job", label: "Get a Job", desc: "I'm actively interviewing or will be soon" },
            { value: "faang", label: "FAANG / Top Tech", desc: "I want to crack Google, Meta, Amazon etc." },
            { value: "startup", label: "Startup / Freelance", desc: "I build things, not just interview" },
            { value: "learn_for_fun", label: "Learn for Growth", desc: "I want to think better, not just solve problems" },
        ],
    },
    {
        id: "teaching_style",
        label: "teaching_style",
        question: "How should your AI tutor teach you?",
        options: [
            { value: "socratic", label: "Socratic", desc: "Never give answers. Make me think with questions." },
            { value: "friendly", label: "Friendly", desc: "Guide me with analogies and encouragement." },
            { value: "ruthless", label: "Ruthless", desc: "Be demanding. Don't accept vague answers." },
        ],
    },
    {
        id: "primary_language",
        label: "primary_language",
        question: "Which language do you write in?",
        options: [
            { value: "python", label: "Python", desc: "Clean syntax, great for logic-first thinking" },
            { value: "cpp", label: "C++", desc: "Maximum control and performance" },
            { value: "java", label: "Java", desc: "Object-oriented, widely used in interviews" },
            { value: "javascript", label: "JavaScript", desc: "Full-stack versatility" },
        ],
    },
    {
        id: "background",
        label: "background",
        question: "What's your background? (optional)",
        options: [
            { value: "cs_grad", label: "CS Graduate", desc: "Formal CS education" },
            { value: "bootcamp", label: "Bootcamp", desc: "Intensive coding program" },
            { value: "self_taught", label: "Self-taught", desc: "Learned on my own" },
            { value: "career_switch", label: "Career Switch", desc: "Coming from another field" },
        ],
        optional: true,
    },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    const current = STEPS[step];
    const isLast = step === STEPS.length - 1;

    const select = async (value: string) => {
        const updated = { ...answers, [current.id]: value };
        setAnswers(updated);

        if (isLast) {
            setSubmitting(true);
            try {
                await onboardingApi.submit({
                    coding_level: updated.coding_level,
                    goal: updated.goal,
                    teaching_style: updated.teaching_style,
                    primary_language: updated.primary_language,
                    background: updated.background,
                });
                setDone(true);
                setTimeout(() => router.push("/dashboard"), 1500);
            } catch {
                setSubmitting(false);
            }
        } else {
            setStep((s) => s + 1);
        }
    };

    const skip = () => {
        if (isLast) {
            select("self_taught");
        } else {
            setStep((s) => s + 1);
        }
    };

    if (done) {
        return (
            <div className="min-h-screen bg-mistral-bg flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <CheckCircle2 className="w-16 h-16 text-mistral-orange mx-auto mb-4" />
                    <h2 className="font-serif text-3xl text-mistral-navy mb-2">Profile created.</h2>
                    <p className="font-mono text-sm text-mistral-navy/50">Redirecting to your dashboard...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-mistral-bg flex flex-col">
            {/* Progress bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-mistral-sand z-50">
                <motion.div
                    className="h-full bg-mistral-orange"
                    animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                    transition={{ duration: 0.4 }}
                />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
                {/* Header */}
                <div className="flex items-center gap-2 mb-16">
                    <div className="grid grid-cols-2 gap-0.5">
                        <div className="w-1.5 h-1.5 bg-mistral-navy" />
                        <div className="w-1.5 h-1.5 bg-mistral-orange" />
                        <div className="w-1.5 h-1.5 bg-mistral-sand" />
                        <div className="w-1.5 h-1.5 bg-mistral-yellow" />
                    </div>
                    <span className="font-serif text-lg font-bold text-mistral-navy">
                        AntiNotes<span className="text-mistral-orange">.</span>
                    </span>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-xl"
                    >
                        {/* Step counter */}
                        <p className="font-mono text-xs text-mistral-navy/40 uppercase tracking-widest mb-4 text-center">
                            {step + 1} / {STEPS.length} — {current.label}
                        </p>

                        {/* Question */}
                        <h2 className="font-serif text-3xl md:text-4xl font-medium text-mistral-navy text-center mb-10 leading-tight">
                            {current.question}
                        </h2>

                        {/* Options */}
                        <div className="flex flex-col gap-3">
                            {current.options.map((opt) => (
                                <motion.button
                                    key={opt.value}
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => select(opt.value)}
                                    disabled={submitting}
                                    className="w-full flex items-center justify-between px-6 py-4 bg-white border border-mistral-navy/20 hover:border-mistral-navy hover:shadow-[4px_4px_0px_0px_#0f172a] transition-all group text-left disabled:opacity-60"
                                >
                                    <div>
                                        <div className="font-mono text-sm font-bold text-mistral-navy group-hover:text-mistral-orange transition-colors">
                                            {opt.label}
                                        </div>
                                        <div className="font-sans text-xs text-mistral-navy/50 mt-0.5">{opt.desc}</div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-mistral-navy/30 group-hover:text-mistral-orange transition-colors flex-shrink-0 ml-4" />
                                </motion.button>
                            ))}
                        </div>

                        {/* Skip (optional step) */}
                        {current.optional && (
                            <button
                                onClick={skip}
                                className="mt-4 w-full font-mono text-xs text-mistral-navy/40 hover:text-mistral-navy/70 transition-colors text-center py-2"
                            >
                                Skip this step →
                            </button>
                        )}

                        {submitting && (
                            <div className="flex items-center justify-center gap-2 mt-6 text-mistral-navy/60 font-mono text-xs">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Building your profile...
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
