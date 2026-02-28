"use client";
import React from 'react';
import { motion } from "framer-motion";
import { Terminal, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const scrollToFeatures = () => {
    const el = document.getElementById("features");
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full max-w-5xl mx-auto pt-32 pb-24 px-6 text-center">

      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30 bg-pixel-pattern"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-mistral-yellow via-mistral-orange/20 to-transparent blur-3xl opacity-40 z-0" />

      <div className="relative z-10">

        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 border border-mistral-navy/10 bg-white mb-8 shadow-[2px_2px_0px_0px_rgba(200,200,200,0.5)]"
        >
          <span className="w-2 h-2 bg-mistral-orange animate-pulse"></span>
          <span className="text-xs font-mono font-medium text-mistral-navy tracking-tight uppercase">v1.0 // public_beta</span>
        </motion.div>

        {/* Headlines */}
        <h1 className="font-serif text-5xl md:text-8xl font-medium text-mistral-navy leading-[0.9] tracking-tight mb-8">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="block"
          >
            Logic, <span className="italic text-mistral-orange">not</span> syntax.
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="block text-mistral-navy/80"
          >
            Thinking, not typing.
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-lg md:text-xl text-mistral-navy/60 font-sans max-w-2xl mx-auto leading-relaxed mb-12"
        >
          The first AI tutor that ignores your semicolons and grades your mental models.
          Stop grinding LeetCode blind.
        </motion.p>

        {/* CTA BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/register"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-mistral-navy text-white font-mono text-sm font-bold uppercase tracking-wider border border-mistral-navy shadow-[4px_4px_0px_0px_#f97316] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#f97316] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            <Terminal className="w-4 h-4 text-mistral-yellow" />
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <button
            onClick={scrollToFeatures}
            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-mistral-navy font-mono text-sm font-bold uppercase tracking-wider border border-mistral-navy/20 hover:border-mistral-navy hover:bg-white transition-all"
          >
            <Sparkles className="w-4 h-4 text-mistral-orange" />
            <span>See How It Works</span>
          </button>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <p className="text-xs font-mono text-mistral-navy/40 uppercase tracking-widest">
            Free to use · No credit card required · Join 400+ engineers
          </p>
        </motion.div>

      </div>
    </section>
  );
}