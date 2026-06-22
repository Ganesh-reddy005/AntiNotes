"use client";
import React, { useState } from "react";
import { MCQQuiz } from "@/components/interactive/MCQQuiz";
import { CodeTabs } from "@/components/interactive/CodeTabs";
import { LiveCodeEditor } from "@/components/interactive/LiveCodeEditor";
import { Info, HelpCircle, Code2, Play, RotateCcw } from "lucide-react";

interface TopicProps {
  userLanguage: string;
}

export default function ArraysStringsTopic({ userLanguage }: TopicProps) {
  const lang = userLanguage.toLowerCase();
  
  // 1. Contiguous Memory Interactive state
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const memoryCells = [
    { index: 0, val: 10, addr: "0x100" },
    { index: 1, val: 20, addr: "0x104" },
    { index: 2, val: 30, addr: "0x108" },
    { index: 3, val: 40, addr: "0x10C" },
    { index: 4, val: 50, addr: "0x110" }
  ];

  // 2. Two-pointer String Reversal Interactive state
  const initialChars = ["h", "e", "l", "l", "o"];
  const [chars, setChars] = useState<string[]>(initialChars);
  const [left, setLeft] = useState<number>(0);
  const [right, setRight] = useState<number>(4);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [swapHistory, setSwapHistory] = useState<string[]>(["Pointers placed at start and end."]);

  const stepTwoPointers = () => {
    if (left >= right) {
      setIsFinished(true);
      return;
    }
    
    const nextChars = [...chars];
    const temp = nextChars[left];
    nextChars[left] = nextChars[right];
    nextChars[right] = temp;
    
    setChars(nextChars);
    setSwapHistory(prev => [
      ...prev,
      `Swapped position ${left} ('${chars[left]}') and position ${right} ('${chars[right]}'). Moved pointers inward.`
    ]);
    
    setLeft(prev => prev + 1);
    setRight(prev => prev - 1);
    
    if (left + 1 >= right - 1) {
      setIsFinished(true);
    }
  };

  const resetTwoPointers = () => {
    setChars(initialChars);
    setLeft(0);
    setRight(4);
    setIsFinished(false);
    setSwapHistory(["Pointers placed at start and end."]);
  };

  const codeExamples = {
    arrayAccess: {
      python: `items = [10, 20, 30, 40, 50]\n# Direct O(1) constant index access\nthird_item = items[2]\nprint(third_item)`,
      java: `int[] items = {10, 20, 30, 40, 50};\n// Direct O(1) constant index access\nint thirdItem = items[2];\nSystem.out.println(thirdItem);`,
      cpp: `std::vector<int> items = {10, 20, 30, 40, 50};\n// Direct O(1) constant index access\nint thirdItem = items[2];\nstd::cout << thirdItem << std::endl;`,
      javascript: `const items = [10, 20, 30, 40, 50];\n// Direct O(1) constant index access\nconst thirdItem = items[2];\nconsole.log(thirdItem);`
    },
    twoPointers: {
      python: `def reverse_string(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        s[left], s[right] = s[right], s[left] # Swap\n        left += 1\n        right -= 1\n    return s`,
      java: `public void reverseString(char[] s) {\n    int left = 0, right = s.length - 1;\n    while (left < right) {\n        char temp = s[left];\n        s[left] = s[right];\n        s[right] = temp; // Swap\n        left++;\n        right--;\n    }\n}`,
      cpp: `void reverseString(std::vector<char>& s) {\n    int left = 0, right = s.size() - 1;\n    while (left < right) {\n        std::swap(s[left], s[right]); // Swap\n        left++;\n        right--;\n    }\n}`,
      javascript: `function reverseString(s) {\n    let left = 0, right = s.length - 1;\n    while (left < right) {\n        let temp = s[left];\n        s[left] = s[right];\n        s[right] = temp; // Swap\n        left++;\n        right--;\n    }\n    return s;\n}`
    }
  };

  const activeArrayAccessCode = codeExamples.arrayAccess[lang as keyof typeof codeExamples.arrayAccess] || codeExamples.arrayAccess.python;
  const activeTwoPointersCode = codeExamples.twoPointers[lang as keyof typeof codeExamples.twoPointers] || codeExamples.twoPointers.python;

  const playgroundData = {
    python: {
      defaultCode: `# Array modification experiment
items = [10, 20, 30]
# Modify element at index 1
items[1] = 99
print(items)`,
      solution: {
        code: `items = [10, 20, 30]
items[1] = 99
print(items)`,
        explanation: "Modifying elements in an array by index is a constant time O(1) operation because the computer writes directly to the calculated memory address."
      }
    },
    java: {
      defaultCode: `public class Main {
    public static void main(String[] args) {
        int[] items = {10, 20, 30};
        // Modify element at index 1
        items[1] = 99;
        for (int x : items) {
            System.out.println(x);
        }
    }
}`,
      solution: {
        code: `public class Main {
    public static void main(String[] args) {
        int[] items = {10, 20, 30};
        items[1] = 99;
        for (int x : items) {
            System.out.println(x);
        }
    }
}`,
        explanation: "Modifying elements in an array by index is a constant time O(1) operation because the computer writes directly to the calculated memory address."
      }
    },
    cpp: {
      defaultCode: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> items = {10, 20, 30};
    // Modify element at index 1
    items[1] = 99;
    for (int x : items) {
        std::cout << x << std::endl;
    }
    return 0;
}`,
      solution: {
        code: `// Complete
items[1] = 99;`,
        explanation: "Modifying elements in an array by index is a constant time O(1) operation because the computer writes directly to the calculated memory address."
      }
    },
    javascript: {
      defaultCode: `const items = [10, 20, 30];
// Modify element at index 1
items[1] = 99;
console.log(items);`,
      solution: {
        code: `const items = [10, 20, 30];
items[1] = 99;
console.log(items);`,
        explanation: "Modifying elements in an array by index is a constant time O(1) operation because the computer writes directly to the calculated memory address."
      }
    }
  };

  const activePlayground = playgroundData[lang as keyof typeof playgroundData] || playgroundData.python;

  return (
    <div className="space-y-16">
      
      {/* 1. Arrays Concept Intro */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">Linear Data Structures: Arrays</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="text-lg text-mistral-navy/70 leading-relaxed mb-6">
            An <strong>Array</strong> is the most fundamental data structure in computer science. 
            It represents a collection of elements stored sequentially in contiguous memory blocks. 
            Because items are placed directly side-by-side, the computer can instantly read any element by computing its address offset.
          </p>
        </div>
      </section>

      {/* 2. Interactive Contiguous Memory Visualization */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-4 text-left">Interactive Array Memory Board</h2>
        <p className="font-sans text-mistral-navy/60 text-sm mb-6 text-left">
          Click on the memory cells to see how index-based lookup works behind the scenes.
        </p>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Memory Row */}
          <div className="bg-white border border-mistral-navy/10 p-8 shadow-sm flex flex-col items-center">
            
            <div className="flex flex-wrap gap-2 justify-center w-full max-w-xl">
              {memoryCells.map((cell) => {
                const isSelected = selectedCell === cell.index;
                return (
                  <button
                    key={cell.index}
                    onClick={() => setSelectedCell(cell.index)}
                    className={`w-20 h-24 border-2 flex flex-col justify-between p-2 font-mono transition-all ${
                      isSelected
                        ? "border-mistral-orange bg-mistral-orange/5"
                        : "border-mistral-navy/10 bg-mistral-bg hover:border-mistral-navy/30"
                    }`}
                  >
                    <span className="text-[10px] text-mistral-navy/40 self-center">{cell.addr}</span>
                    <span className="text-xl font-bold text-mistral-navy self-center">{cell.val}</span>
                    <span className="text-[10px] text-mistral-navy/60 bg-white/60 border border-mistral-navy/5 px-1 py-0.5 rounded self-center">[{cell.index}]</span>
                  </button>
                );
              })}
            </div>

            {/* Calculations Detail Box */}
            <div className="mt-8 border-t border-mistral-navy/5 pt-6 w-full max-w-xl text-left min-h-[90px]">
              {selectedCell !== null ? (
                <div className="text-xs space-y-2">
                  <p className="font-mono text-sm text-mistral-orange font-bold">Index [{selectedCell}] accessed</p>
                  <p className="font-sans text-mistral-navy/70 leading-relaxed">
                    The compiler calculates the address: <code>BaseAddress (0x100) + Index ({selectedCell}) * Size (4 bytes) = {memoryCells[selectedCell].addr}</code>.
                    The CPU reads this memory position instantly. This math equation makes access an <strong>O(1) constant time</strong> operation.
                  </p>
                </div>
              ) : (
                <p className="text-xs italic text-mistral-navy/40 text-center pt-4">Click a cell above to view the compiler address math.</p>
              )}
            </div>
            
            <div className="w-full max-w-xl bg-amber-50 p-4 border-l-4 border-amber-400 text-xs text-amber-900/80 text-left">
              <span className="font-mono font-bold block mb-1">Beginner Note:</span>
              it's ok if you don't understand the memory addresses or hexadecimal notation right now. We will guide you step-by-step through pointers later!
            </div>

          </div>

          <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4 text-left">
            <h4 className="font-mono text-lg font-bold text-mistral-navy">Reading Elements by Index</h4>
            <p className="font-sans text-sm text-mistral-navy/70 leading-relaxed">
              Below is how you write index lookups in your language. Access is always O(1).
            </p>
            
            <CodeTabs defaultLang={userLanguage}>
              <div data-lang={lang}>
                {JSON.stringify({
                  code: activeArrayAccessCode,
                  output: "30",
                  explanation: "Accessing elements using square brackets [] triggers the compiler's offset math instantly."
                })}
              </div>
            </CodeTabs>
          </div>
        </div>
      </section>

      {/* 3. Strings & The Two-Pointer Paradigm */}
      <section className="border-t border-mistral-navy/10 pt-16">
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">Strings & Pointers</h2>
        <div className="prose prose-mistral max-w-none text-left space-y-6">
          <p className="text-sm md:text-base text-mistral-navy/70 leading-relaxed">
            A <strong>String</strong> is simply an array of characters (e.g. <code>"hello"</code> is <code>['h', 'e', 'l', 'l', 'o']</code>). 
            Many classical string problems involve sorting or reversing data. 
            The most efficient strategy for these tasks is the <strong>Two-Pointer Technique</strong>, which places cursor tracking indicators at both boundaries and moves them inward.
          </p>
        </div>
      </section>

      {/* 4. Two-Pointer String Reversal Visualization */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-4 text-left">Interactive Two-Pointer Simulator</h2>
        <p className="font-sans text-mistral-navy/60 text-sm mb-6 text-left">
          Step through the two-pointer string reversal simulation to see how elements swap in-place.
        </p>

        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="bg-white border border-mistral-navy/10 p-8 shadow-sm flex flex-col items-center w-full">
            
            {/* Visual character slots */}
            <div className="flex gap-4 items-center justify-center h-28 relative w-full max-w-md">
              {chars.map((char, idx) => {
                const isLeft = left === idx;
                const isRight = right === idx;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    {/* Character block */}
                    <div className={`w-12 h-12 border-2 flex items-center justify-center font-mono text-lg font-bold rounded ${
                      isLeft ? "border-emerald-500 bg-emerald-50 text-emerald-700" :
                      isRight ? "border-blue-500 bg-blue-50 text-blue-700" :
                      "border-mistral-navy/10 bg-mistral-bg text-mistral-navy/60"
                    }`}>
                      {char}
                    </div>
                    {/* Pointer label */}
                    <div className="h-6 mt-1 font-mono text-[9px] uppercase font-bold text-center">
                      {isLeft && <span className="text-emerald-600 block">Left</span>}
                      {isRight && <span className="text-blue-600 block">Right</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={stepTwoPointers}
                disabled={isFinished}
                className="flex items-center gap-2 px-5 py-2.5 bg-mistral-navy text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-mistral-orange transition-colors disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Step Forward
              </button>
              <button
                onClick={resetTwoPointers}
                className="flex items-center gap-2 px-5 py-2.5 border border-mistral-navy/10 font-mono text-xs font-bold uppercase tracking-widest hover:bg-mistral-bg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            {/* History logs */}
            <div className="mt-8 border-t border-mistral-navy/5 pt-6 w-full max-w-md text-left text-xs font-mono space-y-2">
              <span className="text-[10px] text-mistral-navy/40 uppercase tracking-widest block mb-2">Step History:</span>
              <div className="max-h-24 overflow-y-auto space-y-1 text-mistral-navy/60 pl-2 border-l border-mistral-navy/10">
                {swapHistory.map((log, index) => (
                  <p key={index} className="leading-tight">&gt; {log}</p>
                ))}
              </div>
            </div>

            <div className="w-full max-w-md bg-amber-50 p-4 border-l-4 border-amber-400 text-xs text-amber-900/80 text-left mt-6">
              <span className="font-mono font-bold block mb-1">Beginner Note:</span>
              it's ok if you don't understand the while loops or list swaps yet. We will detail loop operations in the next modules!
            </div>

          </div>

          <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4 text-left">
            <h4 className="font-mono text-lg font-bold text-mistral-navy">In-Place String Reversal Algorithm</h4>
            <p className="font-sans text-sm text-mistral-navy/70 leading-relaxed">
              Below is how we implement string reversal using the Two-Pointer strategy.
            </p>
            
            <CodeTabs defaultLang={userLanguage}>
              <div data-lang={lang}>
                {JSON.stringify({
                  code: activeTwoPointersCode,
                  output: '["o","l","l","e","h"]',
                  explanation: "This swaps characters from the edges inward, completing in O(N) linear time and using O(1) auxiliary space (no extra memory allocation)."
                })}
              </div>
            </CodeTabs>
          </div>

        </div>
      </section>

      {/* 5. Interactive Live Compiler Playground */}
      <section className="border-t border-mistral-navy/10 pt-16 text-left">
        <div className="flex items-center gap-2 mb-6">
          <Code2 className="w-5 h-5 text-mistral-orange" />
          <span className="font-mono text-xs text-mistral-navy/60 uppercase tracking-widest">Active Code Playground</span>
        </div>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-4">Playground: Index Modifications</h2>
        <p className="font-sans text-sm text-mistral-navy/70 leading-relaxed mb-6">
          Modify the array elements by setting values at different indices, and observe how quickly the changes apply.
        </p>

        <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4">
          <div className="text-xs text-mistral-navy/70 space-y-2">
            <p><strong>Step 1:</strong> Run the code to modify the element at index 1 to 99.</p>
            <p><strong>Step 2:</strong> Change the index parameter or assignment value to see how indexing outputs change dynamically!</p>
          </div>

          <LiveCodeEditor 
            language={lang}
            defaultCode={activePlayground.defaultCode}
            solution={activePlayground.solution}
          />
        </div>
      </section>

      {/* 6. MCQ Checkpoint */}
      <section className="pt-8 border-t border-mistral-navy/10">
        <h3 className="font-sans font-bold text-xl text-mistral-navy mb-8 text-left uppercase tracking-widest text-center">Interactive Mastery Check</h3>
        <MCQQuiz 
          question="Why does accessing an element in an array by index take constant O(1) time?" 
          options={[
            "The computer checks every slot in order until it finds the index",
            "The computer calculates the exact memory location using math and accesses it directly",
            "Arrays are smaller than other data structures",
            "It requires sorting the elements first"
          ]} 
          correctIndex={1}
          explanation="Since elements are stored in contiguous memory, the memory address of any element is calculated in a single step using the base address, index, and element size." 
        />
      </section>

      {/* 7. Summary Recap */}
      <section className="bg-mistral-navy text-white p-10 rounded-sm shadow-xl">
        <div className="flex items-center gap-3 mb-8">
          <HelpCircle className="w-8 h-8 text-mistral-orange" />
          <h2 className="font-serif text-3xl font-medium">Knowledge Recap</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">01</div>
              <div>
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">Contiguous Layout</h4>
                <p className="text-xs text-white/60 leading-relaxed">Arrays store elements adjacent to each other, allowing instant O(1) read/write access via offset calculation.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">02</div>
              <div>
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">Two Pointers</h4>
                <p className="text-xs text-white/60 leading-relaxed">The two-pointer technique uses indices at start and end boundaries moving inward to process sequences efficiently.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 p-6 rounded border border-white/10">
            <div className="flex gap-4 mb-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">03</div>
              <h4 className="font-sans font-bold text-sm uppercase tracking-wide mt-1 italic underline decoration-mistral-orange underline-offset-4">Array Time Complexity</h4>
            </div>
            <div className="space-y-2 font-mono text-[11px] text-white/80">
              <p>Index Access: O(1) Constant</p>
              <p>Index Update: O(1) Constant</p>
              <p>In-Place Reversal: O(N) Linear</p>
              <p>Search (Unsorted): O(N) Linear</p>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
