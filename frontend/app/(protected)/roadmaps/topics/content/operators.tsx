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

export default function OperatorsTopic({ widgets, userLanguage }: TopicProps) {
  const findWidget = (id: string) => widgets.find(w => w.widget_id === id);
  const lang = userLanguage.toLowerCase();

  return (
    <div className="space-y-16">
      {/* 1. Arithmetic Operators */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">Arithmetic Operators</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="text-lg text-mistral-navy/70 leading-relaxed mb-6">
            Arithmetic operators perform common mathematical operations. While addition and subtraction are straightforward, 
            programming has a few unique mathematical behaviors you must master for DSA.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
            <div className="bg-white border border-mistral-navy/10 p-6 rounded-sm shadow-sm">
              <h4 className="font-sans font-bold text-mistral-navy mb-4 text-sm uppercase tracking-wider">The "Modulo" Operator (%)</h4>
              <p className="text-xs text-mistral-navy/60 leading-relaxed mb-4">
                Modulo returns the <strong>remainder</strong> of a division. <code>10 % 3</code> is 1 because 3 goes into 10 three times, with 1 left over.
              </p>
              <div className="bg-mistral-orange/5 p-4 rounded border-l-2 border-mistral-orange">
                <h5 className="text-[10px] font-bold text-mistral-orange uppercase mb-1">Where is it used?</h5>
                <ul className="text-[10px] text-mistral-navy/70 space-y-1 list-disc ml-3">
                  <li><strong>Even/Odd:</strong> <code>n % 2 === 0</code> means n is even.</li>
                  <li><strong>Circular Arrays:</strong> Keeping an index within bounds.</li>
                  <li><strong>Hash Maps:</strong> Mapping a large key to a small array index.</li>
                </ul>
              </div>
            </div>

            <div className="bg-white border border-mistral-navy/10 p-6 rounded-sm shadow-sm">
              <h4 className="font-sans font-bold text-mistral-navy mb-4 text-sm uppercase tracking-wider">The Division Trap</h4>
              <p className="text-xs text-mistral-navy/60 leading-relaxed mb-4">
                In many languages, dividing two integers results in an integer (it cuts off the decimal).
              </p>
              <div className="bg-mistral-navy/5 p-4 rounded border-l-2 border-mistral-navy">
                <h5 className="text-[10px] font-bold text-mistral-navy uppercase mb-1">Language Note:</h5>
                <p className="text-[10px] text-mistral-navy/70">
                  {lang === "python" 
                    ? "Python's / operator always returns a float (2.5). Use // for integer division (2)." 
                    : `${userLanguage}'s / operator truncates decimals if both numbers are integers (5/2 = 2).`}
                </p>
              </div>
            </div>
          </div>

          <WidgetRenderer widget={findWidget("op-arithmetic-tabs")} userLanguage={userLanguage} />
        </div>
      </section>

      {/* 2. Comparison Operators */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">Comparison Operators</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="mb-6">
            Comparison operators are used in expressions that result in a <strong>Boolean</strong> (True or False). 
            They are the foundation of decision-making in your code.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
            <div className="p-4 border border-mistral-navy/10 bg-white">
              <code className="text-mistral-orange font-bold" style={{ fontVariantLigatures: "none" }}>==</code>
              <p className="text-[10px] text-mistral-navy/50 mt-1">Equal to</p>
            </div>
            <div className="p-4 border border-mistral-navy/10 bg-white">
              <code className="text-mistral-orange font-bold" style={{ fontVariantLigatures: "none" }}>{lang === "javascript" ? "!= / !==" : "!="}</code>
              <p className="text-[10px] text-mistral-navy/50 mt-1">Not equal to</p>
            </div>
            <div className="p-4 border border-mistral-navy/10 bg-white">
              <code className="text-mistral-orange font-bold" style={{ fontVariantLigatures: "none" }}>{">"} / {"<"}</code>
              <p className="text-[10px] text-mistral-navy/50 mt-1">Greater/Less than</p>
            </div>
          </div>

          <div className="bg-mistral-bg p-6 border-l-4 border-mistral-navy my-8">
            <h4 className="font-sans font-bold text-sm text-mistral-navy mb-2">Where is it used?</h4>
            <p className="text-xs text-mistral-navy/70 italic">
              "Is the player's health zero?", "Is this username already taken?", "Is the temperature above 100 degrees?"
            </p>
          </div>
        </div>
      </section>

      {/* 3. Logical Operators */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">Logical Operators (AND, OR, NOT)</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="mb-6">
            Logical operators allow you to combine multiple comparisons into a single complex decision. 
            Think of them as <strong>The Gatekeepers</strong>.
          </p>

          <div className="space-y-4 my-8">
            <div className="flex gap-6 items-start p-4 bg-white border border-mistral-navy/5">
              <div className="shrink-0 w-20 font-mono text-sm font-bold text-mistral-orange">{lang === "python" ? "and" : "&&"}</div>
              <div>
                <h5 className="font-sans font-bold text-xs text-mistral-navy mb-1 uppercase tracking-tighter">The Strict Bouncer (AND)</h5>
                <p className="text-[11px] text-mistral-navy/60">Returns true ONLY if <strong>both</strong> sides are true. (e.g., You must have a ticket AND be over 18).</p>
              </div>
            </div>
            <div className="flex gap-6 items-start p-4 bg-white border border-mistral-navy/5">
              <div className="shrink-0 w-20 font-mono text-sm font-bold text-mistral-orange">{lang === "python" ? "or" : "||"}</div>
              <div>
                <h5 className="font-sans font-bold text-xs text-mistral-navy mb-1 uppercase tracking-tighter">The Relaxed Friend (OR)</h5>
                <p className="text-[11px] text-mistral-navy/60">Returns true if <strong>at least one</strong> side is true. (e.g., You can enter if you are a VIP OR you have a ticket).</p>
              </div>
            </div>
            <div className="flex gap-6 items-start p-4 bg-white border border-mistral-navy/5">
              <div className="shrink-0 w-20 font-mono text-sm font-bold text-mistral-orange">{lang === "python" ? "not" : "!"}</div>
              <div>
                <h5 className="font-sans font-bold text-xs text-mistral-navy mb-1 uppercase tracking-tighter">The Opposite (NOT)</h5>
                <p className="text-[11px] text-mistral-navy/60">Flips the boolean value. True becomes False, and False becomes True.</p>
              </div>
            </div>
          </div>

          <WidgetRenderer widget={findWidget("op-logical-tabs")} userLanguage={userLanguage} />
        </div>
      </section>

      {/* 4. Interactive Mastery */}
      <section className="pt-8 border-t border-mistral-navy/10">
        <h3 className="font-sans font-bold text-xl text-mistral-navy mb-8 text-left uppercase tracking-widest text-center">Interactive Mastery</h3>
        <WidgetRenderer widget={findWidget("op-mcq")} userLanguage={userLanguage} />
        <div className="mt-12">
          <h4 className="font-sans font-bold text-sm text-mistral-navy mb-2 text-center uppercase tracking-widest">Challenge: The Even-Odd Detector</h4>
          <p className="mb-6 text-center text-xs text-mistral-navy/60">Fix the code below using the <strong>Modulo (%)</strong> operator to correctly identify even numbers.</p>
          <WidgetRenderer widget={findWidget("op-practice-editor")} userLanguage={userLanguage} />
        </div>
      </section>

      {/* 5. Knowledge Recap (Summary) */}
      <section className="bg-mistral-navy text-white p-10 rounded-sm shadow-xl">
        <div className="flex items-center gap-3 mb-8">
          <CheckCircle2 className="w-8 h-8 text-mistral-orange" />
          <h2 className="font-serif text-3xl font-medium">Knowledge Recap</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">01</div>
              <div>
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">Modulo mastery</h4>
                <p className="text-xs text-white/60 leading-relaxed">The <code>%</code> operator is your best friend in DSA for cyclicity, hash maps, and grouping numbers.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">02</div>
              <div>
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">Logical Gates</h4>
                <p className="text-xs text-white/60 leading-relaxed">AND (&&) requires total truth. OR (||) requires partial truth. NOT (!) flips the script.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 p-6 rounded border border-white/10" style={{ fontVariantLigatures: "none" }}>
            <div className="flex gap-4 mb-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">03</div>
              <h4 className="font-sans font-bold text-sm uppercase tracking-wide mt-1 italic underline decoration-mistral-orange underline-offset-4">Syntax Signature ({userLanguage})</h4>
            </div>
            <div className="space-y-3 font-mono text-[11px]">
              {lang === "python" ? (
                <>
                  <p>is_even = n <span className="text-mistral-orange">%</span> 2 == 0</p>
                  <p>is_valid = x {">"} 0 <span className="text-mistral-orange">and</span> x {"<"} 100</p>
                  <p>avg = sum <span className="text-mistral-orange">//</span> count <span className="text-white/30"># Integer div</span></p>
                </>
              ) : (
                <>
                  <p>boolean isEven = n <span className="text-mistral-orange">%</span> 2 == 0;</p>
                  <p>boolean isValid = x {">"} 0 <span className="text-mistral-orange">{"&&"}</span> x {"<"} 100;</p>
                  <p>int avg = sum <span className="text-mistral-orange">/</span> count; <span className="text-white/30">// Truncates</span></p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center">
          <p className="font-sans text-sm text-white/80 mb-6">Operators Mastered. Ready to start making decisions with code?</p>
          <Link href="/roadmaps/topics/control-flow" className="px-8 py-3 bg-mistral-orange text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-mistral-navy transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
            Go to Control Flow &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
