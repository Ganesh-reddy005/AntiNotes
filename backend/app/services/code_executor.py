"""
Code Execution Service
Runs user code against test cases safely.
"""

from typing import Dict
from app.models.problem import Problem


class CodeExecutor:
    """
    Executes user code against problem test cases.
    
    NOTE: This is a SIMPLIFIED version for MVP.
    In production, use Docker containers or sandboxed environments.
    """
    
    @staticmethod
    def execute(code: str, problem: Problem, language: str = "python") -> Dict:
        """
        Run code against test cases.
        
        Returns:
            Dict with test results and correctness
        """
        if language != "python":
            return {
                "test_results": {},
                "is_correct": False,
                "error": "Only Python supported currently"
            }
        
        test_results = {}
        all_passed = True
        
        try:
            # Create execution namespace
            exec_globals = {}
            exec(code, exec_globals)
            
            # Extract the main function (assumes function name matches problem)
            # For now, we'll look for common names
            func_name = None
            for name in exec_globals:
                if callable(exec_globals[name]) and not name.startswith('__'):
                    func_name = name
                    break
            
            if not func_name:
                return {
                    "test_results": {"error": "No function found in code"},
                    "is_correct": False
                }
            
            func = exec_globals[func_name]
            
            # Run each test case
            for idx, test_case in enumerate(problem.test_cases):
                test_name = f"test_{idx + 1}"
                
                try:
                    # Parse input (simplified - assumes it's valid Python)
                    # In production, use proper parsing
                    input_str = test_case.input
                    expected_output = test_case.output
                    
                    # Execute function
                    # This is UNSAFE - for MVP only!
                    # TODO: Use restricted execution environment
                    
                    # Parse input and call function with proper scope
                    result = func(*eval(f"[{input_str}]", exec_globals))
                    
                    # Compare result
                    result_str = str(result)
                    if result_str == expected_output:
                        test_results[test_name] = "pass"
                    else:
                        test_results[test_name] = f"fail (got {result_str}, expected {expected_output})"
                        all_passed = False
                        
                except Exception as e:
                    test_results[test_name] = f"error: {str(e)}"
                    all_passed = False
            
            return {
                "test_results": test_results,
                "is_correct": all_passed
            }
            
        except Exception as e:
            return {
                "test_results": {"compilation_error": str(e)},
                "is_correct": False
            }
