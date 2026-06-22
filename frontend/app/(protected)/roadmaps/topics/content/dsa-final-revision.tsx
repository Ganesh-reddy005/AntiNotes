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

export default function DSAFinalRevisionTopic({ userLanguage }: TopicProps) {
  const lang = userLanguage.toLowerCase();

  // Dynamic parameters
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const roadmapSlug = params ? params.get("roadmap") || "dsa-fundamentals" : "dsa-fundamentals";

  const codeSnippets = {
    python: {
      table: `| Structure | Access | Search | Insertion | Deletion |\n|---|---|---|---|---|\n| Array | O(1) | O(N) | O(N) | O(N) |\n| Linked List | O(N) | O(N) | O(1) | O(1) |\n| Stack (LIFO) | O(N) | O(N) | O(1) | O(1) |\n| Queue (FIFO) | O(N) | O(N) | O(1) | O(1) |\n| BST (Balanced) | O(log N) | O(log N) | O(log N) | O(log N) |`
    },
    java: {
      table: `| Structure | Access | Search | Insertion | Deletion |\n|---|---|---|---|---|\n| Array | O(1) | O(N) | O(N) | O(N) |\n| Linked List | O(N) | O(N) | O(1) | O(1) |\n| Stack (LIFO) | O(N) | O(N) | O(1) | O(1) |\n| Queue (FIFO) | O(N) | O(N) | O(1) | O(1) |\n| BST (Balanced) | O(log N) | O(log N) | O(log N) | O(log N) |`
    },
    cpp: {
      table: `| Structure | Access | Search | Insertion | Deletion |\n|---|---|---|---|---|\n| Array | O(1) | O(N) | O(N) | O(N) |\n| Linked List | O(N) | O(N) | O(1) | O(1) |\n| Stack (LIFO) | O(N) | O(N) | O(1) | O(1) |\n| Queue (FIFO) | O(N) | O(N) | O(1) | O(1) |\n| BST (Balanced) | O(log N) | O(log N) | O(log N) | O(log N) |`
    },
    javascript: {
      table: `| Structure | Access | Search | Insertion | Deletion |\n|---|---|---|---|---|\n| Array | O(1) | O(N) | O(N) | O(N) |\n| Linked List | O(N) | O(N) | O(1) | O(1) |\n| Stack (LIFO) | O(N) | O(N) | O(1) | O(1) |\n| Queue (FIFO) | O(N) | O(N) | O(1) | O(1) |\n| BST (Balanced) | O(log N) | O(log N) | O(log N) | O(log N) |`
    }
  };

  const activeSnippet = codeSnippets[lang as keyof typeof codeSnippets] || codeSnippets.python;

  const playgrounds = {
    python: {
      q1: {
        defaultCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def find_max(root):
    # Task: Return the maximum node value in the Binary Tree recursively
    # Base Case: if root is None, return float('-inf')
    # Recursive Case: return the maximum of root.val, find_max(root.left), and find_max(root.right)
    pass

# Create tree:
#       10
#      /  \\
#     25   8
root = TreeNode(10)
root.left = TreeNode(25)
root.right = TreeNode(8)

print(find_max(root)) # Expected: 25`,
        solution: {
          code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def find_max(root):
    if root is None:
        return float('-inf')
    return max(root.val, find_max(root.left), find_max(root.right))

root = TreeNode(10)
root.left = TreeNode(25)
root.right = TreeNode(8)

print(find_max(root))`,
          explanation: "Return negative infinity if node is null (so it doesn't affect maximum calculations). Otherwise, use recursive calls to find the max values of left and right subtrees and compare them with the root's value."
        }
      },
      q2: {
        defaultCode: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

def reverse_list(head):
    # Task: Reverse the singly linked list in-place and return the new head node
    # Hint: Use a loop. Track prev = None, curr = head.
    # Save next node, shift curr.next to prev, then move prev to curr and curr to next.
    pass

# Helper to print list
def print_list(head):
    curr = head
    res = []
    while curr:
        res.append(str(curr.val))
        curr = curr.next
    return " -> ".join(res)

# Create list: 1 -> 2 -> 3
head = Node(1)
head.next = Node(2)
head.next.next = Node(3)

new_head = reverse_list(head)
print(print_list(new_head)) # Expected: 3 -> 2 -> 1`,
        solution: {
          code: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

def reverse_list(head):
    prev = None
    curr = head
    while curr is not None:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev

def print_list(head):
    curr = head
    res = []
    while curr:
        res.append(str(curr.val))
        curr = curr.next
    return " -> ".join(res)

head = Node(1)
head.next = Node(2)
head.next.next = Node(3)

new_head = reverse_list(head)
print(print_list(new_head))`,
          explanation: "Iterate through the linked list. For each node, temporarily save the next reference, update the node's next pointer to point backwards to the previous node, then slide the previous and current indicators forward."
        }
      },
      q3: {
        defaultCode: `def reverse_string(s):
    # Task: Reverse the given string s using stack operations (list append/pop)
    # Hint: Push all characters onto stack list. Pop characters to construct result.
    pass

print(reverse_string("hello")) # Expected: "olleh"`,
        solution: {
          code: `def reverse_string(s):
    stack = []
    for char in s:
        stack.append(char)
    res = ""
    while len(stack) > 0:
        res += stack.pop()
    return res

print(reverse_string("hello"))`,
          explanation: "Pushing characters onto a stack stores them in order. Popping them retrieves them in reverse order due to the LIFO behavior, rebuilding the string backwards."
        }
      }
    },
    java: {
      q1: {
        defaultCode: `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

public class Main {
    public static int findMax(TreeNode root) {
        // Task: Return the maximum node value in the Binary Tree recursively
        return 0;
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(10);
        root.left = new TreeNode(25);
        root.right = new TreeNode(8);
        System.out.println(findMax(root));
    }
}`,
        solution: {
          code: `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

public class Main {
    public static int findMax(TreeNode root) {
        if (root == null) {
            return Integer.MIN_VALUE;
        }
        int leftMax = findMax(root.left);
        int rightMax = findMax(root.right);
        return Math.max(root.val, Math.max(leftMax, rightMax));
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(10);
        root.left = new TreeNode(25);
        root.right = new TreeNode(8);
        System.out.println(findMax(root));
    }
}`,
          explanation: "If node is null, return Integer.MIN_VALUE. Otherwise, find the maximum recursively from both the left and right subtrees and compare it with the current root's value."
        }
      },
      q2: {
        defaultCode: `class Node {
    int val;
    Node next;
    Node(int val) {
        this.val = val;
        this.next = null;
    }
}

public class Main {
    public static Node reverseList(Node head) {
        // Task: Reverse the singly linked list in-place and return the new head node
        return null;
    }

    public static void main(String[] args) {
        Node head = new Node(1);
        head.next = new Node(2);
        head.next.next = new Node(3);
        Node newHead = reverseList(head);
        Node curr = newHead;
        while (curr != null) {
            System.out.print(curr.val + (curr.next != null ? " -> " : ""));
            curr = curr.next;
        }
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
    public static Node reverseList(Node head) {
        Node prev = null;
        Node curr = head;
        while (curr != null) {
            Node next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }

    public static void main(String[] args) {
        Node head = new Node(1);
        head.next = new Node(2);
        head.next.next = new Node(3);
        Node newHead = reverseList(head);
        Node curr = newHead;
        while (curr != null) {
            System.out.print(curr.val + (curr.next != null ? " -> " : ""));
            curr = curr.next;
        }
    }
}`,
          explanation: "Traverse list, changing each node's next pointer to point back to the previous node (prev). Slide prev and curr pointers forward."
        }
      },
      q3: {
        defaultCode: `import java.util.Stack;

public class Main {
    public static String reverseString(String s) {
        // Task: Reverse the given string s using stack operations
        return "";
    }

    public static void main(String[] args) {
        System.out.println(reverseString("hello"));
    }
}`,
        solution: {
          code: `import java.util.Stack;

public class Main {
    public static String reverseString(String s) {
        Stack<Character> stack = new Stack<>();
        for (int i = 0; i < s.length(); i++) {
            stack.push(s.charAt(i));
        }
        StringBuilder res = new StringBuilder();
        while (!stack.isEmpty()) {
            res.append(stack.pop());
        }
        return res.toString();
    }

    public static void main(String[] args) {
        System.out.println(reverseString("hello"));
    }
}`,
          explanation: "Pushing characters onto a stack stores them in order. Popping them retrieves them in reverse order due to the LIFO behavior, rebuilding the string backwards."
        }
      }
    },
    cpp: {
      q1: {
        defaultCode: `#include <iostream>
#include <algorithm>
#include <climits>

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

int findMax(TreeNode* root) {
    // Task: Return the maximum node value in the Binary Tree recursively
    return 0;
}

int main() {
    TreeNode* root = new TreeNode(10);
    root->left = new TreeNode(25);
    root->right = new TreeNode(8);
    std::cout << findMax(root) << std::endl;
    return 0;
}`,
        solution: {
          code: `#include <iostream>
#include <algorithm>
#include <climits>

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

int findMax(TreeNode* root) {
    if (root == nullptr) {
        return INT_MIN;
    }
    int leftMax = findMax(root->left);
    int rightMax = findMax(root->right);
    return std::max(root->val, std::max(leftMax, rightMax));
}

int main() {
    TreeNode* root = new TreeNode(10);
    root->left = new TreeNode(25);
    root->right = new TreeNode(8);
    std::cout << findMax(root) << std::endl;
    return 0;
}`,
          explanation: "If node is null, return INT_MIN. Otherwise, find the maximum recursively from both the left and right subtrees and compare it with the current root's value."
        }
      },
      q2: {
        defaultCode: `#include <iostream>

struct Node {
    int val;
    Node* next;
    Node(int x) : val(x), next(nullptr) {}
};

Node* reverseList(Node* head) {
    // Task: Reverse the singly linked list in-place and return the new head node
    return nullptr;
}

int main() {
    Node* head = new Node(1);
    head->next = new Node(2);
    head->next->next = new Node(3);
    Node* newHead = reverseList(head);
    Node* curr = newHead;
    while (curr != nullptr) {
        std::cout << curr->val << (curr->next != nullptr ? " -> " : "");
        curr = curr->next;
    }
    return 0;
}`,
        solution: {
          code: `#include <iostream>

struct Node {
    int val;
    Node* next;
    Node(int x) : val(x), next(nullptr) {}
};

Node* reverseList(Node* head) {
    Node* prev = nullptr;
    Node* curr = head;
    while (curr != nullptr) {
        Node* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}

int main() {
    Node* head = new Node(1);
    head->next = new Node(2);
    head->next->next = new Node(3);
    Node* newHead = reverseList(head);
    Node* curr = newHead;
    while (curr != nullptr) {
        std::cout << curr->val << (curr->next != nullptr ? " -> " : "");
        curr = curr->next;
    }
    return 0;
}`,
          explanation: "Traverse list, changing each node's next pointer to point back to the previous node (prev). Slide prev and curr pointers forward."
        }
      },
      q3: {
        defaultCode: `#include <iostream>
#include <stack>
#include <string>

std::string reverseString(std::string s) {
    // Task: Reverse the given string s using stack operations
    return "";
}

int main() {
    std::cout << reverseString("hello") << std::endl;
    return 0;
}`,
        solution: {
          code: `#include <iostream>
#include <stack>
#include <string>

std::string reverseString(std::string s) {
    std::stack<char> st;
    for (char c : s) {
        st.push(c);
    }
    std::string res = "";
    while (!st.empty()) {
        res += st.top();
        st.pop();
    }
    return res;
}

int main() {
    std::cout << reverseString("hello") << std::endl;
    return 0;
}`,
          explanation: "Pushing characters onto a stack stores them in order. Popping them retrieves them in reverse order due to the LIFO behavior, rebuilding the string backwards."
        }
      }
    },
    javascript: {
      q1: {
        defaultCode: `class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function findMax(root) {
    // Task: Return the maximum node value in the Binary Tree recursively
    return 0;
}

const root = new TreeNode(10);
root.left = new TreeNode(25);
root.right = new TreeNode(8);

console.log(findMax(root)); # Expected: 25`,
        solution: {
          code: `class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function findMax(root) {
    if (root === null) {
        return -Infinity;
    }
    return Math.max(root.val, findMax(root.left), findMax(root.right));
}

const root = new TreeNode(10);
root.left = new TreeNode(25);
root.right = new TreeNode(8);

console.log(findMax(root));`,
          explanation: "If node is null, return -Infinity. Otherwise, find the maximum recursively from both the left and right subtrees and compare it with the current root's value."
        }
      },
      q2: {
        defaultCode: `class Node {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

function reverseList(head) {
    // Task: Reverse the singly linked list in-place and return the new head node
    return null;
}

const head = new Node(1);
head.next = new Node(2);
head.next.next = new Node(3);

const newHead = reverseList(head);
let curr = newHead;
let res = [];
while (curr !== null) {
    res.push(curr.val);
    curr = curr.next;
}
console.log(res.join(" -> ")); # Expected: 3 -> 2 -> 1`,
        solution: {
          code: `class Node {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

function reverseList(head) {
    let prev = null;
    let curr = head;
    while (curr !== null) {
        let next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}

const head = new Node(1);
head.next = new Node(2);
head.next.next = new Node(3);

const newHead = reverseList(head);
let curr = newHead;
let res = [];
while (curr !== null) {
    res.push(curr.val);
    curr = curr.next;
}
console.log(res.join(" -> "));`,
          explanation: "Traverse list, changing each node's next pointer to point back to the previous node (prev). Slide prev and curr pointers forward."
        }
      },
      q3: {
        defaultCode: `function reverseString(s) {
    // Task: Reverse the given string s using stack operations
    return "";
}

console.log(reverseString("hello")); # Expected: "olleh"`,
        solution: {
          code: `function reverseString(s) {
    const stack = [];
    for (let i = 0; i < s.length; i++) {
        stack.push(s[i]);
    }
    let res = "";
    while (stack.length > 0) {
        res += stack.pop();
    }
    return res;
}

console.log(reverseString("hello"));`,
          explanation: "Pushing characters onto a stack stores them in order. Popping them retrieves them in reverse order due to the LIFO behavior, rebuilding the string backwards."
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
          <h1 className="font-serif text-5xl font-medium italic text-white drop-shadow-sm">Final DSA Revision</h1>
        </div>
        <p className="text-white/80 max-w-2xl text-lg leading-relaxed font-sans">
          Securing your entire Data Structures & Algorithms knowledge before completing the track!
        </p>
      </section>

      {/* Complexity Reference Chart */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Rocket className="w-8 h-8 text-amber-500" />
          <h2 className="font-serif text-3xl font-medium text-mistral-navy">Core Complexity Reference</h2>
        </div>
        <p className="font-sans text-sm text-mistral-navy/70 leading-relaxed mb-6">
          Review time complexities for standard data structure search, insert, and delete workflows.
        </p>
        
        <div className="prose prose-mistral max-w-none prose-table:border prose-table:border-mistral-navy/10 prose-th:bg-mistral-bg prose-th:px-4 prose-th:py-2 prose-td:px-4 prose-td:py-2 prose-td:border-t text-sm font-sans">
          <table className="w-full border-collapse border border-mistral-navy/10 text-left">
            <thead>
              <tr className="bg-mistral-bg">
                <th className="border border-mistral-navy/10 p-3 font-bold">Data Structure</th>
                <th className="border border-mistral-navy/10 p-3 font-bold">Access</th>
                <th className="border border-mistral-navy/10 p-3 font-bold">Search</th>
                <th className="border border-mistral-navy/10 p-3 font-bold">Insertion</th>
                <th className="border border-mistral-navy/10 p-3 font-bold">Deletion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-mistral-navy/10 p-3 font-mono font-bold">Array</td>
                <td className="border border-mistral-navy/10 p-3 font-mono">O(1)</td>
                <td className="border border-mistral-navy/10 p-3 font-mono">O(N)</td>
                <td className="border border-mistral-navy/10 p-3 font-mono">O(N)</td>
                <td className="border border-mistral-navy/10 p-3 font-mono">O(N)</td>
              </tr>
              <tr>
                <td className="border border-mistral-navy/10 p-3 font-mono font-bold">Linked List</td>
                <td className="border border-mistral-navy/10 p-3 font-mono">O(N)</td>
                <td className="border border-mistral-navy/10 p-3 font-mono">O(N)</td>
                <td className="border border-mistral-navy/10 p-3 font-mono">O(1)</td>
                <td className="border border-mistral-navy/10 p-3 font-mono">O(1)</td>
              </tr>
              <tr>
                <td className="border border-mistral-navy/10 p-3 font-mono font-bold">Stack (LIFO)</td>
                <td className="border border-mistral-navy/10 p-3 font-mono">O(N)</td>
                <td className="border border-mistral-navy/10 p-3 font-mono">O(N)</td>
                <td className="border border-mistral-navy/10 p-3 font-mono">O(1)</td>
                <td className="border border-mistral-navy/10 p-3 font-mono">O(1)</td>
              </tr>
              <tr>
                <td className="border border-mistral-navy/10 p-3 font-mono font-bold">Queue (FIFO)</td>
                <td className="border border-mistral-navy/10 p-3 font-mono">O(N)</td>
                <td className="border border-mistral-navy/10 p-3 font-mono">O(N)</td>
                <td className="border border-mistral-navy/10 p-3 font-mono">O(1)</td>
                <td className="border border-mistral-navy/10 p-3 font-mono">O(1)</td>
              </tr>
              <tr>
                <td className="border border-mistral-navy/10 p-3 font-mono font-bold">BST (Balanced)</td>
                <td className="border border-mistral-navy/10 p-3 font-mono">O(log N)</td>
                <td className="border border-mistral-navy/10 p-3 font-mono">O(log N)</td>
                <td className="border border-mistral-navy/10 p-3 font-mono">O(log N)</td>
                <td className="border border-mistral-navy/10 p-3 font-mono">O(log N)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Important Points */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-8 h-8 text-amber-500" />
          <h2 className="font-serif text-3xl font-medium text-mistral-navy">Logical Synthesis Focus</h2>
        </div>
        <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div>
              <h4 className="font-sans font-bold text-mistral-navy mb-2 uppercase tracking-wider">Complexity Rule</h4>
              <p className="font-sans text-mistral-navy/70 text-xs leading-relaxed">
                Always prioritize algorithms that minimize traversal overhead. Constant time O(1) structures are best for element lookups by index, while trees drop search scales to O(log N).
              </p>
            </div>
            <div>
              <h4 className="font-sans font-bold text-mistral-navy mb-2 uppercase tracking-wider">Pointer Direction</h4>
              <p className="font-sans text-mistral-navy/70 text-xs leading-relaxed">
                Linked lists rely heavily on memory location offsets. To change linkages or reverse items, shift pointer indicators sequentially to avoid breaking link chains.
              </p>
            </div>
            <div>
              <h4 className="font-sans font-bold text-mistral-navy mb-2 uppercase tracking-wider">Restricted Limits</h4>
              <p className="font-sans text-mistral-navy/70 text-xs leading-relaxed">
                Stacks push/pop from a single top limit (LIFO), whereas queues edit from both (FIFO). Always track endpoints to maintain sequence limits.
              </p>
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
            question="What is the worst-case time complexity of searching for a value in a balanced Binary Search Tree vs. an unsorted Singly Linked List?"
            options={[
              "O(1) vs. O(N)",
              "O(log N) vs. O(N)",
              "O(N) vs. O(N)",
              "O(log N) vs. O(1)"
            ]}
            correctIndex={1}
            explanation="A balanced BST cuts work in half at each node choice (O(log N)), while a linked list requires node-by-node scanning from head to tail (O(N))."
          />

          <MCQQuiz 
            question="Which data structure operates strictly under LIFO logic and is best suited for browser back/forward history tracking?"
            options={[
              "Singly Linked List",
              "FIFO Queue",
              "LIFO Stack",
              "Constant Array"
            ]}
            correctIndex={2}
            explanation="Browser history pops the last visited page off the stack when backtracking, which is a textbook example of Last-In, First-Out (LIFO) stack operations."
          />

          <MCQQuiz 
            question="What is the ultimate root cause of a recursive Stack Overflow crash?"
            options={[
              "The program executed in O(1) constant time",
              "The recursive function exceeded the maximum allowed call stack capacity because it lacked an active base case",
              "Pointers to dynamic structures were stored contiguously",
              "The compiler converted recursion to a restricted FIFO queue automatically"
            ]}
            correctIndex={1}
            explanation="Without an active base case to halt executions, recursive calls stack frames recursively until the program runs out of memory limits, triggering a Stack Overflow."
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
          Complete the coding challenges below to demonstrate your master level command of DSA fundamentals!
        </p>

        {/* Sandbox 1 */}
        <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4 mb-12">
          <h3 className="font-sans font-bold text-lg text-mistral-navy">Challenge 1: Max Node in a Binary Tree (Easy)</h3>
          <p className="text-sm text-mistral-navy/70 mb-4 font-sans">
            Traverse the tree recursively and return the maximum value contained in its nodes.
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
          <h3 className="font-sans font-bold text-lg text-mistral-navy">Challenge 2: Reverse a Singly Linked List (Medium)</h3>
          <p className="text-sm text-mistral-navy/70 mb-4 font-sans">
            Redirect the list links in-place so that the items point backwards. Return the new head node.
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
          <h3 className="font-sans font-bold text-lg text-mistral-navy">Challenge 3: Reverse a String using Stack (Easy)</h3>
          <p className="text-sm text-mistral-navy/70 mb-4 font-sans">
            Reverse the characters in a string using LIFO push/pop operations.
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
          <h2 className="font-serif text-3xl font-medium text-white font-bold">DSA Certification Earned</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <div>
            <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-3 text-white">Curriculum Completed</h4>
            <ul className="list-disc pl-5 space-y-2 text-xs text-white/60">
              <li>Time and space scalability checks with Big O notations.</li>
              <li>Linear memory structures, indexing, and two-pointer traversal sweeps.</li>
              <li>Push, pop, enqueue, and dequeue restricted endpoints.</li>
              <li>Dynamic node traversals, binary search trees, and tree recursion.</li>
            </ul>
          </div>
          
          <div className="bg-white/5 p-6 rounded border border-white/10 flex flex-col justify-between items-center text-center">
            <p className="text-sm text-white/80 mb-6 font-sans">You have successfully mastered the DSA Fundamentals curriculum!</p>
            <Link href="/dashboard" className="px-8 py-3 bg-mistral-orange text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-mistral-navy transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
              Proceed to Dashboard &rarr;
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
