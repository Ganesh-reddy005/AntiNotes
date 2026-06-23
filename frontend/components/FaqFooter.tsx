"use client";
import React from 'react';
import Link from "next/link";
import { Terminal, ArrowRight } from "lucide-react";

const faqs = [
  {
    q: "Why can't I just paste these problems into ChatGPT?",
    a: "ChatGPT gives you the answer. We give you the question. Our Socratic Engine forces you to derive the logic yourself. Plus, ChatGPT is stateless—it forgets your weak spots. Antinotes runs a Background Agent that remembers your \"Logic Elo\" and forces reviews exactly when you're about to forget.",
  },
  {
    q: "Is this just a LeetCode wrapper?",
    a: "No. LeetCode checks if your code works (Test Cases). We check how you think (Engineering Standards). Our Reviewer Agent analyzes variable naming, modularity, and trade-offs. We are building Engineers, not competitive programmers.",
  },
  {
    q: "Does this help with Placements?",
    a: "Directly. V1 builds your Logic Intuition (the Technical Interview). V3 (coming 2027) focuses on Real World Projects and Resume crafting. We don't just teach you to code; we provide the complete architectural guidance to get you hired.",
  },
  {
    q: "Is it free to use?",
    a: "Yes — Antinotes is free during the public beta. Sign up with your email, complete a short onboarding, and you'll have immediate access to the Problem Solver, AI Tutor, and Revision Tracker.",
  },
  {
    q: "What languages does it support?",
    a: "Currently Python, Java, and JavaScript are fully supported with syntax validation in the editor. Support for C++, Go, and Rust is on the roadmap.",
  },
];

export default function FaqFooter() {
  return (
    <>
      {/* FAQ SECTION */}
      <section id="faq" className="w-full max-w-3xl mx-auto px-6 py-24 bg-mistral-bg">
        <h2 className="font-serif text-3xl md:text-4xl text-mistral-navy mb-12 text-center">
          Common Questions
        </h2>

        <div className="space-y-10">
          {faqs.map((item, i) => (
            <div key={i} className="group border-b border-mistral-navy/8 pb-8 last:border-0">
              <h3 className="font-sans font-medium text-lg text-mistral-navy mb-2 group-hover:text-mistral-orange transition-colors cursor-default">
                {item.q}
              </h3>
              <p className="font-sans text-mistral-navy/60 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA SECTION (Conversion Trap) */}
      <section className="w-full bg-mistral-navy py-24 px-6 border-t border-mistral-navy/10 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-mistral-orange/20 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-6 leading-tight tracking-tight">
            Placements are approaching.<br/>
            <span className="italic text-mistral-orange">Are you ready?</span>
          </h2>
          
          <p className="font-sans text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop watching endless tutorials. Start building your thinking capabilities. Join 400+ engineers who are already rewiring their brains for top-tier tech interviews.
          </p>

          <Link
            href="/register"
            className="group relative inline-flex items-center gap-3 px-8 py-5 bg-mistral-orange text-mistral-navy font-mono text-sm md:text-base font-bold uppercase tracking-wider shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] active:shadow-none transition-all"
          >
            <Terminal className="w-5 h-5 text-mistral-navy" />
            <span>Claim Your Beta Access</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <p className="mt-8 text-xs font-mono text-white/40 uppercase tracking-widest">
            Currently in private beta · Free forever for early users
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-mistral-navy/5 bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <span className="font-serif text-xl font-bold tracking-tight text-mistral-navy">Antinotes.</span>
            <span className="font-mono text-xs text-mistral-navy/40 mt-2">© 2026 Antinotes Inc. — all rights reserved.</span>
          </div>

          {/* Tagline */}
          <p className="font-serif text-lg text-mistral-navy/80 italic text-center md:text-left">
            Built by engineers who hated <span className="line-through decoration-mistral-orange decoration-2 text-mistral-navy/40">memorization</span>.
          </p>

          {/* Links */}
          <div className="flex gap-6 font-mono text-xs text-mistral-navy/60 uppercase tracking-widest">
            <a
              href="https://www.linkedin.com/in/ganesh-reddy-23724b296/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-mistral-orange transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="mailto:b.ganesh.reddy.05@gmail.com"
              className="hover:text-mistral-orange transition-colors"
            >
              Email
            </a>
            <a
              href="/register"
              className="hover:text-mistral-orange transition-colors"
            >
              Sign Up
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}