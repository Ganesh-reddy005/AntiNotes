"use client";
import React from 'react';
import { Lock, GitBranch, Database, Briefcase, BrainCircuit, Terminal, Rocket } from "lucide-react";

export default function Roadmap() {
  return (
    <section className="w-full border-t border-mistral-navy/5 py-24 bg-mistral-bg">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-start">
        
        {/* --- LEFT SIDE: THE VERSIONS (Vertical Timeline) --- */}
        <div>
           <div className="mb-12">
             <p className="font-mono text-xs text-mistral-navy/40 uppercase tracking-widest mb-4">The Roadmap</p>
             <h2 className="font-serif text-4xl md:text-5xl text-mistral-navy">
               From Student to <span className="italic text-mistral-orange">Engineer</span>.
             </h2>
           </div>

           <div className="space-y-0 relative">
              {/* Vertical Line */}
              <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-mistral-navy/5 -z-10" />

              {/* V1: DSA (Active) */}
              <div className="flex gap-6 relative group cursor-pointer pb-16">
                 <div className="w-10 h-10 rounded-full border-2 border-mistral-orange bg-white flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.3)] shrink-0 z-10">
                    <span className="text-mistral-orange font-bold text-sm">01</span>
                 </div>
                 <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-serif text-xl text-mistral-navy">DSA Foundation</h3>
                      <span className="px-2 py-0.5 bg-mistral-orange/10 text-mistral-orange text-[10px] font-bold uppercase rounded border border-mistral-orange/20">Live v1.0</span>
                    </div>
                    <p className="text-sm text-mistral-navy/60 leading-relaxed font-sans max-w-sm mb-3">
                      Enhance thinking, don't just memorize. We break the "Tutorial Hell" loop using Socratic AI to build your logic intuition.
                    </p>
                 </div>
              </div>

              {/* V2: System Design (Locked) */}
              <div className="flex gap-6 relative grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300 pb-16">
                 <div className="w-10 h-10 rounded-full border-2 border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 z-10">
                    <GitBranch className="w-4 h-4 text-gray-400" />
                 </div>
                 <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-serif text-xl text-mistral-navy">System Design</h3>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                         <Lock className="w-3 h-3" /> Q3 2026
                      </span>
                    </div>
                    <p className="text-sm text-mistral-navy/60 leading-relaxed font-sans max-w-sm">
                      No chaos. Just pure architecture. Scaling from 1 to 1 Million users, HLD, LLD, and Database Sharding.
                    </p>
                 </div>
              </div>

              {/* V3: Career & Placement (Locked) */}
              <div className="flex gap-6 relative grayscale opacity-40">
                 <div className="w-10 h-10 rounded-full border-2 border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 z-10">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                 </div>
                 <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-serif text-xl text-mistral-navy">Placement & Projects</h3>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                         <Lock className="w-3 h-3" /> 2027
                      </span>
                    </div>
                    <p className="text-sm text-mistral-navy/60 leading-relaxed font-sans max-w-sm">
                      Build real industry projects with AI guidance. Resume crafting, soft skills, and direct internship support.
                    </p>
                 </div>
              </div>

           </div>
        </div>

        {/* --- RIGHT SIDE: THE CORE PILLARS (Your Vision) --- */}
        <div className="flex flex-col justify-center h-full pt-8">
           <div className="bg-white border border-mistral-navy/5 p-8 rounded-2xl shadow-[0_20px_40px_-15px_rgba(15,23,42,0.05)]">
              <h3 className="font-serif text-2xl text-mistral-navy mb-8 border-b border-mistral-navy/5 pb-4">
                The Antinotes <span className="italic text-mistral-orange">Manifesto</span>
              </h3>
              
              <div className="space-y-8">
                
                {/* Pillar 1 */}
                <div className="flex gap-4">
                  <div className="mt-1 w-8 h-8 bg-mistral-navy/5 rounded-lg flex items-center justify-center shrink-0">
                    <BrainCircuit className="w-4 h-4 text-mistral-navy" />
                  </div>
                  <div>
                    <h4 className="font-bold text-mistral-navy text-sm uppercase tracking-wide mb-1">Deep Thinking</h4>
                    <p className="text-sm text-mistral-navy/70 leading-relaxed">
                      We reject rote memorization. Our AI forces you to derive solutions from first principles, building true engineering muscle.
                    </p>
                  </div>
                </div>

                {/* Pillar 2 */}
                <div className="flex gap-4">
                  <div className="mt-1 w-8 h-8 bg-mistral-orange/10 rounded-lg flex items-center justify-center shrink-0">
                    <Terminal className="w-4 h-4 text-mistral-orange" />
                  </div>
                  <div>
                    <h4 className="font-bold text-mistral-navy text-sm uppercase tracking-wide mb-1">Developer Focused</h4>
                    <p className="text-sm text-mistral-navy/70 leading-relaxed">
                      Zero chaos. No distractions. A clean, focused environment designed specifically for engineers who want to build, not just study.
                    </p>
                  </div>
                </div>

                {/* Pillar 3 */}
                <div className="flex gap-4">
                  <div className="mt-1 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                    <Rocket className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-mistral-navy text-sm uppercase tracking-wide mb-1">Career Velocity</h4>
                    <p className="text-sm text-mistral-navy/70 leading-relaxed">
                      From "Hello World" to "Hired". We bridge the gap between academic theory and industry requirements with Resume & Internship support.
                    </p>
                  </div>
                </div>

              </div>
           </div>
        </div>

      </div>
    </section>
  );
}