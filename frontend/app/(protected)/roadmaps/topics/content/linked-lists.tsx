"use client";
import React, { useState } from "react";
import Link from "next/link";
import { MCQQuiz } from "@/components/interactive/MCQQuiz";
import { CodeTabs } from "@/components/interactive/CodeTabs";
import { LiveCodeEditor } from "@/components/interactive/LiveCodeEditor";
import { HelpCircle, Code2, Play, RotateCcw, ArrowRight } from "lucide-react";

interface TopicProps {
  userLanguage: string;
}

export default function LinkedListsTopic({ userLanguage }: TopicProps) {
  const lang = userLanguage.toLowerCase();

  // Dynamic parameters
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const roadmapSlug = params ? params.get("roadmap") || "dsa-fundamentals" : "dsa-fundamentals";

  // Traversal visualizer state
  const listNodes = [
    { value: 10, nextIndex: 1, isHead: true, isTail: false },
    { value: 20, nextIndex: 2, isHead: false, isTail: false },
    { value: 30, nextIndex: 3, isHead: false, isTail: false },
    { value: 40, nextIndex: null, isHead: false, isTail: true }
  ];

  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [traversalLogs, setTraversalLogs] = useState<string[]>(["Pointer initialized at Head."]);

  const stepTraversal = () => {
    if (activeStep === null) {
      setActiveStep(0);
      setTraversalLogs(["current = head (Node containing 10)"]);
      return;
    }

    if (activeStep === listNodes.length - 1) {
      return; // reached end of list
    }

    const nextIdx = activeStep + 1;
    setActiveStep(nextIdx);
    setTraversalLogs(prev => [
      ...prev,
      `current = current.next (Node containing ${listNodes[nextIdx].value})`
    ]);
  };

  const resetTraversal = () => {
    setActiveStep(null);
    setTraversalLogs(["Pointer initialized at Head."]);
  };

  const codeExamples = {
    python: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

# Constructing nodes
head = Node(10)
nodeB = Node(20)
# Linking nodes
head.next = nodeB`,
    java: `class Node {
    int val;
    Node next;
    Node(int val) {
        this.val = val;
        this.next = null;
    }
}

// Constructing and linking
Node head = new Node(10);
Node nodeB = new Node(20);
head.next = nodeB;`,
    cpp: `struct Node {
    int val;
    Node* next;
    Node(int x) : val(x), next(nullptr) {}
};

// Constructing and linking
Node* head = new Node(10);
Node* nodeB = new Node(20);
head->next = nodeB;`,
    javascript: `class Node {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

// Constructing and linking
const head = new Node(10);
const nodeB = new Node(20);
head.next = nodeB;`
  };

  const activeCodeSnippet = codeExamples[lang as keyof typeof codeExamples] || codeExamples.python;

  const playgroundData = {
    python: {
      defaultCode: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

def search_list(head, target):
    # Task: Traverse the list starting at head. 
    # Return True if a node's value equals target, otherwise False.
    # Hint: Start at head. While the pointer is not None:
    # check if current.val == target. If not, step to current.next.
    pass

# Create list: 10 -> 20 -> 30
head = Node(10)
head.next = Node(20)
head.next.next = Node(30)

print(search_list(head, 20)) # Expected: True
print(search_list(head, 99)) # Expected: False`,
      solution: {
        code: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

def search_list(head, target):
    current = head
    while current is not None:
        if current.val == target:
            return True
        current = current.next
    return False

head = Node(10)
head.next = Node(20)
head.next.next = Node(30)

print(search_list(head, 20))
print(search_list(head, 99))`,
        explanation: "Set a tracker pointer to head. Traverse using a while loop by updating current = current.next. Return True if matched, or False if you run out of nodes (None)."
      }
    },
    java: {
      defaultCode: `class Node {
    int val;
    Node next;
    Node(int val) {
        this.val = val;
        this.next = null;
    }
}

public class Main {
    public static boolean searchList(Node head, int target) {
        // Task: Traverse the list starting at head.
        // Return true if target is found, otherwise false.
        return false;
    }

    public static void main(String[] args) {
        Node head = new Node(10);
        head.next = new Node(20);
        head.next.next = new Node(30);
        System.out.println(searchList(head, 20));
        System.out.println(searchList(head, 99));
    }
}`,
      solution: {
        code: `class Node {
    int val;
    Node next;
    Node(int val) {
        this.val = val;
        this.next = null;
    }
}

public class Main {
    public static boolean searchList(Node head, int target) {
        Node current = head;
        while (current != null) {
            if (current.val == target) {
                return true;
            }
            current = current.next;
        }
        return false;
    }

    public static void main(String[] args) {
        Node head = new Node(10);
        head.next = new Node(20);
        head.next.next = new Node(30);
        System.out.println(searchList(head, 20));
        System.out.println(searchList(head, 99));
    }
}`,
        explanation: "Set a tracker pointer to head. Traverse using a while loop by updating current = current.next. Return true if matched, or false if current becomes null."
      }
    },
    cpp: {
      defaultCode: `#include <iostream>

struct Node {
    int val;
    Node* next;
    Node(int x) : val(x), next(nullptr) {}
};

bool searchList(Node* head, int target) {
    // Task: Traverse the list starting at head.
    // Return true if target is found, otherwise false.
    return false;
}

int main() {
    Node* head = new Node(10);
    head->next = new Node(20);
    head->next->next = new Node(30);
    std::cout << std::boolalpha;
    std::cout << searchList(head, 20) << std::endl;
    std::cout << searchList(head, 99) << std::endl;
    return 0;
}`,
      solution: {
        code: `#include <iostream>

struct Node {
    int val;
    Node* next;
    Node(int x) : val(x), next(nullptr) {}
};

bool searchList(Node* head, int target) {
    Node* current = head;
    while (current != nullptr) {
        if (current->val == target) {
            return true;
        }
        current = current->next;
    }
    return false;
}

int main() {
    Node* head = new Node(10);
    head->next = new Node(20);
    head->next->next = new Node(30);
    std::cout << std::boolalpha;
    std::cout << searchList(head, 20) << std::endl;
    std::cout << searchList(head, 99) << std::endl;
    return 0;
}`,
        explanation: "Set a tracker pointer to head. Traverse using a while loop by updating current = current->next. Return true if matched, or false if current becomes nullptr."
      }
    },
    javascript: {
      defaultCode: `class Node {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

function searchList(head, target) {
    // Task: Traverse the list starting at head.
    // Return true if target is found, otherwise false.
}

const head = new Node(10);
head.next = new Node(20);
head.next.next = new Node(30);

console.log(searchList(head, 20));
console.log(searchList(head, 99));`,
      solution: {
        code: `class Node {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

function searchList(head, target) {
    let current = head;
    while (current !== null) {
        if (current.val === target) {
            return true;
        }
        current = current.next;
    }
    return false;
}

const head = new Node(10);
head.next = new Node(20);
head.next.next = new Node(30);

console.log(searchList(head, 20));
console.log(searchList(head, 99));`,
        explanation: "Set a tracker pointer to head. Traverse using a while loop by updating current = current.next. Return true if matched, or false if current becomes null."
      }
    }
  };

  const activePlayground = playgroundData[lang as keyof typeof playgroundData] || playgroundData.python;

  return (
    <div className="space-y-16 text-left">
      
      {/* 1. Introduction */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6">Introduction to Linked Lists</h2>
        <div className="prose prose-mistral max-w-none text-mistral-navy/70 text-base space-y-6">
          <p>
            So far, you have worked with **Arrays** and **Lists**, which store elements side-by-side in contiguous memory blocks. 
            This layout makes reading elements quick, but inserting or deleting items is expensive because we must shift other elements to fill the gaps.
          </p>
          <p>
            A <strong>Linked List</strong> is different. Instead of locking elements in a single contiguous block, a Linked List stores elements (called <strong>Nodes</strong>) dynamically scattered throughout memory. 
            Nodes are connected using <strong>Pointers</strong> - references that specify the memory address of the next item.
          </p>
        </div>
      </section>

      {/* 2. Visual Comparison */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-4">Structural Comparison</h2>
        <p className="font-sans text-mistral-navy/60 text-sm mb-6">
          Compare how Arrays and Linked Lists are organized differently inside computer memory.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
          {/* Arrays */}
          <div className="bg-white border border-mistral-navy/10 p-6 shadow-sm">
            <h4 className="font-bold text-mistral-navy mb-3 uppercase tracking-wider text-sm border-b border-mistral-navy/5 pb-2">Arrays & Lists</h4>
            <div className="flex gap-2 mb-4 justify-center py-2 bg-mistral-bg/50 border border-mistral-navy/5 rounded">
              <span className="w-8 h-8 border border-mistral-navy/20 flex items-center justify-center font-mono text-xs text-mistral-navy font-bold">10</span>
              <span className="w-8 h-8 border border-mistral-navy/20 flex items-center justify-center font-mono text-xs text-mistral-navy font-bold">20</span>
              <span className="w-8 h-8 border border-mistral-navy/20 flex items-center justify-center font-mono text-xs text-mistral-navy font-bold">30</span>
            </div>
            <ul className="text-xs text-mistral-navy/70 space-y-2 pl-4 list-disc">
              <li>Stored in adjacent, contiguous memory boxes.</li>
              <li>Read/Write by index is instant O(1) time.</li>
              <li>Insert/Delete requires shifting elements, running in O(N) time.</li>
            </ul>
          </div>

          {/* Linked Lists */}
          <div className="bg-white border border-mistral-navy/10 p-6 shadow-sm">
            <h4 className="font-bold text-mistral-navy mb-3 uppercase tracking-wider text-sm border-b border-mistral-navy/5 pb-2">Linked Lists</h4>
            <div className="flex gap-2 items-center mb-4 justify-center py-2 bg-mistral-bg/50 border border-mistral-navy/5 rounded">
              <span className="px-2 py-1 border border-mistral-navy/20 font-mono text-[10px] rounded">Node 10</span>
              <span className="text-xs text-mistral-navy/40">&rarr;</span>
              <span className="px-2 py-1 border border-mistral-navy/20 font-mono text-[10px] rounded">Node 20</span>
              <span className="text-xs text-mistral-navy/40">&rarr;</span>
              <span className="px-2 py-1 border border-mistral-navy/20 font-mono text-[10px] rounded">Node 30</span>
            </div>
            <ul className="text-xs text-mistral-navy/70 space-y-2 pl-4 list-disc">
              <li>Stored in separate, scattered memory nodes.</li>
              <li>Connected via memory address references (Pointers).</li>
              <li>Insert/Delete is fast O(1) time once node is located (simply swap arrows).</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Traversal Visualizer */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-4">Singly Linked List Traversal</h2>
        <p className="font-sans text-mistral-navy/60 text-sm mb-6">
          Since nodes are scattered, we cannot fetch the middle element instantly. We must start at the <strong>Head</strong> node and traverse pointer links one by one.
        </p>

        <div className="max-w-2xl mx-auto bg-white border border-mistral-navy/10 p-8 shadow-sm flex flex-col items-center">
          
          {/* Visual List Nodes */}
          <div className="flex flex-wrap gap-4 items-center justify-center min-h-[100px] w-full font-sans">
            {listNodes.map((node, idx) => {
              const isActive = activeStep === idx;
              return (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center">
                    {/* Node Structure */}
                    <div className={`w-28 border-2 rounded transition-all ${
                      isActive 
                        ? "border-mistral-orange bg-mistral-orange/5 shadow-[0_0_12px_rgba(249,115,22,0.15)]" 
                        : "border-mistral-navy/15 bg-mistral-bg"
                    }`}>
                      {/* Node Header Label */}
                      <div className="text-[9px] uppercase tracking-wider text-center font-bold bg-mistral-navy/5 py-1 border-b border-mistral-navy/10 text-mistral-navy/50">
                        {node.isHead ? "Head Node" : node.isTail ? "Tail Node" : `Node [${idx}]`}
                      </div>
                      
                      {/* Node Content Split */}
                      <div className="flex divide-x divide-mistral-navy/10">
                        <div className="w-1/2 p-2 flex flex-col items-center">
                          <span className="text-[8px] text-mistral-navy/40 uppercase">Val</span>
                          <span className="font-mono text-sm font-bold text-mistral-navy">{node.value}</span>
                        </div>
                        <div className="w-1/2 p-2 flex flex-col items-center">
                          <span className="text-[8px] text-mistral-navy/40 uppercase">Next</span>
                          <span className="font-mono text-[9px] font-bold text-mistral-orange/80">
                            {node.nextIndex !== null ? `*ptr` : "null"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Active Indicator label */}
                    <div className="h-6 mt-1.5 font-mono text-[9px] uppercase font-bold text-center">
                      {isActive && <span className="text-mistral-orange">current pointer</span>}
                    </div>
                  </div>

                  {/* Connecting Arrow */}
                  {node.nextIndex !== null && (
                    <span className="text-xl text-mistral-navy/30 font-bold self-center mb-6">&rarr;</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Controller */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={stepTraversal}
              disabled={activeStep === listNodes.length - 1}
              className="flex items-center gap-2 px-5 py-2.5 bg-mistral-navy text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-mistral-orange transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Next Step
            </button>
            <button
              onClick={resetTraversal}
              className="flex items-center gap-2 px-5 py-2.5 border border-mistral-navy/10 font-mono text-xs font-bold uppercase tracking-widest hover:bg-mistral-bg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* Console Log */}
          <div className="w-full text-left text-xs font-mono border-t border-mistral-navy/5 pt-4 mt-6">
            <span className="text-[10px] text-mistral-navy/40 uppercase tracking-widest block mb-2">Traversal Trace:</span>
            <div className="max-h-24 overflow-y-auto space-y-1 text-mistral-navy/60 pl-2 border-l border-mistral-navy/10">
              {traversalLogs.map((log, index) => (
                <p key={index} className="leading-tight">&gt; {log}</p>
              ))}
            </div>
          </div>

          <div className="w-full bg-amber-50 p-4 border-l-4 border-amber-400 text-xs text-amber-900/80 text-left mt-6">
            <span className="font-mono font-bold block mb-1">Beginner Note:</span>
            don't worry if pointers or class-based node definitions seem a bit tricky at first, it is completely normal! 
            Think of each node as a container carrying a cargo value and a map pointing to the next container's location.
          </div>

        </div>
      </section>

      {/* 4. Code Definition */}
      <section className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4 text-left max-w-xl mx-auto">
        <h4 className="font-mono text-lg font-bold text-mistral-navy">Constructing a Linked List Node</h4>
        <p className="font-sans text-sm text-mistral-navy/70 leading-relaxed">
          Nodes are defined as custom objects or class structs containing data and pointer references.
        </p>
        
        <CodeTabs defaultLang={userLanguage}>
          <div data-lang={lang}>
            {JSON.stringify({
              code: activeCodeSnippet,
              explanation: "Defining the class node with val (cargo data) and next (pointer pointing to next node object)."
            })}
          </div>
        </CodeTabs>
      </section>

      {/* 5. Coding Playground: Logic Check */}
      <section className="border-t border-mistral-navy/10 pt-16 text-left">
        <div className="flex items-center gap-2 mb-6">
          <Code2 className="w-5 h-5 text-mistral-orange" />
          <span className="font-mono text-xs text-mistral-navy/60 uppercase tracking-widest">Logic Practice</span>
        </div>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-4">Playground: Search in a Linked List</h2>
        <p className="font-sans text-sm text-mistral-navy/70 leading-relaxed mb-6">
          Complete the traversal function below. Start at the head node, iterate through node objects using <code>current.next</code>, and return <code>true</code> if you locate the target number.
        </p>

        <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4">
          <div className="bg-amber-50 p-4 border-l-4 border-amber-400 text-xs text-amber-900/80 mb-4 rounded-r">
            <span className="font-mono font-bold block mb-1">Beginner Note:</span>
            it is ok if you do not understand the pointer iterations fully. 
            Click "Show Answer" to inspect how we check node matching and shift the pointer using current = current.next!
          </div>

          <LiveCodeEditor 
            key={lang}
            language={lang}
            defaultCode={activePlayground.defaultCode}
            solution={activePlayground.solution}
          />
        </div>
      </section>

      {/* 6. MCQ Checkpoint */}
      <section className="pt-8 border-t border-mistral-navy/10">
        <h3 className="font-sans font-bold text-xl text-mistral-navy mb-8 text-left uppercase tracking-widest text-center">Interactive Mastery Check</h3>
        <div className="space-y-8 max-w-xl mx-auto">
          <MCQQuiz 
            question="What does each Node in a singly linked list store?" 
            options={[
              "Only the target data value",
              "The data value and a pointer pointing to the next node object",
              "A pointer pointing to the previous node object",
              "The index position number in sequential order"
            ]} 
            correctIndex={1}
            explanation="Nodes consist of a cargo data variable and a next reference indicating where the next node lives in memory." 
          />

          <MCQQuiz 
            question="Why is searching for a value in a Singly Linked List an O(N) linear time operation?" 
            options={[
              "Linked lists are stored contiguously in memory",
              "We must start at Head and walk step-by-step through next pointers to find an element",
              "Linked lists can only hold sorted values",
              "Node lookup uses simple hexadecimal offset math"
            ]} 
            correctIndex={1}
            explanation="Since nodes are scattered, we have no direct index calculation. Finding an element requires traversing elements one by one." 
          />
        </div>
      </section>

      {/* 7. Summary Recap */}
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
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">Dynamic Allocation</h4>
                <p className="text-xs text-white/60 leading-relaxed">Nodes are allocated scattered in memory, connected sequentially by link references.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">02</div>
              <div>
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">Pointers Shift</h4>
                <p className="text-xs text-white/60 leading-relaxed">Traversing requires updating the current tracking pointer step-by-step: current = current.next.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 p-6 rounded border border-white/10 flex flex-col justify-between items-center text-center">
            <p className="text-sm text-white/80 mb-6 font-sans">Ready to explore Stacks & Queues and learn LIFO/FIFO linear tracking structures?</p>
            <Link href={`/roadmaps/topics/stacks-queues?roadmap=${roadmapSlug}`} className="px-8 py-3 bg-mistral-orange text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-mistral-navy transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
              Go to Module 6: Stacks & Queues &rarr;
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
