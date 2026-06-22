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

export default function LinearStructuresRevisionTopic({ userLanguage }: TopicProps) {
  const lang = userLanguage.toLowerCase();

  // Dynamic values based on parameters
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const roadmapSlug = params ? params.get("roadmap") || "dsa-fundamentals" : "dsa-fundamentals";

  const codeSnippets = {
    python: {
      array: `items = [10, 20, 30]\n# Access index 2\nval = items[2]\n# Modify index 1\nitems[1] = 99`,
      string: `word = "hello"\n# Access character\nchar = word[0]\n# Get length\nsize = len(word)`
    },
    java: {
      array: `int[] items = {10, 20, 30};\n// Access index 2\nint val = items[2];\n// Modify index 1\nitems[1] = 99;`,
      string: `String word = "hello";\n// Access character\nchar c = word.charAt(0);\n// Get length\nint size = word.length();`
    },
    cpp: {
      array: `std::vector<int> items = {10, 20, 30};\n// Access index 2\nint val = items[2];\n// Modify index 1\nitems[1] = 99;`,
      string: `std::string word = "hello";\n// Access character\nchar c = word[0];\n// Get length\nint size = word.length();`
    },
    javascript: {
      array: `const items = [10, 20, 30];\n// Access index 2\nconst val = items[2];\n// Modify index 1\nitems[1] = 99;`,
      string: `const word = "hello";\n// Access character\nconst char = word[0];\n// Get length\nconst size = word.length;`
    }
  };

  const activeSnippets = codeSnippets[lang as keyof typeof codeSnippets] || codeSnippets.python;

  const playgrounds = {
    python: {
      q1: {
        defaultCode: `def find_max(arr):
    # Task: Return the largest number in the array
    # Hint: Keep a running tracker max_val starting at arr[0].
    # Loop over elements and update if any value is larger.
    pass

# Test execution
print(find_max([12, 45, 2, 67, 34])) # Output: 67`,
        solution: {
          code: `def find_max(arr):
    max_val = arr[0]
    for val in arr:
        if val > max_val:
            max_val = val
    return max_val

print(find_max([12, 45, 2, 67, 34]))`,
          explanation: "Initialize max_val with the first element. Iterate through the list and update max_val whenever a larger number is found."
        }
      },
      q2: {
        defaultCode: `def count_evens(arr):
    # Task: Return the count of even numbers in the list
    # Hint: Loop through elements. Increment count if element % 2 == 0.
    pass

# Test execution
print(count_evens([1, 2, 3, 4, 5, 6])) # Output: 3`,
        solution: {
          code: `def count_evens(arr):
    count = 0
    for val in arr:
        if val % 2 == 0:
            count += 1
    return count

print(count_evens([1, 2, 3, 4, 5, 6]))`,
          explanation: "Iterate through elements and check if the remainder of dividing by 2 is zero, incrementing the counter for each match."
        }
      },
      q3: {
        defaultCode: `def is_palindrome(s):
        # Task: Return True if string s reads the same backward (e.g. "racecar")
        # Hint: Initialize left = 0, right = len(s) - 1. Loop while left < right.
        # If s[left] != s[right], return False.
        pass

# Test execution
print(is_palindrome("racecar")) # Output: True
print(is_palindrome("hello"))   # Output: False`,
        solution: {
          code: `def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True

print(is_palindrome("racecar"))
print(is_palindrome("hello"))`,
          explanation: "Using two pointers starting at opposite boundaries moving inward. If characters don't match, it is not a palindrome."
        }
      }
    },
    java: {
      q1: {
        defaultCode: `public class Main {
    public static int findMax(int[] arr) {
        // Task: Return the largest number in the array
        // Hint: Keep a tracker starting at arr[0]. Update when traversing.
        return 0;
    }

    public static void main(String[] args) {
        int[] arr = {12, 45, 2, 67, 34};
        System.out.println(findMax(arr));
    }
}`,
        solution: {
          code: `public class Main {
    public static int findMax(int[] arr) {
        int maxVal = arr[0];
        for (int val : arr) {
            if (val > maxVal) {
                maxVal = val;
            }
        }
        return maxVal;
    }

    public static void main(String[] args) {
        int[] arr = {12, 45, 2, 67, 34};
        System.out.println(findMax(arr));
    }
}`,
          explanation: "Initialize maxVal with the first element. Iterate through the array and update maxVal whenever a larger element is found."
        }
      },
      q2: {
        defaultCode: `public class Main {
    public static int countEvens(int[] arr) {
        // Task: Return the count of even numbers in the array
        return 0;
    }

    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5, 6};
        System.out.println(countEvens(arr));
    }
}`,
        solution: {
          code: `public class Main {
    public static int countEvens(int[] arr) {
        int count = 0;
        for (int val : arr) {
            if (val % 2 == 0) {
                count++;
            }
        }
        return count;
    }

    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5, 6};
        System.out.println(countEvens(arr));
    }
}`,
          explanation: "Iterate through elements and check if division by 2 leaves a remainder of zero, incrementing the counter."
        }
      },
      q3: {
        defaultCode: `public class Main {
    public static boolean isPalindrome(String s) {
        // Task: Return true if string s reads the same backward (e.g. "racecar")
        return false;
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("racecar"));
        System.out.println(isPalindrome("hello"));
    }
}`,
        solution: {
          code: `public class Main {
    public static boolean isPalindrome(String s) {
        int left = 0;
        int right = s.length() - 1;
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("racecar"));
        System.out.println(isPalindrome("hello"));
    }
}`,
          explanation: "Using two pointers starting at opposite boundaries moving inward. If characters don't match, it is not a palindrome."
        }
      }
    },
    cpp: {
      q1: {
        defaultCode: `#include <iostream>
#include <vector>

int findMax(const std::vector<int>& arr) {
    // Task: Return the largest number in vector arr
    return 0;
}

int main() {
    std::vector<int> arr = {12, 45, 2, 67, 34};
    std::cout << findMax(arr) << std::endl;
    return 0;
}`,
        solution: {
          code: `#include <iostream>
#include <vector>

int findMax(const std::vector<int>& arr) {
    int maxVal = arr[0];
    for (int val : arr) {
        if (val > maxVal) {
            maxVal = val;
        }
    }
    return maxVal;
}

int main() {
    std::vector<int> arr = {12, 45, 2, 67, 34};
    std::cout << findMax(arr) << std::endl;
    return 0;
}`,
          explanation: "Initialize maxVal with the first element. Iterate through the vector and update maxVal whenever a larger element is found."
        }
      },
      q2: {
        defaultCode: `#include <iostream>
#include <vector>

int countEvens(const std::vector<int>& arr) {
    // Task: Return the count of even numbers in vector arr
    return 0;
}

int main() {
    std::vector<int> arr = {1, 2, 3, 4, 5, 6};
    std::cout << countEvens(arr) << std::endl;
    return 0;
}`,
        solution: {
          code: `#include <iostream>
#include <vector>

int countEvens(const std::vector<int>& arr) {
    int count = 0;
    for (int val : arr) {
        if (val % 2 == 0) {
            count++;
        }
    }
    return count;
}

int main() {
    std::vector<int> arr = {1, 2, 3, 4, 5, 6};
    std::cout << countEvens(arr) << std::endl;
    return 0;
}`,
          explanation: "Iterate through elements and check if division by 2 leaves a remainder of zero, incrementing the counter."
        }
      },
      q3: {
        defaultCode: `#include <iostream>
#include <string>

bool isPalindrome(const std::string& s) {
    // Task: Return true if string s is a palindrome
    return false;
}

int main() {
    std::cout << std::boolalpha;
    std::cout << isPalindrome("racecar") << std::endl;
    std::cout << isPalindrome("hello") << std::endl;
    return 0;
}`,
        solution: {
          code: `#include <iostream>
#include <string>

bool isPalindrome(const std::string& s) {
    int left = 0;
    int right = s.length() - 1;
    while (left < right) {
        if (s[left] != s[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}

int main() {
    std::cout << std::boolalpha;
    std::cout << isPalindrome("racecar") << std::endl;
    std::cout << isPalindrome("hello") << std::endl;
    return 0;
}`,
          explanation: "Using two pointers starting at opposite boundaries moving inward. If characters don't match, it is not a palindrome."
        }
      }
    },
    javascript: {
      q1: {
        defaultCode: `function findMax(arr) {
    // Task: Return the largest number in arr
    return 0;
}

console.log(findMax([12, 45, 2, 67, 34]));`,
        solution: {
          code: `function findMax(arr) {
    let maxVal = arr[0];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > maxVal) {
            maxVal = arr[i];
        }
    }
    return maxVal;
}

console.log(findMax([12, 45, 2, 67, 34]));`,
          explanation: "Initialize maxVal with the first element. Iterate through the array and update maxVal whenever a larger element is found."
        }
      },
      q2: {
        defaultCode: `function countEvens(arr) {
    // Task: Return the count of even numbers in arr
    return 0;
}

console.log(countEvens([1, 2, 3, 4, 5, 6]));`,
        solution: {
          code: `function countEvens(arr) {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] % 2 === 0) {
            count++;
        }
    }
    return count;
}

console.log(countEvens([1, 2, 3, 4, 5, 6]));`,
          explanation: "Iterate through elements and check if division by 2 leaves a remainder of zero, incrementing the counter."
        }
      },
      q3: {
        defaultCode: `function isPalindrome(s) {
    // Task: Return true if s is a palindrome
    return false;
}

console.log(isPalindrome("racecar"));
console.log(isPalindrome("hello"));`,
        solution: {
          code: `function isPalindrome(s) {
    let left = 0;
    let right = s.length - 1;
    while (left < right) {
        if (s[left] !== s[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}

console.log(isPalindrome("racecar"));
console.log(isPalindrome("hello"));`,
          explanation: "Using two pointers starting at opposite boundaries moving inward. If characters don't match, it is not a palindrome."
        }
      }
    }
  };

  const activePlaygrounds = playgrounds[lang as keyof typeof playgrounds] || playgrounds.python;

  return (
    <div className="space-y-16 text-left">
      
      {/* Hero Section */}
      <section className="bg-amber-500 p-12 -mx-6 -mt-12 text-white shadow-inner rounded-sm">
        <div className="flex items-center gap-4 mb-4">
          <Trophy className="w-10 h-10 text-white" />
          <h1 className="font-serif text-5xl font-medium italic text-white drop-shadow-sm">Linear Structures Revision</h1>
        </div>
        <p className="text-white/80 max-w-2xl text-lg leading-relaxed font-sans">
          You have mastered complexity analysis, arrays, and two-pointer strings. Let us verify your logic and reinforce your fundamentals before introducing Linked Lists.
        </p>
      </section>

      {/* Syntax Cheat Sheet */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Rocket className="w-8 h-8 text-amber-500" />
          <h2 className="font-serif text-3xl font-medium text-mistral-navy">Syntax Reference</h2>
        </div>
        <p className="font-sans text-sm text-mistral-navy/70 leading-relaxed mb-6">
          Quickly review standard indexing syntax and operations for arrays and strings.
        </p>
        
        <CodeTabs defaultLang={userLanguage}>
          <div data-lang={lang}>
            {JSON.stringify({
              code: `// Array Operations\n${activeSnippets.array}\n\n// String Operations\n${activeSnippets.string}`,
              explanation: "Common access, modifications, and length bounds checks."
            })}
          </div>
        </CodeTabs>
      </section>

      {/* Important Points */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-8 h-8 text-amber-500" />
          <h2 className="font-serif text-3xl font-medium text-mistral-navy">Core Highlights</h2>
        </div>
        <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            <div>
              <h4 className="font-sans font-bold text-mistral-navy mb-2 uppercase tracking-wider">Arrays & Lists</h4>
              <ul className="list-disc pl-5 space-y-2 text-mistral-navy/70">
                <li>Contiguous memory storage permits constant time O(1) reads and updates.</li>
                <li>Zero-based indexing shifts valid boundaries to index 0 up to index N - 1.</li>
                <li>Scanning or checking every item in sequence scales as O(N) linear time.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-sans font-bold text-mistral-navy mb-2 uppercase tracking-wider">Strings & Two Pointers</h4>
              <ul className="list-disc pl-5 space-y-2 text-mistral-navy/70">
                <li>Strings behave as sequential lists of individual characters.</li>
                <li>The Two-Pointer approach shifts cursors inward to reverse or compare elements.</li>
                <li>Performing swaps in-place requires O(N) time but avoids allocating new memory, running in O(1) space.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive MCQ Quiz */}
      <section className="pt-8 border-t border-mistral-navy/10">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-8 h-8 text-amber-500" />
          <h2 className="font-serif text-3xl font-medium text-mistral-navy">Mastery Checkpoint</h2>
        </div>
        <p className="font-sans text-sm text-mistral-navy/70 leading-relaxed mb-8">
          Verify your mental models before coding. Complete the multiple choice check below.
        </p>
        
        <div className="space-y-8 max-w-xl mx-auto">
          <MCQQuiz 
            question="Which operation operates in O(1) constant time complexity for an Array?"
            options={[
              "Reading an item by index",
              "Searching for a value without knowing its index",
              "Inserting an item at the beginning of a size N array",
              "Checking if a specific value is duplicate"
            ]}
            correctIndex={0}
            explanation="Reading elements by index is a direct address computation, performing instantly in O(1) time."
          />

          <MCQQuiz 
            question="In the two-pointer technique for reversing elements, why does the loop condition left < right prevent mistakes?"
            options={[
              "It forces the pointers to shift twice as fast",
              "It halts execution once the pointers meet or cross, preventing double-swapping back to original order",
              "It skips checking characters situated at even indices",
              "It allocates extra character buffer spaces dynamically"
            ]}
            correctIndex={1}
            explanation="Halt iterations when pointers meet in the middle, avoiding swapping reversed components back to their original indexes."
          />
        </div>
      </section>

      {/* Synthesis Sandboxes */}
      <section className="pt-16 border-t border-mistral-navy/10">
        <div className="flex items-center gap-3 mb-8">
          <Brain className="w-8 h-8 text-amber-500" />
          <h2 className="font-serif text-3xl font-medium text-mistral-navy">Practice Sandboxes</h2>
        </div>
        <p className="font-sans text-sm text-mistral-navy/70 leading-relaxed mb-10">
          Implement the logic for the three challenges below. Don't worry if you run into syntax checks; read the hints, try writing code, and study the explanations!
        </p>

        {/* Sandbox 1 */}
        <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4 mb-12">
          <h3 className="font-sans font-bold text-lg text-mistral-navy">Challenge 1: Find Maximum Value (Easy)</h3>
          <p className="text-sm text-mistral-navy/70 mb-4">
            Traverse the array elements and return the largest number.
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
          <h3 className="font-sans font-bold text-lg text-mistral-navy">Challenge 2: Count Even Numbers (Easy)</h3>
          <p className="text-sm text-mistral-navy/70 mb-4">
            Count and return how many values inside the array are divisible by 2.
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
          <h3 className="font-sans font-bold text-lg text-mistral-navy">Challenge 3: Valid Palindrome (Medium)</h3>
          <p className="text-sm text-mistral-navy/70 mb-4">
            Use the two-pointer technique to check if the string is identical when read forward or backward.
          </p>
          <LiveCodeEditor 
            key={`q3-${lang}`}
            language={lang}
            defaultCode={activePlaygrounds.q3.defaultCode}
            solution={activePlaygrounds.q3.solution}
          />
        </div>
      </section>

      {/* Recap & Milestone Complete */}
      <section className="bg-mistral-navy text-white p-10 rounded-sm shadow-xl font-sans">
        <div className="flex items-center gap-3 mb-8">
          <CheckCircle2 className="w-8 h-8 text-mistral-orange" />
          <h2 className="font-serif text-3xl font-medium text-white font-bold">Revision Milestone Complete</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <div>
            <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-3 text-white">Milestone Skills Gained</h4>
            <ul className="list-disc pl-5 space-y-2 text-xs text-white/60">
              <li>Traversing arrays to search, count, or aggregate values linearly.</li>
              <li>Setting up pointer pointers and matching index shifts.</li>
              <li>Implementing logic checks inside iterative execution scopes.</li>
            </ul>
          </div>
          
          <div className="bg-white/5 p-6 rounded border border-white/10 flex flex-col justify-between items-center text-center">
            <p className="text-sm text-white/80 mb-6 font-sans">Ready to jump into Linked Lists and see how elements link together dynamically?</p>
            <Link href={`/roadmaps/topics/linked-lists?roadmap=${roadmapSlug}`} className="px-8 py-3 bg-mistral-orange text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-mistral-navy transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
              Go to Module 5: Linked Lists &rarr;
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
