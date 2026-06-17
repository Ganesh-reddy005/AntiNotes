"use client";
import React from "react";
import { WidgetRenderer } from "@/components/interactive/WidgetRenderer";
import { InteractiveWidget } from "@/lib/api";
import { CheckCircle2, Zap, Code2, ArrowRightLeft, FileCheck, Brain } from "lucide-react";
import Link from "next/link";

interface TopicProps {
  widgets: InteractiveWidget[];
  userLanguage: string;
}

export default function FunctionsTopic({ widgets, userLanguage }: TopicProps) {
  const findWidget = (id: string) => widgets.find(w => w.widget_id === id);
  const lang = userLanguage.toLowerCase();

  return (
    <div className="space-y-16">
      {/* 1. The Data Pipeline */}
      <section>
        <h2 className="font-serif text-4xl font-medium text-mistral-navy mb-6 text-left">The Data Pipeline</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="text-lg text-mistral-navy/70 leading-relaxed mb-6">
            In programming, a function is not just a "box of code"—it is a <strong>Data Transformer</strong>. 
            Understanding how data moves in and out of this box is the key to mastering software architecture.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
            <div className="p-6 bg-white border border-mistral-navy/10 shadow-sm border-l-4 border-l-mistral-orange">
              <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-mistral-navy mb-2">1. Inbound (The Input)</h4>
              <p className="text-[11px] text-mistral-navy/50 leading-relaxed">
                When you call a function, you "copy" data from your main program and pass it into <strong>Parameters</strong>.
              </p>
            </div>
            <div className="p-6 bg-white border border-mistral-navy/10 shadow-sm border-l-4 border-l-mistral-navy">
              <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-mistral-navy mb-2">2. Processing (The Room)</h4>
              <p className="text-[11px] text-mistral-navy/50 leading-relaxed">
                The function works in its own "private room" (Scope). It can't see the outside world, and the world can't see it.
              </p>
            </div>
            <div className="p-6 bg-white border border-mistral-navy/10 shadow-sm border-l-4 border-l-emerald-500">
              <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-mistral-navy mb-2">3. Outbound (The Result)</h4>
              <p className="text-[11px] text-mistral-navy/50 leading-relaxed">
                The <code>return</code> statement is the only way to get a value back out. Once it hits return, the room "closes".
              </p>
            </div>
          </div>

          <h3 className="font-sans font-bold text-sm text-mistral-navy mb-4 uppercase tracking-widest">Visualizing the Flow</h3>
          <WidgetRenderer widget={findWidget("func-pipeline-tabs")} userLanguage={userLanguage} debugId="func-pipeline-tabs" />
        </div>
      </section>

      {/* 2. The Type Contract */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left underline decoration-mistral-orange/20 underline-offset-8">The Type Contract</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="mb-8">
            When you define a function, you are making a <strong>Contract</strong> with the computer. 
            In languages like Java or C++, this contract is written directly in the code.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-mistral-bg p-8 rounded-sm border border-mistral-navy/10">
              <div className="flex items-center gap-3 mb-4 text-mistral-navy/40">
                <FileCheck className="w-5 h-5" />
                <h4 className="font-sans font-bold text-xs uppercase tracking-widest">void (The Task)</h4>
              </div>
              <p className="text-xs text-mistral-navy/70 leading-relaxed mb-4">
                "I will perform an action (like printing or saving a file), but I promise **nothing** will come back to the caller."
              </p>
              <div className="p-2 bg-white/50 border border-mistral-navy/5 font-mono text-[10px] text-mistral-navy/40">
                Used for: Side effects, logging, UI updates.
              </div>
            </div>

            <div className="bg-mistral-bg p-8 rounded-sm border border-mistral-navy/10">
              <div className="flex items-center gap-3 mb-4 text-emerald-600">
                <ArrowRightLeft className="w-5 h-5" />
                <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-mistral-navy">int/double (The Promise)</h4>
              </div>
              <p className="text-xs text-mistral-navy/70 leading-relaxed mb-4">
                "I promise that when I am done, I will hand you back a piece of data of this specific type."
              </p>
              <div className="p-2 bg-emerald-50/50 border border-emerald-100 font-mono text-[10px] text-emerald-700">
                Used for: Calculations, data retrieval, logical checks.
              </div>
            </div>
          </div>

          <WidgetRenderer widget={findWidget("func-void-tabs")} userLanguage={userLanguage} debugId="func-void-tabs" />
        </div>
      </section>

      {/* 3. Mental Model: The Replacement */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">Mental Model: The Replacement</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="mb-6">
            Think of a function call like an <strong>ATM Withdrawal</strong>. 
            When you go to an ATM to get $100, the "Process of Withdrawing" is like the <strong>Function Call</strong>. 
            Once the machine gives you the cash, the process is over, and you are left holding <strong>the result ($100)</strong>.
          </p>
          
          <div className="bg-mistral-navy p-10 text-white rounded-sm shadow-lg mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Brain className="w-20 h-20" />
            </div>
            
            <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-mistral-orange mb-6 border-b border-white/10 pb-2">The ATM Transition</h4>
            
            <div className="space-y-8 relative z-10">
                <div className="flex items-start gap-4">
                    <div className="w-20 font-mono text-[10px] uppercase text-white/30 mt-1">1. The Code</div>
                    <div className="font-mono text-sm">
                        Total_Cash = 50 + <span className="text-mistral-orange bg-mistral-orange/10 px-1 py-0.5 rounded underline decoration-2 underline-offset-4">ATM_Withdraw(100)</span>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="w-20 font-mono text-[10px] uppercase text-white/30 mt-1">2. Process</div>
                    <div className="text-xs text-white/60 italic leading-relaxed">
                        The computer jumps to the function, does the logic, and gets the result...
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="w-20 font-mono text-[10px] uppercase text-white/30 mt-1">3. Result</div>
                    <div className="font-mono text-sm">
                        Total_Cash = 50 + <span className="text-emerald-400 font-bold underline decoration-2 underline-offset-4">100</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-start gap-3">
                <Zap className="w-4 h-4 text-mistral-orange shrink-0 mt-0.5" />
                <p className="text-[11px] text-white/50 leading-relaxed italic">
                    <strong>Crucial Insight:</strong> A function call literally "turns into" the data it returns. 
                    This is why you can do math like <code>5 + add(2, 3)</code>. The computer sees it as <code>5 + 5</code>.
                </p>
            </div>
          </div>

          <div className="bg-red-50 p-6 border-l-4 border-red-400 mb-8">
            <h4 className="font-sans font-bold text-red-800 text-sm mb-2 uppercase tracking-widest">⚠️ The "Void" Trap</h4>
            <p className="text-xs text-red-900/80 leading-relaxed">
              If a function is <strong>void</strong>, it is like a <strong>Printer</strong>. It prints a page, but it gives nothing back to your hand. 
              You cannot say <code>x = 5 + Printer()</code> because there is no value to replace the function name!
            </p>
          </div>

          <WidgetRenderer widget={findWidget("func-mcq-flow")} userLanguage={userLanguage} debugId="func-mcq-flow" />
        </div>
      </section>

      {/* Interactive Mastery */}
      <section className="pt-8 border-t border-mistral-navy/10">
        <div className="flex items-center gap-3 mb-8">
            <Brain className="w-6 h-6 text-mistral-orange" />
            <h3 className="font-sans font-bold text-xl text-mistral-navy uppercase tracking-widest">Mastery Check</h3>
        </div>
        
        <WidgetRenderer widget={findWidget("func-mcq-void")} userLanguage={userLanguage} debugId="func-mcq-void" />
        
        <div className="mt-12 bg-white border border-mistral-navy/10 p-8 shadow-sm">
          <h4 className="font-sans font-bold text-sm text-mistral-navy mb-4 uppercase tracking-widest text-center">Final Challenge: Calculation Pipeline</h4>
          <p className="mb-8 text-center text-xs text-mistral-navy/60 italic leading-relaxed max-w-xl mx-auto">
            Write a function called <code>square</code> that takes an integer <code>n</code> and **returns** its square. 
            Remember: Don't just print the result—return it so the caller can use it!
          </p>
          <WidgetRenderer widget={findWidget("func-practice-editor")} userLanguage={userLanguage} debugId="func-practice-editor" />
        </div>
      </section>

      {/* Navigation */}
      <section className="pt-12 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="font-mono text-xs text-mistral-navy/40 uppercase tracking-widest">Module 7 Complete</span>
        </div>
        <Link href="/roadmaps/topics/classes-objects" className="px-12 py-4 bg-mistral-navy text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-mistral-orange transition-all shadow-[8px_8px_0px_0px_rgba(15,23,42,0.1)] flex items-center gap-3">
          Enter the World of Objects <ArrowRightLeft className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
