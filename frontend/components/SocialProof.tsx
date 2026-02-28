"use client";
import React from 'react';
import { motion } from "framer-motion";
import { Brain, Target, Zap, Users } from "lucide-react";

const stats = [
    {
        icon: <Users className="w-5 h-5" />,
        value: "400+",
        label: "Engineers on Beta",
        color: "text-mistral-orange",
        bg: "bg-mistral-orange/10",
    },
    {
        icon: <Brain className="w-5 h-5" />,
        value: "450+",
        label: "DSA Concepts Mapped",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        icon: <Target className="w-5 h-5" />,
        value: "3×",
        label: "Faster Retention",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
    },
    {
        icon: <Zap className="w-5 h-5" />,
        value: "< 30s",
        label: "To First AI Review",
        color: "text-purple-500",
        bg: "bg-purple-500/10",
    },
];

const testimonials = [
    {
        quote: "Antinotes made me realize I was memorizing patterns, not thinking. The Socratic Engine is brutal—in the best way.",
        author: "Arjun S.",
        role: "SWE Intern @ Flipkart",
    },
    {
        quote: "The Logic Score breakdown is unlike anything on LeetCode. I finally understand *why* my solution was O(n²).",
        author: "Priya M.",
        role: "CS Junior, IIT Bombay",
    },
    {
        quote: "The spaced repetition actually works. I haven't forgotten a DP pattern since I started using this.",
        author: "Ravi K.",
        role: "Placed @ Microsoft",
    },
];

export default function SocialProof() {
    return (
        <section id="social-proof" className="relative w-full max-w-7xl mx-auto px-6 py-20 md:py-28">

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex flex-col items-center text-center p-6 bg-white border border-mistral-navy/8 shadow-[2px_2px_0px_0px_rgba(15,23,42,0.06)]"
                    >
                        <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} mb-3`}>
                            {stat.icon}
                        </div>
                        <div className={`font-serif text-4xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                        <div className="font-mono text-xs text-mistral-navy/50 uppercase tracking-widest">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Testimonials */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <h2 className="font-serif text-3xl md:text-4xl text-mistral-navy mb-3">
                    What engineers are <span className="italic text-mistral-orange">saying</span>
                </h2>
                <p className="font-sans text-base text-mistral-navy/50 max-w-lg mx-auto">
                    Beta users are already seeing measurable improvements in interview performance.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((t, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.12 }}
                        className="p-6 bg-white border border-mistral-navy/8 shadow-[2px_2px_0px_0px_rgba(15,23,42,0.06)] flex flex-col justify-between"
                    >
                        <p className="font-serif text-lg text-mistral-navy/80 leading-relaxed italic mb-5">
                            &ldquo;{t.quote}&rdquo;
                        </p>
                        <div className="flex items-center gap-3 pt-4 border-t border-mistral-navy/5">
                            <div className="w-8 h-8 bg-mistral-orange/10 flex items-center justify-center font-serif font-bold text-mistral-orange text-sm">
                                {t.author[0]}
                            </div>
                            <div>
                                <div className="font-sans font-semibold text-sm text-mistral-navy">{t.author}</div>
                                <div className="font-mono text-xs text-mistral-navy/40">{t.role}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
