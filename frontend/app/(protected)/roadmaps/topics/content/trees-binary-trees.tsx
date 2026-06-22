"use client";
import React, { useState } from "react";
import Link from "next/link";
import { MCQQuiz } from "@/components/interactive/MCQQuiz";
import { CodeTabs } from "@/components/interactive/CodeTabs";
import { LiveCodeEditor } from "@/components/interactive/LiveCodeEditor";
import { HelpCircle, Code2, Play, RotateCcw, TreeDeciduous, GraduationCap, CheckCircle2, Award } from "lucide-react";

interface TopicProps {
  userLanguage: string;
}

export default function TreesBinaryTreesTopic({ userLanguage }: TopicProps) {
  const lang = userLanguage.toLowerCase();

  // Dynamic parameters
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const roadmapSlug = params ? params.get("roadmap") || "dsa-fundamentals" : "dsa-fundamentals";

  // Traversal visualizer configurations
  const [traversalType, setTraversalType] = useState<"preorder" | "inorder" | "postorder">("preorder");
  const [activeStep, setActiveStep] = useState<number | null>(null);

  // Nodes metadata for SVG rendering
  // Coordinates are designed inside 400x240 view box
  const nodes = [
    { id: 1, val: 1, cx: 200, cy: 40 },
    { id: 2, val: 2, cx: 100, cy: 110 },
    { id: 3, val: 3, cx: 300, cy: 110 },
    { id: 4, val: 4, cx: 50, cy: 180 },
    { id: 5, val: 5, cx: 150, cy: 180 }
  ];

  const lines = [
    { from: 1, to: 2, x1: 200, y1: 40, x2: 100, y2: 110 },
    { from: 1, to: 3, x1: 200, y1: 40, x2: 300, y2: 110 },
    { from: 2, to: 4, x1: 100, y1: 110, x2: 50, y2: 180 },
    { from: 2, to: 5, x1: 100, y1: 110, x2: 150, y2: 180 }
  ];

  const traversalSteps = {
    preorder: [
      { activeNode: 1, visited: [1], log: "Start at root Node 1. Visit Root first before traversing subtrees." },
      { activeNode: 2, visited: [1, 2], log: "Move to left child Node 2. Visit Node 2 before its children." },
      { activeNode: 4, visited: [1, 2, 4], log: "Move to Node 2's left child Node 4. Node 4 is a leaf (no children), visit it and backtrack." },
      { activeNode: 5, visited: [1, 2, 4, 5], log: "Backtrack to Node 2, then move to its right child Node 5. Visit Node 5." },
      { activeNode: 3, visited: [1, 2, 4, 5, 3], log: "Backtrack through Node 2 and Node 1. Move to Root's right child Node 3. Visit Node 3." },
      { activeNode: null, visited: [1, 2, 4, 5, 3], log: "All nodes processed! Preorder traversal result is complete." }
    ],
    inorder: [
      { activeNode: 4, visited: [4], log: "Traverse deep left from Node 1 to Node 2, then to leaf Node 4. Visit Node 4 first." },
      { activeNode: 2, visited: [4, 2], log: "Backtrack to Node 2. Node 2's left subtree is done, so visit Node 2." },
      { activeNode: 5, visited: [4, 2, 5], log: "Move to Node 2's right child Node 5. Visit Node 5 and backtrack." },
      { activeNode: 1, visited: [4, 2, 5, 1], log: "Backtrack through Node 2 to root Node 1. Visit root Node 1." },
      { activeNode: 3, visited: [4, 2, 5, 1, 3], log: "Move to right child Node 3. Visit Node 3." },
      { activeNode: null, visited: [4, 2, 5, 1, 3], log: "All nodes processed! Inorder traversal result is complete." }
    ],
    postorder: [
      { activeNode: 4, visited: [4], log: "Traverse deep left to leaf Node 4. Visit Node 4." },
      { activeNode: 5, visited: [4, 5], log: "Backtrack to Node 2. Before visiting parent, traverse right child Node 5. Visit Node 5." },
      { activeNode: 2, visited: [4, 5, 2], log: "Both left and right subtrees of Node 2 are completed. Backtrack and visit Node 2." },
      { activeNode: 3, visited: [4, 5, 2, 3], log: "Backtrack to Node 1. Before root, traverse right child Node 3. Visit leaf Node 3." },
      { activeNode: 1, visited: [4, 5, 2, 3, 1], log: "Both left and right subtrees of root Node 1 are completed. Visit root Node 1 last." },
      { activeNode: null, visited: [4, 5, 2, 3, 1], log: "All nodes processed! Postorder traversal result is complete." }
    ]
  };

  const stepsList = traversalSteps[traversalType];
  const currentStep = activeStep !== null ? stepsList[activeStep] : null;
  const activeNodeId = currentStep ? currentStep.activeNode : null;
  const visitedArray = currentStep ? currentStep.visited : [];
  const logMessage = currentStep ? currentStep.log : "Click 'Next Step' to trace the recursion call stack.";

  const handleNext = () => {
    if (activeStep === null) {
      setActiveStep(0);
    } else if (activeStep < stepsList.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleReset = () => {
    setActiveStep(null);
  };

  const handleTypeChange = (type: "preorder" | "inorder" | "postorder") => {
    setTraversalType(type);
    setActiveStep(null);
  };

  const codeSnippets = {
    python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# Recursive Inorder Traversal
def inorder_traversal(root):
    if not root:
        return
    inorder_traversal(root.left)
    print(root.val)
    inorder_traversal(root.right)`,
    java: `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

// Recursive Inorder Traversal
public static void inorderTraversal(TreeNode root) {
    if (root == null) {
        return;
    }
    inorderTraversal(root.left);
    System.out.println(root.val);
    inorderTraversal(root.right);
}`,
    cpp: `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

// Recursive Inorder Traversal
void inorderTraversal(TreeNode* root) {
    if (root == nullptr) {
        return;
    }
    inorderTraversal(root->left);
    std::cout << root->val << std::endl;
    inorderTraversal(root->right);
}`,
    javascript: `class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

// Recursive Inorder Traversal
function inorderTraversal(root) {
    if (!root) {
        return;
    }
    inorderTraversal(root.left);
    console.log(root.val);
    inorderTraversal(root.right);
}`
  };

  const activeSnippet = codeSnippets[lang as keyof typeof codeSnippets] || codeSnippets.python;

  const playgroundData = {
    python: {
      defaultCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def sum_nodes(root):
    # Task: Return the sum of all node values in the tree recursively
    # Base Case: if root is None, return 0
    # Recursive Case: return root.val + sum_nodes(root.left) + sum_nodes(root.right)
    pass

# Construct test tree:
#       10
#      /  \\
#     5    15
root = TreeNode(10)
root.left = TreeNode(5)
root.right = TreeNode(15)

print(sum_nodes(root)) # Expected output: 30`,
      solution: {
        code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def sum_nodes(root):
    if root is None:
        return 0
    return root.val + sum_nodes(root.left) + sum_nodes(root.right)

root = TreeNode(10)
root.left = TreeNode(5)
root.right = TreeNode(15)

print(sum_nodes(root))`,
        explanation: "If the root is None, the sum is 0 (base case). Otherwise, calculate the node value itself plus the sum of all left nodes recursively, plus the sum of all right nodes recursively."
      }
    },
    java: {
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
    public static int sumNodes(TreeNode root) {
        // Task: Return the sum of all node values in the tree recursively
        return 0;
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(10);
        root.left = new TreeNode(5);
        root.right = new TreeNode(15);
        System.out.println(sumNodes(root));
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
    public static int sumNodes(TreeNode root) {
        if (root == null) {
            return 0;
        }
        return root.val + sumNodes(root.left) + sumNodes(root.right);
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(10);
        root.left = new TreeNode(5);
        root.right = new TreeNode(15);
        System.out.println(sumNodes(root));
    }
}`,
        explanation: "Check if root is null to return 0. Otherwise, perform recursive summation by calling root.val + sumNodes(root.left) + sumNodes(root.right)."
      }
    },
    cpp: {
      defaultCode: `#include <iostream>

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

int sumNodes(TreeNode* root) {
    // Task: Return the sum of all node values in the tree recursively
    return 0;
}

int main() {
    TreeNode* root = new TreeNode(10);
    root->left = new TreeNode(5);
    root->right = new TreeNode(15);
    std::cout << sumNodes(root) << std::endl;
    return 0;
}`,
      solution: {
        code: `#include <iostream>

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

int sumNodes(TreeNode* root) {
    if (root == nullptr) {
        return 0;
    }
    return root->val + sumNodes(root->left) + sumNodes(root->right);
}

int main() {
    TreeNode* root = new TreeNode(10);
    root->left = new TreeNode(5);
    root->right = new TreeNode(15);
    std::cout << sumNodes(root) << std::endl;
    return 0;
}`,
        explanation: "The base case checks for nullptr and returns 0. The recursive step returns the root's value plus the recursive sum of left and right child pointers."
      }
    },
    javascript: {
      defaultCode: `class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function sumNodes(root) {
    // Task: Return the sum of all node values in the tree recursively
    return 0;
}

const root = new TreeNode(10);
root.left = new TreeNode(5);
root.right = new TreeNode(15);

console.log(sumNodes(root));`,
      solution: {
        code: `class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function sumNodes(root) {
    if (root === null) {
        return 0;
    }
    return root.val + sumNodes(root.left) + sumNodes(root.right);
}

const root = new TreeNode(10);
root.left = new TreeNode(5);
root.right = new TreeNode(15);

console.log(sumNodes(root));`,
        explanation: "Check for null as the base case and return 0. Return the addition of root.val and the recursive summation of both subtrees."
      }
    }
  };

  const activePlayground = playgroundData[lang as keyof typeof playgroundData] || playgroundData.python;

  return (
    <div className="space-y-16 text-left">
      
      {/* 1. Introduction */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <TreeDeciduous className="w-8 h-8 text-mistral-orange" />
          <h2 className="font-serif text-3xl font-medium text-mistral-navy">Understanding Trees</h2>
        </div>
        <div className="prose prose-mistral max-w-none text-mistral-navy/70 text-base space-y-6">
          <p>
            Until now, we have studied linear data structures like Arrays, Linked Lists, Stacks, and Queues. 
            In these structures, elements follow a straight, sequential line.
          </p>
          <p>
            A <strong>Tree</strong> is a non-linear, hierarchical structure. 
            It represents data organized parent-child relationships, much like an organizational chart or directory structure on a computer.
          </p>
          <div className="bg-amber-50 p-6 border-l-4 border-amber-400 text-xs text-amber-900/80 rounded-r">
            <span className="font-mono font-bold block mb-1">Key Terminology:</span>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li><strong>Root:</strong> The topmost node of the tree, which has no parent.</li>
              <li><strong>Parent / Child:</strong> A node connected directly below another is its child; the node above is the parent.</li>
              <li><strong>Leaf:</strong> A node that has no children (endpoints of the tree).</li>
              <li><strong>Edge:</strong> The link or pointer connecting one node to another.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2. Binary Trees & Traversal Visualizer */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-4">Binary Tree Traversals</h2>
        <p className="font-sans text-mistral-navy/60 text-sm mb-6">
          A **Binary Tree** is a tree where each node can have at most two children, commonly referred to as the <strong>left child</strong> and <strong>right child</strong>.
          Since trees are hierarchical, we traverse them using recursive depth-first algorithms: Preorder, Inorder, and Postorder.
        </p>

        <div className="max-w-xl mx-auto bg-white border border-mistral-navy/10 p-8 shadow-sm flex flex-col items-center">
          {/* Visualizer Header Controls */}
          <div className="flex gap-2 mb-6 border-b border-mistral-navy/5 pb-4 w-full justify-center">
            {["preorder", "inorder", "postorder"].map((type) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type as any)}
                className={`px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  traversalType === type
                    ? "bg-mistral-orange text-white"
                    : "bg-mistral-bg hover:bg-mistral-navy/5 text-mistral-navy/60"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* SVG Diagram */}
          <div className="relative w-full max-w-[360px] aspect-[4/3] bg-mistral-bg/20 rounded border border-mistral-navy/5 p-4 flex items-center justify-center">
            <svg viewBox="0 0 400 240" className="w-full h-full">
              {/* Lines */}
              {lines.map((line, idx) => {
                const isActive = 
                  (activeNodeId === line.from && activeStep !== null && stepsList[activeStep].visited.includes(line.to)) ||
                  (activeNodeId === line.to);
                return (
                  <line
                    key={idx}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke={isActive ? "#f97316" : "#cbd5e1"}
                    strokeWidth={isActive ? 3 : 2}
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* Nodes */}
              {nodes.map((node) => {
                const isActive = activeNodeId === node.id;
                const isVisited = visitedArray.includes(node.id);
                return (
                  <g key={node.id} className="cursor-pointer">
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r={20}
                      fill={isActive ? "#f97316" : isVisited ? "#0f172a" : "#ffffff"}
                      stroke={isActive ? "#f97316" : "#0f172a"}
                      strokeWidth={2}
                      className="transition-all duration-300"
                    />
                    <text
                      x={node.cx}
                      y={node.cy + 4}
                      textAnchor="middle"
                      className={`font-mono text-xs font-bold transition-all duration-300 ${
                        isActive || isVisited ? "fill-white" : "fill-mistral-navy"
                      }`}
                    >
                      {node.val}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Steps Trace controls */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleNext}
              disabled={activeStep === stepsList.length - 1}
              className="flex items-center gap-2 px-5 py-2.5 bg-mistral-navy text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-mistral-orange transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Next Step
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 border border-mistral-navy/10 font-mono text-xs font-bold uppercase tracking-widest hover:bg-mistral-bg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* Traversal State display */}
          <div className="w-full text-left text-xs font-mono border-t border-mistral-navy/5 pt-4 mt-6 space-y-4">
            <div>
              <span className="text-[10px] text-mistral-navy/40 uppercase tracking-widest block mb-1">Traversal Log:</span>
              <p className="text-mistral-navy/70 leading-relaxed">&gt; {logMessage}</p>
            </div>
            <div>
              <span className="text-[10px] text-mistral-navy/40 uppercase tracking-widest block mb-1">Visited Output Order:</span>
              <div className="flex gap-2">
                {visitedArray.length === 0 ? (
                  <span className="text-mistral-navy/20 italic">No nodes visited yet</span>
                ) : (
                  visitedArray.map((val, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-mistral-navy text-white text-[10px] font-bold rounded-sm animate-in zoom-in-50 duration-200"
                    >
                      {val}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Code Example */}
      <section className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4 text-left max-w-xl mx-auto">
        <h4 className="font-mono text-lg font-bold text-mistral-navy">Recursive Traversal Code</h4>
        <p className="font-sans text-sm text-mistral-navy/70 leading-relaxed">
          See how a simple binary node represents pointers to left/right children, and recursive calls print elements.
        </p>
        
        <CodeTabs defaultLang={userLanguage}>
          <div data-lang={lang}>
            {JSON.stringify({
              code: activeSnippet,
              explanation: "Tree recursion works exactly like standard functions: calling left subtree, returning, executing root statement, and calling right subtree."
            })}
          </div>
        </CodeTabs>
      </section>

      {/* 4. Practice Sandbox */}
      <section className="border-t border-mistral-navy/10 pt-16 text-left">
        <div className="flex items-center gap-2 mb-6">
          <Code2 className="w-5 h-5 text-mistral-orange" />
          <span className="font-mono text-xs text-mistral-navy/60 uppercase tracking-widest">Logic Practice</span>
        </div>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-4">Playground: Sum of Binary Tree Nodes</h2>
        <p className="font-sans text-sm text-mistral-navy/70 leading-relaxed mb-6">
          Complete the function to calculate the recursive sum of all nodes in a binary tree.
          If a subtree is empty (None), its sum is 0. Otherwise, accumulate the sum of left, right, and parent values.
        </p>

        <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4">
          <div className="bg-amber-50 p-4 border-l-4 border-amber-400 text-xs text-amber-900/80 mb-4 rounded-r">
            <span className="font-mono font-bold block mb-1">Beginner Note:</span>
            it is ok if you do not understand multiple recursive calls yet. Take a guess, click execute, or review the solution to see how sub-problems accumulate up the stack!
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
            question="What is the maximum number of child nodes a parent node can have in a Binary Tree?" 
            options={[
              "No limit",
              "At most 1",
              "At most 2",
              "Strictly 0"
            ]} 
            correctIndex={2}
            explanation="By definition, a binary tree node has at most two children, typically named left and right." 
          />

          <MCQQuiz 
            question="Which depth-first traversal prints the root node first before visiting subtrees?" 
            options={[
              "Inorder Traversal",
              "Preorder Traversal",
              "Postorder Traversal",
              "Breadth-First Search"
            ]} 
            correctIndex={1}
            explanation="Preorder traversal executes root operation first, then moves to left, then right subtrees." 
          />
        </div>
      </section>

      {/* 6. Summary Recap & Next Milestone */}
      <section className="bg-mistral-navy text-white p-10 rounded-sm shadow-xl font-sans">
        <div className="flex items-center gap-3 mb-8">
          <Award className="w-8 h-8 text-mistral-orange" />
          <h2 className="font-serif text-3xl font-medium text-white font-bold">Trees & Binary Trees Complete!</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <div className="space-y-6">
            <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-3 text-white">Roadmap Concepts Certified</h4>
            <ul className="list-disc pl-5 space-y-2 text-xs text-white/60">
              <li>Time/Space complexity estimation using Big O notation.</li>
              <li>Linear structure configurations like Arrays, Lists, and String boundaries.</li>
              <li>Restricted endpoint manipulations in Stacks and Queues.</li>
              <li>Recursive stack frameworks and Hierarchical Trees/Traversals.</li>
            </ul>
          </div>
          
          <div className="bg-white/5 p-6 rounded border border-white/10 flex flex-col justify-between items-center text-center">
            <p className="text-sm text-white/80 mb-6 font-sans">Ready to verify your command of all DSA structures and algorithms in the final milestone?</p>
            <Link href={`/roadmaps/topics/dsa-final-revision?roadmap=${roadmapSlug}`} className="px-8 py-3 bg-mistral-orange text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-mistral-navy transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
              Go to Module 10: Final DSA Revision &rarr;
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
