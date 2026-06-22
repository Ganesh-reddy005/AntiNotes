"use client";
import React from "react";
import Link from "next/link";
import { MCQQuiz } from "@/components/interactive/MCQQuiz";
import { GraduationCap, Rocket, Target, Zap, CheckCircle2, ArrowRight } from "lucide-react";

interface TopicProps {
  userLanguage: string;
}

export default function FoundationsIntroTopic({ userLanguage }: TopicProps) {
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const roadmapSlug = params ? params.get("roadmap") || "programming-foundations" : "programming-foundations";

  return (
    <div className="space-y-16 text-left">
      
      {/* Hero Section */}
      <section className="bg-mistral-navy p-12 -mx-6 -mt-12 text-white shadow-inner rounded-sm font-sans">
        <div className="flex items-center gap-4 mb-4">
          <GraduationCap className="w-10 h-10 text-mistral-orange" />
          <h1 className="font-serif text-5xl font-medium italic text-white drop-shadow-sm">Programming Foundations Orientation</h1>
        </div>
        <p className="text-white/80 max-w-2xl text-lg leading-relaxed font-sans">
          Welcome! Before writing code, let's align our learning mindset, address common myths, and understand the core curriculum to maximize your retention.
        </p>
      </section>

      {/* Expectation Management */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Rocket className="w-8 h-8 text-mistral-orange" />
          <h2 className="font-serif text-3xl font-medium text-mistral-navy">What are we covering?</h2>
        </div>
        <div className="prose prose-mistral max-w-none text-mistral-navy/70 text-base space-y-6">
          <p>
            This track is designed to take you from a complete beginner to a logical thinker who can construct functional software models. We will walk through:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono uppercase tracking-wider text-mistral-navy/80">
            <div className="bg-white border border-mistral-navy/5 p-4 rounded-sm">
              01. Input & Output (Program communication)
            </div>
            <div className="bg-white border border-mistral-navy/5 p-4 rounded-sm">
              02. Variables & Constants (Memory storage units)
            </div>
            <div className="bg-white border border-mistral-navy/5 p-4 rounded-sm">
              03. Operators & Logic (Calculations & evaluation)
            </div>
            <div className="bg-white border border-mistral-navy/5 p-4 rounded-sm">
              04. Control Flow (Decision making statements)
            </div>
            <div className="bg-white border border-mistral-navy/5 p-4 rounded-sm">
              05. Loops & Iterations (Automated repetition)
            </div>
            <div className="bg-white border border-mistral-navy/5 p-4 rounded-sm">
              06. Collections (Grouping associated values)
            </div>
            <div className="bg-white border border-mistral-navy/5 p-4 rounded-sm">
              07. Functions (Modular, reusable block designs)
            </div>
            <div className="bg-white border border-mistral-navy/5 p-4 rounded-sm">
              08. Classes & Objects (Data structuring blueprints)
            </div>
          </div>
        </div>
      </section>

      {/* Common Misconceptions */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-8 h-8 text-mistral-orange" />
          <h2 className="font-serif text-3xl font-medium text-mistral-navy">Common Programming Misconceptions</h2>
        </div>
        <div className="space-y-6">
          <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-mono font-bold text-xs shrink-0">X</div>
              <div>
                <h4 className="font-sans font-bold text-mistral-navy text-sm uppercase tracking-wide">Myth 1: "I need to be a math genius to program."</h4>
                <p className="text-xs text-mistral-navy/70 leading-relaxed mt-1">
                  Programming is about logical flow, pattern matching, and breaking down actions step-by-step. Standard business applications require nothing more than basic arithmetic.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-mono font-bold text-xs shrink-0">X</div>
              <div>
                <h4 className="font-sans font-bold text-mistral-navy text-sm uppercase tracking-wide">Myth 2: "I must memorize all syntax rules."</h4>
                <p className="text-xs text-mistral-navy/70 leading-relaxed mt-1">
                  Professional software developers consult reference documentation daily. Retention comes naturally from practice, not rote memorization. Focus on understanding the core concept, not raw syntax rules.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-mono font-bold text-xs shrink-0">X</div>
              <div>
                <h4 className="font-sans font-bold text-mistral-navy text-sm uppercase tracking-wide">Myth 3: "I can learn programming by just reading or watching."</h4>
                <p className="text-xs text-mistral-navy/70 leading-relaxed mt-1">
                  Coding is an active sport. You build retention and confidence only by writing, running, and debugging code. Make mistakes, fix them, and experiment!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Learning Journey on AntiNotes */}
      <section className="pt-8 border-t border-mistral-navy/10">
        <div className="flex items-center gap-3 mb-6">
          <GraduationCap className="w-8 h-8 text-mistral-orange" />
          <h2 className="font-serif text-3xl font-medium text-mistral-navy">The Learning Journey on AntiNotes</h2>
        </div>
        <div className="prose prose-mistral max-w-none text-mistral-navy/70 text-base leading-relaxed space-y-4">
          <p>
            As you work through this roadmap, remember that you don't need to be an expert in language syntax before you start writing code. AntiNotes is designed for active retention, which means you will learn by doing. Our integrated compilers provide pre-filled boilerplates and step-by-step logic hints that adapt to your progress, allowing you to solve problems even if you only have a little prior knowledge.
          </p>
          <p>
            Instead of pushing you to memorize code blocks or study templates, we help you build true problem-solving intuition. Every time you write, run, or debug code on the platform, our hyper-personalized tutoring engine tracks your cognitive profile—identifying your logic strengths and gaps. The more you use the platform, the better the guidance becomes, tailoring explanations specifically to your style and pace to build real, lasting confidence.
          </p>
        </div>
      </section>

      {/* Interactive Mindset Quiz */}
      <section className="pt-8 border-t border-mistral-navy/10">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-8 h-8 text-mistral-orange" />
          <h2 className="font-serif text-3xl font-medium text-mistral-navy">Logical Mindset Check</h2>
        </div>
        
        <div className="space-y-8 max-w-xl mx-auto">
          <MCQQuiz 
            question="What is the most effective way to retain programming logic and syntaxes?"
            options={[
              "Reading tutorial pages repeatedly until memorized",
              "Writing, running, and debugging code regularly to build logical intuition",
              "Watching videos of other developers programming",
              "Translating code segments to other formats without executing them"
            ]}
            correctIndex={1}
            explanation="Active implementation and debugging are the only ways to build logical muscle memory. Running into syntax errors and resolving them accelerates retention."
          />

          <MCQQuiz 
            question="How should you react when your code displays a syntax or compilation error?"
            options={[
              "Assume you are bad at programming and stop trying",
              "Delete everything and copy paste the entire solution code directly",
              "Read the error log to pinpoint the line and reason for failure, interpreting it as a normal step of execution",
              "Submit the code repeatedly without changes hoping it runs"
            ]}
            correctIndex={2}
            explanation="Errors are helpful hints from the compiler, not indicators of failure. Professional debugging is simply fixing errors one-by-one by reading log diagnostics."
          />
        </div>
      </section>

      {/* Next Step */}
      <section className="bg-mistral-navy text-white p-10 rounded-sm shadow-xl font-sans">
        <div className="flex items-center gap-3 mb-8">
          <CheckCircle2 className="w-8 h-8 text-mistral-orange" />
          <h2 className="font-serif text-3xl font-medium text-white font-bold">Orientation Complete</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <div>
            <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-3 text-white">Mindset Keys Established</h4>
            <ul className="list-disc pl-5 space-y-2 text-xs text-white/60">
              <li>Writing code beats passive watching.</li>
              <li>Syntax references are a normal developer tool.</li>
              <li>Errors are debugging feedback, not indicators of capability.</li>
            </ul>
          </div>
          
          <div className="bg-white/5 p-6 rounded border border-white/10 flex flex-col justify-between items-center text-center">
            <p className="text-sm text-white/80 mb-6 font-sans">Ready to begin your programming foundations track?</p>
            <Link href={`/roadmaps/topics/intro-io?roadmap=${roadmapSlug}`} className="px-8 py-3 bg-mistral-orange text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-mistral-navy transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
              Go to Module 2: Intro to Input/Output &rarr;
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
