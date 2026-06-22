"use client";
import React, { useState } from "react";
import Link from "next/link";
import { MCQQuiz } from "@/components/interactive/MCQQuiz";
import { CodeTabs } from "@/components/interactive/CodeTabs";
import { LiveCodeEditor } from "@/components/interactive/LiveCodeEditor";
import { Info, HelpCircle, Code2 } from "lucide-react";

type ComplexityType = "constant" | "logarithmic" | "linear" | "quadratic";

interface TopicProps {
  userLanguage: string;
}

export default function ComplexityAnalysisTopic({ userLanguage }: TopicProps) {
  const [selectedComplexity, setSelectedComplexity] = useState<ComplexityType>("linear");
  const lang = userLanguage.toLowerCase();

  const complexityDetails = {
    constant: {
      title: "Constant Time - O(1)",
      description: "The execution time remains exactly the same, regardless of how large the input data becomes. It takes a constant number of steps.",
      example: "Accessing an item in an array by its position (index).",
      code: {
        python: `def get_first_element(arr):\n    # Accessing by index takes a single constant step\n    return arr[0] if len(arr) > 0 else None`,
        java: `public int getFirstElement(int[] arr) {\n    // Accessing by index takes a single constant step\n    if (arr.length > 0) {\n        return arr[0];\n    }\n    return -1;\n}`,
        cpp: `int getFirstElement(const std::vector<int>& arr) {\n    // Accessing by index takes a single constant step\n    if (!arr.empty()) {\n        return arr[0];\n    }\n    return -1;\n}`,
        javascript: `function getFirstElement(arr) {\n    // Accessing by index takes a single constant step\n    return arr.length > 0 ? arr[0] : null;\n}`
      },
      explanation: "No matter if the array has 10 elements or 10 million elements, the CPU computes the location of the index instantly and performs a single read operation. The complexity is independent of input size."
    },
    logarithmic: {
      title: "Logarithmic Time - O(log N)",
      description: "Each step of the algorithm divides the remaining work in half. The number of operations grows very slowly as the input scales.",
      example: "Searching for a number in a sorted array using Binary Search.",
      code: {
        python: `def binary_search(arr, target):\n    # Splits the search space in half each loop iteration\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1`,
        java: `public int binarySearch(int[] arr, int target) {\n    // Splits the search space in half each loop iteration\n    int low = 0, high = arr.length - 1;\n    while (low <= high) {\n        int mid = (low + high) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`,
        cpp: `int binarySearch(const std::vector<int>& arr, int target) {\n    // Splits the search space in half each loop iteration\n    int low = 0, high = arr.size() - 1;\n    while (low <= high) {\n        int mid = (low + high) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`,
        javascript: `function binarySearch(arr, target) {\n    // Splits the search space in half each loop iteration\n    let low = 0, high = arr.length - 1;\n    while (low <= high) {\n        let mid = Math.floor((low + high) / 2);\n        if (arr[mid] === target) return mid;\n        else if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`
      },
      explanation: "Each iteration discards half of the elements. Doubling the array size only adds a single extra comparison step. This is highly efficient at scale."
    },
    linear: {
      title: "Linear Time - O(N)",
      description: "The execution time grows in direct, 1-to-1 proportion with the size of the input data. If the input size doubles, the work doubles.",
      example: "Searching through a collection sequentially to find a value.",
      code: {
        python: `def linear_search(arr, target):\n    # Checks every element one-by-one\n    for i in range(len(arr)):\n        if arr[i] == target:\n            return i\n    return -1`,
        java: `public int linearSearch(int[] arr, int target) {\n    // Checks every element one-by-one\n    for (int i = 0; i < arr.length; i++) {\n        if (arr[i] == target) return i;\n    }\n    return -1;\n}`,
        cpp: `int linearSearch(const std::vector<int>& arr, int target) {\n    // Checks every element one-by-one\n    for (int i = 0; i < arr.size(); i++) {\n        if (arr[i] == target) return i;\n    }\n    return -1;\n}`,
        javascript: `function linearSearch(arr, target) {\n    // Checks every element one-by-one\n    for (let i = 0; i < arr.length; i++) {\n        if (arr[i] === target) return i;\n    }\n    return -1;\n}`
      },
      explanation: "Since the loop runs N times, the number of executions scales linearly with N. Don't worry, you will learn more about arrays and loops in detail in the upcoming modules!"
    },
    quadratic: {
      title: "Quadratic Time - O(N^2)",
      description: "The running time grows quadratically with the input size. If input size N doubles, the operations increase by a factor of four.",
      example: "Comparing every element in a list with every other element.",
      code: {
        python: `def find_duplicates(arr):\n    # Nested loop comparing all pairs\n    n = len(arr)\n    for i in range(n):\n        for j in range(i + 1, n):\n            if arr[i] == arr[j]:\n                return True\n    return False`,
        java: `public boolean findDuplicates(int[] arr) {\n    // Nested loop comparing all pairs\n    int n = arr.length;\n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            if (arr[i] == arr[j]) return true;\n        }\n    }\n    return false;\n}`,
        cpp: `bool findDuplicates(const std::vector<int>& arr) {\n    // Nested loop comparing all pairs\n    int n = arr.size();\n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            if (arr[i] == arr[j]) return true;\n        }\n    }\n    return false;\n}`,
        javascript: `function findDuplicates(arr) {\n    // Nested loop comparing all pairs\n    let n = arr.length;\n    for (let i = 0; i < n; i++) {\n        for (let j = i + 1; j < n; j++) {\n            if (arr[i] === arr[j]) return true;\n        }\n    }\n    return false;\n}`
      },
      explanation: "For every single item in the outer loop, the inner loop performs multiple scans. If N = 1000, N^2 = 1,000,000 operations. This is generally inefficient for large datasets. Don't worry, you will learn more about nested iterations and structural array manipulation later!"
    }
  };

  const activeDetails = complexityDetails[selectedComplexity];
  const activeCodeContent = activeDetails.code[lang as keyof typeof activeDetails.code] || activeDetails.code.python;

  // Two Sum Code Tabs contents
  const twoSumBruteCode = {
    python: `def two_sum_brute(nums, target):\n    n = len(nums)\n    for i in range(n):\n        for j in range(i + 1, n):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n    return []`,
    java: `public int[] twoSumBrute(int[] nums, int target) {\n    int n = nums.length;\n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            if (nums[i] + nums[j] == target) {\n                return new int[]{i, j};\n            }\n        }\n    }\n    return new int[0];\n}`,
    cpp: `std::vector<int> twoSumBrute(const std::vector<int>& nums, int target) {\n    int n = nums.size();\n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            if (nums[i] + nums[j] == target) {\n                return {i, j};\n            }\n        }\n    }\n    return {};\n}`,
    javascript: `function twoSumBrute(nums, target) {\n    const n = nums.length;\n    for (let i = 0; i < n; i++) {\n        for (let j = i + 1; j < n; j++) {\n            if (nums[i] + nums[j] === target) {\n                return [i, j];\n            }\n        }\n    }\n    return [];\n}`
  };

  const twoSumOptimizedCode = {
    python: `def two_sum_optimized(nums, target):\n    seen = {} # Memory table\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []`,
    java: `public int[] twoSumOptimized(int[] nums, int target) {\n    Map<Integer, Integer> seen = new HashMap<>(); // Memory table\n    for (int i = 0; i < nums.length; i++) {\n        int complement = target - nums[i];\n        if (seen.containsKey(complement)) {\n            return new int[]{seen.get(complement), i};\n        }\n        seen.put(nums[i], i);\n    }\n    return new int[0];\n}`,
    cpp: `std::vector<int> twoSumOptimized(const std::vector<int>& nums, int target) {\n    std::unordered_map<int, int> seen; // Memory table\n    for (int i = 0; i < nums.size(); i++) {\n        int complement = target - nums[i];\n        if (seen.find(complement) != seen.end()) {\n            return {seen[complement], i};\n        }\n        seen[nums[i]] = i;\n      }\n      return {};\n}`,
    javascript: `function twoSumOptimized(nums, target) {\n    const seen = new Map(); // Memory table\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (seen.has(complement)) {\n            return [seen.get(complement), i];\n        }\n        seen.set(nums[i], i);\n    }\n    return [];\n}`
  };

  const playgroundData = {
    python: {
      defaultCode: `def count_steps(n):
    # This loop runs 'n' times (O(N) linear complexity)
    print(f"Starting loop of size {n}")
    for i in range(1, n + 1):
        print(f"Step {i}")

# Experiment: Run the function with different values!
count_steps(5)`,
      solution: {
        code: `def count_steps(n):
    # For O(1) constant complexity, print start and end instantly:
    print(f"Starting loop of size {n}")
    print(f"Steps: 1 to {n}")

count_steps(5)`,
        explanation: "Replacing the loop with a single direct printing statement removes the dependency on N, converting the complexity from O(N) linear time to O(1) constant time."
      }
    },
    java: {
      defaultCode: `public class Main {
    public static void countSteps(int n) {
        // This loop runs 'n' times (O(N) linear complexity)
        System.out.println("Starting loop of size " + n);
        for (int i = 1; i <= n; i++) {
            System.out.println("Step " + i);
        }
    }

    public static void main(String[] args) {
        // Experiment: Run with different values!
        countSteps(5);
    }
}`,
      solution: {
        code: `public class Main {
    public static void countSteps(int n) {
        // For O(1) constant complexity, print start and end instantly:
        System.out.println("Starting loop of size " + n);
        System.out.println("Steps: 1 to " + n);
    }

    public static void main(String[] args) {
        countSteps(5);
    }
}`,
        explanation: "Replacing the loop with a single direct printing statement removes the dependency on N, converting the complexity from O(N) linear time to O(1) constant time."
      }
    },
    cpp: {
      defaultCode: `#include <iostream>

void countSteps(int n) {
    // This loop runs 'n' times (O(N) linear complexity)
    std::cout << "Starting loop of size " << n << std::endl;
    for (int i = 1; i <= n; i++) {
        std::cout << "Step " << i << std::endl;
    }
}

int main() {
    // Experiment: Run with different values!
    countSteps(5);
    return 0;
}`,
      solution: {
        code: `#include <iostream>

void countSteps(int n) {
    // For O(1) constant complexity, print start and end instantly:
    std::cout << "Starting loop of size " << n << std::endl;
    std::cout << "Steps: 1 to " << n << std::endl;
}

int main() {
    countSteps(5);
    return 0;
}`,
        explanation: "Replacing the loop with a single direct printing statement removes the dependency on N, converting the complexity from O(N) linear time to O(1) constant time."
      }
    },
    javascript: {
      defaultCode: `function countSteps(n) {
    // This loop runs 'n' times (O(N) linear complexity)
    console.log("Starting loop of size " + n);
    for (let i = 1; i <= n; i++) {
        console.log("Step " + i);
    }
}

// Experiment: Run with different values!
countSteps(5);`,
      solution: {
        code: `function countSteps(n) {
    // For O(1) constant complexity, print start and end instantly:
    console.log("Starting loop of size " + n);
    console.log("Steps: 1 to " + n);
}

countSteps(5);`,
        explanation: "Replacing the loop with a single direct printing statement removes the dependency on N, converting the complexity from O(N) linear time to O(1) constant time."
      }
    }
  };

  const activePlayground = playgroundData[lang as keyof typeof playgroundData] || playgroundData.python;

  return (
    <div className="space-y-16">
      
      {/* 1. Introduction Section */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">Understanding Code Efficiency</h2>
        <div className="prose prose-mistral max-w-none text-left">
          <p className="text-lg text-mistral-navy/70 leading-relaxed mb-6">
            When multiple programs produce the correct result, we measure their value by how efficiently they use resources. 
            Complexity analysis is the standard method used to compare code performance independent of hardware, programming language, or OS variations.
          </p>
          <div className="bg-white border-2 border-mistral-navy/5 p-8 rounded-sm shadow-sm border-l-4 border-l-mistral-orange">
            <h4 className="font-sans font-bold text-mistral-navy mb-4 uppercase tracking-widest text-xs">The Concept of Growth Rate</h4>
            <p className="text-sm text-mistral-navy/70 leading-relaxed">
              We focus on how the count of operations grows relative to the input size, denoted as N. 
              Instead of measuring milliseconds (which changes depending on the CPU speeds), we describe efficiency trends using Big O notation, which defines the upper bound (worst-case scenario) of operations.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Interactive Graph Section (Full Width, Vertical Stack) */}
      <section>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">Interactive Complexity Graph</h2>
        <p className="font-sans text-mistral-navy/60 text-sm mb-8 text-left">
          Select a code pattern below to see how its operation count scales as the input size grows.
        </p>

        <div className="space-y-8 max-w-4xl mx-auto">
          
          {/* Top: Full-Width Graph Container */}
          <div className="bg-white border border-mistral-navy/10 p-8 shadow-sm flex flex-col items-center w-full">
            <div className="w-full max-w-2xl h-[320px] md:h-[380px] relative">
              <svg viewBox="0 0 300 220" className="w-full h-full">
                {/* Grid Lines */}
                <line x1="40" y1="180" x2="280" y2="180" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="40" y1="20" x2="40" y2="180" stroke="#94a3b8" strokeWidth="1.5" />

                {/* Graph Labels */}
                <text x="280" y="200" fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">N (Input Size)</text>
                <text x="35" y="20" fill="#64748b" fontSize="10" textAnchor="end" transform="rotate(-90 35 20)" fontFamily="monospace">Operations</text>

                {/* O(1) - Constant */}
                <line 
                  x1="40" y1="165" x2="280" y2="165" 
                  stroke={selectedComplexity === "constant" ? "#f97316" : "#e2e8f0"} 
                  strokeWidth={selectedComplexity === "constant" ? "4.5" : "1.5"} 
                  className="transition-all duration-300"
                />
                <text x="285" y="168" fill={selectedComplexity === "constant" ? "#f97316" : "#94a3b8"} fontSize="10" fontFamily="monospace" fontWeight={selectedComplexity === "constant" ? "bold" : "normal"}>O(1)</text>

                {/* O(log N) - Logarithmic */}
                <path 
                  d="M 40 180 Q 150 145, 280 135" 
                  fill="none" 
                  stroke={selectedComplexity === "logarithmic" ? "#3b82f6" : "#e2e8f0"} 
                  strokeWidth={selectedComplexity === "logarithmic" ? "4.5" : "1.5"} 
                  className="transition-all duration-300"
                />
                <text x="285" y="138" fill={selectedComplexity === "logarithmic" ? "#3b82f6" : "#94a3b8"} fontSize="10" fontFamily="monospace" fontWeight={selectedComplexity === "logarithmic" ? "bold" : "normal"}>O(log N)</text>

                {/* O(N) - Linear */}
                <line 
                  x1="40" y1="180" x2="250" y2="30" 
                  stroke={selectedComplexity === "linear" ? "#10b981" : "#e2e8f0"} 
                  strokeWidth={selectedComplexity === "linear" ? "4.5" : "1.5"} 
                  className="transition-all duration-300"
                />
                <text x="255" y="33" fill={selectedComplexity === "linear" ? "#10b981" : "#94a3b8"} fontSize="10" fontFamily="monospace" fontWeight={selectedComplexity === "linear" ? "bold" : "normal"}>O(N)</text>

                {/* O(N^2) - Quadratic */}
                <path 
                  d="M 40 180 Q 75 180, 110 20" 
                  fill="none" 
                  stroke={selectedComplexity === "quadratic" ? "#a855f7" : "#e2e8f0"} 
                  strokeWidth={selectedComplexity === "quadratic" ? "4.5" : "1.5"} 
                  className="transition-all duration-300"
                />
                <text x="115" y="24" fill={selectedComplexity === "quadratic" ? "#a855f7" : "#94a3b8"} fontSize="10" fontFamily="monospace" fontWeight={selectedComplexity === "quadratic" ? "bold" : "normal"}>O(N^2)</text>
              </svg>
            </div>
            
            {/* Visual Legend Indicator */}
            <div className="w-full max-w-2xl flex justify-between items-center mt-6 border-t border-mistral-navy/5 pt-4 text-xs font-mono text-mistral-navy/40">
              <span>Flat Line = Immediate Execution</span>
              <span>Steep Vertical Line = Heavy Operations Load</span>
            </div>
          </div>

          {/* Middle: Control Selector buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
            {(["constant", "logarithmic", "linear", "quadratic"] as ComplexityType[]).map((type) => {
              const colors = {
                constant: { active: "border-mistral-orange text-mistral-orange bg-mistral-orange/5", normal: "border-gray-200 text-gray-500 hover:border-mistral-orange/50" },
                logarithmic: { active: "border-blue-500 text-blue-600 bg-blue-50", normal: "border-gray-200 text-gray-500 hover:border-blue-500/50" },
                linear: { active: "border-emerald-500 text-emerald-600 bg-emerald-50", normal: "border-gray-200 text-gray-500 hover:border-emerald-500/50" },
                quadratic: { active: "border-purple-500 text-purple-600 bg-purple-50", normal: "border-gray-200 text-gray-500 hover:border-purple-500/50" }
              };

              const labels = {
                constant: "O(1) Constant",
                logarithmic: "O(log N) Log",
                linear: "O(N) Linear",
                quadratic: "O(N^2) Quadratic"
              };

              const isSelected = selectedComplexity === type;

              return (
                <button
                  key={type}
                  onClick={() => setSelectedComplexity(type)}
                  className={`p-3 rounded border font-mono text-xs text-center font-bold transition-all ${
                    isSelected ? colors[type].active : colors[type].normal
                  }`}
                >
                  {labels[type]}
                </button>
              );
            })}
          </div>

          {/* Bottom: Explanation & Code Display */}
          <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-6 w-full text-left">
            <h4 className="font-mono text-xl font-bold text-mistral-navy">
              {activeDetails.title}
            </h4>
            <p className="font-sans text-sm text-mistral-navy/70 leading-relaxed">
              {activeDetails.description}
            </p>
            
            <div className="bg-mistral-bg p-4 rounded border border-mistral-navy/5 flex gap-3">
              <Info className="w-5 h-5 text-mistral-orange shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-mono font-bold text-mistral-navy block uppercase mb-1">Standard Example:</span>
                <span className="font-sans text-mistral-navy/60 leading-relaxed">{activeDetails.example}</span>
              </div>
            </div>

            {/* Language Code Tabs */}
            <CodeTabs defaultLang={userLanguage}>
              <div data-lang={lang}>
                {JSON.stringify({
                  code: activeCodeContent,
                  output: "Output window: execution ready",
                  explanation: activeDetails.explanation
                })}
              </div>
            </CodeTabs>
          </div>
          
        </div>
      </section>

      {/* 3. Deep Dive Case Study Section (Why it's important & Two Sum walk-through) */}
      <section className="border-t border-mistral-navy/10 pt-16">
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-6 text-left">Why Complexity Matters in DSA</h2>
        
        <div className="prose prose-mistral max-w-none text-left space-y-6">
          <p className="text-sm md:text-base text-mistral-navy/70 leading-relaxed">
            In interview coding environments, the difference between an acceptable solution and a rejected solution is almost always the time complexity. 
            If you write an algorithm that does double the work for every additional input element, it will exceed the time limit on large scale test cases and fail.
          </p>

          <div className="border border-mistral-navy/10 p-6 md:p-8 bg-white space-y-8">
            <h3 className="font-mono text-lg font-bold text-mistral-navy border-b border-mistral-navy/5 pb-3">Case Study: Solving Two Sum</h3>
            <p className="text-sm text-mistral-navy/70 leading-relaxed">
              Let's look at the classic problem: <strong>Two Sum</strong>. 
              Given a collection of numbers and a target value, find the indices of two numbers that add up to the target. 
              For example: if our array is <code>[2, 7, 11, 15]</code> and the target is <code>9</code>, the answer is <code>[0, 1]</code> (because 2 + 7 = 9).
            </p>

            {/* Step 1: Brute Force */}
            <div className="space-y-4">
              <h4 className="font-mono text-sm font-bold text-mistral-orange uppercase tracking-wider">Approach 1: The Brute Force Path (O(N^2))</h4>
              <p className="text-xs text-mistral-navy/60 leading-relaxed">
                The most basic way to solve this is to look at every single number and compare it to every other number in the array. 
                We loop through each position, and then open another nested loop to find a second number that matches the required sum.
              </p>
              
              <div className="bg-amber-50 p-4 border-l-4 border-amber-400 text-xs text-amber-900/80 mb-4 rounded-r">
                <span className="font-mono font-bold block mb-1">Beginner Note:</span>
                it's ok if you don't understand the loop syntax or indexing syntax fully now. 
                You will learn all about arrays and loop boundaries step-by-step in the upcoming sections!
              </div>

              {/* Code tabs brute force */}
              <CodeTabs defaultLang={userLanguage}>
                <div data-lang={lang}>
                  {JSON.stringify({
                    code: twoSumBruteCode[lang as keyof typeof twoSumBruteCode] || twoSumBruteCode.python,
                    output: "Result: [0, 1]",
                    explanation: "This uses a nested loop. The outer loop runs N times, and the inner loop runs N times. Therefore, the total work scales quadratically as O(N^2)."
                  })}
                </div>
              </CodeTabs>
              
              <div className="p-4 bg-mistral-bg text-xs text-mistral-navy/70 rounded border border-mistral-navy/5">
                <span className="font-mono font-bold block mb-1">Time Complexity Calculation:</span>
                If we have N numbers, we check N * N comparisons in the worst case. 
                For N = 100 elements, that's 10,000 steps. For N = 100,000 elements, it spikes to 10,000,000,000 (10 billion) operations, causing the code to crash or hang.
              </div>
            </div>

            {/* Step 2: Optimizing */}
            <div className="space-y-4 pt-4 border-t border-mistral-navy/5">
              <h4 className="font-mono text-sm font-bold text-emerald-600 uppercase tracking-wider">Approach 2: The Optimized Path (O(N))</h4>
              <p className="text-xs text-mistral-navy/60 leading-relaxed">
                Can we solve this without nested loops? Yes, by introducing a <strong>memory lookup table</strong> (often called a Dictionary or Hash Map). 
                As we read each number, we calculate its complement (the exact value we need to find to hit our target sum). 
                Instead of searching the rest of the array, we check our memory table in a single constant step to see if we've already seen that complement.
              </p>

              <div className="bg-blue-50 p-4 border-l-4 border-blue-400 text-xs text-blue-900/80 mb-4 rounded-r">
                <span className="font-mono font-bold block mb-1">Beginner Note:</span>
                it's ok if you don't understand now how memory tables or maps work. 
                We will walk through them in detail during the Collections and Data Structures modules!
              </div>

              {/* Code tabs optimized */}
              <CodeTabs defaultLang={userLanguage}>
                <div data-lang={lang}>
                  {JSON.stringify({
                    code: twoSumOptimizedCode[lang as keyof typeof twoSumOptimizedCode] || twoSumOptimizedCode.python,
                    output: "Result: [0, 1]",
                    explanation: "We traverse the array only once. For each element, we do a lookup in our memory table. Memory table lookup is O(1) constant time, making the total run time O(N)."
                  })}
                </div>
              </CodeTabs>

              <div className="p-4 bg-mistral-bg text-xs text-mistral-navy/70 rounded border border-mistral-navy/5">
                <span className="font-mono font-bold block mb-1">Time Complexity Calculation:</span>
                Since we only loop once, we perform exactly N steps. 
                For N = 100 elements, we do 100 operations. For N = 100,000 elements, we do only 100,000 operations (instead of 10 billion!). 
                This runs in fractions of a millisecond and passes easily.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Interactive Live Compiler Code Playground */}
      <section className="border-t border-mistral-navy/10 pt-16 text-left">
        <div className="flex items-center gap-2 mb-6">
          <Code2 className="w-5 h-5 text-mistral-orange" />
          <span className="font-mono text-xs text-mistral-navy/60 uppercase tracking-widest">Active Code Playground</span>
        </div>
        <h2 className="font-serif text-3xl font-medium text-mistral-navy mb-4">Playground: Scale Complexity Manually</h2>
        <p className="font-sans text-sm text-mistral-navy/70 leading-relaxed mb-6">
          Let's experiment with how scaling input N increases operations. 
          Below is a simple function that executes a loop printing step-by-step count.
        </p>

        <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4">
          <div className="text-xs text-mistral-navy/70 space-y-2">
            <p><strong>Step 1:</strong> Press <strong>Run Code</strong>. Notice it prints steps 1 to 5. The loop takes 5 steps (O(N) time complexity).</p>
            <p><strong>Step 2:</strong> Change the calling value at the bottom from <code>5</code> to <code>10</code>, and run it again. Notice the operations double! This is linear scaling.</p>
            <p><strong>Step 3:</strong> Click <strong>Show Answer</strong> to see how we could print the range in O(1) constant complexity instead by removing the loop completely!</p>
          </div>
          
          <div className="bg-amber-50 p-4 border-l-4 border-amber-400 text-xs text-amber-900/80 mb-4 rounded-r">
            <span className="font-mono font-bold block mb-1">Beginner Note:</span>
            it's ok if you don't understand how functions or variables are initialized. You will master functions and scope parameters later!
          </div>

          <LiveCodeEditor 
            key={lang}
            language={lang}
            defaultCode={activePlayground.defaultCode}
            solution={activePlayground.solution}
          />
        </div>
      </section>

      {/* 5. Knowledge Check Section */}
      <section className="pt-8 border-t border-mistral-navy/10">
        <h3 className="font-sans font-bold text-xl text-mistral-navy mb-8 text-left uppercase tracking-widest text-center">Interactive Mastery Check</h3>
        <MCQQuiz 
          question="If you double the size of the input (from N to 2N) for an O(N^2) quadratic algorithm, how does the running time change?" 
          options={["It remains exactly the same", "It doubles (2x slower)", "It quadruples (4x slower)", "It increases by N steps"]} 
          correctIndex={2}
          explanation="Because the complexity is quadratic (N^2), changing N to 2N results in (2N)^2 = 4(N^2). The runtime increases by a factor of 4." 
        />
      </section>

      {/* 6. Lesson Recap Summary Card */}
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
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">Scale Focus</h4>
                <p className="text-xs text-white/60 leading-relaxed">Complexity analysis measures how operations count grows, prioritizing long-term scaling over hardware-specific timings.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">02</div>
              <div>
                <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-1">Time vs Space</h4>
                <p className="text-xs text-white/60 leading-relaxed">We measure both execution scaling (Time Complexity) and extra memory utilization (Space Complexity).</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 p-6 rounded border border-white/10">
            <div className="flex gap-4 mb-4">
              <div className="font-mono text-mistral-orange font-bold text-xl">03</div>
              <h4 className="font-sans font-bold text-sm uppercase tracking-wide mt-1 italic underline decoration-mistral-orange underline-offset-4">Resource Growth Summary</h4>
            </div>
            <div className="space-y-2 font-mono text-[11px] text-white/80">
              <p>O(1) Constant: Constant step time</p>
              <p>O(log N) Logarithmic: Work halves each step</p>
              <p>O(N) Linear: 1-to-1 linear scaling</p>
              <p>O(N^2) Quadratic: Quadratic growth curve</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center">
          <p className="font-sans text-sm text-white/80 mb-6 text-center">Complexity Analysis Complete. Ready to learn how we store data sequentially in memory?</p>
          <Link href="/roadmaps/topics/arrays-lists?roadmap=dsa-fundamentals" className="px-8 py-3 bg-mistral-orange text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-mistral-navy transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
            Go to Module 2: Arrays & Lists &rarr;
          </Link>
        </div>
      </section>
      
    </div>
  );
}
