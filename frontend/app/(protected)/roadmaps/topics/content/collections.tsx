"use client";
import React from "react";
import { WidgetRenderer } from "@/components/interactive/WidgetRenderer";
import { InteractiveWidget } from "@/lib/api";
import { CheckCircle2, LayoutGrid, Database, Key } from "lucide-react";
import Link from "next/link";

interface TopicProps {
  widgets: InteractiveWidget[];
  userLanguage: string;
}

export default function CollectionsTopic({ widgets, userLanguage }: TopicProps) {
  const findWidget = (id: string) => widgets.find(w => w.widget_id === id);
  const lang = userLanguage.toLowerCase();

  return (
    <div className="space-y-16">
      {/* 1. Introduction */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">The Warehouse of Data</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="text-lg text-mistral-navy/70 leading-relaxed mb-6">
            Until now, we've used single variables to store data. But what if you have 10,000 users? 
            You wouldn't create 10,000 variables. You'd use a <strong>Collection</strong>.
          </p>
          <div className="bg-white border-2 border-mistral-navy/5 p-8 rounded-sm shadow-sm border-l-4 border-l-mistral-orange">
            <h4 className="font-sans font-bold text-mistral-navy mb-4 uppercase tracking-widest text-xs">The Parking Lot Analogy:</h4>
            <ul className="text-sm text-mistral-navy/70 space-y-3 list-disc ml-4">
              <li><strong>Spot 0, Spot 1, Spot 2:</strong> An array is like a row of parking spots. Each spot has a number (Index).</li>
              <li><strong>Zero-Based Indexing:</strong> In programming, we <em>always</em> start counting from 0. The first car is at spot 0.</li>
              <li><strong>Efficiency:</strong> Collections allow us to group related data and process them all at once using loops.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2. Arrays & Lists */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">Arrays & Dynamic Lists</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="mb-6">
            The most common collection is the <strong>Array</strong> (or <strong>List</strong>). It stores items in a specific order.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
            <div className="bg-mistral-bg p-6 rounded-sm border border-mistral-navy/10">
              <div className="flex items-center gap-2 mb-4">
                <LayoutGrid className="w-5 h-5 text-mistral-orange" />
                <h5 className="font-sans font-bold text-mistral-navy uppercase tracking-tighter text-sm">Static Arrays</h5>
              </div>
              <ul className="text-xs text-mistral-navy/60 space-y-2 list-disc ml-4">
                <li><strong>Fixed Size:</strong> You must decide the size when you create it.</li>
                <li><strong>Fast Access:</strong> Getting an item by its index is incredibly fast.</li>
                <li><strong>Used in:</strong> Java/C++ raw arrays.</li>
              </ul>
            </div>
            
            <div className="bg-mistral-bg p-6 rounded-sm border border-mistral-navy/10">
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-mistral-navy" />
                <h5 className="font-sans font-bold text-mistral-navy uppercase tracking-tighter text-sm">Dynamic Lists</h5>
              </div>
              <ul className="text-xs text-mistral-navy/60 space-y-2 list-disc ml-4">
                <li><strong>Growing Size:</strong> It automatically gets bigger as you add more items.</li>
                <li><strong>Flexible:</strong> Most modern programming uses these by default.</li>
                <li><strong>Called:</strong> Python <code>list</code>, Java <code>ArrayList</code>, C++ <code>vector</code>, JS <code>Array</code>.</li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 p-6 border-l-4 border-amber-400 mb-8">
            <h4 className="font-sans font-bold text-amber-800 text-sm mb-2 uppercase tracking-widest">⚠️ The "Off-By-One" Error</h4>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              Because we start at 0, the last item in a list of 10 items is at index **9**, not 10. 
              Trying to access <code>list[10]</code> will cause an "Index Out of Bounds" crash!
            </p>
          </div>

          <WidgetRenderer widget={findWidget("col-array-tabs")} userLanguage={userLanguage} />
        </div>
      </section>

      {/* 3. Dictionaries / Maps */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">Dictionaries & Maps (Key-Value)</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="mb-6">
            Sometimes you don't want to look up data by a number. You want to look it up by a <strong>Key</strong> (like a name or ID).
            This is where <strong>Maps</strong> (or Dictionaries) come in.
          </p>

          <div className="bg-mistral-bg p-8 rounded-sm border border-mistral-navy/10 mb-8">
            <div className="flex items-center gap-3 mb-6 justify-center">
              <Key className="w-6 h-6 text-mistral-orange" />
              <h4 className="font-sans font-bold text-mistral-navy uppercase tracking-widest text-xs">The Key-Value Pair</h4>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-4 items-center">
                <div className="px-4 py-2 bg-mistral-navy text-white font-mono text-xs rounded shadow-sm">"Alice"</div>
                <div className="text-mistral-navy/20">→</div>
                <div className="px-4 py-2 bg-white border border-mistral-navy/10 font-mono text-xs rounded shadow-sm">"555-0199"</div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="px-4 py-2 bg-mistral-navy text-white font-mono text-xs rounded shadow-sm">"Bob"</div>
                <div className="text-mistral-navy/20">→</div>
                <div className="px-4 py-2 bg-white border border-mistral-navy/10 font-mono text-xs rounded shadow-sm">"555-0123"</div>
              </div>
              <p className="text-[10px] text-mistral-navy/40 mt-4 italic">Think of it like a real Dictionary: The "Word" is the Key, and the "Definition" is the Value.</p>
            </div>
          </div>

          <WidgetRenderer widget={findWidget("col-map-tabs")} userLanguage={userLanguage} />
        </div>
      </section>

      {/* Interactive Mastery */}
      <section className="pt-8 border-t border-mistral-navy/10">
        <h3 className="font-sans font-bold text-xl text-mistral-navy mb-8 text-left uppercase tracking-widest text-center">Interactive Mastery</h3>
        <WidgetRenderer widget={findWidget("col-mcq")} userLanguage={userLanguage} />
        <div className="mt-12">
          <h4 className="font-sans font-bold text-sm text-mistral-navy mb-2 text-center uppercase tracking-widest">Challenge: The Grocery List</h4>
          <p className="mb-6 text-center text-xs text-mistral-navy/60 italic">Add "Milk" to the end of the list and then print the 2nd item in the list.</p>
          <WidgetRenderer widget={findWidget("col-practice-editor")} userLanguage={userLanguage} />
        </div>
      </section>

      {/* Knowledge Recap */}
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
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">0-Based Indexing</h4>
                <p className="text-xs text-white/60 leading-relaxed">Always start counting at 0. The first item is <code>list[0]</code>.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">02</div>
              <div>
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">Lists vs Maps</h4>
                <p className="text-xs text-white/60 leading-relaxed">Lists are ordered by numbers. Maps are unordered but indexed by unique keys.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">03</div>
              <div>
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">Bounds Checking</h4>
                <p className="text-xs text-white/60 leading-relaxed">Accessing an index that doesn't exist will crash your code. Always check the length!</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 p-6 rounded border border-white/10" style={{ fontVariantLigatures: "none" }}>
            <div className="flex gap-4 mb-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">04</div>
              <h4 className="font-sans font-bold text-sm uppercase tracking-wide mt-1 italic underline decoration-mistral-orange underline-offset-4">Syntax Signature ({userLanguage})</h4>
            </div>
            <div className="space-y-3 font-mono text-[11px]">
              {lang === "java" ? (
                <>
                  <p>ArrayList{"<"}String{">"} list = <span className="text-mistral-orange">new</span> ArrayList{"<"}{">"}();</p>
                  <p>list.add("Apple"); <span className="text-white/30">// Add</span></p>
                  <p>String item = list.get(0); <span className="text-white/30">// Read</span></p>
                  <p>HashMap{"<"}K, V{">"} map = <span className="text-mistral-orange">new</span> HashMap{"<"}{">"}();</p>
                </>
              ) : lang === "python" ? (
                <>
                  <p>my_list = ["Apple", "Banana"]</p>
                  <p>my_list.append("Cherry") <span className="text-white/30"># Add</span></p>
                  <p>item = my_list[0] <span className="text-white/30"># Read</span></p>
                  <p>my_dict = {"{"}"key": "value"{"}"}</p>
                </>
              ) : lang === "cpp" ? (
                <>
                  <p>vector{"<"}string{">"} vec = {"{"}"Apple"{"}"};</p>
                  <p>vec.push_back("Banana"); <span className="text-white/30">// Add</span></p>
                  <p>string s = vec[0]; <span className="text-white/30">// Read</span></p>
                  <p>unordered_map{"<"}K, V{">"} map;</p>
                </>
              ) : (
                <>
                  <p>const arr = ["Apple"];</p>
                  <p>arr.push("Banana"); <span className="text-white/30">// Add</span></p>
                  <p>const item = arr[0]; <span className="text-white/30">// Read</span></p>
                  <p>const map = new Map();</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center">
          <p className="font-sans text-sm text-white/80 mb-6">Collections mastered. Ready to learn how to organize code into reusable blocks?</p>
          <Link href="/roadmaps/topics/functions" className="px-8 py-3 bg-mistral-orange text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-mistral-navy transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
            Go to Functions &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
