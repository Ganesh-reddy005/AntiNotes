"use client";
import React from "react";
import Link from "next/link";
import { MCQQuiz } from "@/components/interactive/MCQQuiz";
import { GraduationCap, Rocket, Target, Zap, CheckCircle2, ArrowRight } from "lucide-react";

interface TopicProps {
  userLanguage: string;
}

export default function DSAIntroTopic({ userLanguage }: TopicProps) {
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const roadmapSlug = params ? params.get("roadmap") || "dsa-fundamentals" : "dsa-fundamentals";

  return (
    <div className="space-y-16 text-left">
      
      {/* Hero Section */}
      <section className="bg-mistral-navy p-12 -mx-6 -mt-12 text-white shadow-inner rounded-sm font-sans">
        <div className="flex items-center gap-4 mb-4">
          <GraduationCap className="w-10 h-10 text-mistral-orange" />
          <h1 className="font-serif text-5xl font-medium italic text-white drop-shadow-sm">DSA Fundamentals Orientation</h1>
        </div>
        <p className="text-white/80 max-w-2xl text-lg leading-relaxed font-sans">
          Welcome! Before writing code, let's align our mindset, address common misconceptions, and understand the core structures to maximize your retention.
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
            This track is designed to take you from a basic programmer to an efficient logical thinker who can construct optimal memory structures. We will walk through:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono uppercase tracking-wider text-mistral-navy/80">
            <div className="bg-white border border-mistral-navy/5 p-4 rounded-sm">
              01. Complexity Analysis & Big O (Benchmarking growth scales)
            </div>
            <div className="bg-white border border-mistral-navy/5 p-4 rounded-sm">
              02. Arrays & Lists (Contiguous linear slots)
            </div>
            <div className="bg-white border border-mistral-navy/5 p-4 rounded-sm">
              03. Strings & Two Pointers (Sequential boundaries)
            </div>
            <div className="bg-white border border-mistral-navy/5 p-4 rounded-sm">
              04. Linked Lists (Scattered memory dynamic pointer nodes)
            </div>
            <div className="bg-white border border-mistral-navy/5 p-4 rounded-sm">
              05. Stacks & Queues (Restricted LIFO/FIFO endpoints)
            </div>
            <div className="bg-white border border-mistral-navy/5 p-4 rounded-sm">
              06. Recursion & Backtracking (Self-invoking call stacks)
            </div>
            <div className="bg-white border border-mistral-navy/5 p-4 rounded-sm">
              07. Trees & Binary Trees (Hierarchical non-linear nodes)
            </div>
          </div>
        </div>
      </section>

      {/* Common Misconceptions */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-8 h-8 text-mistral-orange" />
          <h2 className="font-serif text-3xl font-medium text-mistral-navy">Common DSA Misconceptions</h2>
        </div>
        <div className="space-y-6">
          
          <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-mono font-bold text-xs shrink-0">X</div>
              <div>
                <h4 className="font-sans font-bold text-mistral-navy text-sm uppercase tracking-wide">Myth 1: "DSA is a new programming language."</h4>
                <p className="text-xs text-mistral-navy/70 leading-relaxed mt-1">
                  DSA stands for Data Structures & Algorithms. It is not a programming language, but rather a set of logical patterns and blueprints. You can implement them in Python, Java, C++, JavaScript, Go, or any programming language.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-mono font-bold text-xs shrink-0">X</div>
              <div>
                <h4 className="font-sans font-bold text-mistral-navy text-sm uppercase tracking-wide">Myth 2: "I must solve strictly in Java."</h4>
                <p className="text-xs text-mistral-navy/70 leading-relaxed mt-1">
                  Many believe they must always use a specific language (like Java) to learn DSA. The concepts—nodes, pointers, arrays, complexities—are language-agnostic. Pick the language you feel most comfortable with. Logic is what matters.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-mono font-bold text-xs shrink-0">X</div>
              <div>
                <h4 className="font-sans font-bold text-mistral-navy text-sm uppercase tracking-wide">Myth 3: "DSA is too hard and only for geniuses."</h4>
                <p className="text-xs text-mistral-navy/70 leading-relaxed mt-1">
                  DSA is not an innate talent; it is a structured, learnable skill. By building on basic structures (like Arrays) step-by-step, the complex structures (like Trees and Recursion) become natural extensions of what you already know.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-mono font-bold text-xs shrink-0">!</div>
              <div>
                <h4 className="font-sans font-bold text-mistral-navy text-sm uppercase tracking-wide">AI Era Highlight: "Why does DSA matter if AI can write my code?"</h4>
                <p className="text-xs text-mistral-navy/70 leading-relaxed mt-1">
                  AI is excellent at generating syntax boilerplate. However, AI cannot evaluate the scale constraints of your platform or understand system compromises. Knowing *which* data structure to select, estimating runtime bottlenecks, and designing solid algorithms are what separate a senior systems architect from a simple prompt generator.
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
            question="Which of the following statements represents the relationship between DSA and programming languages?"
            options={[
              "DSA is an advanced programming language that compiles slower than C++",
              "DSA concepts are language-agnostic blueprints that can be implemented in any programming language",
              "You can only write algorithms in Java or C++ compilers",
              "You must master assembly language before you can study arrays and linked lists"
            ]}
            correctIndex={1}
            explanation="Data structures and algorithms are logical structures. A linked list has nodes and pointers whether it is written in Python, Java, JavaScript, or C++."
          />

          <MCQQuiz 
            question="Why does learning DSA remain critical for software engineering in the era of Generative AI tools?"
            options={[
              "Because AI tools are prohibited from generating syntax templates",
              "Because understanding runtime growth scales and database design bottlenecks allows you to architect platforms, not just write boilerplate syntax",
              "Because compilers require you to submit manually drawn diagram maps with your code",
              "Because Big O notation math is too complex for AI algorithms to solve"
            ]}
            correctIndex={1}
            explanation="AI is great at generation, but engineering is about structure, constraints, and runtime analysis. Understanding which structures to use and how loops scale is the foundation of platform design."
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
              <li>Logic and memory structure layouts are language-agnostic.</li>
              <li>Tracing patterns on paper is better than rushing to code.</li>
              <li>Analyzing growth scales is key to engineering scalable software.</li>
            </ul>
          </div>
          
          <div className="bg-white/5 p-6 rounded border border-white/10 flex flex-col justify-between items-center text-center">
            <p className="text-sm text-white/80 mb-6 font-sans">Ready to begin your DSA fundamentals track?</p>
            <Link href={`/roadmaps/topics/complexity-analysis?roadmap=${roadmapSlug}`} className="px-8 py-3 bg-mistral-orange text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-mistral-navy transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
              Go to Module 2: Complexity Analysis &rarr;
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
