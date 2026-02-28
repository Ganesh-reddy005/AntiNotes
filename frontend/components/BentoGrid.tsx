"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Clock, Zap, Search, Terminal, ArrowRight } from "lucide-react";

// --- DATA ---
const features = [
  {
    id: 0,
    number: "01", // Replaced icon with Number
    title: "Adaptive Difficulty",
    // Kept the main icon for the LEFT side text area, but removed from card
    icon: <Brain className="w-5 h-5 md:w-6 md:h-6" />,
    short: "AI scans logic gaps.",
    long: "We use a Knowledge Graph to map 450+ DSA concepts. If you fail a 'Tree' problem, we don't just give you the answer. We dynamically queue up 3 prerequisite 'Linked List' problems to fix your foundational gap first.",
    color: "text-mistral-orange",
    bg: "bg-mistral-orange/10",
    border: "border-mistral-orange"
  },
  {
    id: 1,
    number: "02",
    title: "Spaced Repetition",
    icon: <Clock className="w-5 h-5 md:w-6 md:h-6" />,
    short: "Tracks memory fade.",
    long: "Based on the Ebbinghaus Forgetting Curve, our algorithm calculates the 'Half-Life' of every problem you solve. If you solved 'LRU Cache' today, we will force a review in 3 days, then 7 days—ensuring it sticks.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500"
  },
  {
    id: 2,
    number: "03",
    title: "Logic Score",
    icon: <Zap className="w-5 h-5 md:w-6 md:h-6" />,
    short: "Grades efficiency.",
    long: "Your code is run against 50+ hidden test cases and analyzed by an LLM for 'Clean Code' principles. You get a breakdown: 90% for Time Complexity, but only 40% for Variable Naming.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500"
  },
  {
    id: 3,
    number: "04",
    title: "The Socratic Engine",
    icon: <Search className="w-5 h-5 md:w-6 md:h-6" />,
    short: "Don't memorize. Derive.",
    long: "We never give you the answer. If you get stuck, the AI asks specific, guiding questions—'What happens to the pointer if the list is empty?'—forcing you to derive the logic yourself and build real intuition.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500"
  }
];

