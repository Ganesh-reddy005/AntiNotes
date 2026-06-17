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

export default function VariablesTopic({ widgets, userLanguage }: TopicProps) {
  const findWidget = (id: string) => widgets.find(w => w.widget_id === id);
  const lang = userLanguage.toLowerCase();

  return (
    <div className="space-y-16">
      {/* 1. The Hook (Analogy) */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">The Memory Boxes</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="text-lg text-mistral-navy/70 leading-relaxed mb-6">
            Imagine you are moving to a new house. You have hundreds of items: books, plates, and clothes. 
            To keep track of them, you put them in <strong>labeled boxes</strong>.
          </p>
          <div className="bg-white border-2 border-mistral-navy/5 p-8 rounded-sm shadow-sm border-l-4 border-l-mistral-orange">
            <h4 className="font-sans font-bold text-mistral-navy mb-2">Why do we need variables?</h4>
            <p className="text-sm italic text-mistral-navy/60">
              Without variables, the computer would store data at random memory addresses like <code>0x7ffd5</code>. 
              Variables allow us to give these addresses <strong>human-readable names</strong> (like <code>userName</code> or <code>score</code>) 
              so we can reuse and update them throughout our program.
            </p>
          </div>
        </div>
      </section>

      {/* 2. The Engine (Technical) */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">How it works under the hood</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="mb-6">
            When you create a variable, the computer reserves a small chunk of its <strong>RAM (Random Access Memory)</strong>. 
            The size of this chunk depends on the <strong>Data Type</strong> you choose.
          </p>
          <div className="bg-mistral-bg p-8 rounded-sm border border-mistral-navy/10 mb-8">
            <h4 className="font-sans font-bold text-mistral-navy mb-6 text-center uppercase tracking-widest text-xs">Anatomy of {userLanguage} Declaration</h4>
            
            {lang === "java" && (
              <div className="grid grid-cols-1 gap-6">
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">int</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">The <strong>Data Type</strong>. It tells Java exactly how much memory to reserve (4 bytes for an int).</p>
                </div>
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">age</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">The <strong>Identifier</strong>. This is the label you'll use to refer to the data later.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">=</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">The <strong>Assignment Operator</strong>. It takes the value on the right and "puts it in the box" on the left.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">25;</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">The <strong>Value</strong> and the <strong>Semicolon</strong>. The data itself, followed by the end-of-instruction marker.</p>
                </div>
              </div>
            )}

            {lang === "python" && (
              <div className="grid grid-cols-1 gap-6">
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">age</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">The <strong>Name</strong>. Python doesn't need you to specify the type; it figures it out automatically!</p>
                </div>
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">=</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">The <strong>Assignment Operator</strong>. It links the name to the value in memory.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">25</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">The <strong>Value</strong>. Python sees this is a whole number and treats it as an <code>int</code>.</p>
                </div>
              </div>
            )}

            {lang === "cpp" && (
              <div className="grid grid-cols-1 gap-6">
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">int</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">The <strong>Type</strong>. C++ is very strict about memory; you must tell it exactly what's coming.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">age = 25;</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">The assignment and termination. Without the <code>;</code>, the compiler will fail to build your program.</p>
                </div>
              </div>
            )}

            {lang === "javascript" && (
              <div className="grid grid-cols-1 gap-6">
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">let</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">The <strong>Keyword</strong>. It tells JS you are creating a variable that can change its value later.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">age = 25;</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">The name and value. Semicolons are optional in JS but highly recommended for clear structure.</p>
                </div>
              </div>
            )}
          </div>
          <WidgetRenderer widget={findWidget("var-declare-tabs")} userLanguage={userLanguage} />
        </div>
      </section>

      {/* 3. Language Nuance (Static vs Dynamic) */}
      <section className="bg-mistral-bg p-8 border-l-4 border-mistral-navy">
        <h3 className="font-sans font-bold text-lg text-mistral-navy mb-4 text-left uppercase tracking-tight italic">The "Box Rule" in {userLanguage}</h3>
        
        {(lang === "java" || lang === "cpp") ? (
          <div className="space-y-4 prose prose-mistral text-left">
            <p>
              In <strong>{userLanguage}</strong>, the rules are strict. This is called <strong>Static Typing</strong>. 
              Before you can use a box, you must decide what's going inside it and you can <em>never</em> change its type later.
            </p>
            <p className="text-sm font-mono text-mistral-orange bg-mistral-orange/5 p-4 rounded">
              int age = 25; // Valid<br />
              age = "Young"; // ERROR: You can't put text in an integer box!
            </p>
            <p className="text-xs text-mistral-navy/50">Static typing is great for <strong>DSA</strong> because it prevents hidden bugs and makes the program faster.</p>
          </div>
        ) : (
          <div className="space-y-4 prose prose-mistral text-left">
            <p>
              In <strong>{userLanguage}</strong>, the rules are flexible. This is called <strong>Dynamic Typing</strong>. 
              The box changes its shape and size automatically based on what you put in it.
            </p>
            <p className="text-sm font-mono text-mistral-orange bg-mistral-orange/5 p-4 rounded">
              let x = 25; // x is a number<br />
              x = "Hello"; // Valid! x is now a string.
            </p>
            <p className="text-xs text-mistral-navy/50">Dynamic typing is great for <strong>rapid development</strong>, but you must be careful not to lose track of what's inside your boxes!</p>
          </div>
        )}
      </section>

      {/* 4. Micro-Quiz (Retention Check) */}
      <section className="pt-8 border-t border-mistral-navy/10">
        <h3 className="font-sans font-bold text-xl text-mistral-navy mb-8 text-left uppercase tracking-widest text-center">Quick Check</h3>
        <WidgetRenderer widget={findWidget("var-memory-mcq")} userLanguage={userLanguage} />
      </section>

      {/* 5. Data Types Breakdown */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">Common Data Types</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="mb-8">
            Not all data is the same. To save memory, computers distinguish between whole numbers, decimals, text, and logic.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 border border-mistral-navy/10 bg-white shadow-sm hover:border-mistral-orange/30 transition-colors">
              <span className="font-mono text-[10px] text-mistral-orange uppercase font-bold tracking-widest">Integer (int)</span>
              <h5 className="font-sans font-bold text-sm mt-1 mb-2">Whole Numbers</h5>
              <p className="text-xs text-mistral-navy/60 leading-relaxed"><strong>Use case:</strong> Counting items, loop counters, or player health. No decimals allowed.</p>
            </div>
            <div className="p-6 border border-mistral-navy/10 bg-white shadow-sm hover:border-mistral-orange/30 transition-colors">
              <span className="font-mono text-[10px] text-mistral-orange uppercase font-bold tracking-widest">String</span>
              <h5 className="font-sans font-bold text-sm mt-1 mb-2">Textual Data</h5>
              <p className="text-xs text-mistral-navy/60 leading-relaxed"><strong>Use case:</strong> Usernames, messages, or descriptions. Always wrapped in "quotes".</p>
            </div>
            <div className="p-6 border border-mistral-navy/10 bg-white shadow-sm hover:border-mistral-orange/30 transition-colors">
              <span className="font-mono text-[10px] text-mistral-orange uppercase font-bold tracking-widest">Float / Double</span>
              <h5 className="font-sans font-bold text-sm mt-1 mb-2">Decimal Precision</h5>
              <p className="text-xs text-mistral-navy/60 leading-relaxed"><strong>Use case:</strong> Prices, coordinates, or mathematical calculations requiring precision.</p>
            </div>
            <div className="p-6 border border-mistral-navy/10 bg-white shadow-sm hover:border-mistral-orange/30 transition-colors">
              <span className="font-mono text-[10px] text-mistral-orange uppercase font-bold tracking-widest">Boolean</span>
              <h5 className="font-sans font-bold text-sm mt-1 mb-2">Logical State</h5>
              <p className="text-xs text-mistral-navy/60 leading-relaxed"><strong>Use case:</strong> Yes/No flags, such as <code>isLoggedIn</code> or <code>hasPassed</code>.</p>
            </div>
          </div>
          <WidgetRenderer widget={findWidget("var-types-tabs")} userLanguage={userLanguage} />
        </div>
      </section>

      {/* 6. Type Casting */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">Type Casting: Converting Boxes</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="mb-6">
            Sometimes you need to change a value from one type to another. This is called <strong>Casting</strong>.
          </p>
          <div className="bg-amber-50/50 p-6 rounded-sm border-l-2 border-amber-400 my-8">
            <h4 className="font-sans font-bold text-amber-800 text-sm mb-4 italic">Why do we cast?</h4>
            <ul className="text-xs text-amber-900/80 space-y-2 list-disc ml-4">
              <li><strong>Processing User Input:</strong> Converting "25" (text) into 25 (number) so you can do math with it.</li>
              <li><strong>Memory Optimization:</strong> Converting a large number into a smaller type to save space.</li>
              <li><strong>Precision Control:</strong> Removing the decimal part of a number (Trunation).</li>
            </ul>
          </div>
          <WidgetRenderer widget={findWidget("var-casting-tabs")} userLanguage={userLanguage} />
          <p className="mt-4 text-xs text-mistral-navy/40 italic">Note: In Java/C++, casting a decimal (2.8) to an int results in 2, not 3. It doesn't round; it truncates.</p>
        </div>
      </section>

      {/* 7. Live Practice */}
      <section className="pt-8 border-t border-mistral-navy/10">
        <h3 className="font-sans font-bold text-xl text-mistral-navy mb-8 text-left uppercase tracking-widest text-center">Interactive Mastery</h3>
        <p className="mb-8 text-sm text-center text-mistral-navy/70">Use what you've learned about types and casting to solve the puzzle below.</p>
        <WidgetRenderer widget={findWidget("var-practice-editor")} userLanguage={userLanguage} />
      </section>

      {/* 8. Knowledge Recap (Summary) */}
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
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">Memory Allocation</h4>
                <p className="text-xs text-white/60 leading-relaxed">Variables are labeled references to RAM addresses. Declaring them reserves space in the computer's temporary memory.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">02</div>
              <div>
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">Types & Casting</h4>
                <p className="text-xs text-white/60 leading-relaxed">Data Types determine the size and nature of data. Casting is the process of forced conversion between these types.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 p-6 rounded border border-white/10">
            <div className="flex gap-4 mb-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">03</div>
              <h4 className="font-sans font-bold text-sm uppercase tracking-wide mt-1 italic underline decoration-mistral-orange underline-offset-4">Syntax Signature ({userLanguage})</h4>
            </div>
            <div className="space-y-3 font-mono text-[11px]">
              {lang === "java" ? (
                <>
                  <p><span className="text-mistral-orange">int</span> score = 100;</p>
                  <p className="text-white/40 pl-4">// type name = value;</p>
                  <p><span className="text-mistral-orange">double</span> price = 19.99;</p>
                  <p className="text-white/40 pl-4">// use double for decimals</p>
                  <p><span className="text-mistral-orange">(int)</span> 2.8;</p>
                  <p className="text-white/40 pl-4">// explicit casting to whole number</p>
                </>
              ) : lang === "python" ? (
                <>
                  <p>score = 100</p>
                  <p className="text-white/40 pl-4"># Dynamically typed as int</p>
                  <p><span className="text-mistral-orange">str</span>(100)</p>
                  <p className="text-white/40 pl-4"># Casting number to text</p>
                  <p><span className="text-mistral-orange">float</span>("19.9")</p>
                  <p className="text-white/40 pl-4"># Casting text to decimal</p>
                </>
              ) : (
                <p className="text-white/60 italic">Understanding your language's type system is the foundation for efficient memory management in DSA.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center">
          <p className="font-sans text-sm text-white/80 mb-6">Variables mastered. Ready to learn how computers make decisions?</p>
          <Link href="/roadmaps/topics/control-flow" className="px-8 py-3 bg-mistral-orange text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-mistral-navy transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
             Control Flow &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
