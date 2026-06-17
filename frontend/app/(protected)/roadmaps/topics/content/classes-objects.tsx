"use client";
import React from "react";
import { WidgetRenderer } from "@/components/interactive/WidgetRenderer";
import { InteractiveWidget } from "@/lib/api";
import { CheckCircle2, Zap, Box, Layout, MousePointer2, GitBranch, Brain, Info } from "lucide-react";
import Link from "next/link";

interface TopicProps {
  widgets: InteractiveWidget[];
  userLanguage: string;
}

export default function ClassesObjectsTopic({ widgets, userLanguage }: TopicProps) {
  const findWidget = (id: string) => widgets.find(w => w.widget_id === id);

  return (
    <div className="space-y-16">
      {/* 1. The Definition */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Info className="w-8 h-8 text-mistral-navy/20" />
          <h2 className="font-serif text-4xl font-medium text-mistral-navy text-left">The Definition</h2>
        </div>
        
        <div className="prose prose-mistral max-w-none text-left">
          <p className="text-lg text-mistral-navy/70 leading-relaxed mb-8">
            Before we dive into analogies, let's define exactly what we are building. 
            <strong>Object-Oriented Programming (OOP)</strong> is a way of organizing code so that related data and actions stay together.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
            <div className="p-8 bg-white border border-mistral-navy/10 shadow-sm border-t-4 border-t-mistral-navy">
              <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-mistral-navy mb-4">The Class</h4>
              <p className="text-xs text-mistral-navy/60 leading-relaxed">
                A custom template or <strong>Template</strong> defined by you. It dictates what every object made from it will look like and what it will do.
              </p>
            </div>
            <div className="p-8 bg-white border border-mistral-navy/10 shadow-sm border-t-4 border-t-mistral-orange">
              <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-mistral-navy mb-4">The Object</h4>
              <p className="text-xs text-mistral-navy/60 leading-relaxed">
                A specific <strong>Instance</strong> created in the computer's memory. If the Class is the idea, the Object is the reality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Analogy */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">The Analogy: Blueprint vs. House</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="mb-8 text-mistral-navy/70 leading-relaxed">
            Imagine you want to build a neighborhood of 100 identical houses. You don't draw a new map for every single house. 
            Instead, you draw <strong>one blueprint</strong>.
          </p>

          <div className="flex flex-col md:flex-row gap-8 items-center mb-10">
            <div className="flex-1 p-8 bg-mistral-bg border border-dashed border-mistral-navy/20 rounded-lg text-center">
                <Layout className="w-12 h-12 text-mistral-navy/30 mx-auto mb-4" />
                <h5 className="font-sans font-bold text-sm text-mistral-navy uppercase tracking-widest mb-2">The Blueprint (Class)</h5>
                <p className="text-[11px] text-mistral-navy/40 italic">"Instructions: Must have 3 windows and 1 door."</p>
            </div>
            <div className="hidden md:block">
                <ArrowRightLeft className="w-6 h-6 text-mistral-orange opacity-20" />
            </div>
            <div className="flex-1 p-8 bg-white border border-mistral-navy/10 shadow-lg rounded-lg text-center">
                <Box className="w-12 h-12 text-mistral-orange mx-auto mb-4" />
                <h5 className="font-sans font-bold text-sm text-mistral-navy uppercase tracking-widest mb-2">The Real House (Object)</h5>
                <p className="text-[11px] text-mistral-navy/40 italic">A physical building standing at 123 Main St.</p>
            </div>
          </div>

          <WidgetRenderer widget={findWidget("cls-mcq-blueprint")} userLanguage={userLanguage} />
        </div>
      </section>

      {/* 3. Components */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left underline decoration-mistral-orange/20 underline-offset-8">Nouns & Verbs</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="mb-8">
            An object is like a container that holds two things: <strong>Variables</strong> (what it has) and <strong>Functions</strong> (what it does).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="p-8 bg-mistral-bg rounded-sm border border-mistral-navy/5">
                <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-mistral-navy mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-mistral-navy" /> Properties (Nouns)
                </h4>
                <ul className="text-xs text-mistral-navy/60 space-y-3 list-none p-0">
                    <li>• <code>health = 100</code></li>
                    <li>• <code>name = "Link"</code></li>
                    <li>• <code>is_alive = true</code></li>
                </ul>
            </div>
            <div className="p-8 bg-mistral-bg rounded-sm border border-mistral-navy/5">
                <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-mistral-navy mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-mistral-orange" /> Methods (Verbs)
                </h4>
                <ul className="text-xs text-mistral-navy/60 space-y-3 list-none p-0">
                    <li>• <code>jump()</code></li>
                    <li>• <code>take_damage()</code></li>
                    <li>• <code>speak()</code></li>
                </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Syntax & The Name Tag */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">The "Name Tag" Syntax</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="mb-6 leading-relaxed text-mistral-navy/70">
            Because one blueprint can make 1,000 objects, the computer needs a way for an object to talk about <strong>itself</strong>. 
            We use a special keyword called <code>this</code> (or <code>self</code> in Python) as an internal name tag.
          </p>
          
          <div className="my-10">
            <WidgetRenderer widget={findWidget("cls-syntax-tabs")} userLanguage={userLanguage} />
          </div>

          <div className="bg-amber-50 p-8 border-l-4 border-amber-400 mb-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-amber-800">
                <MousePointer2 className="w-5 h-5" />
                <h4 className="font-sans font-bold text-xs uppercase tracking-widest">How it works</h4>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed mb-4">
              When you call <code>mario.jump()</code>, the computer enters the <code>jump</code> function. 
              The keyword <code>this</code> (or <code>self</code>) automatically attaches itself to <code>mario</code>. 
              Inside the function, <code>this.name</code> literally becomes "Mario".
            </p>
          </div>

          <WidgetRenderer widget={findWidget("cls-mcq-this")} userLanguage={userLanguage} />
        </div>
      </section>

      {/* 5. DSA Relevance */}
      <section className="p-10 bg-mistral-navy text-white rounded-sm shadow-xl">
        <div className="flex items-center gap-3 mb-6 text-mistral-orange">
          <GitBranch className="w-8 h-8" />
          <h2 className="font-serif text-3xl font-medium text-white text-left">The Secret to DSA</h2>
        </div>
        
        <div className="prose prose-invert max-w-none text-left">
          <p className="text-white/70 leading-relaxed mb-8">
            Why are we learning this? Because simple arrays and variables can only represent simple lists. 
            To build complex structures like <strong>Linked Lists</strong>, <strong>Trees</strong>, or <strong>Graphs</strong>, we need "Custom Boxes".
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
                <h5 className="font-sans font-bold text-xs uppercase tracking-widest text-mistral-orange">The "Node" Box</h5>
                <p className="text-xs text-white/50 leading-relaxed">
                    Imagine a box that holds a number AND a string (a connection) to another box. 
                    You can't do this with a basic integer. You need a <strong>Class</strong>.
                </p>
            </div>
            <div className="p-6 bg-black/30 rounded font-mono text-xs border border-white/5">
                <span className="text-mistral-orange">class</span> <span className="text-emerald-400">Node</span> &#123;<br/>
                &nbsp;&nbsp;<span className="text-emerald-400">int</span> value;<br/>
                &nbsp;&nbsp;<span className="text-emerald-400">Node</span> next; <span className="text-white/20">// The connection!</span><br/>
                &#125;
            </div>
          </div>
        </div>
      </section>

      {/* Mastery Section */}
      <section className="pt-16 border-t border-mistral-navy/10">
        <div className="flex items-center gap-3 mb-8">
            <Brain className="w-6 h-6 text-mistral-orange" />
            <h3 className="font-sans font-bold text-xl text-mistral-navy uppercase tracking-widest">Mastery Sandbox</h3>
        </div>
        
        <div className="bg-white border border-mistral-navy/10 p-8 shadow-sm">
          <h4 className="font-sans font-bold text-sm text-mistral-navy mb-4 uppercase tracking-widest text-center">Challenge: The Hero's Vitality</h4>
          <p className="mb-8 text-center text-xs text-mistral-navy/60 italic leading-relaxed max-w-xl mx-auto">
            Below is a <code>Hero</code> blueprint. Your job is to add an action (Method) called <code>heal</code>. 
            Inside the action, use the "name tag" to increase the hero's health by 20. Then, build your hero and call the action!
          </p>
          <WidgetRenderer widget={findWidget("cls-practice-editor")} userLanguage={userLanguage} />
        </div>
      </section>

      {/* Final Navigation */}
      <section className="pt-12 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="font-mono text-xs text-mistral-navy/40 uppercase tracking-widest">Foundation Complete</span>
        </div>
        <Link href="/roadmaps/topics/architect-revision" className="px-12 py-4 bg-amber-500 text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-amber-600 transition-all shadow-[8px_8px_0px_0px_#d97706] flex items-center gap-3">
          Final Foundation Revision <Zap className="w-4 h-4 fill-current" />
        </Link>
      </section>
    </div>
  );
}

// Helper icons missing in imports
function ArrowRightLeft(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m16 3 4 4-4 4" />
        <path d="M20 7H4" />
        <path d="m8 21-4-4 4-4" />
        <path d="M4 17h16" />
      </svg>
    )
}
