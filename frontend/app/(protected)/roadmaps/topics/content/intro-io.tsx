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

export default function IntroToIOTopic({ widgets, userLanguage }: TopicProps) {
  const findWidget = (id: string) => widgets.find(w => w.widget_id === id);
  const lang = userLanguage.toLowerCase();

  return (
    <div className="space-y-16">
      {/* 1. The "What & Why" of Programming */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6">What is Programming?</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="text-lg text-mistral-navy/70 leading-relaxed">
            At its simplest, <strong>programming is giving instructions to a computer.</strong> 
            Computers are incredibly fast but they lack common sense. They cannot "guess" what you want; they only follow the exact steps you provide.
          </p>
          <div className="my-8 bg-white border-2 border-mistral-navy/5 p-6 rounded-sm shadow-sm border-l-4 border-l-mistral-orange">
            <h4 className="font-sans font-bold text-mistral-navy mb-2">The Recipe Analogy</h4>
            <p className="text-sm italic text-mistral-navy/60">
              Think of a program like a <strong>recipe</strong>. The computer is the chef, and you are the recipe writer. 
              If you forget to say "boil the water," the chef will just throw the dry pasta into the pot. 
              In programming, being specific is everything.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Syntax: The Grammar of Machines */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6">Understanding Syntax</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="mb-6">
            <strong>Syntax</strong> is the set of rules that defines how a program must be written. 
            Without these rules, the computer wouldn't know where one instruction ends and the next begins.
          </p>

          <div className="bg-mistral-bg p-8 rounded-sm border border-mistral-navy/10 mb-8">
            <h4 className="font-sans font-bold text-mistral-navy mb-6 text-center uppercase tracking-widest text-xs">Anatomy of {userLanguage} Syntax</h4>
            
            {lang === "java" && (
              <div className="grid grid-cols-1 gap-6">
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">public class Main</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">Everything in Java lives inside a <strong>Class</strong>. Think of this as the "container" for your program. The name must match your file name.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">static void main</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">This is the <strong>Entry Point</strong>. When you hit "Run," the computer looks for this specific line to start executing your instructions.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">{"{ }"}</code>
                  <p className="text-sm text-mistral-navy/70 mt-1"><strong>Curly Braces</strong> define a "block" of code. Everything inside the braces belongs to that class or method.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">;</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">The <strong>Semicolon</strong> is like a period in a sentence. It tells Java that an instruction is finished.</p>
                </div>
              </div>
            )}

            {lang === "python" && (
              <div className="grid grid-cols-1 gap-6">
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">def main():</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">While not always required, defining a main function is a best practice to organize your logic.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">Indentation</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">Python uses <strong>4 spaces</strong> to show which code belongs together. If you don't indent, the computer won't know the code is part of the function!</p>
                </div>
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">:</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">The <strong>Colon</strong> tells Python that a new block of code (like a function or loop) is about to start.</p>
                </div>
              </div>
            )}

            {lang === "cpp" && (
              <div className="grid grid-cols-1 gap-6">
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">#include &lt;iostream&gt;</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">This tells C++ to "import" a tool that allows it to talk to the screen (input/output).</p>
                </div>
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">int main()</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">The main function where execution begins. The <code>int</code> means it returns an integer status code to the OS.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">std::cout</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">Short for <strong>Character Output</strong>. The <code>&lt;&lt;</code> symbols "push" data toward the screen.</p>
                </div>
              </div>
            )}

            {lang === "javascript" && (
              <div className="grid grid-cols-1 gap-6">
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">function</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">The keyword used to define a block of reusable code.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">console.log()</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">The tool used to send data to the browser's debug console.</p>
                </div>
                <div className="flex gap-4 items-start">
                  <code className="bg-mistral-navy text-white px-2 py-1 rounded text-xs shrink-0">camelCase</code>
                  <p className="text-sm text-mistral-navy/70 mt-1">JS convention where the first word is lowercase and subsequent words are Capitalized.</p>
                </div>
              </div>
            )}
          </div>

          <p className="mb-4 text-sm font-medium">Observe these rules in action across languages:</p>
          <WidgetRenderer widget={findWidget("intro-io-syntax-tabs")} userLanguage={userLanguage} debugId="intro-io-syntax-tabs" />
        </div>
      </section>

      {/* 3. Output: The Program's Voice */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6">Output (Printing)</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="mb-6">
            <strong>Output</strong> is how a program displays information to the user. 
          </p>

          <div className="bg-emerald-50/50 p-6 rounded-sm border-l-2 border-emerald-500 my-8">
            <h4 className="font-sans font-bold text-emerald-800 text-sm mb-4 italic">Breakdown of the Print Command:</h4>
            {lang === "java" ? (
              <div className="space-y-3">
                <p className="text-xs text-emerald-900/80"><code>System</code>: A built-in class that provides access to the system.</p>
                <p className="text-xs text-emerald-900/80"><code>out</code>: The "output stream" connected to the console.</p>
                <p className="text-xs text-emerald-900/80"><code>println</code>: Short for "Print Line". It prints your text and then moves to a new line.</p>
              </div>
            ) : lang === "python" ? (
              <div className="space-y-3">
                <p className="text-xs text-emerald-900/80"><code>print</code>: A built-in function that takes whatever is inside the parentheses and displays it.</p>
                <p className="text-xs text-emerald-900/80"><code>"..."</code>: Double quotes tell the computer that this is <strong>text</strong> (a String), not code to be executed.</p>
              </div>
            ) : (
              <p className="text-xs text-emerald-900/80">This command tells the computer to take a piece of data (usually text in quotes) and push it out to the user's screen or console window.</p>
            )}
          </div>

          <WidgetRenderer widget={findWidget("intro-io-hello-tabs")} userLanguage={userLanguage} debugId="intro-io-hello-tabs" />
        </div>
      </section>

      {/* 4. Comments: Notes for Humans */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6">Comments</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="mb-6">
            <strong>Comments</strong> are parts of the code that the computer completely ignores. 
            They are written for <strong>you</strong> and other developers who might read your code later.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
            <div className="p-4 border border-amber-200 bg-amber-50/30 rounded-sm">
              <h5 className="font-sans font-bold text-xs text-amber-800 mb-1">Single-line</h5>
              <p className="text-[11px] text-amber-900/70">Used for quick notes explaining a single line of logic.</p>
            </div>
            <div className="p-4 border border-amber-200 bg-amber-50/30 rounded-sm">
              <h5 className="font-sans font-bold text-xs text-amber-800 mb-1">Multi-line</h5>
              <p className="text-[11px] text-amber-900/70">Used for longer documentation or "commenting out" blocks of code during testing.</p>
            </div>
          </div>

          <WidgetRenderer widget={findWidget("intro-io-comments-tabs")} userLanguage={userLanguage} debugId="intro-io-comments-tabs" />
        </div>
      </section>

      {/* Checkpoint & Practice */}
      <section className="pt-8 border-t border-mistral-navy/10">
        <h3 className="font-sans font-bold text-xl text-mistral-navy mb-8 text-left uppercase tracking-widest text-center">Interactive Mastery</h3>
        <WidgetRenderer widget={findWidget("intro-io-q1")} userLanguage={userLanguage} debugId="intro-io-q1" />
        <div className="mt-12">
          <p className="mb-4 text-center text-mistral-navy/50 text-sm italic">"The only way to learn a new programming language is by writing programs in it." — Dennis Ritchie</p>
          <WidgetRenderer widget={findWidget("intro-io-live-editor")} userLanguage={userLanguage} debugId="intro-io-live-editor" />
        </div>
      </section>

      {/* 6. Knowledge Recap (Summary) */}
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
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">Programming</h4>
                <p className="text-xs text-white/60 leading-relaxed">Giving precise, step-by-step instructions to a machine that lacks intuition.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">02</div>
              <div>
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">Output & Comments</h4>
                <p className="text-xs text-white/60 leading-relaxed"><strong>Output</strong> lets the computer talk to the user. <strong>Comments</strong> let the developer talk to other humans.</p>
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
                  <p><span className="text-mistral-orange">public class</span> Main {"{"} ... {"}"}</p>
                  <p className="text-white/40 pl-4">// The container for your program</p>
                  <p><span className="text-mistral-orange">static void main</span>(String[] args) {"{"} ... {"}"}</p>
                  <p className="text-white/40 pl-4">// The starting point of execution</p>
                  <p>System.out.<span className="text-mistral-orange">println</span>("...");</p>
                  <p className="text-white/40 pl-4">// The command to show output</p>
                </>
              ) : lang === "python" ? (
                <>
                  <p><span className="text-mistral-orange">def</span> main():</p>
                  <p className="text-white/40 pl-4"># Organize your logic in functions</p>
                  <p><span className="text-mistral-orange">print</span>("...")</p>
                  <p className="text-white/40 pl-4"># Simple, direct output</p>
                  <p className="text-mistral-orange">Indentation (4 spaces)</p>
                  <p className="text-white/40"># Defines what code belongs where</p>
                </>
              ) : (
                <p className="text-white/60 italic">Syntax rules ensure your instructions are mapped correctly to the computer's memory and CPU.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center">
          <p className="font-sans text-sm text-white/80 mb-6">Foundation Complete. Ready to learn how computers remember data?</p>
          <Link href="/roadmaps/topics/variables" className="px-8 py-3 bg-mistral-orange text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-mistral-navy transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
            Go to Module 2: Variables &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
