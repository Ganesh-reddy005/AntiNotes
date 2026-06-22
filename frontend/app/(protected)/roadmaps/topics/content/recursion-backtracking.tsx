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

export default function RecursionBacktrackingTopic({ userLanguage }: TopicProps) {
  const lang = userLanguage.toLowerCase();

  // Dynamic parameters
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const roadmapSlug = params ? params.get("roadmap") || "dsa-fundamentals" : "dsa-fundamentals";

  // Visual Call Stack simulator states for factorial(3)
  const stackSteps = [
    { stack: ["factorial(3)"], label: "Called factorial(3): waiting for 3 * factorial(2)", status: "pushing" },
    { stack: ["factorial(3)", "factorial(2)"], label: "Called factorial(2): waiting for 2 * factorial(1)", status: "pushing" },
    { stack: ["factorial(3)", "factorial(2)", "factorial(1)"], label: "Called factorial(1): BASE CASE reached! Returns 1", status: "base-case" },
    { stack: ["factorial(3)", "factorial(2)"], label: "factorial(1) returned 1. factorial(2) resolves to 2 * 1 = 2", status: "popping" },
    { stack: ["factorial(3)"], label: "factorial(2) returned 2. factorial(3) resolves to 3 * 2 = 6", status: "popping" },
    { stack: [], label: "factorial(3) returned 6. Final execution complete!", status: "completed" }
  ];

  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>(["Press Next Step to trace the call stack."]);

  const stepStack = () => {
    if (activeStep === null) {
      setActiveStep(0);
      setLogs([stackSteps[0].label]);
      return;
    }

    if (activeStep === stackSteps.length - 1) {
      return;
    }

    const nextStep = activeStep + 1;
    setActiveStep(nextStep);
    setLogs(prev => [...prev, stackSteps[nextStep].label]);
  };

  const resetStack = () => {
    setActiveStep(null);
    setLogs(["Press Next Step to trace the call stack."]);
  };

  const codeSnippets = {
    python: `def factorial(n):
    # Base Case
    if n == 1:
        return 1
    # Recursive Case
    return n * factorial(n - 1)`,
    java: `public static int factorial(int n) {
    // Base Case
    if (n == 1) {
        return 1;
    }
    // Recursive Case
    return n * factorial(n - 1);
}`,
    cpp: `int factorial(int n) {
    // Base Case
    if (n == 1) {
        return 1;
    }
    // Recursive Case
    return n * factorial(n - 1);
}`,
    javascript: `function factorial(n) {
    // Base Case
    if (n === 1) {
        return 1;
    }
    // Recursive Case
    return n * factorial(n - 1);
}`
  };

  const activeSnippet = codeSnippets[lang as keyof typeof codeSnippets] || codeSnippets.python;

  const playgroundData = {
    python: {
      defaultCode: `def fibonacci(n):
    # Task: Return the n-th Fibonacci number recursively
    # Base Cases: if n == 0 return 0, if n == 1 return 1
    # Recursive Case: return fibonacci(n-1) + fibonacci(n-2)
    pass

# Test execution
print(fibonacci(5)) # Expected: 5 (sequence: 0, 1, 1, 2, 3, 5)`,
      solution: {
        code: `def fibonacci(n):
    if n == 0:
        return 0
    if n == 1:
        return 1
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(5))`,
        explanation: "The base cases handle n=0 and n=1 directly. The recursive case calls the function twice with smaller inputs, accumulating the sum up the call stack."
      }
    },
    java: {
      defaultCode: `public class Main {
    public static int fibonacci(int n) {
        // Task: Return the n-th Fibonacci number recursively
        // Base Cases: n == 0 -> 0, n == 1 -> 1
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(fibonacci(5));
    }
}`,
      solution: {
        code: `public class Main {
    public static int fibonacci(int n) {
        if (n == 0) {
            return 0;
        }
        if (n == 1) {
            return 1;
        }
        return fibonacci(n - 1) + fibonacci(n - 2);
    }

    public static void main(String[] args) {
        System.out.println(fibonacci(5));
    }
}`,
        explanation: "The base cases handle n=0 and n=1 directly. The recursive case calls the function twice with smaller inputs, accumulating the sum up the call stack."
      }
    },
    cpp: {
      defaultCode: `#include <iostream>

int fibonacci(int n) {
    // Task: Return the n-th Fibonacci number recursively
    // Base Cases: n == 0 -> 0, n == 1 -> 1
    return 0;
}

int main() {
    std::cout << fibonacci(5) << std::endl;
    return 0;
}`,
      solution: {
        code: `#include <iostream>

int fibonacci(int n) {
    if (n == 0) {
        return 0;
    }
    if (n == 1) {
        return 1;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    std::cout << fibonacci(5) << std::endl;
    return 0;
}`,
        explanation: "The base cases handle n=0 and n=1 directly. The recursive case calls the function twice with smaller inputs, accumulating the sum up the call stack."
      }
    },
    javascript: {
      defaultCode: `function fibonacci(n) {
    // Task: Return the n-th Fibonacci number recursively
    // Base Cases: n === 0 -> 0, n === 1 -> 1
}

console.log(fibonacci(5));`,
      solution: {
        code: `function fibonacci(n) {
    if (n === 0) {
        return 0;
    }
    if (n === 1) {
        return 1;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(5));`,
        explanation: "The base cases handle n=0 and n=1 directly. The recursive case calls the function twice with smaller inputs, accumulating the sum up the call stack."
      }
    }
  };

  const activePlayground = playgroundData[lang as keyof typeof playgroundData] || playgroundData.python;

  // Active stack array derived from steps
  const activeStack = activeStep !== null ? stackSteps[activeStep].stack : [];

  return (
    <div className="space-y-16 text-left">
      
      {/* 1. Introduction */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6">Introduction to Recursion</h2>
        <div className="prose prose-mistral max-w-none text-mistral-navy/70 text-base space-y-6">
          <p>
            In programming, we usually repeat actions using loops like <code>for</code> or <code>while</code>. 
            However, some problems are naturally broken down into smaller, self-similar sub-problems.
          </p>
          <p>
            <strong>Recursion</strong> is a technique where a function solves a problem by calling <strong>itself</strong>. 
            To prevent running forever, every recursive function must consist of:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Base Case:</strong> The simplest possible input which returns a value instantly without calling itself. This is our stopping condition.</li>
            <li><strong>Recursive Case:</strong> The part where the function calls itself with a slightly smaller input, moving closer to the base case.</li>
          </ul>
        </div>
      </section>

      {/* 2. Visual Call Stack */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-4">The Execution Call Stack</h2>
        <p className="font-sans text-mistral-navy/60 text-sm mb-6">
          Every time a function calls itself, the computer pushes a frame onto the memory **Call Stack**. 
          Step through the visual call stack execution for <code>factorial(3)</code> (calculating 3 * 2 * 1).
        </p>

        <div className="max-w-xl mx-auto bg-white border border-mistral-navy/10 p-8 shadow-sm flex flex-col items-center">
          
          {/* Stack Container */}
          <div className="w-56 border-2 border-dashed border-mistral-navy/20 rounded-b p-4 flex flex-col-reverse gap-2 bg-mistral-bg/50 min-h-[200px]">
            {activeStack.map((frame, idx) => {
              const isTop = idx === activeStack.length - 1;
              return (
                <div key={idx} className={`h-10 text-white flex items-center justify-center font-mono font-bold text-xs shadow rounded-sm border border-white/10 animate-in slide-in-from-top-2 duration-300 ${
                  isTop ? "bg-mistral-orange" : "bg-mistral-navy"
                }`}>
                  {frame} {isTop && " (Active)"}
                </div>
              );
            })}
            {activeStack.length === 0 && (
              <span className="text-xs text-mistral-navy/20 italic self-center mt-16">Stack Empty (Returned 6)</span>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={stepStack}
              disabled={activeStep === stackSteps.length - 1}
              className="flex items-center gap-2 px-5 py-2.5 bg-mistral-navy text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-mistral-orange transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Next Step
            </button>
            <button
              onClick={resetStack}
              className="flex items-center gap-2 px-5 py-2.5 border border-mistral-navy/10 font-mono text-xs font-bold uppercase tracking-widest hover:bg-mistral-bg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* Trace Logs */}
          <div className="w-full text-left text-xs font-mono border-t border-mistral-navy/5 pt-4 mt-6">
            <span className="text-[10px] text-mistral-navy/40 uppercase tracking-widest block mb-2">Call Stack Logs:</span>
            <div className="max-h-24 overflow-y-auto space-y-1 text-mistral-navy/60 pl-2 border-l border-mistral-navy/10">
              {logs.map((log, index) => (
                <p key={index} className="leading-tight">&gt; {log}</p>
              ))}
            </div>
          </div>

          <div className="w-full bg-amber-50 p-4 border-l-4 border-amber-400 text-xs text-amber-900/80 text-left mt-6">
            <span className="font-mono font-bold block mb-1">Beginner Note:</span>
            don't worry if tracking recursive function loops or base conditions feels confusing at first, it is completely normal!
            Think of the call stack as a stack of tasks. You cannot finish the bottom task until you resolve all top tasks first.
          </div>

        </div>
      </section>

      {/* 3. Code Example */}
      <section className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4 text-left max-w-xl mx-auto">
        <h4 className="font-mono text-lg font-bold text-mistral-navy">Recursive Factorial Structure</h4>
        <p className="font-sans text-sm text-mistral-navy/70 leading-relaxed">
          See how the function breaks down into a base condition and a recursive multiplication call.
        </p>
        
        <CodeTabs defaultLang={userLanguage}>
          <div data-lang={lang}>
            {JSON.stringify({
              code: activeSnippet,
              explanation: "Notice the base case matching n == 1 returning 1 immediately, halting additional function self-calls."
            })}
          </div>
        </CodeTabs>
      </section>

      {/* 4. Coding Playground: Fibonacci */}
      <section className="border-t border-mistral-navy/10 pt-16 text-left">
        <div className="flex items-center gap-2 mb-6">
          <Code2 className="w-5 h-5 text-mistral-orange" />
          <span className="font-mono text-xs text-mistral-navy/60 uppercase tracking-widest">Logic Practice</span>
        </div>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-4">Playground: Fibonacci Number</h2>
        <p className="font-sans text-sm text-mistral-navy/70 leading-relaxed mb-6">
          Write recursive logic to find the n-th Fibonacci number. 
          Return 0 for n=0, 1 for n=1, and call <code>fibonacci(n-1) + fibonacci(n-2)</code> for larger inputs.
        </p>

        <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4">
          <div className="bg-amber-50 p-4 border-l-4 border-amber-400 text-xs text-amber-900/80 mb-4 rounded-r">
            <span className="font-mono font-bold block mb-1">Beginner Note:</span>
            it is ok if you do not understand multiple recursive calls yet. 
            Take a guess, try executing it, or click "Show Answer" to check how tree recursion branches and returns!
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
        <div className="space-y-8 max-w-xl mx-auto">
          <MCQQuiz 
            question="What are the two mandatory parts of any recursive function?" 
            options={[
              "An array and a loop",
              "A Base Case and a Recursive Case",
              "A stack and a queue",
              "Pointers and index offsets"
            ]} 
            correctIndex={1}
            explanation="To run and terminate correctly, a recursive function must have a Base Case to stop self-calls and a Recursive Case to narrow the problem." 
          />

          <MCQQuiz 
            question="What happens if a recursive function lacks a Base Case?" 
            options={[
              "The program compiles instantly in O(1) constant time",
              "The program loops infinitely until crashing with a Stack Overflow error",
              "It returns a default value of zero",
              "The compiler converts it to a while loop automatically"
            ]} 
            correctIndex={1}
            explanation="Without a stopping case, the computer will push frames onto the call stack indefinitely until it runs out of memory (Stack Overflow)." 
          />
        </div>
      </section>

      {/* 6. Summary Recap */}
      <section className="bg-mistral-navy text-white p-10 rounded-sm shadow-xl font-sans">
        <div className="flex items-center gap-3 mb-8">
          <HelpCircle className="w-8 h-8 text-mistral-orange" />
          <h2 className="font-serif text-3xl font-medium text-white font-bold">Knowledge Recap</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">01</div>
              <div>
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">Self-Invocation</h4>
                <p className="text-xs text-white/60 leading-relaxed">Recursion divides complex tasks by having functions invoke themselves with smaller inputs.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">02</div>
              <div>
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">Call Stack Frames</h4>
                <p className="text-xs text-white/60 leading-relaxed">Each recursive call allocates a memory stack frame, which pops off as results compute back up.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 p-6 rounded border border-white/10 flex flex-col justify-between items-center text-center">
            <p className="text-sm text-white/80 mb-6 font-sans">Ready to secure your dynamic memory and stack principles before diving into hierarchical structures?</p>
            <Link href={`/roadmaps/topics/dynamic-structures-revision?roadmap=${roadmapSlug}`} className="px-8 py-3 bg-mistral-orange text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-mistral-navy transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
              Go to Module 8: Dynamic Structures Revision &rarr;
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
