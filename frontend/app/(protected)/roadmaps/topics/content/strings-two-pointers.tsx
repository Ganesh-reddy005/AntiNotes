"use client";
import React, { useState } from "react";
import Link from "next/link";
import { MCQQuiz } from "@/components/interactive/MCQQuiz";
import { CodeTabs } from "@/components/interactive/CodeTabs";
import { LiveCodeEditor } from "@/components/interactive/LiveCodeEditor";
import { HelpCircle, Code2, Play, RotateCcw } from "lucide-react";

interface TopicProps {
  userLanguage: string;
}

export default function StringsTwoPointersTopic({ userLanguage }: TopicProps) {
  const lang = userLanguage.toLowerCase();
  
  // Two-pointer String Reversal Interactive state
  const initialChars = ["h", "e", "l", "l", "o"];
  const [chars, setChars] = useState<string[]>(initialChars);
  const [left, setLeft] = useState<number>(0);
  const [right, setRight] = useState<number>(4);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [swapHistory, setSwapHistory] = useState<string[]>(["Pointers placed at start and end indices."]);

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
      `Swapped index ${left} ('${chars[left]}') and index ${right} ('${chars[right]}'). Moved pointers inward.`
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
    setSwapHistory(["Pointers placed at start and end indices."]);
  };

  const codeExamples = {
    twoPointers: {
      python: `def reverse_string(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        s[left], s[right] = s[right], s[left] # Swap\n        left += 1\n        right -= 1\n    return s`,
      java: `public void reverseString(char[] s) {\n    int left = 0, right = s.length - 1;\n    while (left < right) {\n        char temp = s[left];\n        s[left] = s[right];\n        s[right] = temp; // Swap\n        left++;\n        right--;\n    }\n}`,
      cpp: `void reverseString(std::vector<char>& s) {\n    int left = 0, right = s.size() - 1;\n    while (left < right) {\n        std::swap(s[left], s[right]); // Swap\n        left++;\n        right--;\n    }\n}`,
      javascript: `function reverseString(s) {\n    let left = 0, right = s.length - 1;\n    while (left < right) {\n        let temp = s[left];\n        s[left] = s[right];\n        s[right] = temp; // Swap\n        left++;\n        right--;\n    }\n    return s;\n}`
    }
  };

  const activeTwoPointersCode = codeExamples.twoPointers[lang as keyof typeof codeExamples.twoPointers] || codeExamples.twoPointers.python;

  const playgroundData = {
    python: {
      defaultCode: `def reverse_string(s):
    # Task: Reverse the list of characters s in-place using two pointers
    # Hint: Start left at 0 and right at len(s) - 1. Loop while left < right.
    # Swap s[left] and s[right], then increment left and decrement right.
    pass

# Test characters
test_chars = ['a', 'b', 'c', 'd', 'e']
reverse_string(test_chars)
print(test_chars)`,
      solution: {
        code: `def reverse_string(s):
    left, right = 0, len(s) - 1
    while left < right:
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1

test_chars = ['a', 'b', 'c', 'd', 'e']
reverse_string(test_chars)
print(test_chars)`,
        explanation: "Starting left at 0 and right at 4 (end), we swap characters and move pointers inward. When they meet or cross, the list is reversed."
      }
    },
    java: {
      defaultCode: `public class Main {
    public static void reverseString(char[] s) {
        // Task: Reverse the char array s in-place using two pointers
        // Hint: Start left at 0, right at s.length - 1. Loop while left < right.
        // Swap elements and shift pointers.
    }

    public static void main(String[] args) {
        char[] testChars = {'a', 'b', 'c', 'd', 'e'};
        reverseString(testChars);
        System.out.println(new String(testChars));
    }
}`,
      solution: {
        code: `public class Main {
    public static void reverseString(char[] s) {
        int left = 0;
        int right = s.length - 1;
        while (left < right) {
            char temp = s[left];
            s[left] = s[right];
            s[right] = temp;
            left++;
            right--;
        }
    }

    public static void main(String[] args) {
        char[] testChars = {'a', 'b', 'c', 'd', 'e'};
        reverseString(testChars);
        System.out.println(new String(testChars));
    }
}`,
        explanation: "Starting left at 0 and right at 4 (end), we swap characters and move pointers inward. When they meet or cross, the list is reversed."
      }
    },
    cpp: {
      defaultCode: `#include <iostream>
#include <vector>

void reverseString(std::vector<char>& s) {
    // Task: Reverse the character vector s in-place using two pointers
    // Hint: Start left at 0, right at s.size() - 1. Loop while left < right.
}

int main() {
    std::vector<char> testChars = {'a', 'b', 'c', 'd', 'e'};
    reverseString(testChars);
    for (char c : testChars) {
        std::cout << c;
    }
    std::cout << std::endl;
    return 0;
}`,
      solution: {
        code: `#include <iostream>
#include <vector>

void reverseString(std::vector<char>& s) {
    int left = 0;
    int right = s.size() - 1;
    while (left < right) {
        std::swap(s[left], s[right]);
        left++;
        right--;
    }
}

int main() {
    std::vector<char> testChars = {'a', 'b', 'c', 'd', 'e'};
    reverseString(testChars);
    for (char c : testChars) {
        std::cout << c;
    }
    std::cout << std::endl;
    return 0;
}`,
        explanation: "Starting left at 0 and right at 4 (end), we swap characters and move pointers inward. When they meet or cross, the list is reversed."
      }
    },
    javascript: {
      defaultCode: `function reverseString(s) {
    // Task: Reverse the array s in-place using two pointers
    // Hint: Start left at 0, right at s.length - 1. Loop while left < right.
}

const testChars = ['a', 'b', 'c', 'd', 'e'];
reverseString(testChars);
console.log(testChars);`,
      solution: {
        code: `function reverseString(s) {
    let left = 0;
    let right = s.length - 1;
    while (left < right) {
        let temp = s[left];
        s[left] = s[right];
        s[right] = temp;
        left++;
        right--;
    }
}

const testChars = ['a', 'b', 'c', 'd', 'e'];
reverseString(testChars);
console.log(testChars);`,
        explanation: "Starting left at 0 and right at 4 (end), we swap characters and move pointers inward. When they meet or cross, the list is reversed."
      }
    }
  };

  const activePlayground = playgroundData[lang as keyof typeof playgroundData] || playgroundData.python;

  return (
    <div className="space-y-16">
      
      {/* 1. Intro */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">Strings & The Two-Pointer Paradigm</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="text-lg text-mistral-navy/70 leading-relaxed mb-6">
            A <strong>String</strong> is simply a sequence of characters stored side-by-side. 
            For example, the string "hello" is represented as the list of characters ['h', 'e', 'l', 'l', 'o'].
          </p>
          <p className="text-lg text-mistral-navy/70 leading-relaxed">
            When we need to solve string problems or modify sequences without using extra memory, we often use the <strong>Two-Pointer Technique</strong>. 
            This places search pointers at the opposite ends of the collection and moves them toward each other.
          </p>
        </div>
      </section>

      {/* 2. Interactive Simulator */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-4 text-left">Interactive Two-Pointer Simulator</h2>
        <p className="font-sans text-mistral-navy/60 text-sm mb-6 text-left">
          Watch how Left and Right pointer indices swap characters in-place to reverse a string.
        </p>

        <div className="max-w-xl mx-auto space-y-8 bg-white border border-mistral-navy/10 p-8 shadow-sm flex flex-col items-center">
          
          {/* Character Cells */}
          <div className="flex gap-4 justify-center items-center h-24 w-full font-sans">
            {chars.map((char, idx) => {
              const isLeft = left === idx;
              const isRight = right === idx;
              return (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`w-12 h-12 border-2 flex items-center justify-center font-mono text-lg font-bold rounded transition-all ${
                    isLeft ? "border-emerald-500 bg-emerald-50 text-emerald-700" :
                    isRight ? "border-blue-500 bg-blue-50 text-blue-700" :
                    "border-mistral-navy/10 bg-mistral-bg text-mistral-navy/60"
                  }`}>
                    {char}
                  </div>
                  <div className="h-6 mt-1 font-mono text-[10px] uppercase font-bold text-center">
                    {isLeft && <span className="text-emerald-600">Left</span>}
                    {isRight && <span className="text-blue-600">Right</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
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

          {/* Logs */}
          <div className="w-full text-left text-xs font-mono border-t border-mistral-navy/5 pt-4">
            <span className="text-[10px] text-mistral-navy/40 uppercase tracking-widest block mb-2">Step History:</span>
            <div className="max-h-24 overflow-y-auto space-y-1 text-mistral-navy/60 pl-2 border-l border-mistral-navy/10">
              {swapHistory.map((log, index) => (
                <p key={index} className="leading-tight">&gt; {log}</p>
              ))}
            </div>
          </div>
          
          <div className="w-full bg-amber-50 p-4 border-l-4 border-amber-400 text-xs text-amber-900/80 text-left">
            <span className="font-mono font-bold block mb-1">Beginner Note:</span>
            it is ok if you do not understand the while loop condition or the character swap logic fully now. 
            Step through the simulation first to see the visual pattern!
          </div>
        </div>
      </section>

      {/* 3. Code Example */}
      <section className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4 text-left max-w-xl mx-auto">
        <h4 className="font-mono text-lg font-bold text-mistral-navy">Two-Pointer Reversal Code</h4>
        <p className="font-sans text-sm text-mistral-navy/70 leading-relaxed">
          The two-pointer technique solves string/array reversals in-place without needing extra storage space.
        </p>
        
        <CodeTabs defaultLang={userLanguage}>
          <div data-lang={lang}>
            {JSON.stringify({
              code: activeTwoPointersCode,
              output: '["o","l","l","e","h"]',
              explanation: "Swapping elements at opposite endpoints while left pointer < right pointer reverses the content in O(N) time and O(1) space."
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
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-4">Playground: Reverse String In-Place</h2>
        <p className="font-sans text-sm text-mistral-navy/70 leading-relaxed mb-6">
          Complete the function to swap elements from both ends inward using the two-pointer strategy.
        </p>

        <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4">
          <div className="bg-amber-50 p-4 border-l-4 border-amber-400 text-xs text-amber-900/80 mb-4 rounded-r">
            <span className="font-mono font-bold block mb-1">Beginner Note:</span>
            it is ok if you do not understand the loop or swap statement structure fully now. 
            Try to solve it, or click "Show Answer" to review the correct two-pointer implementation!
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
          question="In the two-pointer technique for reversing a string, when does the loop terminate?" 
          options={[
            "When the left pointer exceeds the right pointer (left >= right)",
            "When the left pointer reaches the end index of the string",
            "When the right pointer reaches index 0",
            "When we have run exactly N steps regardless of the pointers"
          ]} 
          correctIndex={0}
          explanation="Once the pointers meet or cross in the middle, all characters have been swapped. Continuing would swap them back, restoring the original string." 
        />
      </section>

      {/* 6. Summary Recap */}
      <section className="bg-mistral-navy text-white p-10 rounded-sm shadow-xl font-sans">
        <div className="flex items-center gap-3 mb-8">
          <HelpCircle className="w-8 h-8 text-mistral-orange" />
          <h2 className="font-serif text-3xl font-medium text-white">Knowledge Recap</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">01</div>
              <div>
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">String Representation</h4>
                <p className="text-xs text-white/60 leading-relaxed">Strings are sequential sequences of characters. They are indexed exactly like lists or arrays.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">02</div>
              <div>
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">Two Pointers</h4>
                <p className="text-xs text-white/60 leading-relaxed">By tracking indices at the left and right boundaries and shifting them inward, we can process sequences with zero auxiliary space allocation.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 p-6 rounded border border-white/10 font-sans">
            <div className="flex gap-4 mb-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">03</div>
              <h4 className="font-sans font-bold text-sm uppercase tracking-wide mt-1 italic underline decoration-mistral-orange underline-offset-4 text-white">Time and Space Metrics</h4>
            </div>
            <div className="space-y-2 font-mono text-[11px] text-white/80">
              <p>Step-wise pointer updates: O(1) Constant</p>
              <p>Reversal overall runtime: O(N) Linear</p>
              <p>Reversal overall space: O(1) Constant</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center font-sans">
          <p className="text-sm text-white/80 mb-6 text-center">Strings & Two Pointers Complete. Ready to test your linear data structures logic?</p>
          <Link href="/roadmaps/topics/linear-structures-revision?roadmap=dsa-fundamentals" className="px-8 py-3 bg-mistral-orange text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-mistral-navy transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
            Go to Module 4: Linear Structures Revision &rarr;
          </Link>
        </div>
      </section>
      
    </div>
  );
}
