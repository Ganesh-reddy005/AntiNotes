"use client";
import React from "react";
import { WidgetRenderer } from "@/components/interactive/WidgetRenderer";
import { InteractiveWidget } from "@/lib/api";
import { CheckCircle2, AlertTriangle, Zap } from "lucide-react";
import Link from "next/link";

interface TopicProps {
  widgets: InteractiveWidget[];
  userLanguage: string;
}

export default function LoopsTopic({ widgets, userLanguage }: TopicProps) {
  const findWidget = (id: string) => widgets.find(w => w.widget_id === id);
  const lang = userLanguage.toLowerCase();

  return (
    <div className="space-y-16">
      {/* 1. Introduction */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">The Power of Repetition</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="text-lg text-mistral-navy/70 leading-relaxed mb-6">
            Imagine you're on an assembly line and your job is to put a cap on 1,000 bottles. You wouldn't write down the instruction "Put cap on bottle" 1,000 times. 
            Instead, you'd say: <strong>"While there are bottles left, put a cap on them."</strong>
          </p>
          <div className="bg-white border-2 border-mistral-navy/5 p-8 rounded-sm shadow-sm border-l-4 border-l-mistral-orange">
            <h4 className="font-sans font-bold text-mistral-navy mb-4 uppercase tracking-widest text-xs">Why Loops Matter:</h4>
            <ul className="text-sm text-mistral-navy/70 space-y-3 list-disc ml-4">
              <li><strong>Efficiency:</strong> Perform complex, repetitive tasks with just a few lines of code.</li>
              <li><strong>Traversal:</strong> Loops are how we visit every item in a list, every user in a database, or every pixel in an image.</li>
              <li><strong>Automation:</strong> They allow programs to run continuously until a specific goal is met.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2. While Loops */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">The While Loop</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="mb-6">
            A <code>while</code> loop is condition-driven. It checks a condition <strong>before</strong> every iteration. If the condition is true, the loop runs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
            <div className="bg-mistral-bg p-6 rounded-sm border border-mistral-navy/10">
              <h5 className="font-sans font-bold text-mistral-navy mb-2 uppercase tracking-tighter text-sm">How it works:</h5>
              <ol className="text-xs text-mistral-navy/60 space-y-2 list-decimal ml-4">
                <li>Check the <strong>condition</strong>.</li>
                <li>If True: Run the code inside.</li>
                <li>Go back to step 1.</li>
                <li>If False: Exit the loop.</li>
              </ol>
            </div>
            
            <div className="bg-red-50 p-6 rounded-sm border-l-4 border-red-400">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <h5 className="font-sans font-bold text-red-800 uppercase tracking-tighter text-sm">The Infinite Loop Trap</h5>
              </div>
              <p className="text-[11px] text-red-900/70 leading-relaxed">
                If the condition <strong>never</strong> becomes false, the loop runs forever, usually crashing your program. 
                Always ensure something changes inside the loop that eventually breaks the condition!
              </p>
            </div>
          </div>

          <WidgetRenderer widget={findWidget("loops-while-tabs")} userLanguage={userLanguage} />
        </div>
      </section>

      {/* 3. For Loops */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">The For Loop</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="mb-6">
            A <code>for</code> loop is usually count-driven. We use it when we know in advance how many times we want to repeat a block of code.
          </p>

          <div className="bg-mistral-bg p-8 rounded-sm border border-mistral-navy/10 mb-8">
            <h4 className="font-sans font-bold text-mistral-navy mb-6 text-center uppercase tracking-widest text-xs">Anatomy of a {userLanguage} For-Loop</h4>
            
            {lang === "java" || lang === "cpp" || lang === "javascript" ? (
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0" style={{ fontVariantLigatures: "none" }}>int i = 0;</code>
                  <p className="text-xs text-mistral-navy/70 mt-1"><strong>Initialization:</strong> Create a counter variable (usually <code>i</code>).</p>
                </div>
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0" style={{ fontVariantLigatures: "none" }}>i {"<"} 10;</code>
                  <p className="text-xs text-mistral-navy/70 mt-1"><strong>Condition:</strong> The loop runs as long as this is true.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0" style={{ fontVariantLigatures: "none" }}>i++</code>
                  <p className="text-xs text-mistral-navy/70 mt-1"><strong>Update:</strong> Increment the counter after every run.</p>
                </div>
              </div>
            ) : lang === "python" ? (
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">for i in range(10):</code>
                  <p className="text-xs text-mistral-navy/70 mt-1">Python makes it simple: <code>i</code> takes every value from 0 up to (but not including) 10.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">Indentation</code>
                  <p className="text-xs text-mistral-navy/70 mt-1">Just like 'if' statements, the code inside the loop must be indented.</p>
                </div>
              </div>
            ) : null}
          </div>

          <WidgetRenderer widget={findWidget("loops-for-tabs")} userLanguage={userLanguage} />
        </div>
      </section>

      {/* 4. Loop Control */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">Loop Control: Break & Continue</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="mb-6">
            Sometimes you need to change the flow of a loop while it's running. You have two powerful tools:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 text-left">
            <div className="p-6 bg-white border border-mistral-navy/10 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 bg-mistral-orange/10 font-mono text-[10px] text-mistral-orange uppercase tracking-widest">STOP</div>
              <h5 className="font-sans font-bold text-mistral-navy mb-2 uppercase tracking-tighter text-sm">Break</h5>
              <p className="text-[11px] text-mistral-navy/60 leading-relaxed">
                The **Emergency Exit**. It immediately kills the loop and moves to the next part of your program. 
                <em> Use this when you've found what you're looking for!</em>
              </p>
            </div>
            <div className="p-6 bg-white border border-mistral-navy/10 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 bg-mistral-navy/10 font-mono text-[10px] text-mistral-navy/40 uppercase tracking-widest">SKIP</div>
              <h5 className="font-sans font-bold text-mistral-navy mb-2 uppercase tracking-tighter text-sm">Continue</h5>
              <p className="text-[11px] text-mistral-navy/60 leading-relaxed">
                The **Fast-Forward**. It stops the current iteration and jumps straight to the next one.
                <em> Use this to skip specific items (like ignoring negative numbers).</em>
              </p>
            </div>
          </div>
          
          <WidgetRenderer widget={findWidget("loops-control-tabs")} userLanguage={userLanguage} />
        </div>
      </section>

      {/* Interactive Mastery */}
      <section className="pt-8 border-t border-mistral-navy/10">
        <h3 className="font-sans font-bold text-xl text-mistral-navy mb-8 text-left uppercase tracking-widest text-center">Interactive Mastery</h3>
        <WidgetRenderer widget={findWidget("loops-mcq")} userLanguage={userLanguage} />
        <div className="mt-12">
          <h4 className="font-sans font-bold text-sm text-mistral-navy mb-2 text-center uppercase tracking-widest">Challenge: Stop the Infinity!</h4>
          <p className="mb-6 text-center text-xs text-mistral-navy/60 italic">The code below is an infinite loop. Add the missing line to ensure it counts to 5 and then stops.</p>
          <WidgetRenderer widget={findWidget("loops-practice-editor")} userLanguage={userLanguage} />
        </div>
      </section>

      {/* 6. Knowledge Recap */}
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
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">While vs For</h4>
                <p className="text-xs text-white/60 leading-relaxed">Use <code>while</code> when you don't know the exact count. Use <code>for</code> when the number of repetitions is fixed.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">02</div>
              <div>
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">Safety First</h4>
                <p className="text-xs text-white/60 leading-relaxed">Always update your loop variable to avoid the dreaded infinite loop crash.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">03</div>
              <div>
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">Steering</h4>
                <p className="text-xs text-white/60 leading-relaxed"><code>break</code> exits the loop entirely. <code>continue</code> skips to the next round.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 p-6 rounded border border-white/10" style={{ fontVariantLigatures: "none" }}>
            <div className="flex gap-4 mb-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">04</div>
              <h4 className="font-sans font-bold text-sm uppercase tracking-wide mt-1 italic underline decoration-mistral-orange underline-offset-4">Syntax Signature ({userLanguage})</h4>
            </div>
            <div className="space-y-3 font-mono text-[11px]">
              {lang === "java" || lang === "cpp" || lang === "javascript" ? (
                <>
                  <p><span className="text-mistral-orange">while</span> (cond) {"{ ... }"}</p>
                  <p><span className="text-mistral-orange">for</span> (int i=0; i{"<"}n; i++) {"{ ... }"}</p>
                  <p><span className="text-mistral-orange">break;</span> <span className="text-white/30">// Exit</span></p>
                  <p><span className="text-mistral-orange">continue;</span> <span className="text-white/30">// Skip</span></p>
                </>
              ) : lang === "python" ? (
                <>
                  <p><span className="text-mistral-orange">while</span> condition:</p>
                  <p><span className="text-mistral-orange">for</span> i <span className="text-mistral-orange">in</span> range(n):</p>
                  <p><span className="text-mistral-orange">break</span></p>
                  <p><span className="text-mistral-orange">continue</span></p>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-mistral-navy/10 flex flex-col items-center">
          <p className="font-sans text-sm text-mistral-navy/60 mb-6 italic">You've reached a significant checkpoint in your journey!</p>
          <Link href="/roadmaps/topics/foundation-revision" className="px-10 py-4 bg-amber-500 text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-mistral-navy transition-all shadow-[8px_8px_0px_0px_rgba(245,158,11,0.1)] flex items-center gap-3">
            Claim Mastery Milestone <Zap className="w-4 h-4 fill-current" />
          </Link>
        </div>
      </section>
    </div>
  );
}
