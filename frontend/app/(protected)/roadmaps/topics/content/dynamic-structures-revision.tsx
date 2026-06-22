"use client";
import React, { useState } from "react";
import Link from "next/link";
import { MCQQuiz } from "@/components/interactive/MCQQuiz";
import { CodeTabs } from "@/components/interactive/CodeTabs";
import { LiveCodeEditor } from "@/components/interactive/LiveCodeEditor";
import { Trophy, Rocket, Target, Zap, Brain, CheckCircle2, ArrowRight } from "lucide-react";

interface TopicProps {
  userLanguage: string;
}

export default function DynamicStructuresRevisionTopic({ userLanguage }: TopicProps) {
  const lang = userLanguage.toLowerCase();

  // Dynamic parameters
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const roadmapSlug = params ? params.get("roadmap") || "dsa-fundamentals" : "dsa-fundamentals";

  const codeSnippets = {
    python: {
      list: `class Node:\n    def __init__(self, val):\n        self.val = val\n        self.next = None\n# Traverse\ncurr = head\nwhile curr:\n    curr = curr.next`,
      stack: `stack = []\nstack.append(10)  # Push\nstack.pop()       # Pop`,
      recursion: `def recurse(n):\n    if n <= 1: return 1 # Base case\n    return n * recurse(n-1)`
    },
    java: {
      list: `class Node {\n    int val;\n    Node next;\n    Node(int val) { this.val = val; }\n}\n// Traverse\nNode curr = head;\nwhile (curr != null) {\n    curr = curr.next;\n}`,
      stack: `Stack<Integer> s = new Stack<>();\ns.push(10); // Push\ns.pop();    // Pop`,
      recursion: `int recurse(int n) {\n    if (n <= 1) return 1; // Base case\n    return n * recurse(n-1);\n}`
    },
    cpp: {
      list: `struct Node {\n    int val;\n    Node* next;\n    Node(int x) : val(x), next(nullptr) {}\n};\n// Traverse\nNode* curr = head;\nwhile (curr != nullptr) {\n    curr = curr->next;\n}`,
      stack: `std::stack<int> s;\ns.push(10); // Push\ns.pop();    // Pop`,
      recursion: `int recurse(int n) {\n    if (n <= 1) return 1; // Base case\n    return n * recurse(n-1);\n}`
    },
    javascript: {
      list: `class Node {\n    constructor(val) {\n        this.val = val;\n        this.next = null;\n    }\n}\n// Traverse\nlet curr = head;\nwhile (curr !== null) {\n    curr = curr.next;\n}`,
      stack: `const s = [];\ns.push(10); // Push\ns.pop();    // Pop`,
      recursion: `function recurse(n) {\n    if (n <= 1) return 1; // Base case\n    return n * recurse(n-1);\n}`
    }
  };

  const activeSnippets = codeSnippets[lang as keyof typeof codeSnippets] || codeSnippets.python;

  const playgrounds = {
    python: {
      q1: {
        defaultCode: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

def get_list_length(head):
    # Task: Return the total count of nodes in the linked list
    # Hint: Initialize a counter to 0. Set current = head.
    # While current is not None, increment count and update current = current.next.
    pass

# Create list: 10 -> 20 -> 30
head = Node(10)
head.next = Node(20)
head.next.next = Node(30)

print(get_list_length(head)) # Expected: 3`,
        solution: {
          code: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

def get_list_length(head):
    count = 0
    current = head
    while current is not None:
        count += 1
        current = current.next
    return count

head = Node(10)
head.next = Node(20)
head.next.next = Node(30)

print(get_list_length(head))`,
          explanation: "Initialize a counter at 0. Walk through the nodes one by one by shifting the pointer using current = current.next, incrementing the counter at each node."
        }
      },
      q2: {
        defaultCode: `def recursive_sum(n):
    # Task: Return the sum of numbers from 1 to n recursively
    # Base Case: if n == 1 return 1
    # Recursive Case: return n + recursive_sum(n-1)
    pass

# Test execution
print(recursive_sum(5)) # Expected: 15 (5 + 4 + 3 + 2 + 1)`,
        solution: {
          code: `def recursive_sum(n):
    if n == 1:
        return 1
    return n + recursive_sum(n - 1)

print(recursive_sum(5))`,
          explanation: "The base case halts recursion when n reduces to 1. The recursive case adds n to the sum of the remaining elements from 1 to n-1."
        }
      },
      q3: {
        defaultCode: `def is_valid_brackets(s):
    # Task: Verify if opening brackets '(' have matching closing brackets ')'
    # Hint: Loop through s. Push '(' onto a stack list.
    # Pop from stack if you see ')'. If stack is empty when popping, return False.
    # Return True if stack is empty at the end.
    pass

# Test execution
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
          explanation: "Use a list as a stack. Push opening brackets onto the stack and pop them when checking closing boundaries."
        }
      }
    },
    java: {
      q1: {
        defaultCode: `class Node {
    int val;
    Node next;
    Node(int val) {
        this.val = val;
        this.next = null;
    }
}

public class Main {
    public static int getListLength(Node head) {
        // Task: Return the total count of nodes in the linked list
        return 0;
    }

    public static void main(String[] args) {
        Node head = new Node(10);
        head.next = new Node(20);
        head.next.next = new Node(30);
        System.out.println(getListLength(head));
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
    public static int getListLength(Node head) {
        int count = 0;
        Node current = head;
        while (current != null) {
            count++;
            current = current.next;
        }
        return count;
    }

    public static void main(String[] args) {
        Node head = new Node(10);
        head.next = new Node(20);
        head.next.next = new Node(30);
        System.out.println(getListLength(head));
    }
}`,
          explanation: "Initialize a counter at 0. Walk through the nodes one by one by shifting the pointer using current = current.next, incrementing the counter at each node."
        }
      },
      q2: {
        defaultCode: `public class Main {
    public static int recursiveSum(int n) {
        // Task: Return the sum of numbers from 1 to n recursively
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(recursiveSum(5));
    }
}`,
        solution: {
          code: `public class Main {
    public static int recursiveSum(int n) {
        if (n == 1) {
            return 1;
        }
        return n + recursiveSum(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(recursiveSum(5));
    }
}`,
          explanation: "The base case halts recursion when n reduces to 1. The recursive case adds n to the sum of the remaining elements from 1 to n-1."
        }
      },
      q3: {
        defaultCode: `import java.util.Stack;

public class Main {
    public static boolean isValidBrackets(String s) {
        // Task: Verify if opening brackets '(' have matching closing brackets ')'
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
          explanation: "Use Stack to push opening brackets and pop them when matching closing brackets."
        }
      }
    },
    cpp: {
      q1: {
        defaultCode: `#include <iostream>

struct Node {
    int val;
    Node* next;
    Node(int x) : val(x), next(nullptr) {}
};

int getListLength(Node* head) {
    // Task: Return the total count of nodes in the linked list
    return 0;
}

int main() {
    Node* head = new Node(10);
    head->next = new Node(20);
    head->next->next = new Node(30);
    std::cout << getListLength(head) << std::endl;
    return 0;
}`,
        solution: {
          code: `#include <iostream>

struct Node {
    int val;
    Node* next;
    Node(int x) : val(x), next(nullptr) {}
};

int getListLength(Node* head) {
    int count = 0;
    Node* current = head;
    while (current != nullptr) {
        count++;
        current = current->next;
    }
    return count;
}

int main() {
    Node* head = new Node(10);
    head->next = new Node(20);
    head->next->next = new Node(30);
    std::cout << getListLength(head) << std::endl;
    return 0;
}`,
          explanation: "Initialize a counter at 0. Walk through the nodes one by one by shifting the pointer using current = current->next, incrementing the counter at each node."
        }
      },
      q2: {
        defaultCode: `#include <iostream>

int recursiveSum(int n) {
    // Task: Return the sum of numbers from 1 to n recursively
    return 0;
}

int main() {
    std::cout << recursiveSum(5) << std::endl;
    return 0;
}`,
        solution: {
          code: `#include <iostream>

int recursiveSum(int n) {
    if (n == 1) {
        return 1;
    }
    return n + recursiveSum(n - 1);
}

int main() {
    std::cout << recursiveSum(5) << std::endl;
    return 0;
}`,
          explanation: "The base case halts recursion when n reduces to 1. The recursive case adds n to the sum of the remaining elements from 1 to n-1."
        }
      },
      q3: {
        defaultCode: `#include <iostream>
#include <string>
#include <stack>

bool isValidBrackets(const std::string& s) {
    // Task: Verify if opening brackets '(' have matching closing brackets ')'
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
          explanation: "Use std::stack to push opening brackets and pop them when matching closing brackets."
        }
      }
    },
    javascript: {
      q1: {
        defaultCode: `class Node {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

function getListLength(head) {
    // Task: Return the total count of nodes in the linked list
    return 0;
}

const head = new Node(10);
head.next = new Node(20);
head.next.next = new Node(30);

console.log(getListLength(head));`,
        solution: {
          code: `class Node {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

function getListLength(head) {
    let count = 0;
    let current = head;
    while (current !== null) {
        count++;
        current = current.next;
    }
    return count;
}

const head = new Node(10);
head.next = new Node(20);
head.next.next = new Node(30);

console.log(getListLength(head));`,
          explanation: "Initialize a counter at 0. Walk through the nodes one by one by shifting the pointer using current = current.next, incrementing the counter at each node."
        }
      },
      q2: {
        defaultCode: `function recursiveSum(n) {
    // Task: Return the sum of numbers from 1 to n recursively
    return 0;
}

console.log(recursiveSum(5));`,
        solution: {
          code: `function recursiveSum(n) {
    if (n === 1) {
        return 1;
    }
    return n + recursiveSum(n - 1);
}

console.log(recursiveSum(5));`,
          explanation: "The base case halts recursion when n reduces to 1. The recursive case adds n to the sum of the remaining elements from 1 to n-1."
        }
      },
      q3: {
        defaultCode: `function isValidBrackets(s) {
    // Task: Verify if opening brackets '(' have matching closing brackets ')'
    return false;
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
          explanation: "Use Array as a stack. Push opening brackets and pop them when matching closing brackets."
        }
      }
    }
  };

  const activePlaygrounds = playgrounds[lang as keyof typeof playgrounds] || playgrounds.python;

  return (
    <div className="space-y-16 text-left">
      
      {/* Hero Section */}
      <section className="bg-amber-500 p-12 -mx-6 -mt-12 text-white shadow-inner rounded-sm font-sans">
        <div className="flex items-center gap-4 mb-4">
          <Trophy className="w-10 h-10 text-white" />
          <h1 className="font-serif text-5xl font-medium italic text-white drop-shadow-sm">Dynamic Structures Revision</h1>
        </div>
        <p className="text-white/80 max-w-2xl text-lg leading-relaxed font-sans">
          Reinforce your understanding of nodes, pointers, stacks, queues, and recursion before moving into hierarchical Trees.
        </p>
      </section>

      {/* Syntax Cheat Sheet */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Rocket className="w-8 h-8 text-amber-500" />
          <h2 className="font-serif text-3xl font-medium text-mistral-navy">Dynamic Syntax Cheat Sheet</h2>
        </div>
        <p className="font-sans text-sm text-mistral-navy/70 leading-relaxed mb-6">
          Review standard operations for linked structures, stacks, and recursion.
        </p>
        
        <CodeTabs defaultLang={userLanguage}>
          <div data-lang={lang}>
            {JSON.stringify({
              code: `// Linked List traversal:\n${activeSnippets.list}\n\n// Stack basic operations:\n${activeSnippets.stack}\n\n// Recursion base pattern:\n${activeSnippets.recursion}`,
              explanation: "Common syntax conventions for pointer links, stack push/pop, and recursive base conditions."
            })}
          </div>
        </CodeTabs>
      </section>

      {/* Important Points */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-8 h-8 text-amber-500" />
          <h2 className="font-serif text-3xl font-medium text-mistral-navy">Core Concept Review</h2>
        </div>
        <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div>
              <h4 className="font-sans font-bold text-mistral-navy mb-2 uppercase tracking-wider">Linked Lists</h4>
              <ul className="list-disc pl-5 space-y-2 text-mistral-navy/70 text-xs">
                <li>Nodes live non-contiguously in memory, linked via pointers.</li>
                <li>Accessing elements sequentially requires O(N) linear time starting at the Head.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-sans font-bold text-mistral-navy mb-2 uppercase tracking-wider">Stacks & Queues</h4>
              <ul className="list-disc pl-5 space-y-2 text-mistral-navy/70 text-xs">
                <li>Stacks follow LIFO (Last-In, First-Out) logic, editing at one endpoint.</li>
                <li>Queues follow FIFO (First-In, First-Out) logic, enqueuing at tail and dequeuing at head.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-sans font-bold text-mistral-navy mb-2 uppercase tracking-wider">Recursion</h4>
              <ul className="list-disc pl-5 space-y-2 text-mistral-navy/70 text-xs">
                <li>Recursive calls trigger system memory Call Stack pushes.</li>
                <li>Always ensure a Base Case stops iteration, preventing Stack Overflow.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive MCQ Quiz */}
      <section className="pt-8 border-t border-mistral-navy/10">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-8 h-8 text-amber-500" />
          <h2 className="font-serif text-3xl font-medium text-mistral-navy">Logical Mastery Check</h2>
        </div>
        
        <div className="space-y-8 max-w-xl mx-auto">
          <MCQQuiz 
            question="Why are elements inside a Singly Linked List not instantly readable by index like arrays?"
            options={[
              "Linked list values are kept encrypted",
              "Nodes are stored dynamically scattered in memory rather than in contiguous blocks, requiring link-by-link traversal",
              "Linked lists are restricted to string values only",
              "Compiler optimization blocks pointer offset calculation"
            ]}
            correctIndex={1}
            explanation="Scattered memory allocation prevents index addition math, forcing traversal node-by-node starting from Head."
          />

          <MCQQuiz 
            question="Which data structure mimics the system Call Stack during recursive execution?"
            options={[
              "Queue (FIFO)",
              "Stack (LIFO)",
              "Contiguous Array",
              "Adjacency Matrix"
            ]}
            correctIndex={1}
            explanation="The computer pushes function execution frames onto the stack when calling them, and pops them off from the top as they finish (LIFO)."
          />
        </div>
      </section>

      {/* Practice Sandboxes */}
      <section className="pt-16 border-t border-mistral-navy/10">
        <div className="flex items-center gap-3 mb-8">
          <Brain className="w-8 h-8 text-amber-500" />
          <h2 className="font-serif text-3xl font-medium text-mistral-navy">Logical Synthesis Sandboxes</h2>
        </div>
        <p className="font-sans text-sm text-mistral-navy/70 leading-relaxed mb-10">
          Implement the logic for the three challenges below to secure your dynamic memory and stack principles!
        </p>

        {/* Sandbox 1 */}
        <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4 mb-12">
          <h3 className="font-sans font-bold text-lg text-mistral-navy">Challenge 1: Length of a Linked List (Easy)</h3>
          <p className="text-sm text-mistral-navy/70 mb-4 font-sans">
            Count the total number of node elements in the list by traversing from Head.
          </p>
          <LiveCodeEditor 
            key={`q1-${lang}`}
            language={lang}
            defaultCode={activePlaygrounds.q1.defaultCode}
            solution={activePlaygrounds.q1.solution}
          />
        </div>

        {/* Sandbox 2 */}
        <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4 mb-12">
          <h3 className="font-sans font-bold text-lg text-mistral-navy">Challenge 2: Recursive Sum (Easy)</h3>
          <p className="text-sm text-mistral-navy/70 mb-4 font-sans">
            Calculate the sum of integers from 1 up to N using recursive self-invocation.
          </p>
          <LiveCodeEditor 
            key={`q2-${lang}`}
            language={lang}
            defaultCode={activePlaygrounds.q2.defaultCode}
            solution={activePlaygrounds.q2.solution}
          />
        </div>

        {/* Sandbox 3 */}
        <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4">
          <h3 className="font-sans font-bold text-lg text-mistral-navy">Challenge 3: Bracket Matching Verification (Medium)</h3>
          <p className="text-sm text-mistral-navy/70 mb-4 font-sans">
            Implement bracket matching validation using stack list operations.
          </p>
          <LiveCodeEditor 
            key={`q3-${lang}`}
            language={lang}
            defaultCode={activePlaygrounds.q3.defaultCode}
            solution={activePlaygrounds.q3.solution}
          />
        </div>
      </section>

      {/* Complete Milestone Card */}
      <section className="bg-mistral-navy text-white p-10 rounded-sm shadow-xl font-sans">
        <div className="flex items-center gap-3 mb-8">
          <CheckCircle2 className="w-8 h-8 text-mistral-orange" />
          <h2 className="font-serif text-3xl font-medium text-white font-bold">Dynamic Structures Complete</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <div>
            <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-3 text-white">Revision Skills Certified</h4>
            <ul className="list-disc pl-5 space-y-2 text-xs text-white/60">
              <li>Traversing link references in memory with current pointer nodes.</li>
              <li>Managing LIFO stack appending models to validate sequences.</li>
              <li>Structuring clean Base and Recursive function call branches.</li>
            </ul>
          </div>
          
          <div className="bg-white/5 p-6 rounded border border-white/10 flex flex-col justify-between items-center text-center">
            <p className="text-sm text-white/80 mb-6 font-sans">Ready to enter hierarchical Binary Trees and recursive DFS/BFS traversals?</p>
            <Link href={`/roadmaps/topics/trees-binary-trees?roadmap=${roadmapSlug}`} className="px-8 py-3 bg-mistral-orange text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-mistral-navy transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
              Go to Module 9: Trees & Binary Trees &rarr;
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
