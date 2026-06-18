import httpx
import logging
from typing import Dict, Any, List, Optional

# Configure logging to see when fallbacks happen
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CodeExecutionService:
    """
    Robust service that handles code execution across multiple public providers.
    Uses a fallback strategy: Wandbox -> Judge0 -> Glot.io
    """

    @classmethod
    async def execute(cls, language: str, code: str) -> Dict[str, Any]:
        # List of providers to try in order
        # Judge0 is first because it's significantly faster (~1.3s vs ~2.4s)
        providers = [
            cls._execute_judge0,
            cls._execute_wandbox,
            cls._execute_glot
        ]
        
        last_error = "All providers failed."
        
        for provider_func in providers:
            try:
                result = await provider_func(language, code)
                
                # Check if the provider actually succeeded (no service errors)
                # OCI runtime errors or 503s should trigger a fallback
                stderr = result.get("run", {}).get("stderr", "")
                if "Resource temporarily unavailable" in stderr or "Execution Service Error" in stderr:
                    logger.warning(f"Provider {provider_func.__name__} failed with resource error, trying fallback...")
                    continue
                
                return result
            except Exception as e:
                logger.error(f"Provider {provider_func.__name__} crashed: {str(e)}")
                last_error = str(e)
                continue
        
        return {
            "run": {
                "stdout": "",
                "stderr": f"Master Execution Error: {last_error}. All public compilers are currently under high load. Please try again in a few seconds.",
                "code": 1
            }
        }

    @staticmethod
    async def _execute_wandbox(language: str, code: str) -> Dict[str, Any]:
        url = "https://wandbox.org/api/compile.json"
        mapping = {
            "python": "cpython-3.13.8",
            "javascript": "nodejs-20.17.0",
            "java": "openjdk-jdk-22+36",
            "cpp": "gcc-13.2.0",
        }
        compiler = mapping.get(language.lower(), "cpython-3.13.8")
        
        async with httpx.AsyncClient() as client:
            json_data = {"compiler": compiler, "code": code, "save": False}
            if language.lower() == "java":
                import re
                if re.search(r'\bclass\s+Main\b', code):
                    # Wandbox Java requires class named 'prog'. We wrap Main.
                    json_data["code"] = "public class prog { public static void main(String[] args) { try { Main.main(args); } catch(Exception e) { e.printStackTrace(); } } }"
                    json_data["codes"] = [{"file": "Main.java", "code": code}]
            
            resp = await client.post(url, json=json_data, timeout=10.0)
            resp.raise_for_status()
            data = resp.json()
            
            stdout = data.get("program_output", "")
            stderr = data.get("program_error", "") or data.get("compiler_error", "")
            return {
                "run": {"stdout": stdout, "stderr": stderr, "code": int(data.get("status", "0"))}
            }

    @staticmethod
    async def _execute_judge0(language: str, code: str) -> Dict[str, Any]:
        """Judge0 Public Instance Fallback"""
        url = "https://ce.judge0.com/submissions?wait=true"
        # Judge0 uses language IDs
        mapping = {
            "python": 71,     # Python (3.8.1)
            "javascript": 63, # JavaScript (Node.js 12.14.0)
            "java": 62,       # Java (OpenJDK 13.0.1)
            "cpp": 54,        # C++ (GCC 9.2.0)
        }
        lang_id = mapping.get(language.lower(), 71)
        
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, json={"source_code": code, "language_id": lang_id}, timeout=15.0)
            resp.raise_for_status()
            data = resp.json()
            
            # Judge0 base64 encodes output sometimes, but CE instance usually returns raw or objects
            stdout = data.get("stdout") or ""
            stderr = data.get("stderr") or data.get("compile_output") or ""
            return {
                "run": {"stdout": stdout, "stderr": stderr, "code": 0 if data.get("status", {}).get("id") == 3 else 1}
            }

    @staticmethod
    async def _execute_glot(language: str, code: str) -> Dict[str, Any]:
        """Glot.io Fallback (No Auth usually required for simple runs)"""
        url = f"https://glot.io/api/run/{language}/latest"
        if language.lower() == "javascript": language = "javascript"
        elif language.lower() == "python": language = "python"
        
        # Glot requires specific filenames
        filename = "main.py" if language == "python" else "Main.java" if language == "java" else "main.cpp" if language == "cpp" else "main.js"

        async with httpx.AsyncClient() as client:
            resp = await client.post(url, json={"files": [{"name": filename, "content": code}]}, timeout=10.0)
            resp.raise_for_status()
            data = resp.json()
            return {
                "run": {"stdout": data.get("stdout", ""), "stderr": data.get("stderr", ""), "code": 0}
            }
