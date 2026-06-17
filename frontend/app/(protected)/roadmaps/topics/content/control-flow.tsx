"use client";
import React from "react";
import { WidgetRenderer } from "@/components/interactive/WidgetRenderer";
import { InteractiveWidget } from "@/lib/api";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface TopicProps {
  widgets: InteractiveWidget[];
  userLanguage: string;
}

export default function ControlFlowTopic({ widgets, userLanguage }: TopicProps) {
  const findWidget = (id: string) => widgets.find(w => w.widget_id === id);
  const lang = userLanguage.toLowerCase();

  return (
    <div className="space-y-16">
      {/* 1. The Concept */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">The Fork in the Road</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="text-lg text-mistral-navy/70 leading-relaxed mb-6">
            In the real world, we make decisions constantly: <em>"If it's raining, I'll take an umbrella. Else, I'll wear sunglasses."</em> 
            <strong>Control Flow</strong> is how we give this same decision-making power to our programs.
          </p>
          <div className="bg-white border-2 border-mistral-navy/5 p-8 rounded-sm shadow-sm border-l-4 border-l-mistral-orange">
            <h4 className="font-sans font-bold text-mistral-navy mb-4">Why is it critical?</h4>
            <ul className="text-sm text-mistral-navy/70 space-y-3 list-disc ml-4">
              <li><strong>Dynamic Reactions:</strong> Programs can react differently to different user inputs.</li>
              <li><strong>Intelligence:</strong> It allows code to "think" and branch out instead of just running from top to bottom.</li>
              <li><strong>Algorithmic Base:</strong> Almost every algorithm (Sorting, Searching, etc.) relies on these decision points.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2. The If Statement */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">The If Statement</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="mb-6">
            The <code>if</code> statement is the most basic decision point. It tells the computer: 
            <em>"Only run this block of code IF this condition is true."</em>
          </p>
          
          <div className="bg-mistral-bg p-8 rounded-sm border border-mistral-navy/10 mb-8">
            <h4 className="font-sans font-bold text-mistral-navy mb-6 text-center uppercase tracking-widest text-xs">Anatomy of {userLanguage} If-Statement</h4>
            
            {lang === "java" || lang === "cpp" ? (
              <div className="grid grid-cols-1 gap-6">
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">if (...)</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">The <strong>Keyword</strong> and the <strong>Condition</strong> (must be inside parentheses).</p>
                </div>
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">{"{ ... }"}</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">The <strong>Code Block</strong>. These curly braces define exactly which lines of code belong to the decision.</p>
                </div>
              </div>
            ) : lang === "python" ? (
              <div className="grid grid-cols-1 gap-6">
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">if condition:</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">The keyword followed by the condition and a <strong>Colon (:)</strong>. Parentheses are optional.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">Indentation</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">Python uses **whitespace** to know which code is part of the 'if'. No braces needed!</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-mistral-navy/70">Syntax rules ensure the computer knows exactly when to execute a branch of logic.</p>
            )}
          </div>
          <WidgetRenderer widget={findWidget("cf-ifelse-tabs")} userLanguage={userLanguage} />
        </div>
      </section>

      {/* 3. The Else-If & Else */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">Handling Multiple Paths (Else If & Else)</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="mb-6">
            Sometimes a simple Yes/No isn't enough. You might have three, four, or fifty possible paths.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
            <div className="p-6 bg-white border border-mistral-navy/10 rounded-sm">
              <h5 className="font-sans font-bold text-mistral-navy mb-2 uppercase tracking-tighter text-sm">Else If / {lang === "python" ? "elif" : "else if"}</h5>
              <p className="text-xs text-mistral-navy/60">Checks a new condition only if the previous ones were false. You can have as many as you want.</p>
            </div>
            <div className="p-6 bg-white border border-mistral-navy/10 rounded-sm">
              <h5 className="font-sans font-bold text-mistral-navy mb-2 uppercase tracking-tighter text-sm">Else</h5>
              <p className="text-xs text-mistral-navy/60">The <strong>Fallback</strong>. This block runs if <em>every</em> previous condition was false.</p>
            </div>
          </div>

          <div className="bg-amber-50 p-6 border-l-4 border-amber-400 mb-8">
            <h4 className="font-sans font-bold text-amber-800 text-sm mb-2 uppercase tracking-widest">⚠️ The DSA Trap: Ordering</h4>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              Conditions are checked from **top to bottom**. If you check for <code>score {">"} 80</code> before <code>score {">"} 90</code>, 
              someone with a score of 95 will enter the 80+ block and <strong>never</strong> reach the 90+ block. Always check your most specific conditions first!
            </p>
          </div>
        </div>
      </section>

      {/* 4. Switch & Match */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">The Dispatcher (Switch & Match)</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="mb-6">
            When you're checking a single variable against many fixed values (like a menu selection), long <code>if-else</code> chains can become messy.
            The <code>switch</code> (or <code>match</code>) statement provides a cleaner way.
          </p>
          <WidgetRenderer widget={findWidget("cf-switch-tabs")} userLanguage={userLanguage} />
          <div className="bg-mistral-bg p-6 rounded-sm border border-mistral-navy/5 mt-6">
            <h5 className="font-sans font-bold text-mistral-navy text-xs mb-2 uppercase tracking-widest">Language Nuance:</h5>
            <ul className="text-xs text-mistral-navy/60 space-y-2 list-disc ml-4">
              <li><strong>Java/C++/JS:</strong> Uses <code>switch-case</code>. Don't forget the <code>break</code> keyword, or the code will "fall through" to the next case!</li>
              <li><strong>Python 3.10+:</strong> Uses the modern <code>match-case</code>, which is much smarter and doesn't need break statements.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Checkpoint & Practice */}
      <section className="pt-8 border-t border-mistral-navy/10">
        <h3 className="font-sans font-bold text-xl text-mistral-navy mb-8 text-left uppercase tracking-widest text-center">Interactive Mastery</h3>
        <WidgetRenderer widget={findWidget("cf-mcq")} userLanguage={userLanguage} />
        <div className="mt-12">
          <h4 className="font-sans font-bold text-sm text-mistral-navy mb-2 text-center uppercase tracking-widest">Challenge: The Logical Bug</h4>
          <p className="mb-6 text-center text-xs text-mistral-navy/60 italic">The grading system below is broken. Fix the order of conditions so that every student gets the correct grade.</p>
          <WidgetRenderer widget={findWidget("cf-practice-editor")} userLanguage={userLanguage} />
        </div>
      </section>

      {/* 6. Knowledge Recap (Summary) */}
      <section className="bg-mistral-navy text-white p-10 rounded-sm shadow-xl">
        <div className="flex items-center gap-3 mb-8">
          <CheckCircle2 className="w-8 h-8 text-mistral-orange" />
          <h2 className="font-serif text-3xl font-medium">Knowledge Recap</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">01</div>
              <div>
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">If-Else Logic</h4>
                <p className="text-xs text-white/60 leading-relaxed">The binary choice. If the condition is true, take Path A. Else, take Path B.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">02</div>
              <div>
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">Condition Chaining</h4>
                <p className="text-xs text-white/60 leading-relaxed">Order matters! Always check for specific cases before general fallbacks.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">03</div>
              <div>
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">Switch/Match</h4>
                <p className="text-xs text-white/60 leading-relaxed">Best for multiple fixed-value checks. Cleaner and more readable than nested if-else statements.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 p-6 rounded border border-white/10">
            <div className="flex gap-4 mb-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">04</div>
              <h4 className="font-sans font-bold text-sm uppercase tracking-wide mt-1 italic underline decoration-mistral-orange underline-offset-4">Syntax Signature ({userLanguage})</h4>
            </div>
            <div className="space-y-3 font-mono text-[11px]">
              {lang === "java" || lang === "cpp" ? (
                <>
                  <p><span className="text-mistral-orange">if</span> (score {">"} 90) {"{ ... }"}</p>
                  <p><span className="text-mistral-orange">else if</span> (score {">"} 80) {"{ ... }"}</p>
                  <p><span className="text-mistral-orange">else</span> {"{ ... }"}</p>
                  <p><span className="text-mistral-orange">switch</span> (day) {"{ case 1: ... break; }"}</p>
                </>
              ) : lang === "python" ? (
                <>
                  <p><span className="text-mistral-orange">if</span> score {">"} 90:</p>
                  <p className="pl-4"><span className="text-white/30"># Indented block</span></p>
                  <p><span className="text-mistral-orange">elif</span> score {">"} 80:</p>
                  <p><span className="text-mistral-orange">else</span>:</p>
                  <p><span className="text-mistral-orange">match</span> day:</p>
                  <p className="pl-4"><span className="text-mistral-orange">case</span> 1: ...</p>
                </>
              ) : (
                <>
                  <p><span className="text-mistral-orange">if</span> (score {">"} 90) {"{ ... }"}</p>
                  <p><span className="text-mistral-orange">else if</span> (score {">"} 80) {"{ ... }"}</p>
                  <p><span className="text-mistral-orange">switch</span> (day) {"{ case 1: ... }"}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center">
          <p className="font-sans text-sm text-white/80 mb-6">Decision-making mastered. Ready to learn how computers handle repetitive tasks?</p>
          <Link href="/roadmaps/topics/loops" className="px-8 py-3 bg-mistral-orange text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-mistral-navy transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
            Go to Loops &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
