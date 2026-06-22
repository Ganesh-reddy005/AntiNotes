"use client";
import React, { useState } from "react";
import Link from "next/link";
import { MCQQuiz } from "@/components/interactive/MCQQuiz";
import { CodeTabs } from "@/components/interactive/CodeTabs";
import { LiveCodeEditor } from "@/components/interactive/LiveCodeEditor";
import { Info, HelpCircle, Code2 } from "lucide-react";

interface TopicProps {
  userLanguage: string;
}

export default function ArraysListsTopic({ userLanguage }: TopicProps) {
  const lang = userLanguage.toLowerCase();
  
  // Array cells visualization state
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const elements = [
    { index: 0, val: 10 },
    { index: 1, val: 20 },
    { index: 2, val: 30 },
    { index: 3, val: 40 },
    { index: 4, val: 50 }
  ];

  const codeExamples = {
    python: `items = [10, 20, 30, 40, 50]\n# Access index 2 (the third element)\nval = items[2]\nprint(val)  # Output: 30`,
    java: `int[] items = {10, 20, 30, 40, 50};\n// Access index 2 (the third element)\nint val = items[2];\nSystem.out.println(val);  // Output: 30`,
    cpp: `std::vector<int> items = {10, 20, 30, 40, 50};\n// Access index 2 (the third element)\nint val = items[2];\nstd::cout << val << std::endl;  // Output: 30`,
    javascript: `const items = [10, 20, 30, 40, 50];\n// Access index 2 (the third element)\nconst val = items[2];\nconsole.log(val);  // Output: 30`
  };

  const activeCodeExample = codeExamples[lang as keyof typeof codeExamples] || codeExamples.python;

  const playgroundData = {
    python: {
      defaultCode: `def print_odd_indices(arr):
    # Task: Print every element stored at an ODD index (1, 3, 5, etc.)
    # Hint: Loop through indices from 0 to len(arr) - 1
    # Check if index % 2 != 0, then print arr[index]
    pass

# Test array with 10 elements
test_array = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
print_odd_indices(test_array)`,
      solution: {
        code: `def print_odd_indices(arr):
    for i in range(len(arr)):
        if i % 2 != 0:
            print(arr[i])

test_array = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
print_odd_indices(test_array)`,
        explanation: "The loop checks every index i from 0 to 9. The modulo check i % 2 != 0 is true only for odd indices (1, 3, 5, 7, 9), printing the values 20, 40, 60, 80, and 100."
      }
    },
    java: {
      defaultCode: `public class Main {
    public static void printOddIndices(int[] arr) {
        // Task: Print every element stored at an ODD index (1, 3, 5, etc.)
        // Hint: Loop through index i from 0 to arr.length - 1
        // Check if i % 2 != 0, then print arr[i]
    }

    public static void main(String[] args) {
        int[] testArray = {10, 20, 30, 40, 50, 60, 70, 80, 90, 100};
        printOddIndices(testArray);
    }
}`,
      solution: {
        code: `public class Main {
    public static void printOddIndices(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            if (i % 2 != 0) {
                System.out.println(arr[i]);
            }
        }
    }

    public static void main(String[] args) {
        int[] testArray = {10, 20, 30, 40, 50, 60, 70, 80, 90, 100};
        printOddIndices(testArray);
    }
}`,
        explanation: "The loop checks every index i from 0 to 9. The modulo check i % 2 != 0 is true only for odd indices (1, 3, 5, 7, 9), printing the values 20, 40, 60, 80, and 100."
      }
    },
    cpp: {
      defaultCode: `#include <iostream>
#include <vector>

void printOddIndices(const std::vector<int>& arr) {
    // Task: Print every element stored at an ODD index (1, 3, 5, etc.)
    // Hint: Loop through index i from 0 to arr.size() - 1
    // Check if i % 2 != 0, then print arr[i]
}

int main() {
    std::vector<int> testArray = {10, 20, 30, 40, 50, 60, 70, 80, 90, 100};
    printOddIndices(testArray);
    return 0;
}`,
      solution: {
        code: `#include <iostream>
#include <vector>

void printOddIndices(const std::vector<int>& arr) {
    for (int i = 0; i < arr.size(); i++) {
        if (i % 2 != 0) {
            std::cout << arr[i] << std::endl;
        }
    }
}

int main() {
    std::vector<int> testArray = {10, 20, 30, 40, 50, 60, 70, 80, 90, 100};
    printOddIndices(testArray);
    return 0;
}`,
        explanation: "The loop checks every index i from 0 to 9. The modulo check i % 2 != 0 is true only for odd indices (1, 3, 5, 7, 9), printing the values 20, 40, 60, 80, and 100."
      }
    },
    javascript: {
      defaultCode: `function printOddIndices(arr) {
    // Task: Print every element stored at an ODD index (1, 3, 5, etc.)
    // Hint: Loop through index i from 0 to arr.length - 1
    // Check if i % 2 !== 0, then print arr[i]
}

const testArray = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
printOddIndices(testArray);`,
      solution: {
        code: `function printOddIndices(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (i % 2 !== 0) {
            console.log(arr[i]);
        }
    }
}

const testArray = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
printOddIndices(testArray);`,
        explanation: "The loop checks every index i from 0 to 9. The modulo check i % 2 !== 0 is true only for odd indices (1, 3, 5, 7, 9), printing the values 20, 40, 60, 80, and 100."
      }
    }
  };

  const activePlayground = playgroundData[lang as keyof typeof playgroundData] || playgroundData.python;

  return (
    <div className="space-y-16">
      
      {/* 1. Introduction */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">Linear Data Structures: Arrays & Lists</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="text-lg text-mistral-navy/70 leading-relaxed mb-6">
            An <strong>Array</strong> (or a list) is the most basic way to store a sequence of items together in memory. 
            Imagine a row of numbered lockers: each locker holds one item, and you open them by using their index numbers.
          </p>
        </div>
      </section>

      {/* 2. Interactive Cell Index Selector */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-4 text-left">Zero-Based Indexing</h2>
        <p className="font-sans text-mistral-navy/60 text-sm mb-6 text-left">
          In programming, we always start counting at <strong>0</strong>. Click on any cell below to see its values.
        </p>

        <div className="max-w-xl mx-auto space-y-8 bg-white border border-mistral-navy/10 p-8 shadow-sm flex flex-col items-center">
          <div className="flex gap-2 justify-center w-full">
            {elements.map((cell) => {
              const isSelected = selectedIndex === cell.index;
              return (
                <button
                  key={cell.index}
                  onClick={() => setSelectedIndex(cell.index)}
                  className={`w-16 h-16 border-2 flex flex-col justify-center items-center font-mono transition-all ${
                    isSelected
                      ? "border-mistral-orange bg-mistral-orange/5 text-mistral-orange"
                      : "border-mistral-navy/10 bg-mistral-bg text-mistral-navy hover:border-mistral-navy/30"
                  }`}
                >
                  <span className="text-lg font-bold">{cell.val}</span>
                  <span className="text-[10px] text-mistral-navy/40">[{cell.index}]</span>
                </button>
              );
            })}
          </div>

          <div className="w-full text-left min-h-[50px] text-xs">
            {selectedIndex !== null ? (
              <p className="font-sans text-mistral-navy/70 leading-relaxed">
                The element at index <strong>{selectedIndex}</strong> is <strong>{elements[selectedIndex].val}</strong>.
              </p>
            ) : (
              <p className="text-xs italic text-mistral-navy/40 text-center pt-2">Click an array cell above to inspect it.</p>
            )}
          </div>
        </div>
      </section>

      {/* 3. Code Access Example */}
      <section className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4 text-left max-w-xl mx-auto">
        <h4 className="font-mono text-lg font-bold text-mistral-navy">Reading Elements by Index</h4>
        <p className="font-sans text-sm text-mistral-navy/70 leading-relaxed">
          Accessing elements is highly efficient, executing in a single step (O(1) constant time).
        </p>
        
        <CodeTabs defaultLang={userLanguage}>
          <div data-lang={lang}>
            {JSON.stringify({
              code: activeCodeExample,
              output: "30",
              explanation: "Accessing elements using square brackets [] queries the memory index instantly."
            })}
          </div>
        </CodeTabs>
      </section>

      {/* 4. Coding Playground: Logic Check */}
      <section className="border-t border-mistral-navy/10 pt-16 text-left">
        <div className="flex items-center gap-2 mb-6">
          <Code2 className="w-5 h-5 text-mistral-orange" />
          <span className="font-mono text-xs text-mistral-navy/60 uppercase tracking-widest">Logic Practice</span>
        </div>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-4">Playground: Print Odd Indices</h2>
        <p className="font-sans text-sm text-mistral-navy/70 leading-relaxed mb-6">
          Apply your looping and array-indexing logic below. 
          Given an array of 10 elements, print only the values stored at <strong>odd index positions</strong>.
        </p>

        <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4">
          <div className="bg-amber-50 p-4 border-l-4 border-amber-400 text-xs text-amber-900/80 mb-4 rounded-r">
            <span className="font-mono font-bold block mb-1">Beginner Note:</span>
            it's ok if you don't understand the indexing or loop checks fully now. 
            Take a guess, try editing the code, or click "Show Answer" to inspect how loop iteration index modulo calculation is resolved!
          </div>

          <LiveCodeEditor 
            key={lang}
            language={lang}
            defaultCode={activePlayground.defaultCode}
            solution={activePlayground.solution}
          />
        </div>
      </section>

      {/* 5. MCQ Checkpoint */}
      <section className="pt-8 border-t border-mistral-navy/10">
        <h3 className="font-sans font-bold text-xl text-mistral-navy mb-8 text-left uppercase tracking-widest text-center">Interactive Mastery Check</h3>
        <MCQQuiz 
          question="For an array of size N, what is the index of the very first element and the very last element?" 
          options={[
            "First element is at index 1, last element is at index N",
            "First element is at index 0, last element is at index N - 1",
            "First element is at index 0, last element is at index N",
            "First element is at index 1, last element is at index N - 1"
          ]} 
          correctIndex={1}
          explanation="Since arrays use zero-based indexing, indices run from 0 up to N - 1." 
        />
      </section>

      {/* 6. Summary Recap */}
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
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">Zero-Based Indexing</h4>
                <p className="text-xs text-white/60 leading-relaxed">The first item is always at index 0, and the last item is at index N-1.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">02</div>
              <div>
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">Index Offset Lookup</h4>
                <p className="text-xs text-white/60 leading-relaxed">Reading or writing elements using bracket indicators runs in constant O(1) time complexity.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 p-6 rounded border border-white/10">
            <div className="flex gap-4 mb-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">03</div>
              <h4 className="font-sans font-bold text-sm uppercase tracking-wide mt-1 italic underline decoration-mistral-orange underline-offset-4">Linear Data Operations</h4>
            </div>
            <div className="space-y-2 font-mono text-[11px] text-white/80">
              <p>Read elements by index: O(1) Constant</p>
              <p>Write/Update elements by index: O(1) Constant</p>
              <p>Sequential loops over N items: O(N) Linear</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center">
          <p className="font-sans text-sm text-white/80 mb-6 text-center">Arrays & Lists Complete. Ready to learn how pointers swap elements in character arrays?</p>
          <Link href="/roadmaps/topics/strings-two-pointers?roadmap=dsa-fundamentals" className="px-8 py-3 bg-mistral-orange text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-mistral-navy transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
            Go to Module 3: Strings & Two Pointers &rarr;
          </Link>
        </div>
      </section>
      
    </div>
  );
}
