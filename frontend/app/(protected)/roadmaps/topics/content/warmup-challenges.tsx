"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { LiveCodeEditor } from "@/components/interactive/LiveCodeEditor";
import { HelpCircle, Code2, Play, Trophy, HelpCircle as HintIcon, Info, CheckCircle2, ArrowRight } from "lucide-react";

interface TopicProps {
  userLanguage: string;
}

export default function WarmupChallengesTopic({ userLanguage }: TopicProps) {
  const { slug } = useParams() as { slug: string };
  const lang = userLanguage.toLowerCase();

  // Dynamic parameters
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const roadmapSlug = params ? params.get("roadmap") || "foundations-warmups" : "foundations-warmups";

  // Hint and Solution display state
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // Configuration for the 10 challenges
  const challengesConfig: Record<string, any> = {
    "warmup-max-three": {
      title: "Largest of Three Numbers",
      order: 1,
      relevance: "Selecting layout bounds or graphics scaling factors based on comparison checks.",
      description: "Given three integers `a`, `b`, and `c`, find and return the maximum value. Solve using standard conditional branching.",
      hint: "Use comparisons. If a >= b and a >= c, a is the largest. Otherwise compare b and c.",
      nextSlug: "warmup-count-vowels",
      nextTitle: "Count Vowels in a String",
      playgrounds: {
        python: {
          defaultCode: `def max_of_three(a, b, c):\n    # Task: Return the largest number among a, b, and c\n    pass\n\nprint(max_of_three(10, 25, 15)) # Expected: 25`,
          solution: {
            code: `def max_of_three(a, b, c):\n    if a >= b and a >= c:\n        return a\n    elif b >= a and b >= c:\n        return b\n    else:\n        return c\n\nprint(max_of_three(10, 25, 15))`,
            explanation: "Compare a with b and c. If true, a is max. Otherwise, check if b is greater than or equal to both. If not, c must be the largest."
          }
        },
        java: {
          defaultCode: `public class Main {\n    public static int maxOfThree(int a, int b, int c) {\n        // Task: Return the largest among a, b, and c\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(maxOfThree(10, 25, 15));\n    }\n}`,
          solution: {
            code: `public class Main {\n    public static int maxOfThree(int a, int b, int c) {\n        if (a >= b && a >= c) {\n            return a;\n        } else if (b >= a && b >= c) {\n            return b;\n        } else {\n            return c;\n        }\n    }\n\n    public static void main(String[] args) {\n        System.out.println(maxOfThree(10, 25, 15));\n    }\n}`,
            explanation: "Compare a with b and c. If true, a is max. Otherwise, check if b is greater than or equal to both. If not, c must be the largest."
          }
        },
        cpp: {
          defaultCode: `#include <iostream>\n\nint maxOfThree(int a, int b, int c) {\n    // Task: Return the largest among a, b, and c\n    return 0;\n}\n\nint main() {\n    std::cout << maxOfThree(10, 25, 15) << std::endl;\n    return 0;\n}`,
          solution: {
            code: `#include <iostream>\n\nint maxOfThree(int a, int b, int c) {\n    if (a >= b && a >= c) {\n        return a;\n    } else if (b >= a && b >= c) {\n        return b;\n    } else {\n        return c;\n    }\n}\n\nint main() {\n    std::cout << maxOfThree(10, 25, 15) << std::endl;\n    return 0;\n}`,
            explanation: "Compare a with b and c. If true, a is max. Otherwise, check if b is greater than or equal to both. If not, c must be the largest."
          }
        },
        javascript: {
          defaultCode: `function maxOfThree(a, b, c) {\n    // Task: Return the largest among a, b, and c\n    return 0;\n}\n\nconsole.log(maxOfThree(10, 25, 15));`,
          solution: {
            code: `function maxOfThree(a, b, c) {\n    if (a >= b && a >= c) {\n        return a;\n    } else if (b >= a && b >= c) {\n        return b;\n    } else {\n        return c;\n    }\n}\n\nconsole.log(maxOfThree(10, 25, 15));`,
            explanation: "Compare a with b and c. If true, a is max. Otherwise, check if b is greater than or equal to both. If not, c must be the largest."
          }
        }
      }
    },
    "warmup-count-vowels": {
      title: "Count Vowels in a String",
      order: 2,
      relevance: "Filtering user comment fields, text content parsers, or checking word lengths.",
      description: "Count and return the total number of vowels (`a`, `e`, `i`, `o`, `u` - case-insensitive) inside string `s`.",
      hint: "Convert s to lowercase, iterate through characters, and increment a counter if character is in 'aeiou'.",
      nextSlug: "warmup-fizzbuzz",
      nextTitle: "The FizzBuzz Challenge",
      playgrounds: {
        python: {
          defaultCode: `def count_vowels(s):\n    # Task: Return the count of vowels in string s\n    pass\n\nprint(count_vowels("hello")) # Expected: 2`,
          solution: {
            code: `def count_vowels(s):\n    count = 0\n    vowels = {'a', 'e', 'i', 'o', 'u'}\n    for char in s.lower():\n        if char in vowels:\n            count += 1\n    return count\n\nprint(count_vowels("hello"))`,
            explanation: "Scan lowercased characters in a loop, check if they exist in the set of vowels, and increment count accordingly."
          }
        },
        java: {
          defaultCode: `public class Main {\n    public static int countVowels(String s) {\n        // Task: Return the count of vowels in s\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(countVowels("hello"));\n    }\n}`,
          solution: {
            code: `public class Main {\n    public static int countVowels(String s) {\n        int count = 0;\n        String clean = s.toLowerCase();\n        for (int i = 0; i < clean.length(); i++) {\n            char c = clean.charAt(i);\n            if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {\n                count++;\n            }\n        }\n        return count;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(countVowels("hello"));\n    }\n}`,
            explanation: "Convert the string to lowercase. Iterate through indices, check characters against vowels, and accumulate."
          }
        },
        cpp: {
          defaultCode: `#include <iostream>\n#include <string>\n#include <cctype>\n\nint countVowels(std::string s) {\n    // Task: Return the count of vowels in s\n    return 0;\n}\n\nint main() {\n    std::cout << countVowels("hello") << std::endl;\n    return 0;\n}`,
          solution: {
            code: `#include <iostream>\n#include <string>\n#include <cctype>\n\nint countVowels(std::string s) {\n    int count = 0;\n    for (char c : s) {\n        char lower = std::tolower(c);\n        if (lower == 'a' || lower == 'e' || lower == 'i' || lower == 'o' || lower == 'u') {\n            count++;\n        }\n    }\n    return count;\n}\n\nint main() {\n    std::cout << countVowels("hello") << std::endl;\n    return 0;\n}`,
            explanation: "Traverse every character in string, convert to lower case, and check for vowels."
          }
        },
        javascript: {
          defaultCode: `function countVowels(s) {\n    // Task: Return the count of vowels in s\n    return 0;\n}\n\nconsole.log(countVowels("hello"));`,
          solution: {
            code: `function countVowels(s) {\n    let count = 0;\n    const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n    for (let char of s.toLowerCase()) {\n        if (vowels.has(char)) {\n            count++;\n        }\n    }\n    return count;\n}\n\nconsole.log(countVowels("hello"));`,
            explanation: "Convert s to lowercase, step through characters, and increment count if character is in the set of vowels."
          }
        }
      }
    },
    "warmup-fizzbuzz": {
      title: "The FizzBuzz Challenge",
      order: 3,
      relevance: "Formatting division offsets or performing step-by-step layout allocations.",
      description: "For a given number `n`, return `'Fizz'` if divisible by 3, `'Buzz'` if divisible by 5, `'FizzBuzz'` if divisible by both 3 and 5, otherwise return the number as a string.",
      hint: "Check the joint divisibility condition (n % 15 == 0 or n % 3 == 0 and n % 5 == 0) first to prevent falling into single branches.",
      nextSlug: "warmup-fibonacci",
      nextTitle: "Iterative Fibonacci Number",
      playgrounds: {
        python: {
          defaultCode: `def fizzbuzz(n):\n    # Task: Return Fizz, Buzz, FizzBuzz or number as string\n    pass\n\nprint(fizzbuzz(15)) # Expected: FizzBuzz\nprint(fizzbuzz(9))  # Expected: Fizz`,
          solution: {
            code: `def fizzbuzz(n):\n    if n % 3 == 0 and n % 5 == 0:\n        return "FizzBuzz"\n    elif n % 3 == 0:\n        return "Fizz"\n    elif n % 5 == 0:\n        return "Buzz"\n    else:\n        return str(n)\n\nprint(fizzbuzz(15))\nprint(fizzbuzz(9))`,
            explanation: "Check the combined condition first. If not met, evaluate single modulo parameters in branching order."
          }
        },
        java: {
          defaultCode: `public class Main {\n    public static String fizzbuzz(int n) {\n        // Task: Return Fizz, Buzz, FizzBuzz, or number string\n        return "";\n    }\n\n    public static void main(String[] args) {\n        System.out.println(fizzbuzz(15));\n        System.out.println(fizzbuzz(9));\n    }\n}`,
          solution: {
            code: `public class Main {\n    public static String fizzbuzz(int n) {\n        if (n % 3 == 0 && n % 5 == 0) {\n            return "FizzBuzz";\n        } else if (n % 3 == 0) {\n            return "Fizz";\n        } else if (n % 5 == 0) {\n            return "Buzz";\n        } else {\n            return String.valueOf(n);\n        }\n    }\n\n    public static void main(String[] args) {\n        System.out.println(fizzbuzz(15));\n        System.out.println(fizzbuzz(9));\n    }\n}`,
            explanation: "Branch logic from combined modulo divisibility down to individual constraints."
          }
        },
        cpp: {
          defaultCode: `#include <iostream>\n#include <string>\n\nstd::string fizzbuzz(int n) {\n    // Task: Return Fizz, Buzz, FizzBuzz, or number string\n    return "";\n}\n\nint main() {\n    std::cout << fizzbuzz(15) << std::endl;\n    std::cout << fizzbuzz(9) << std::endl;\n    return 0;\n}`,
          solution: {
            code: `#include <iostream>\n#include <string>\n\nstd::string fizzbuzz(int n) {\n    if (n % 3 == 0 && n % 5 == 0) {\n        return "FizzBuzz";\n    } else if (n % 3 == 0) {\n        return "Fizz";\n    } else if (n % 5 == 0) {\n        return "Buzz";\n    } else {\n        return std::to_string(n);\n    }\n}\n\nint main() {\n    std::cout << fizzbuzz(15) << std::endl;\n    std::cout << fizzbuzz(9) << std::endl;\n    return 0;\n}`,
            explanation: "Combined check handles both 3 and 5. Then single branching paths fall back to standard numeric string translation."
          }
        },
        javascript: {
          defaultCode: `function fizzbuzz(n) {\n    // Task: Return Fizz, Buzz, FizzBuzz, or number string\n    return "";\n}\n\nconsole.log(fizzbuzz(15));\nconsole.log(fizzbuzz(9));`,
          solution: {
            code: `function fizzbuzz(n) {\n    if (n % 3 === 0 && n % 5 === 0) {\n        return "FizzBuzz";\n    } else if (n % 3 === 0) {\n        return "Fizz";\n    } else if (n % 5 === 0) {\n        return "Buzz";\n    } else {\n        return String(n);\n    }\n}\n\nconsole.log(fizzbuzz(15));\nconsole.log(fizzbuzz(9));`,
            explanation: "Use conditional checks starting with the strict compound modulo check before returning outputs."
          }
        }
      }
    },
    "warmup-fibonacci": {
      title: "Iterative Fibonacci Number",
      order: 4,
      relevance: "Modeling incremental layout increments or designing grid spacing formulas.",
      description: "Compute the `n`-th Fibonacci number iteratively (do not use recursion). Assume `n >= 0`. The sequence is: `0, 1, 1, 2, 3, 5, 8...`.",
      hint: "Use two tracking variables (a = 0, b = 1). Run a loop from 2 to n. Update variables as (a, b = b, a + b).",
      nextSlug: "warmup-reverse-array",
      nextTitle: "Reverse an Array In-Place",
      playgrounds: {
        python: {
          defaultCode: `def fibonacci(n):\n    # Task: Return the n-th Fibonacci number iteratively\n    pass\n\nprint(fibonacci(5)) # Expected: 5`,
          solution: {
            code: `def fibonacci(n):\n    if n == 0: return 0\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b\n\nprint(fibonacci(5))`,
            explanation: "Initialize two variables, slide them forward to calculate sequence values iteratively in O(N) time and O(1) space."
          }
        },
        java: {
          defaultCode: `public class Main {\n    public static int fibonacci(int n) {\n        // Task: Return the n-th Fibonacci number\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(fibonacci(5));\n    }\n}`,
          solution: {
            code: `public class Main {\n    public static int fibonacci(int n) {\n        if (n == 0) return 0;\n        int a = 0, b = 1;\n        for (int i = 2; i <= n; i++) {\n            int temp = a + b;\n            a = b;\n            b = temp;\n        }\n        return b;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(fibonacci(5));\n    }\n}`,
            explanation: "Sum previous values and slide trackers step-by-step using a temporary parameter."
          }
        },
        cpp: {
          defaultCode: `#include <iostream>\n\nint fibonacci(int n) {\n    // Task: Return the n-th Fibonacci number\n    return 0;\n}\n\nint main() {\n    std::cout << fibonacci(5) << std::endl;\n    return 0;\n}`,
          solution: {
            code: `#include <iostream>\n\nint fibonacci(int n) {\n    if (n == 0) return 0;\n    int a = 0, b = 1;\n    for (int i = 2; i <= n; i++) {\n        int temp = a + b;\n        a = b;\n        b = temp;\n    }\n    return b;\n}\n\nint main() {\n    std::cout << fibonacci(5) << std::endl;\n    return 0;\n}`,
            explanation: "Store sum of double historical variables in temp, then update variables recursively in loop."
          }
        },
        javascript: {
          defaultCode: `function fibonacci(n) {\n    // Task: Return the n-th Fibonacci number\n    return 0;\n}\n\nconsole.log(fibonacci(5));`,
          solution: {
            code: `function fibonacci(n) {\n    if (n === 0) return 0;\n    let a = 0, b = 1;\n    for (let i = 2; i <= n; i++) {\n        let temp = a + b;\n        a = b;\n        b = temp;\n    }\n    return b;\n}\n\nconsole.log(fibonacci(5));`,
            explanation: "Slide values forward to solve iteratively in O(N) time and O(1) space, avoiding recursion overhead."
          }
        }
      }
    },
    "warmup-reverse-array": {
      title: "Reverse an Array In-Place",
      order: 5,
      relevance: "Reversing timeline layouts, feeds, or switching chronological logs.",
      description: "Modify the array `arr` in-place so that elements are reversed. Do not allocate a new array. Return the reversed array.",
      hint: "Use two pointers, left = 0 and right = arr.length - 1. Swap elements at left and right, then move pointers inward.",
      nextSlug: "warmup-sum-digits",
      nextTitle: "Sum of Digits of a Number",
      playgrounds: {
        python: {
          defaultCode: `def reverse_array(arr):\n    # Task: Reverse the array in-place and return it\n    pass\n\nprint(reverse_array([1, 2, 3, 4])) # Expected: [4, 3, 2, 1]`,
          solution: {
            code: `def reverse_array(arr):\n    left, right = 0, len(arr) - 1\n    while left < right:\n        arr[left], arr[right] = arr[right], arr[left]\n        left += 1\n        right -= 1\n    return arr\n\nprint(reverse_array([1, 2, 3, 4]))`,
            explanation: "Swap items at the margins in-place, then shift left/right pointers inward until they cross."
          }
        },
        java: {
          defaultCode: `import java.util.Arrays;\n\npublic class Main {\n    public static int[] reverseArray(int[] arr) {\n        // Task: Reverse the array in-place\n        return arr;\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {1, 2, 3, 4};\n        System.out.println(Arrays.toString(reverseArray(arr)));\n    }\n}`,
          solution: {
            code: `import java.util.Arrays;\n\npublic class Main {\n    public static int[] reverseArray(int[] arr) {\n        int left = 0, right = arr.length - 1;\n        while (left < right) {\n            int temp = arr[left];\n            arr[left] = arr[right];\n            arr[right] = temp;\n            left++;\n            right--;\n        }\n        return arr;\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {1, 2, 3, 4};\n        System.out.println(Arrays.toString(reverseArray(arr)));\n    }\n}`,
            explanation: "Use standard temporary swaps to redirect indices in-place without memory allocation."
          }
        },
        cpp: {
          defaultCode: `#include <iostream>\n#include <vector>\n\nstd::vector<int> reverseArray(std::vector<int>& arr) {\n    // Task: Reverse the vector in-place\n    return arr;\n}\n\nint main() {\n    std::vector<int> arr = {1, 2, 3, 4};\n    std::vector<int> res = reverseArray(arr);\n    for(int x : res) std::cout << x << " ";\n    std::cout << std::endl;\n    return 0;\n}`,
          solution: {
            code: `#include <iostream>\n#include <vector>\n\nstd::vector<int> reverseArray(std::vector<int>& arr) {\n    int left = 0, right = arr.size() - 1;\n    while (left < right) {\n        int temp = arr[left];\n        arr[left] = arr[right];\n        arr[right] = temp;\n        left++;\n        right--;\n    }\n    return arr;\n}\n\nint main() {\n    std::vector<int> arr = {1, 2, 3, 4};\n    std::vector<int> res = reverseArray(arr);\n    for(int x : res) std::cout << x << " ";\n    std::cout << std::endl;\n    return 0;\n}`,
            explanation: "Swap items between margins and move inward to execute O(N) traversal using O(1) extra space."
          }
        },
        javascript: {
          defaultCode: `function reverseArray(arr) {\n    // Task: Reverse the array in-place\n    return arr;\n}\n\nconsole.log(reverseArray([1, 2, 3, 4]));`,
          solution: {
            code: `function reverseArray(arr) {\n    let left = 0, right = arr.length - 1;\n    while (left < right) {\n        let temp = arr[left];\n        arr[left] = arr[right];\n        arr[right] = temp;\n        left++;\n        right--;\n    }\n    return arr;\n}\n\nconsole.log(reverseArray([1, 2, 3, 4]));`,
            explanation: "Shift bounds pointers inward swapping index offsets sequentially."
          }
        }
      }
    },
    "warmup-sum-digits": {
      title: "Sum of Digits of a Number",
      order: 6,
      relevance: "Building checksum checks (e.g. Credit Card Luhn test) or numeric hashing algorithms.",
      description: "Given a positive integer `num`, return the mathematical sum of its digits (e.g. `123` -> `1 + 2 + 3 = 6`).",
      hint: "Use a loop while num > 0. Extract the last digit with (num % 10), add it to sum, then divide (num // 10) to strip the digit.",
      nextSlug: "warmup-palindrome",
      nextTitle: "Verify Palindrome String",
      playgrounds: {
        python: {
          defaultCode: `def sum_digits(num):\n    # Task: Return sum of digits of num\n    pass\n\nprint(sum_digits(123)) # Expected: 6`,
          solution: {
            code: `def sum_digits(num):\n    total = 0\n    n = abs(num)\n    while n > 0:\n        total += n % 10\n        n //= 10\n    return total\n\nprint(sum_digits(123))`,
            explanation: "Deconstruct the number using integer modulo 10 extraction and division. Accumulate digits in a total variable."
          }
        },
        java: {
          defaultCode: `public class Main {\n    public static int sumDigits(int num) {\n        // Task: Return sum of digits\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(sumDigits(123));\n    }\n}`,
          solution: {
            code: `public class Main {\n    public static int sumDigits(int num) {\n        int total = 0;\n        int n = Math.abs(num);\n        while (n > 0) {\n            total += n % 10;\n            n /= 10;\n        }\n        return total;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(sumDigits(123));\n    }\n}`,
            explanation: "Extract last digit using modulo 10 division, accumulate in sum, then strip last digit by dividing by 10."
          }
        },
        cpp: {
          defaultCode: `#include <iostream>\n#include <cmath>\n\nint sumDigits(int num) {\n    // Task: Return sum of digits\n    return 0;\n}\n\nint main() {\n    std::cout << sumDigits(123) << std::endl;\n    return 0;\n}`,
          solution: {
            code: `#include <iostream>\n#include <cmath>\n\nint sumDigits(int num) {\n    int total = 0;\n    int n = std::abs(num);\n    while (n > 0) {\n        total += n % 10;\n        n /= 10;\n    }\n    return total;\n}\n\nint main() {\n    std::cout << sumDigits(123) << std::endl;\n    return 0;\n}`,
            explanation: "Modular deconstruction captures each digit value and drops it numerically, avoiding string conversion."
          }
        },
        javascript: {
          defaultCode: `function sumDigits(num) {\n    // Task: Return sum of digits\n    return 0;\n}\n\nconsole.log(sumDigits(123));`,
          solution: {
            code: `function sumDigits(num) {\n    let total = 0;\n    let n = Math.abs(num);\n    while (n > 0) {\n        total += n % 10;\n        n = Math.floor(n / 10);\n    }\n    return total;\n}\n\nconsole.log(sumDigits(123));`,
            explanation: "Use math calculations (modulo and Math.floor division) to isolate and sum individual digit elements."
          }
        }
      }
    },
    "warmup-palindrome": {
      title: "Verify Palindrome String",
      order: 7,
      relevance: "Verifying dna profiles, text pattern matching, and input sanitization.",
      description: "Check if string `s` is a palindrome (reads identically forwards and backwards). Ignore case distinctions.",
      hint: "Use two pointers, left = 0 and right = s.length - 1. Loop while left < right and check if s[left] == s[right].",
      nextSlug: "warmup-duplicate-number",
      nextTitle: "Find Duplicate in Array",
      playgrounds: {
        python: {
          defaultCode: `def is_palindrome(s):\n    # Task: Return True if s is a palindrome, otherwise False\n    pass\n\nprint(is_palindrome("racecar")) # Expected: True\nprint(is_palindrome("hello"))   # Expected: False`,
          solution: {
            code: `def is_palindrome(s):\n    clean = s.lower()\n    left, right = 0, len(clean) - 1\n    while left < right:\n        if clean[left] != clean[right]:\n            return False\n        left += 1\n        right -= 1\n    return True\n\nprint(is_palindrome("racecar"))\nprint(is_palindrome("hello"))`,
            explanation: "Compare characters at left and right boundaries, shifting them inward. Return False if mismatch is detected."
          }
        },
        java: {
          defaultCode: `public class Main {\n    public static boolean isPalindrome(String s) {\n        // Task: Check if s is palindrome\n        return false;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(isPalindrome("racecar"));\n        System.out.println(isPalindrome("hello"));\n    }\n}`,
          solution: {
            code: `public class Main {\n    public static boolean isPalindrome(String s) {\n        String clean = s.toLowerCase();\n        int left = 0, right = clean.length() - 1;\n        while (left < right) {\n            if (clean.charAt(left) != clean.charAt(right)) {\n                return false;\n            }\n            left++;\n            right--;\n        }\n        return true;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(isPalindrome("racecar"));\n        System.out.println(isPalindrome("hello"));\n    }\n}`,
            explanation: "Convert to lowercase. Loop using indices comparisons at margins and shift inward."
          }
        },
        cpp: {
          defaultCode: `#include <iostream>\n#include <string>\n#include <cctype>\n\nbool isPalindrome(std::string s) {\n    // Task: Check if s is palindrome\n    return false;\n}\n\nint main() {\n    std::cout << std::boolalpha;\n    std::cout << isPalindrome("racecar") << std::endl;\n    std::cout << isPalindrome("hello") << std::endl;\n    return 0;\n}`,
          solution: {
            code: `#include <iostream>\n#include <string>\n#include <cctype>\n\nbool isPalindrome(std::string s) {\n    int left = 0, right = s.size() - 1;\n    while (left < right) {\n        if (std::tolower(s[left]) != std::tolower(s[right])) {\n            return false;\n        }\n        left++;\n        right--;\n    }\n    return true;\n}\n\nint main() {\n    std::cout << std::boolalpha;\n    std::cout << isPalindrome("racecar") << std::endl;\n    std::cout << isPalindrome("hello") << std::endl;\n    return 0;\n}`,
            explanation: "Compare characters at left and right boundaries after mapping to lowercase."
          }
        },
        javascript: {
          defaultCode: `function isPalindrome(s) {\n    // Task: Check if s is palindrome\n    return false;\n}\n\nconsole.log(isPalindrome("racecar"));\nconsole.log(isPalindrome("hello"));`,
          solution: {
            code: `function isPalindrome(s) {\n    let clean = s.toLowerCase();\n    let left = 0, right = clean.length - 1;\n    while (left < right) {\n        if (clean[left] !== clean[right]) {\n            return false;\n        }\n        left++;\n        right--;\n    }\n    return true;\n}\n\nconsole.log(isPalindrome("racecar"));\nconsole.log(isPalindrome("hello"));`,
            explanation: "Two-pointer comparison moving inward from bounds. Exits early if mismatch is seen."
          }
        }
      }
    },
    "warmup-duplicate-number": {
      title: "Find Duplicate in Array",
      order: 8,
      relevance: "Deduplicating signup registration databases or cleaning product catalog indexes.",
      description: "Given an array of integers `arr`, return the first duplicated element. Assume at least one duplicate exists.",
      hint: "Track elements you visit in a set collection. Loop through the array; if an element is already in the set, return it.",
      nextSlug: "warmup-missing-number",
      nextTitle: "Find the Missing Number",
      playgrounds: {
        python: {
          defaultCode: `def find_duplicate(arr):\n    # Task: Return the first duplicated element\n    pass\n\nprint(find_duplicate([1, 3, 4, 2, 2])) # Expected: 2`,
          solution: {
            code: `def find_duplicate(arr):\n    seen = set()\n    for num in arr:\n        if num in seen:\n            return num\n        seen.add(num)\n    return -1\n\nprint(find_duplicate([1, 3, 4, 2, 2]))`,
            explanation: "Track visited values in a set. When scanning an element already present in the set, report it as the duplicate."
          }
        },
        java: {
          defaultCode: `import java.util.HashSet;\n\npublic class Main {\n    public static int findDuplicate(int[] arr) {\n        // Task: Return the first duplicated element\n        return -1;\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {1, 3, 4, 2, 2};\n        System.out.println(findDuplicate(arr));\n    }\n}`,
          solution: {
            code: `import java.util.HashSet;\n\npublic class Main {\n    public static int findDuplicate(int[] arr) {\n        HashSet<Integer> seen = new HashSet<>();\n        for (int num : arr) {\n            if (seen.contains(num)) {\n                return num;\n            }\n            seen.add(num);\n        }\n        return -1;\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {1, 3, 4, 2, 2};\n        System.out.println(findDuplicate(arr));\n    }\n}`,
            explanation: "Use HashSet to verify element presence in O(1) lookup times. Return duplicate when hit."
          }
        },
        cpp: {
          defaultCode: `#include <iostream>\n#include <vector>\n#include <unordered_set>\n\nint findDuplicate(const std::vector<int>& arr) {\n    // Task: Return the first duplicated element\n    return -1;\n}\n\nint main() {\n    std::vector<int> arr = {1, 3, 4, 2, 2};\n    std::cout << findDuplicate(arr) << std::endl;\n    return 0;\n}`,
          solution: {
            code: `#include <iostream>\n#include <vector>\n#include <unordered_set>\n\nint findDuplicate(const std::vector<int>& arr) {\n    std::unordered_set<int> seen;\n    for (int num : arr) {\n        if (seen.count(num)) {\n            return num;\n        }\n        seen.insert(num);\n    }\n    return -1;\n}\n\nint main() {\n    std::vector<int> arr = {1, 3, 4, 2, 2};\n    std::cout << findDuplicate(arr) << std::endl;\n    return 0;\n}`,
            explanation: "Store scanned numbers inside unordered_set. Fast search checks count checks to detect redundancy."
          }
        },
        javascript: {
          defaultCode: `function findDuplicate(arr) {\n    // Task: Return the first duplicated element\n    return -1;\n}\n\nconsole.log(findDuplicate([1, 3, 4, 2, 2]));`,
          solution: {
            code: `function findDuplicate(arr) {\n    const seen = new Set();\n    for (let num of arr) {\n        if (seen.has(num)) {\n            return num;\n        }\n        seen.add(num);\n    }\n    return -1;\n}\n\nconsole.log(findDuplicate([1, 3, 4, 2, 2]));`,
            explanation: "Use Set to check and store numbers. O(1) hash validations solve the search in O(N) time."
          }
        }
      }
    },
    "warmup-missing-number": {
      title: "Find the Missing Number",
      order: 9,
      relevance: "Verifying checksum numbers or identifying dropped transaction packets in networks.",
      description: "Given an array containing `N - 1` distinct numbers from range `1` to `N`, find the one missing number.",
      hint: "Calculate expected sum using mathematical formula N * (N + 1) / 2. Subtract actual array elements sum from it.",
      nextSlug: "warmup-merge-arrays",
      nextTitle: "Merge Two Sorted Arrays",
      playgrounds: {
        python: {
          defaultCode: `def find_missing(arr, n):\n    # Task: Find the missing number in range 1..n\n    pass\n\nprint(find_missing([1, 2, 4, 5], 5)) # Expected: 3`,
          solution: {
            code: `def find_missing(arr, n):\n    expected = n * (n + 1) // 2\n    actual = sum(arr)\n    return expected - actual\n\nprint(find_missing([1, 2, 4, 5], 5))`,
            explanation: "Use math! The expected sum of range 1..N is N*(N+1)/2. Subtract actual sum of array elements to reveal missing slot in O(N) time and O(1) space."
          }
        },
        java: {
          defaultCode: `public class Main {\n    public static int findMissing(int[] arr, int n) {\n        // Task: Find missing number in range 1..n\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {1, 2, 4, 5};\n        System.out.println(findMissing(arr, 5));\n    }\n}`,
          solution: {
            code: `public class Main {\n    public static int findMissing(int[] arr, int n) {\n        int expected = n * (n + 1) / 2;\n        int actual = 0;\n        for (int num : arr) {\n            actual += num;\n        }\n        return expected - actual;\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {1, 2, 4, 5};\n        System.out.println(findMissing(arr, 5));\n    }\n}`,
            explanation: "Accumulate actual sum in a loop, subtract from mathematical limit calculation."
          }
        },
        cpp: {
          defaultCode: `#include <iostream>\n#include <vector>\n#include <numeric>\n\nint findMissing(const std::vector<int>& arr, int n) {\n    // Task: Find missing number in range 1..n\n    return 0;\n}\n\nint main() {\n    std::vector<int> arr = {1, 2, 4, 5};\n    std::cout << findMissing(arr, 5) << std::endl;\n    return 0;\n}`,
          solution: {
            code: `#include <iostream>\n#include <vector>\n#include <numeric>\n\nint findMissing(const std::vector<int>& arr, int n) {\n    int expected = n * (n + 1) / 2;\n    int actual = std::accumulate(arr.begin(), arr.end(), 0);\n    return expected - actual;\n}\n\nint main() {\n    std::vector<int> arr = {1, 2, 4, 5};\n    std::cout << findMissing(arr, 5) << std::endl;\n    return 0;\n}`,
            explanation: "Apply formula subtraction logic using std::accumulate helper."
          }
        },
        javascript: {
          defaultCode: `function findMissing(arr, n) {\n    // Task: Find missing number in range 1..n\n    return 0;\n}\n\nconsole.log(findMissing([1, 2, 4, 5], 5));`,
          solution: {
            code: `function findMissing(arr, n) {\n    let expected = (n * (n + 1)) / 2;\n    let actual = arr.reduce((acc, curr) => acc + curr, 0);\n    return expected - actual;\n}\n\nconsole.log(findMissing([1, 2, 4, 5], 5));`,
            explanation: "Use Array.reduce to count actual sum, subtracting from expected mathematical limit."
          }
        }
      }
    },
    "warmup-merge-arrays": {
      title: "Merge Two Sorted Arrays",
      order: 10,
      relevance: "Merging chronologically sorted logs or combining sorted search results databases.",
      description: "Merge two sorted arrays `arr1` and `arr2` into a single sorted array. Make sure it runs in O(N + M) time.",
      hint: "Use two pointer indexes (i = 0, j = 0). While both have elements, compare arr1[i] and arr2[j]. Add smaller to results and advance that pointer.",
      nextSlug: null,
      nextTitle: null,
      playgrounds: {
        python: {
          defaultCode: `def merge_arrays(arr1, arr2):\n    # Task: Merge two sorted arrays into one sorted array\n    pass\n\nprint(merge_arrays([1, 3, 5], [2, 4, 6])) # Expected: [1, 2, 3, 4, 5, 6]`,
          solution: {
            code: `def merge_arrays(arr1, arr2):\n    res = []\n    i, j = 0, 0\n    while i < len(arr1) and j < len(arr2):\n        if arr1[i] <= arr2[j]:\n            res.append(arr1[i])\n            i += 1\n        else:\n            res.append(arr2[j])\n            j += 1\n    while i < len(arr1):\n        res.append(arr1[i])\n        i += 1\n    while j < len(arr2):\n        res.append(arr2[j])\n        j += 1\n    return res\n\nprint(merge_arrays([1, 3, 5], [2, 4, 6]))`,
            explanation: "Step two pointers in parallel. Compare items at pointers, append the smaller one, and advance. Flush remaining elements at the end in O(N + M) time."
          }
        },
        java: {
          defaultCode: `import java.util.Arrays;\nimport java.util.ArrayList;\nimport java.util.List;\n\npublic class Main {\n    public static List<Integer> mergeArrays(int[] arr1, int[] arr2) {\n        // Task: Merge two sorted arrays\n        return new ArrayList<>();\n    }\n\n    public static void main(String[] args) {\n        int[] arr1 = {1, 3, 5};\n        int[] arr2 = {2, 4, 6};\n        System.out.println(mergeArrays(arr1, arr2));\n    }\n}`,
          solution: {
            code: `import java.util.Arrays;\nimport java.util.ArrayList;\nimport java.util.List;\n\npublic class Main {\n    public static List<Integer> mergeArrays(int[] arr1, int[] arr2) {\n        List<Integer> res = new ArrayList<>();\n        int i = 0, j = 0;\n        while (i < arr1.length && j < arr2.length) {\n            if (arr1[i] <= arr2[j]) {\n                res.add(arr1[i]);\n                i++;\n            } else {\n                res.add(arr2[j]);\n                j++;\n            }\n        }\n        while (i < arr1.length) {\n            res.add(arr1[i]);\n            i++;\n        }\n        while (j < arr2.length) {\n            res.add(arr2[j]);\n            j++;\n        }\n        return res;\n    }\n\n    public static void main(String[] args) {\n        int[] arr1 = {1, 3, 5};\n        int[] arr2 = {2, 4, 6};\n        System.out.println(mergeArrays(arr1, arr2));\n    }\n}`,
            explanation: "Advance pointers sequentially comparing indices, adding remaining elements of array when the other exhausts."
          }
        },
        cpp: {
          defaultCode: `#include <iostream>\n#include <vector>\n\nstd::vector<int> mergeArrays(const std::vector<int>& arr1, const std::vector<int>& arr2) {\n    // Task: Merge two sorted arrays\n    return {};\n}\n\nint main() {\n    std::vector<int> arr1 = {1, 3, 5};\n    std::vector<int> arr2 = {2, 4, 6};\n    std::vector<int> res = mergeArrays(arr1, arr2);\n    for(int x : res) std::cout << x << " ";\n    std::cout << std::endl;\n    return 0;\n}`,
          solution: {
            code: `#include <iostream>\n#include <vector>\n\nstd::vector<int> mergeArrays(const std::vector<int>& arr1, const std::vector<int>& arr2) {\n    std::vector<int> res;\n    int i = 0, j = 0;\n    while (i < arr1.size() && j < arr2.size()) {\n        if (arr1[i] <= arr2[j]) {\n            res.push_back(arr1[i]);\n            i++;\n        } else {\n            res.push_back(arr2[j]);\n            j++;\n        }\n    }\n    while (i < arr1.size()) {\n        res.push_back(arr1[i]);\n        i++;\n    }\n    while (j < arr2.size()) {\n        res.push_back(arr2[j]);\n        j++;\n    }\n    return res;\n}\n\nint main() {\n    std::vector<int> arr1 = {1, 3, 5};\n    std::vector<int> arr2 = {2, 4, 6};\n    std::vector<int> res = mergeArrays(arr1, arr2);\n    for(int x : res) std::cout << x << " ";\n    std::cout << std::endl;\n    return 0;\n}`,
            explanation: "Parallel pointers track indexes on both vectors. Compare pointers, append smaller, and merge left-overs."
          }
        },
        javascript: {
          defaultCode: `function mergeArrays(arr1, arr2) {\n    // Task: Merge two sorted arrays\n    return [];\n}\n\nconsole.log(mergeArrays([1, 3, 5], [2, 4, 6]));`,
          solution: {
            code: `function mergeArrays(arr1, arr2) {\n    const res = [];\n    let i = 0, j = 0;\n    while (i < arr1.length && j < arr2.length) {\n        if (arr1[i] <= arr2[j]) {\n            res.push(arr1[i]);\n            i++;\n        } else {\n            res.push(arr2[j]);\n            j++;\n        }\n    }\n    while (i < arr1.length) {\n        res.push(arr1[i]);\n        i++;\n    }\n    while (j < arr2.length) {\n        res.push(arr2[j]);\n        j++;\n    }\n    return res;\n}\n\nconsole.log(mergeArrays([1, 3, 5], [2, 4, 6]));`,
            explanation: "Step i and j pointers along arrays. Push smaller element to result array, incrementing pointer."
          }
        }
      }
    }
  };

  const challenge = challengesConfig[slug] || challengesConfig["warmup-max-three"];
  const playground = challenge.playgrounds[lang] || challenge.playgrounds.python;

  return (
    <div className="space-y-16 text-left">
      
      {/* Hero Section */}
      <section className="bg-amber-500 p-12 -mx-6 -mt-12 text-white shadow-inner rounded-sm font-sans">
        <div className="flex items-center gap-4 mb-4">
          <Trophy className="w-10 h-10 text-white" />
          <h1 className="font-serif text-5xl font-medium italic text-white drop-shadow-sm">{challenge.title}</h1>
        </div>
        <p className="text-white/80 max-w-2xl text-lg leading-relaxed font-sans">
          Challenge {challenge.order} of 10: Let's start thinking logically to bridge foundations syntax with algorithms!
        </p>
      </section>

      {/* Real World Relevance */}
      <section className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm">
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-6 h-6 text-mistral-orange" />
          <h3 className="font-sans font-bold text-mistral-navy uppercase tracking-wider text-sm">Where is this used in real life?</h3>
        </div>
        <p className="text-sm text-mistral-navy/70 leading-relaxed font-sans">
          {challenge.relevance}
        </p>
      </section>

      {/* Problem Description */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Code2 className="w-8 h-8 text-mistral-orange" />
          <h2 className="font-serif text-3xl font-medium text-mistral-navy">Problem Description</h2>
        </div>
        <p className="font-sans text-sm text-mistral-navy/70 leading-relaxed">
          {challenge.description}
        </p>
      </section>

      {/* Interactive Controls */}
      <section className="space-y-6 pt-6 border-t border-mistral-navy/5">
        <div className="flex gap-4">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-2 px-5 py-2.5 border border-mistral-navy/10 text-mistral-navy hover:bg-mistral-bg font-mono text-xs font-bold uppercase tracking-widest transition-all"
          >
            <HintIcon className="w-4 h-4" /> {showHint ? "Hide Hint" : "Show Hint"}
          </button>
          
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="flex items-center gap-2 px-5 py-2.5 bg-mistral-navy text-white hover:bg-mistral-orange font-mono text-xs font-bold uppercase tracking-widest transition-all"
          >
            <HelpCircle className="w-4 h-4" /> {showSolution ? "Hide Answer" : "Show Answer"}
          </button>
        </div>

        {/* Hint Box */}
        {showHint && (
          <div className="p-6 bg-amber-50 border-l-4 border-amber-400 rounded-r text-sm text-amber-900/80 font-sans animate-in slide-in-from-top-2 duration-200">
            <span className="font-mono font-bold block mb-1">Logic Hint:</span>
            {challenge.hint}
          </div>
        )}

        {/* Sandbox Editor */}
        <div className="bg-white border border-mistral-navy/10 p-6 md:p-8 rounded-sm space-y-4 mt-6">
          <span className="font-mono text-[10px] text-mistral-navy/40 uppercase tracking-widest block">Coding Workspace:</span>
          <LiveCodeEditor 
            key={`${slug}-${lang}`}
            language={lang}
            defaultCode={playground.defaultCode}
            solution={playground.solution}
          />
        </div>

        {/* Solution and Explanation Box */}
        {showSolution && (
          <div className="p-6 md:p-8 bg-mistral-bg/50 border border-mistral-navy/10 rounded-sm space-y-6 animate-in slide-in-from-top-2 duration-300">
            <h4 className="font-mono font-bold text-sm text-mistral-navy uppercase tracking-wider">Correct Solution Approach:</h4>
            
            <div className="bg-white border border-mistral-navy/5 p-4 rounded font-mono text-xs text-mistral-orange whitespace-pre-wrap">
              {playground.solution.code}
            </div>

            <div>
              <h5 className="font-sans font-bold text-xs text-mistral-navy uppercase tracking-wider mb-2">Why it works:</h5>
              <p className="text-xs text-mistral-navy/70 leading-relaxed font-sans">
                {playground.solution.explanation}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Completion Milestone navigation */}
      <section className="bg-mistral-navy text-white p-10 rounded-sm shadow-xl font-sans mt-12">
        <div className="flex items-center gap-3 mb-8">
          <CheckCircle2 className="w-8 h-8 text-mistral-orange" />
          <h2 className="font-serif text-3xl font-medium text-white font-bold">Challenge Completed?</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <div>
            <h4 className="font-sans font-bold text-sm uppercase tracking-wide mb-3 text-white">Mindset Checkpoint</h4>
            <ul className="list-disc pl-5 space-y-2 text-xs text-white/60">
              <li>Writing and executing modular logics beats memorization.</li>
              <li>Always understand the real-world application of your solution.</li>
              <li>Analyze loops and complexity growth rates proactively.</li>
            </ul>
          </div>
          
          <div className="bg-white/5 p-6 rounded border border-white/10 flex flex-col justify-between items-center text-center">
            {challenge.nextSlug ? (
              <>
                <p className="text-sm text-white/80 mb-6 font-sans">Ready for the next challenge: {challenge.nextTitle}?</p>
                <Link href={`/roadmaps/topics/${challenge.nextSlug}?roadmap=${roadmapSlug}`} className="px-8 py-3 bg-mistral-orange text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-mistral-navy transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
                  Go to Challenge {challenge.order + 1} &rarr;
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm text-white/80 mb-6 font-sans">Congratulations! You have completed all 10 logic warm-up challenges!</p>
                <Link href="/dashboard" className="px-8 py-3 bg-mistral-orange text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-mistral-navy transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
                  Back to Dashboard &rarr;
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
      
    </div>
  );
}
