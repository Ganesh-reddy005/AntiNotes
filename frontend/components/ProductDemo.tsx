"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileCode2, 
  Bot, 
  LineChart, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Terminal,
  Target,
  Zap,
  Calendar,
  TrendingDown,
  MoreHorizontal,
  Info,
  History
} from "lucide-react";

export default function ProductDemo() {
  const [activeTab, setActiveTab] = useState<"ide" | "agent" | "stats">("ide");

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 border-y border-mistral-navy/5 bg-mistral-bg">
      
      {/* Header */}
      <div className="text-center mb-8 md:mb-12">
        <h2 className="font-serif text-3xl md:text-4xl text-mistral-navy mb-4">
          The <span className="text-mistral-orange italic">Antinotes</span> Workflow
        </h2>
        <p className="font-sans text-sm md:text-base text-mistral-navy/60">
          From writing code to mastering logic. See how it works.
        </p>
      </div>

      {/* The "App" Container (Glassmorphic) */}
      {/* FIX: Changed h-auto to h-[850px] on mobile to prevent collapse */}
      <div className="max-w-6xl mx-auto bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_-15px_rgba(15,23,42,0.1)] border border-mistral-navy/10 flex flex-col md:flex-row h-[850px] md:h-[700px] overflow-hidden">
        
        {/* --- SIDEBAR NAVIGATION --- */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-mistral-navy/5 flex flex-col p-4 gap-2 bg-mistral-navy/5 shrink-0 h-auto md:h-full z-20 relative">
          
          {/* BRANDED WINDOW CONTROLS */}
          <div className="flex gap-4 items-center mb-4 md:mb-8 px-2 pt-2">
            <div className="grid grid-cols-2 gap-1">
              <div className="w-3 h-3 bg-[#0f172a] shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]"></div>
              <div className="w-3 h-3 bg-[#f97316] shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]"></div>
              <div className="w-3 h-3 bg-[#94a3b8] shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]"></div>
              <div className="w-3 h-3 bg-[#fce7f3] shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]"></div>
            </div>
            <span className="font-mono text-xs font-bold text-mistral-navy/40 tracking-widest uppercase">
              Antinotes_OS
            </span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
            {[
              { id: "ide", icon: FileCode2, label: "1. The Problem" },
              { id: "agent", icon: Bot, label: "2. Agent Review" },
              { id: "stats", icon: LineChart, label: "3. Growth Data" },
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? "bg-white shadow-sm ring-1 ring-mistral-navy/5 text-mistral-navy border-b-4 md:border-b-0 md:border-l-4 border-mistral-orange" 
                    : "text-mistral-navy/60 hover:bg-white/50 hover:text-mistral-navy"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-mistral-orange" : "text-current"}`} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        {/* FIX: Flex-1 ensures it fills the remaining height of the 850px container */}
        <div className="flex-1 relative bg-transparent font-mono text-sm overflow-hidden h-full">
          <AnimatePresence mode="wait">
            
            {/* VIEW 1: THE IDE */}
            {activeTab === "ide" && (
              <motion.div 
                key="ide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col h-full"
              >
                {/* Top Bar */}
                <div className="h-12 border-b border-mistral-navy/5 flex items-center justify-between px-4 md:px-6 bg-white/40 shrink-0">
                  <div className="flex items-center gap-2 text-mistral-navy/60">
                    <Terminal className="w-4 h-4 text-mistral-orange" />
                    <span className="font-sans font-medium text-xs md:text-sm truncate">Workspace // Invert_Binary_Tree</span>
                  </div>
                  <button 
                    onClick={() => setActiveTab("agent")}
                    className="flex items-center gap-2 bg-mistral-navy hover:bg-mistral-navy/90 text-white px-3 md:px-4 py-1.5 text-xs font-bold transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,0.2)] active:shadow-none active:translate-y-[1px]"
                  >
                    <Play className="w-3 h-3 fill-current" /> Run_Check
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
                  {/* LEFT: THE QUESTION */}
                  <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-mistral-navy/5 bg-white/30 flex flex-col h-1/2 md:h-full">
                    <div className="p-6 overflow-y-auto prose prose-sm max-w-none custom-scrollbar">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xl md:text-2xl font-bold text-mistral-navy m-0 font-serif">Invert Binary Tree</h4>
                        <span className="px-2 py-1 text-[10px] font-bold bg-mistral-orange/10 text-mistral-orange border border-mistral-orange/20 uppercase tracking-widest">
                          Easy
                        </span>
                      </div>
                      <p className="text-mistral-navy/70 leading-relaxed mb-4 font-sans text-sm md:text-base">
                        Given the <code className="text-xs bg-mistral-navy/5 px-1 py-0.5 border border-mistral-navy/10 text-mistral-navy">root</code> of a binary tree, invert the tree, and return its root.
                      </p>
                    </div>
                  </div>

                  {/* RIGHT: THE CODE EDITOR */}
                  <div className="w-full md:w-1/2 bg-[#0f172a] flex flex-col text-[#e2e8f0] h-1/2 md:h-full">
                    <div className="flex-1 p-4 overflow-y-auto font-mono text-xs md:text-sm leading-relaxed custom-scrollbar">
                       <div className="flex">
                        <div className="flex flex-col text-right pr-4 text-slate-600 select-none">
                          {Array.from({length: 12}).map((_, i) => <span key={i}>{i+1}</span>)}
                        </div>
                        <div className="text-slate-300">
                          <div><span className="text-purple-400">class</span> <span className="text-yellow-200">Solution</span>:</div>
                          <div className="pl-4">
                            <span className="text-blue-400">def</span> <span className="text-yellow-200">invertTree</span>(self, root):
                          </div>
                          <div className="pl-8 text-slate-500 italic"># Antinotes: Focus on Base Case</div>
                          <div className="pl-8"><span className="text-purple-400">if not</span> root:</div>
                          <div className="pl-12"><span className="text-purple-400">return</span> None</div>
                          <div className="pl-8 mt-2 text-slate-500"># Swap children</div>
                          <div className="pl-8">root.left, root.right = root.right, root.left</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

{/* VIEW 2: THE AGENT REVIEW */}
{activeTab === "agent" && (
              <motion.div 
                key="agent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col overflow-y-auto custom-scrollbar h-full"
              >
                 {/* DEMO BANNER */}
                 <div className="bg-mistral-orange/10 border-b border-mistral-orange/20 py-2 px-4 flex items-center justify-center gap-2 shrink-0">
                    <Info className="w-3 h-3 text-mistral-orange" />
                    <span className="text-[10px] md:text-xs font-bold text-mistral-orange uppercase tracking-widest text-center">
                        Interactive Demo Preview • Socratic Mode Active
                    </span>
                 </div>

                 {/* AGENT HEADER: Visualizing the Multi-Agent Flow */}
                 <div className="bg-[#0f172a] p-6 border-b border-slate-800 text-white shrink-0">
                    
                    {/* The Agent Pipeline Visualization */}
                    <div className="flex flex-wrap items-center gap-2 text-[10px] md:text-xs font-mono text-slate-400 mb-4 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded border border-white/5">
                            <Bot className="w-3 h-3 text-emerald-400" /> Profile Agent
                        </span>
                        <span className="text-slate-600">→</span>
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-white/10 rounded text-white font-bold border border-mistral-orange/50 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
                            <Terminal className="w-3 h-3 text-mistral-orange" /> Reviewer
                        </span>
                        <span className="text-slate-600">→</span>
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded border border-white/5">
                            <History className="w-3 h-3 text-purple-400" /> Background
                        </span>
                    </div>

                    <div className="flex justify-between items-end">
                         <div>
                            <h3 className="text-lg md:text-xl font-serif text-white">Code Review</h3>
                            <p className="text-xs md:text-sm text-slate-400 mt-1">
                                Context: <span className="text-slate-200">Production Engineering Path</span>
                            </p>
                         </div>
                         <div className="text-right">
                             <span className="text-3xl md:text-4xl font-serif text-mistral-orange">85</span>
                             <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Logic Score</p>
                         </div>
                    </div>
                 </div>

                 <div className="p-6 md:p-8 space-y-6 bg-white/40">
                    
                    {/* 1. THE SOCRATIC AGENT (Questions, not answers) */}
                    <div className="bg-white border border-mistral-navy/5 p-6 shadow-sm border-l-4 border-l-emerald-500">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-emerald-50 rounded-lg shrink-0">
                                <Bot className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-mistral-navy uppercase tracking-wider mb-2">
                                    Socratic Inquiry
                                </h4>
                                <p className="text-sm text-mistral-navy/80 italic leading-relaxed">
                                    "I noticed you used a recursive approach. If this code runs on a system with limited stack memory (like an embedded device) and the tree depth hits 10,000, <b>what happens to the application state?</b>"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 2. PRODUCTION CHAOS (Simulating Reality) */}
                    <div className="bg-white border border-mistral-navy/5 p-6 shadow-sm border-l-4 border-l-mistral-orange">
                         <div className="flex items-start gap-4">
                            <div className="p-2 bg-orange-50 rounded-lg shrink-0">
                                <Zap className="w-5 h-5 text-mistral-orange" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-mistral-navy uppercase tracking-wider mb-3">
                                    Production Chaos Simulation
                                </h4>
                                <div className="p-3 bg-mistral-navy/5 rounded border border-mistral-navy/10 mb-3 font-mono text-xs">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                        <span className="text-red-600 font-bold">ALERT:</span> 
                                        <span className="text-mistral-navy">Data migration increased tree depth by 500%.</span>
                                    </div>
                                    <div className="text-slate-500 pl-4">
                                        &gt; RecursionError: maximum recursion depth exceeded.
                                    </div>
                                </div>
                                <p className="text-sm text-mistral-navy/70">
                                    <b>New Requirement:</b> Refactor this to use an Iterative Approach (Queue) to handle the data spike without crashing.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 3. THINKING STYLE & SUMMARY */}
                    <div className="bg-white border border-mistral-navy/5 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Target className="w-4 h-4 text-purple-500" />
                            <h4 className="text-sm font-bold text-mistral-navy uppercase tracking-wider">
                                Thinking Style Analysis
                            </h4>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="text-sm text-mistral-navy/80">
                                <span className="block text-[10px] font-bold text-emerald-600 mb-1 uppercase">Observed Strength</span>
                                <p>You prioritize readability. Your base cases are clean and handle edge cases (null roots) well.</p>
                            </div>
                            <div className="text-sm text-mistral-navy/80">
                                <span className="block text-[10px] font-bold text-mistral-orange mb-1 uppercase">Blind Spot</span>
                                <p>You default to <b>Recursive Patterns</b> even when constraints suggest high-scale data. We will practice 3 Iterative problems next.</p>
                            </div>
                        </div>
                    </div>

                 </div>
              </motion.div>
            )}

            {/* VIEW 3: GROWTH STATS */}
            {activeTab === "stats" && (
              <motion.div 
                key="stats"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 p-6 md:p-8 overflow-y-auto custom-scrollbar h-full"
              >
                 {/* Header */}
                 <div className="flex justify-between items-end mb-8 pb-6 border-b border-mistral-navy/10">
                     <div>
                        <h3 className="font-serif text-2xl text-mistral-navy">Engineering Profile</h3>
                        <p className="text-xs text-mistral-navy/40 font-mono mt-1 uppercase tracking-wide">Generated by Background Agent</p>
                     </div>
                 </div>

                 {/* Metrics */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
                    {[
                        { icon: Target, label: "Logic Elo", value: "1,450", change: "+12", trend: "up" },
                        { icon: Zap, label: "Retention", value: "94%", change: "stable", trend: "flat" },
                        { icon: Calendar, label: "Streak", value: "12 Days", change: "Best", trend: "up" }
                    ].map((metric, i) => (
                        <div key={i} className="p-5 bg-white border border-mistral-navy/5 shadow-sm flex items-center justify-between md:block">
                            <div>
                                <div className="flex items-center gap-2 text-mistral-navy/40 mb-1 md:mb-3 text-[10px] uppercase tracking-widest font-bold">
                                    <metric.icon className="w-3 h-3" /> {metric.label}
                                </div>
                                <span className="text-2xl md:text-3xl font-serif text-mistral-navy">{metric.value}</span>
                            </div>
                            
                            {metric.trend === "up" && (
                                <div className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 border border-emerald-100 font-mono">
                                    {metric.change}
                                </div>
                            )}
                        </div>
                    ))}
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Adaptive Analysis */}
                     <div className="space-y-6">
                        <h4 className="flex items-center gap-2 font-serif text-lg text-mistral-navy">
                           <MoreHorizontal className="w-4 h-4 text-mistral-orange" /> Adaptive Analysis
                        </h4>
                        
                        <div className="group p-5 bg-white border border-l-4 border-l-mistral-orange border-y-mistral-navy/5 border-r-mistral-navy/5 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[10px] font-bold text-mistral-orange bg-mistral-orange/10 px-2 py-1 uppercase tracking-wide">
                                    Critical Weakness
                                </span>
                                <TrendingDown className="w-4 h-4 text-mistral-orange" />
                            </div>
                            <h5 className="font-bold text-mistral-navy mt-2 text-sm">Graph Traversal</h5>
                            <p className="text-xs text-mistral-navy/60 mt-2 mb-4 leading-relaxed">
                                Struggled with "Cycle Detection" recently.
                            </p>
                        </div>
                     </div>

                     {/* Memory Queue */}
                     <div className="pb-8">
                        <h4 className="flex items-center gap-2 font-serif text-lg text-mistral-navy mb-6">
                           <History className="w-4 h-4 text-mistral-navy/40" /> Memory Queue
                        </h4>
                        
                        <div className="space-y-3">
                            <div className="p-4 bg-white border border-mistral-navy/10 flex flex-col gap-3 shadow-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-mistral-navy">LRU Cache Design</span>
                                    <span className="text-[10px] font-bold text-mistral-orange border border-mistral-orange/20 px-2 py-1 uppercase">Forgetting Soon</span>
                                </div>
                                <div className="w-full h-1.5 bg-mistral-navy/5 overflow-hidden">
                                     <div className="h-full bg-mistral-orange w-[20%]" />
                                </div>
                            </div>
                        </div>
                     </div>
                 </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}