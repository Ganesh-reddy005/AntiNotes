"use client";
import React, { useState } from "react";
import Link from "next/link";
import { MCQQuiz } from "@/components/interactive/MCQQuiz";
import { CodeTabs } from "@/components/interactive/CodeTabs";
import { LiveCodeEditor } from "@/components/interactive/LiveCodeEditor";
import { HelpCircle, Code2, Play, RotateCcw, Plus, Trash } from "lucide-react";

interface TopicProps {
  userLanguage: string;
}

export default function StacksQueuesTopic({ userLanguage }: TopicProps) {
  const lang = userLanguage.toLowerCase();

  // Dynamic parameters
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const roadmapSlug = params ? params.get("roadmap") || "dsa-fundamentals" : "dsa-fundamentals";

  // Stack state
  const [stack, setStack] = useState<number[]>([10, 20]);
  const [stackLogs, setStackLogs] = useState<string[]>(["Stack initialized with [10, 20]."]);
  
  // Queue state
  const [queue, setQueue] = useState<number[]>([10, 20]);
  const [queueLogs, setQueueLogs] = useState<string[]>(["Queue initialized with [10, 20]."]);

  // Stack actions
  const pushStack = () => {
    if (stack.length >= 5) {
      setStackLogs(prev => [...prev, "Stack Overflow: Stack is full!"]);
      return;
    }
    const val = (stack.length + 1) * 10;
    setStack(prev => [...prev, val]);
    setStackLogs(prev => [...prev, `push(${val}): Pushed onto top of stack.`]);
  };

  const popStack = () => {
    if (stack.length === 0) {
      setStackLogs(prev => [...prev, "Stack Underflow: Stack is empty!"]);
      return;
    }
    const popped = stack[stack.length - 1];
    setStack(prev => prev.slice(0, -1));
    setStackLogs(prev => [...prev, `pop(): Popped ${popped} from top of stack.`]);
  };

  // Queue actions
  const enqueueQueue = () => {
    if (queue.length >= 5) {
      setQueueLogs(prev => [...prev, "Queue is full!"]);
      return;
    }
    const val = (queue.length + 1) * 10;
    setQueue(prev => [...prev, val]);
    setQueueLogs(prev => [...prev, `enqueue(${val}): Enqueued to tail of queue.`]);
  };

  const dequeueQueue = () => {
    if (queue.length === 0) {
      setQueueLogs(prev => [...prev, "Queue Underflow: Queue is empty!"]);
      return;
    }
    const dequeued = queue[0];
    setQueue(prev => prev.slice(1));
    setQueueLogs(prev => [...prev, `dequeue(): Dequeued ${dequeued} from head of queue.`]);
  };

  const resetStackAndQueue = () => {
    setStack([10, 20]);
    setStackLogs(["Stack reset to [10, 20]."]);
    setQueue([10, 20]);
    setQueueLogs(["Queue reset to [10, 20]."]);
  };

  const codeSnippets = {
    python: {
      stack: `# Python List as a Stack\nstack = []\nstack.append(10)  # push\nstack.append(20)\nval = stack.pop()  # pop -> 20`,
      queue: `# Python collections.deque as a Queue\nfrom collections import deque\nqueue = deque()\nqueue.append(10)      # enqueue\nqueue.append(20)\nval = queue.popleft()  # dequeue -> 10`
    },
    java: {
      stack: `// Java Stack\nStack<Integer> stack = new Stack<>();\nstack.push(10);\nstack.push(20);\nint val = stack.pop(); // pop -> 20`,
      queue: `// Java Queue (LinkedList)\nQueue<Integer> q = new LinkedList<>();\nq.offer(10); // enqueue\nq.offer(20);\nint val = q.poll(); // dequeue -> 10`
    },
    cpp: {
      stack: `// C++ std::stack\nstd::stack<int> s;\ns.push(10);\ns.push(20);\nint val = s.top(); s.pop(); // pop -> 20`,
      queue: `// C++ std::queue\nstd::queue<int> q;\nq.push(10); // enqueue\nq.push(20);\nint val = q.front(); q.pop(); // dequeue -> 10`
    },
    javascript: {
      stack: `// JavaScript Array as Stack\nconst stack = [];\nstack.push(10);\nstack.push(20);\nconst val = stack.pop(); // pop -> 20`,
      queue: `// JavaScript Array as Queue\nconst queue = [];\nqueue.push(10);          // enqueue\nqueue.push(20);\nconst val = queue.shift(); // dequeue -> 10`
    }
  };

  const activeSnippets = codeSnippets[lang as keyof typeof codeSnippets] || codeSnippets.python;

  const playgroundData = {
    python: {
      defaultCode: `def is_valid_brackets(s):
    # Task: Return True if brackets match correctly, e.g. "(())"
    # Hint: Use a list as a stack. If you see '(', append it.
    # If you see ')', pop from the stack. If stack is empty when popping, return False.
    # At the end, return True if the stack is empty.
    pass

# Test executions
print(is_valid_brackets("(())")) # Expected: True
print(is_valid_brackets("(()"))  # Expected: False`,
      solution: {
        code: `def is_valid_brackets(s):
    stack = []
    for char in s:
        if char == '(':
            stack.append(char)
        elif char == ')':
            if not stack:
                return False
            stack.pop()
    return len(stack) == 0

print(is_valid_brackets("(())"))
print(is_valid_brackets("(()"))`,
        explanation: "Push opening brackets onto a stack. When a closing bracket is found, pop from the stack. If the stack is empty or contains unmatched elements at the end, it is invalid."
      }
    },
    java: {
      defaultCode: `import java.util.Stack;

public class Main {
    public static boolean isValidBrackets(String s) {
        // Task: Check if parentheses match correctly, e.g. "(())"
        // Hint: Use Stack<Character> to track opening brackets.
        return false;
    }

    public static void main(String[] args) {
        System.out.println(isValidBrackets("(())"));
        System.out.println(isValidBrackets("(()"));
    }
}`,
      solution: {
        code: `import java.util.Stack;

public class Main {
    public static boolean isValidBrackets(String s) {
        Stack<Character> stack = new Stack<>();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '(') {
                stack.push(c);
            } else if (c == ')') {
                if (stack.isEmpty()) {
                    return false;
                }
                stack.pop();
            }
        }
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        System.out.println(isValidBrackets("(())"));
        System.out.println(isValidBrackets("(()"));
    }
}`,
        explanation: "Push opening brackets onto a stack. When a closing bracket is found, pop from the stack. If the stack is empty or contains unmatched elements at the end, it is invalid."
      }
    },
    cpp: {
      defaultCode: `#include <iostream>
#include <string>
#include <stack>

bool isValidBrackets(const std::string& s) {
    // Task: Check if parentheses match correctly, e.g. "(())"
    // Hint: Use std::stack<char> to track opening brackets.
    return false;
}

int main() {
    std::cout << std::boolalpha;
    std::cout << isValidBrackets("(())") << std::endl;
    std::cout << isValidBrackets("(()") << std::endl;
    return 0;
}`,
      solution: {
        code: `#include <iostream>
#include <string>
#include <stack>

bool isValidBrackets(const std::string& s) {
    std::stack<char> st;
    for (char c : s) {
        if (c == '(') {
            st.push(c);
        } else if (c == ')') {
            if (st.empty()) {
                return false;
            }
            st.pop();
        }
    }
    return st.empty();
}

int main() {
    std::cout << std::boolalpha;
    std::cout << isValidBrackets("(())") << std::endl;
    std::cout << isValidBrackets("(()") << std::endl;
    return 0;
}`,
        explanation: "Push opening brackets onto a stack. When a closing bracket is found, pop from the stack. If the stack is empty or contains unmatched elements at the end, it is invalid."
      }
    },
    javascript: {
      defaultCode: `function isValidBrackets(s) {
    // Task: Check if parentheses match correctly, e.g. "(())"
    // Hint: Use a local array as a stack (push/pop).
}

console.log(isValidBrackets("(())"));
console.log(isValidBrackets("(()"));`,
      solution: {
        code: `function isValidBrackets(s) {
    const stack = [];
    for (let i = 0; i < s.length; i++) {
        const char = s[i];
        if (char === '(') {
            stack.push(char);
        } else if (char === ')') {
            if (stack.length === 0) {
                return false;
            }
            stack.pop();
        }
    }
    return stack.length === 0;
}

console.log(isValidBrackets("(())"));
console.log(isValidBrackets("(()"));`,
        explanation: "Push opening brackets onto a stack. When a closing bracket is found, pop from the stack. If the stack is empty or contains unmatched elements at the end, it is invalid."
      }
    }
  };

  const activePlayground = playgroundData[lang as keyof typeof playgroundData] || playgroundData.python;

  return (
    <div className="space-y-16 text-left">
      
      {/* 1. Introduction */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6">Stacks & Queues</h2>
        <div className="prose prose-mistral max-w-none text-mistral-navy/70 text-base space-y-6">
          <p>
            Stuck inside linear collections, you have worked directly with indices. But sometimes we want to restrict access to secure orderly behaviors.
          </p>
          <p>
            <strong>Stacks</strong> and <strong>Queues</strong> are restricted linear structures. 
            Instead of accessing random locations like <code>arr[3]</code>, elements are added and removed only from the endpoints.
          </p>
        </div>
      </section>

      {/* 2. Stack (LIFO) */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-4">The Stack: LIFO (Last-In, First-Out)</h2>
        <p className="font-sans text-mistral-navy/60 text-sm mb-6">
          Think of a stack of dinner plates. The last plate placed on top is the very first one you take off.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Visual Container */}
          <div className="bg-white border border-mistral-navy/10 p-8 shadow-sm flex flex-col items-center">
            
            {/* Stack Box */}
            <div className="w-40 border-2 border-dashed border-mistral-navy/20 rounded-b p-4 flex flex-col-reverse gap-2 bg-mistral-bg/50 min-h-[220px]">
              {stack.map((val, idx) => (
                <div key={idx} className="h-10 bg-mistral-navy text-white flex items-center justify-center font-mono font-bold text-sm shadow rounded-sm border border-white/10 animate-in slide-in-from-top-2 duration-300">
                  {val} {idx === stack.length - 1 && " (Top)"}
                </div>
              ))}
              {stack.length === 0 && (
                <span className="text-xs text-mistral-navy/20 italic self-center mt-16">Empty Stack</span>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={pushStack}
                className="flex items-center gap-1.5 px-4 py-2 border border-mistral-navy text-mistral-navy font-mono text-[10px] font-bold uppercase tracking-wider hover:bg-mistral-navy hover:text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Push
              </button>
              <button
                onClick={popStack}
                className="flex items-center gap-1.5 px-4 py-2 border border-red-500 text-red-500 font-mono text-[10px] font-bold uppercase tracking-wider hover:bg-red-500 hover:text-white transition-colors"
              >
                <Trash className="w-3.5 h-3.5" /> Pop
              </button>
            </div>

            {/* Logs */}
            <div className="w-full text-left text-[10px] font-mono border-t border-mistral-navy/5 pt-4 mt-6">
              <div className="max-h-24 overflow-y-auto space-y-1 text-mistral-navy/50 pl-2 border-l border-mistral-navy/10">
                {stackLogs.slice(-3).map((log, index) => (
                  <p key={index} className="leading-tight">&gt; {log}</p>
                ))}
              </div>
            </div>

          </div>

          {/* Syntax Info */}
          <div className="space-y-4">
            <h4 className="font-mono text-base font-bold text-mistral-navy">Stack Syntax Code</h4>
            <p className="font-sans text-xs text-mistral-navy/60 leading-relaxed">
              Push adds elements to the top of the stack. Pop removes from the top.
            </p>
            <CodeTabs defaultLang={userLanguage}>
              <div data-lang={lang}>
                {JSON.stringify({
                  code: activeSnippets.stack,
                  explanation: "Lists/Stacks manage objects by appending and extracting from the rear end of elements."
                })}
              </div>
            </CodeTabs>
          </div>

        </div>
      </section>

      {/* 3. Queue (FIFO) */}
      <section className="border-t border-mistral-navy/10 pt-16">
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-4">The Queue: FIFO (First-In, First-Out)</h2>
        <p className="font-sans text-mistral-navy/60 text-sm mb-6">
          Think of a line of people waiting at a grocery store checkout. The first person to join the queue is served first.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Visual Container */}
          <div className="bg-white border border-mistral-navy/10 p-8 shadow-sm flex flex-col items-center">
            
            {/* Queue Box */}
            <div className="w-full border-2 border-dashed border-mistral-navy/20 rounded p-4 flex gap-2 bg-mistral-bg/50 min-h-[80px] items-center justify-center">
              {queue.map((val, idx) => (
                <div key={idx} className="w-16 h-12 bg-emerald-600 text-white flex flex-col items-center justify-center font-mono font-bold shadow rounded border border-white/10 animate-in slide-in-from-right-2 duration-300">
                  <span className="text-xs">{val}</span>
                  <span className="text-[7px] text-white/60">
                    {idx === 0 ? "Head" : idx === queue.length - 1 ? "Tail" : ""}
                  </span>
                </div>
              ))}
              {queue.length === 0 && (
                <span className="text-xs text-mistral-navy/20 italic">Empty Queue</span>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={enqueueQueue}
                className="flex items-center gap-1.5 px-4 py-2 border border-emerald-600 text-emerald-600 font-mono text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-600 hover:text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Enqueue
              </button>
              <button
                onClick={dequeueQueue}
                className="flex items-center gap-1.5 px-4 py-2 border border-red-500 text-red-500 font-mono text-[10px] font-bold uppercase tracking-wider hover:bg-red-500 hover:text-white transition-colors"
              >
                <Trash className="w-3.5 h-3.5" /> Dequeue
              </button>
            </div>

            {/* Logs */}
            <div className="w-full text-left text-[10px] font-mono border-t border-mistral-navy/5 pt-4 mt-6">
              <div className="max-h-24 overflow-y-auto space-y-1 text-mistral-navy/50 pl-2 border-l border-mistral-navy/10">
                {queueLogs.slice(-3).map((log, index) => (
                  <p key={index} className="leading-tight">&gt; {log}</p>
                ))}
              </div>
            </div>

          </div>

          {/* Syntax Info */}
          <div className="space-y-4">
            <h4 className="font-mono text-base font-bold text-mistral-navy">Queue Syntax Code</h4>
            <p className="font-sans text-xs text-mistral-navy/60 leading-relaxed">
              Enqueue adds elements to the tail end of elements. Dequeue pulls from the head.
            </p>
            <CodeTabs defaultLang={userLanguage}>
              <div data-lang={lang}>
                {JSON.stringify({
                  code: activeSnippets.queue,
                  explanation: "Double-ended queues pull items from the front indices using popleft/shift operations."
                })}
              </div>
            </CodeTabs>
          </div>

        </div>
        
        <div className="max-w-2xl mx-auto bg-amber-50 p-4 border-l-4 border-amber-400 text-xs text-amber-900/80 text-left mt-8">
          <span className="font-mono font-bold block mb-1">Beginner Note:</span>
          don't worry if stack/queue behaviors or shifting array pointer indices seem confusing at first, it is completely normal!
          Focus on LIFO (Stack) vs FIFO (Queue) rules first before studying internal list index shifts!
        </div>
      </section>

      {/* 4. Coding Playground: Balanced Brackets */}
      <section className="border-t border-mistral-navy/10 pt-16 text-left">
        <div className="flex items-center gap-2 mb-6">
          <Code2 className="w-5 h-5 text-mistral-orange" />
          <span className="font-mono text-xs text-mistral-navy/60 uppercase tracking-widest">Logic Practice</span>
        </div>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-4">Playground: Balanced Brackets</h2>
        <p className="font-sans text-sm text-mistral-navy/70 leading-relaxed mb-6">
          Write bracket matching validation logic using a stack. 
          Traverse the string, push opening brackets onto your stack, and pop them when you encounter closing brackets.
        </p>

        <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4">
          <div className="bg-amber-50 p-4 border-l-4 border-amber-400 text-xs text-amber-900/80 mb-4 rounded-r">
            <span className="font-mono font-bold block mb-1">Beginner Note:</span>
            it is ok if you do not understand stack array appending fully. 
            Click "Show Answer" to inspect how we check matching bracket boundaries!
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
            question="Which data structure operates on the LIFO (Last-In, First-Out) principle?" 
            options={[
              "Queue",
              "Stack",
              "Unsorted Array",
              "Singly Linked List"
            ]} 
            correctIndex={1}
            explanation="Stacks restrict actions to a single endpoint, meaning the last element added is the first one removed (LIFO)." 
          />

          <MCQQuiz 
            question="In a checkout line, the first person to arrive is the first to leave. Which structure mimics this?" 
            options={[
              "Stack",
              "Queue",
              "Binary Search Tree",
              "Undirected Graph"
            ]} 
            correctIndex={1}
            explanation="Queues process entries in insertion order. The first element enqueued is the first dequeued (FIFO)." 
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
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">Restricted Access</h4>
                <p className="text-xs text-white/60 leading-relaxed">Unlike random array lookups, elements are manipulated only at boundary boundaries.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">02</div>
              <div>
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">LIFO vs FIFO</h4>
                <p className="text-xs text-white/60 leading-relaxed">Stacks are Last-In, First-Out (LIFO). Queues are First-In, First-Out (FIFO).</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 p-6 rounded border border-white/10 flex flex-col justify-between items-center text-center">
            <p className="text-sm text-white/80 mb-6 font-sans">Ready to master Recursion and see how the execution call stack behaves?</p>
            <Link href={`/roadmaps/topics/recursion-backtracking?roadmap=${roadmapSlug}`} className="px-8 py-3 bg-mistral-orange text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-mistral-navy transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
              Go to Module 7: Recursion & Backtracking &rarr;
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
