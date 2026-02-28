"use client";
import React from 'react';
import { motion } from "framer-motion";
import { Terminal, User, ArrowRight } from "lucide-react";

export default function Comparison() {
  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-16 items-center">
      
      {/* LEFT: THE PAIN (Typography & Story) */}
      <div className="space-y-8">
        <h3 className="font-serif text-4xl text-mistral-navy leading-[1.1]">
          The "Tutorial Hell" <span className="italic text-mistral-orange">Loop</span>.
        </h3>
        <ul className="space-y-6 font-sans">
          {[
            "You memorize the solution to pass the test.",
            "You forget the logic 2 days later.",
            "The interviewer changes one constraint, and you panic."
          ].map((text, i) => (
            <li key={i} className="flex items-start gap-4 group cursor-default">
              <span className="font-mono text-sm font-bold text-mistral-orange pt-1 border-b border-mistral-orange/20">0{i + 1}</span>
              <p className="text-mistral-navy/70 group-hover:text-mistral-navy transition-colors text-lg leading-relaxed">
                {text}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT: THE SOLUTION (Glassmorphic Chat Card) */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="relative bg-white/60 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-mistral-navy/10 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.1)]"
      >
        {/* RETRO BADGE */}
        <div className="absolute -top-3 -right-3 bg-mistral-orange text-white text-[10px] font-mono font-bold px-3 py-1.5 border border-mistral-orange shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] uppercase tracking-wider">
          Live_Agent_v1
        </div>
        
        <div className="space-y-6">
          
          {/* AGENT BUBBLE 1 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-mistral-navy flex items-center justify-center shrink-0 border border-mistral-navy shadow-[2px_2px_0px_0px_#f97316]">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-mistral-navy/5 p-4 shadow-sm text-sm text-mistral-navy font-sans leading-relaxed rounded-tr-none">
              "Your Hash Map solution is <span className="font-mono text-xs bg-mistral-navy/5 px-1 py-0.5 text-mistral-navy border border-mistral-navy/10">O(n)</span>. Correct. But <b>why</b> choose a Map over a Set here?"
            </div>
          </div>
          
          {/* USER BUBBLE */}
          <div className="flex items-start gap-4 justify-end">
            <div className="bg-mistral-navy/5 border border-mistral-navy/5 p-4 text-sm text-mistral-navy/80 font-sans leading-relaxed text-right rounded-tl-none">
              Because we need to store the index of the complement?
            </div>
            <div className="w-8 h-8 bg-white border border-mistral-navy/10 flex items-center justify-center shrink-0">
               <User className="w-4 h-4 text-mistral-navy" />
            </div>
          </div>

           {/* AGENT BUBBLE 2 */}
           <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-mistral-navy flex items-center justify-center shrink-0 border border-mistral-navy shadow-[2px_2px_0px_0px_#f97316]">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-mistral-navy/5 p-4 shadow-sm text-sm text-mistral-navy font-sans leading-relaxed rounded-tr-none">
              "Exactly. You just derived the Space/Time trade-off."
              <div className="mt-3 flex items-center gap-2 text-xs font-mono font-bold text-mistral-orange uppercase tracking-wide">
                <ArrowRight className="w-3 h-3" />
                +10 Logic Points
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}