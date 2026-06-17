"use client";
import React from "react";
import { WidgetRenderer } from "@/components/interactive/WidgetRenderer";
import { InteractiveWidget } from "@/lib/api";
import { CheckCircle2, Zap, Brain, Construction, Database, GitBranch, ArrowRight, ShieldCheck, FileCode, Layers, Code2 } from "lucide-react";
import Link from "next/link";

interface TopicProps {
  widgets: InteractiveWidget[];
  userLanguage: string;
}

export default function ArchitectRevisionTopic({ widgets, userLanguage }: TopicProps) {
  const findWidget = (id: string) => widgets.find(w => w.widget_id === id);

  return (
    <div className="space-y-32">
      {/* Hero Section */}
      <section className="bg-amber-500 p-12 -mx-6 -mt-12 text-white shadow-inner">
        <div className="flex items-center gap-4 mb-4">
            <Construction className="w-10 h-10" />
            <h1 className="font-serif text-5xl font-medium italic text-white drop-shadow-sm">Core Foundations Review</h1>
        </div>
        <p className="text-white/80 max-w-2xl text-lg leading-relaxed">
            Synthesizing Modules 1-9. We will review how <strong>Data, Logic, and Structure</strong> work together 
            to build functional software systems.
        </p>
      </section>

      {/* 1. COLLECTIONS */}
      <section>
        <div className="flex items-center gap-3 mb-12 pb-2 border-b-2 border-amber-500/20">
            <Database className="w-8 h-8 text-amber-500" />
            <h2 className="font-serif text-4xl font-medium text-mistral-navy">1. Collections (The Warehouse)</h2>
        </div>
        
        <div className="space-y-12">
          {/* Analysis Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-8 border border-mistral-navy/5 shadow-sm border-t-4 border-t-amber-500">
                <h4 className="font-sans font-bold text-[10px] uppercase tracking-widest text-amber-600 mb-4">WHY?</h4>
                <p className="text-sm text-mistral-navy/70 leading-relaxed">
                    If you have 500 hospital patients, defining <code>p1, p2, p3...</code> manually is impossible. 
                    You need a <strong>Warehouse</strong> (Collection) so you can manage everyone using a single <strong>Loop</strong>.
                </p>
            </div>
            <div className="bg-white p-8 border border-mistral-navy/5 shadow-sm border-t-4 border-t-mistral-navy">
                <h4 className="font-sans font-bold text-[10px] uppercase tracking-widest text-mistral-navy/40 mb-4">WHAT?</h4>
                <p className="text-sm text-mistral-navy/70 leading-relaxed">
                    Tools like <strong>Arrays</strong> (fixed size) and <strong>Lists/Vectors</strong> (dynamic size) that store multiple 
                    pieces of data in a single variable.
                </p>
            </div>
            <div className="bg-white p-8 border border-mistral-navy/5 shadow-sm border-t-4 border-t-emerald-500">
                <h4 className="font-sans font-bold text-[10px] uppercase tracking-widest text-emerald-600 mb-4">WHERE in DSA?</h4>
                <p className="text-sm text-mistral-navy/70 leading-relaxed">
                    Foundation for <strong>Stacks, Queues</strong>, and the secret to <strong>O(1) instant lookup</strong> using HashMaps.
                </p>
            </div>
          </div>

          {/* Interactive Section - NOW BELOW */}
          <div className="space-y-10 bg-mistral-bg/30 p-10 rounded-sm border border-mistral-navy/5">
            <div className="max-w-6xl mx-auto">
                <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-mistral-navy/40 mb-4 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-mistral-orange" /> HOW? (Syntax Clarity)
                </h4>
                <p className="text-sm text-mistral-navy/60 mb-8 italic">
                    Observe how different languages handle memory. Fixed arrays are faster but rigid, while dynamic lists grow as you add data.
                </p>
                <div className="space-y-16">
                    <WidgetRenderer widget={findWidget("arch-syntax-coll")} userLanguage={userLanguage} debugId="arch-syntax-coll" />
                    <WidgetRenderer widget={findWidget("arch-mcq-coll-why")} userLanguage={userLanguage} debugId="arch-mcq-coll-why" />
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FUNCTIONS */}
      <section>
        <div className="flex items-center gap-3 mb-12 pb-2 border-b-2 border-amber-500/20">
            <Layers className="w-8 h-8 text-amber-500" />
            <h2 className="font-serif text-4xl font-medium text-mistral-navy">2. Functions (The Transformer)</h2>
        </div>
        
        <div className="space-y-12">
          {/* Analysis Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-8 border border-mistral-navy/5 shadow-sm border-t-4 border-t-amber-500">
                <h4 className="font-sans font-bold text-[10px] uppercase tracking-widest text-amber-600 mb-4">WHY?</h4>
                <p className="text-sm text-mistral-navy/70 leading-relaxed">
                    To avoid <strong>Copy-Paste</strong> coding. If your tax logic changes, you update one function instead of 50 different places.
                </p>
            </div>
            <div className="bg-white p-8 border border-mistral-navy/5 shadow-sm border-t-4 border-t-mistral-navy">
                <h4 className="font-sans font-bold text-[10px] uppercase tracking-widest text-mistral-navy/40 mb-4">WHAT?</h4>
                <p className="text-sm text-mistral-navy/70 leading-relaxed">
                    A block of code with a <strong>Contract</strong>. <code>void</code> is a task with no result (Printer), 
                    while <code>return</code> hands back data (ATM).
                </p>
            </div>
            <div className="bg-white p-8 border border-mistral-navy/5 shadow-sm border-t-4 border-t-emerald-500">
                <h4 className="font-sans font-bold text-[10px] uppercase tracking-widest text-emerald-600 mb-4">WHERE in DSA?</h4>
                <p className="text-sm text-mistral-navy/70 leading-relaxed">
                    Critical for <strong>Recursion</strong>—where functions call themselves to solve complex problems like Sorting and Tree traversal.
                </p>
            </div>
          </div>

          {/* Interactive Section - NOW BELOW */}
          <div className="space-y-10 bg-mistral-bg/30 p-10 rounded-sm border border-mistral-navy/5">
            <div className="max-w-6xl mx-auto">
                <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-mistral-navy/40 mb-4 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-mistral-orange" /> HOW? (Syntax Clarity)
                </h4>
                <p className="text-sm text-mistral-navy/60 mb-8 italic">
                    The return type is a promise to the caller. Understanding "void" vs "return" is the first step to clean data flow.
                </p>
                <div className="space-y-16">
                    <WidgetRenderer widget={findWidget("arch-syntax-func")} userLanguage={userLanguage} debugId="arch-syntax-func" />
                    <WidgetRenderer widget={findWidget("arch-mcq-func-void")} userLanguage={userLanguage} debugId="arch-mcq-func-void" />
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CLASSES */}
      <section>
        <div className="flex items-center gap-3 mb-12 pb-2 border-b-2 border-amber-500/20">
            <GitBranch className="w-8 h-8 text-amber-500" />
            <h2 className="font-serif text-4xl font-medium text-mistral-navy">3. Classes & Objects (The Blueprint)</h2>
        </div>
        
        <div className="space-y-12">
          {/* Analysis Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-8 border border-mistral-navy/5 shadow-sm border-t-4 border-t-amber-500">
                <h4 className="font-sans font-bold text-[10px] uppercase tracking-widest text-amber-600 mb-4">WHY?</h4>
                <p className="text-sm text-mistral-navy/70 leading-relaxed">
                    To model the real world. A "User" is more than just a name; it's a bundle of data (email, password) 
                    and actions (<code>login()</code>).
                </p>
            </div>
            <div className="bg-white p-8 border border-mistral-navy/5 shadow-sm border-t-4 border-t-mistral-navy">
                <h4 className="font-sans font-bold text-[10px] uppercase tracking-widest text-mistral-navy/40 mb-4">WHAT?</h4>
                <p className="text-sm text-mistral-navy/70 leading-relaxed">
                    A <strong>Class</strong> is the plan. An <strong>Object</strong> is the real thing built in memory. 
                    The <strong>Constructor</strong> is the builder function.
                </p>
            </div>
            <div className="bg-white p-8 border border-mistral-navy/5 shadow-sm border-t-4 border-t-emerald-500">
                <h4 className="font-sans font-bold text-[10px] uppercase tracking-widest text-emerald-600 mb-4">WHERE in DSA?</h4>
                <p className="text-sm text-mistral-navy/70 leading-relaxed">
                    The <strong>Node Box</strong>. This is how we build Linked Lists, Trees, and Graphs—by chaining custom objects together.
                </p>
            </div>
          </div>

          {/* Interactive Section - NOW BELOW */}
          <div className="space-y-10 bg-mistral-bg/30 p-10 rounded-sm border border-mistral-navy/5">
            <div className="max-w-6xl mx-auto">
                <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-mistral-navy/40 mb-4 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-mistral-orange" /> HOW? (Syntax Clarity)
                </h4>
                <p className="text-sm text-mistral-navy/60 mb-8 italic">
                    The constructor (init) is what brings the object to life. Master how to initialize data inside your custom blueprints.
                </p>
                <div className="space-y-16">
                    <WidgetRenderer widget={findWidget("arch-syntax-class")} userLanguage={userLanguage} debugId="arch-syntax-class" />
                    <WidgetRenderer widget={findWidget("arch-mcq-node")} userLanguage={userLanguage} debugId="arch-mcq-node" />
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Synthesis Challenges */}
      <section className="pt-20 border-t-2 border-mistral-navy/5">
        <div className="flex flex-col items-center gap-4 mb-16">
            <Brain className="w-12 h-12 text-amber-500" />
            <h3 className="font-serif text-5xl text-mistral-navy italic text-center">Synthesis Challenges</h3>
            <p className="text-mistral-navy/40 font-mono text-xs uppercase tracking-[0.2em] text-center">Testing the Architect's Mind</p>
        </div>

        <div className="space-y-32">
            <div className="relative group max-w-5xl mx-auto">
                <div className="flex items-start justify-between mb-8 border-l-4 border-amber-500 pl-6">
                    <div>
                        <h4 className="font-serif text-3xl text-mistral-navy mb-2 font-medium">Challenge 1: The Library Manager</h4>
                        <p className="text-[10px] text-mistral-navy/40 uppercase tracking-widest font-mono">Scope: Collections + Functions + Classes</p>
                    </div>
                    <ShieldCheck className="w-10 h-10 text-amber-500/20 group-hover:text-amber-500 transition-all shrink-0" />
                </div>
                <p className="text-sm text-mistral-navy/70 leading-relaxed mb-10 italic max-w-3xl">
                    This challenge brings everything together. You will use a <strong>Class</strong> to define a book, 
                    a <strong>Collection</strong> to store your library, and a <strong>Function</strong> to search for titles.
                </p>
                <WidgetRenderer widget={findWidget("arch-sandbox-library")} userLanguage={userLanguage} debugId="arch-sandbox-library" />
            </div>

            <div className="relative group max-w-5xl mx-auto">
                <div className="flex items-start justify-between mb-8 border-l-4 border-amber-500 pl-6">
                    <div>
                        <h4 className="font-serif text-3xl text-mistral-navy mb-2 font-medium">Challenge 2: The Chain Architect</h4>
                        <p className="text-[10px] text-mistral-navy/40 uppercase tracking-widest font-mono">Scope: Classes + Memory Pointers</p>
                    </div>
                    <GitBranch className="w-10 h-10 text-amber-500/20 group-hover:text-amber-500 transition-all shrink-0" />
                </div>
                <p className="text-sm text-mistral-navy/70 leading-relaxed mb-10 italic max-w-3xl">
                    The birth of a Linked List. Create two custom objects and "Link" them together using memory pointers. 
                    This is your first step into advanced data structures.
                </p>
                <WidgetRenderer widget={findWidget("arch-sandbox-node")} userLanguage={userLanguage} debugId="arch-sandbox-node" />
            </div>
        </div>
      </section>

      {/* Completion */}
      <section className="pt-16 flex flex-col items-center pb-32">
        <div className="flex items-center gap-2 mb-8">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            <span className="font-mono text-base text-mistral-navy/40 uppercase tracking-widest font-bold">Foundation Sequence Complete</span>
        </div>
        <div className="p-16 bg-mistral-navy text-white rounded-sm text-center max-w-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-amber-500 opacity-5 pointer-events-none" />
            <h4 className="font-serif text-4xl mb-8 italic text-amber-500">Foundations Complete.</h4>
            <p className="text-lg text-white/70 leading-relaxed mb-12 italic px-12">
                You have mastered the core pillars of programming: Variables, Control Flow, Loops, Functions, and Classes. 
                You are now ready to apply these concepts to advanced data structures and algorithms.
                <br/><br/>
                Next Stage: <strong>Algorithmic Complexity & Big O.</strong>
            </p>
            <Link href="/roadmaps/programming-foundations" className="inline-flex items-center gap-4 px-16 py-6 bg-amber-500 text-white font-mono text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-mistral-navy transition-all shadow-lg transform hover:-translate-y-1">
                Return to Roadmap <ArrowRight className="w-6 h-6" />
            </Link>
        </div>
      </section>
    </div>
  );
}
