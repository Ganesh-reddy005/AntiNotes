"use client";
import React from "react";
import { WidgetRenderer } from "@/components/interactive/WidgetRenderer";
import { InteractiveWidget } from "@/lib/api";
import { CheckCircle2, Zap, Brain, Rocket, Trophy, Target, ArrowRight } from "lucide-react";
import Link from "next/link";

interface TopicProps {
  widgets: InteractiveWidget[];
  userLanguage: string;
}

export default function FoundationRevisionTopic({ widgets, userLanguage }: TopicProps) {
  const findWidget = (id: string) => widgets.find(w => w.widget_id === id);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-amber-500 p-12 -mx-6 -mt-12 text-white shadow-inner">
        <div className="flex items-center gap-4 mb-4">
            <Trophy className="w-10 h-10" />
            <h1 className="font-serif text-5xl font-medium italic text-white drop-shadow-sm">Mastery Milestone</h1>
        </div>
        <p className="text-white/80 max-w-2xl text-lg leading-relaxed">
            You've built the foundation. Now, let's verify your strength before we move into the advanced world of Collections and Classes.
        </p>
      </section>

      {/* 1. Basics & I/O */}
      <section>
        <div className="flex items-center gap-3 mb-6">
            <Rocket className="w-8 h-8 text-amber-500" />
            <h2 className="font-serif text-3xl font-medium text-mistral-navy">The Launchpad: I/O & Variables</h2>
        </div>
        <WidgetRenderer widget={findWidget("rev-mcq-1")} userLanguage={userLanguage} />
      </section>

      {/* 2. Logic & Control */}
      <section>
        <div className="flex items-center gap-3 mb-6">
            <Target className="w-8 h-8 text-amber-500" />
            <h2 className="font-serif text-3xl font-medium text-mistral-navy">Precision: Logic & Control Flow</h2>
        </div>
        <WidgetRenderer widget={findWidget("rev-mcq-2")} userLanguage={userLanguage} />
      </section>

      {/* 3. Loops */}
      <section>
        <div className="flex items-center gap-3 mb-6">
            <Zap className="w-8 h-8 text-amber-500" />
            <h2 className="font-serif text-3xl font-medium text-mistral-navy">Power: Loops & Iteration</h2>
        </div>
        <WidgetRenderer widget={findWidget("rev-mcq-3")} userLanguage={userLanguage} />
      </section>

      {/* Synthesis Challenge */}
      <section className="pt-16 border-t border-amber-500/20">
        <div className="flex items-center gap-3 mb-8">
            <Brain className="w-8 h-8 text-amber-500" />
            <h3 className="font-sans font-bold text-2xl text-mistral-navy uppercase tracking-widest">Mastery Sandbox</h3>
        </div>
        <WidgetRenderer widget={findWidget("rev-practice-editor")} userLanguage={userLanguage} />
      </section>

      {/* Completion */}
      <section className="pt-12 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            <span className="font-mono text-sm text-mistral-navy/40 uppercase tracking-widest">Foundation Level 1 Complete</span>
        </div>
        <Link href="/roadmaps/topics/collections" className="px-12 py-4 bg-mistral-navy text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-mistral-orange transition-all shadow-[8px_8px_0px_0px_rgba(15,23,42,0.1)] flex items-center gap-3">
          Level Up: Collections <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