export default function BentoGrid() {
  const [activeId, setActiveId] = useState<number>(0);

  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center overflow-hidden">
      
      {/* --- BACKGROUND ACCENTS --- */}
      <div className="absolute top-1/2 right-[-20%] w-[800px] h-[800px] bg-mistral-navy/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

      {/* --- LEFT SIDE: STATIC CONTENT --- */}
      <div className="w-full md:w-1/2 relative z-10 pr-0 md:pr-12 mb-8 md:mb-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 md:mb-12 text-center md:text-left"
        >
           <h2 className="font-serif text-4xl md:text-6xl text-mistral-navy mb-4 md:mb-6 leading-[0.95]">
            Engineered for <br/>
            <span className="italic text-mistral-orange">Retention</span>.
          </h2>
          <p className="font-sans text-base md:text-lg text-mistral-navy/60 max-w-md mx-auto md:mx-0">
            Most platforms measure how many problems you solve. We measure how much you actually understand.
          </p>
        </motion.div>

        {/* Dynamic Text Area (The Reveal) */}
        <div className="min-h-[220px] md:min-h-[250px] relative">
          <AnimatePresence mode="wait">
            {features.map((feature) => (
              feature.id === activeId && (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 md:space-y-6"
                >
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    {/* Kept icon here for context on left side */}
                    <div className={`p-2 rounded-lg ${feature.bg} ${feature.color} shadow-sm`}>
                      {feature.icon}
                    </div>
                    <h3 className="font-mono text-lg md:text-xl font-bold text-mistral-navy uppercase tracking-tight">
                      {feature.title}
                    </h3>
                  </div>
                  
                  <p className="font-serif text-xl md:text-2xl text-mistral-navy leading-snug text-center md:text-left">
                    {feature.long}
                  </p>
                  
                  <div className="flex justify-center md:justify-start">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-mistral-orange uppercase tracking-widest cursor-pointer group w-fit">
                        <Terminal className="w-3 h-3" />
                        <span className="border-b border-transparent group-hover:border-mistral-orange transition-all">Try Logic Demo</span>
                    </div>
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* --- MOBILE LAYOUT: 2x2 GRID (Visible only on < md) --- */}
      <div className="w-full mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
        {features.map((feature) => (
            <button
                key={feature.id}
                onClick={() => setActiveId(feature.id)}
                className={`
                    p-4 rounded-xl border text-left transition-all duration-200
                    flex items-center gap-3
                    ${activeId === feature.id 
                        ? `bg-white border-mistral-orange shadow-md scale-[1.02]` 
                        : "bg-white/50 border-gray-200 hover:bg-white"
                    }
                `}
            >
                {/* Number Badge for Mobile */}
                <div className={`w-8 h-8 flex items-center justify-center rounded-lg font-mono font-bold text-sm ${feature.bg} ${feature.color} shrink-0`}>
                    {feature.number}
                </div>
                <div>
                    <h4 className={`font-serif text-sm font-bold ${activeId === feature.id ? "text-mistral-navy" : "text-mistral-navy/70"}`}>
                        {feature.title}
                    </h4>
                </div>
            </button>
        ))}
      </div>

      {/* --- DESKTOP LAYOUT: ROTATING WHEEL (Visible only on >= md) --- */}
      <div className="hidden md:flex w-1/2 h-[600px] relative items-center justify-end overflow-visible">
        
        {/* The Pivot Container (Invisible) */}
        <div className="absolute right-[-350px] top-1/2 -translate-y-1/2 w-[600px] h-[600px] flex items-center justify-center">
            
            {features.map((feature, index) => {
               // --- MATH FOR THE WHEEL ---
               const indexDiff = index - activeId;
               const thetaDegree = 180 + (indexDiff * 25);
               const thetaRad = (thetaDegree * Math.PI) / 180;
               const radius = 450; 
               const x = radius * Math.cos(thetaRad);
               const y = radius * Math.sin(thetaRad);
               const rotateCard = indexDiff * 25;

               return (
                  <motion.button
                    key={feature.id}
                    onClick={() => setActiveId(feature.id)}
                    animate={{ 
                        x, 
                        y, 
                        rotate: rotateCard, 
                        opacity: activeId === index ? 1 : 0.4,
                        scale: activeId === index ? 1 : 0.9
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className={`
                        absolute
                        w-[280px] p-5 rounded-2xl border text-left
                        backdrop-blur-md transition-all duration-200
                        flex flex-col gap-2 shadow-lg cursor-pointer
                        ${activeId === feature.id 
                            ? `bg-white/95 ${feature.border} shadow-[4px_4px_0px_0px_rgba(15,23,42,0.1)] z-20 ring-1 ring-mistral-navy/5` 
                            : "bg-white/40 border-white/50 hover:bg-white/70 hover:opacity-80 z-10"
                        }
                    `}
                    style={{ left: '50%', top: '50%', marginLeft: '-140px', marginTop: '-60px' }} 
                  >
                    <div className="flex items-center justify-between w-full">
                       {/* THE BIG NUMBER REPLACEMENT */}
                       <span className={`text-4xl font-serif font-bold italic opacity-30 ${feature.color}`}>
                         {feature.number}
                       </span>
                       
                       {activeId === feature.id && (
                           <ArrowRight className={`w-4 h-4 ${feature.color}`} />
                       )}
                    </div>

                    <div>
                        <h4 className={`font-serif text-lg ${activeId === feature.id ? "text-mistral-navy" : "text-mistral-navy/60"}`}>
                            {feature.title}
                        </h4>
                        <p className="text-xs font-sans text-mistral-navy/40 mt-1">
                            {feature.short}
                        </p>
                    </div>

                  </motion.button>
               );
            })}
        </div>
      </div>

    </section>
  );
}