import os
import tempfile
import asyncio
from typing import Tuple

class SyntaxService:
    @staticmethod
    async def check_syntax(code: str, language: str) -> Tuple[bool, str | None]:
        """
        Runs a lightweight, local syntax/compilation check.
        Returns (is_valid: bool, error_message: str | None).
        This does not execute the code, so it requires no secure sandbox.
        """
        # Map languages to file extensions and validation commands
        runners = {
            "python": {
                "ext": ".py",
                "cmd": lambda filepath: ["python3", "-m", "py_compile", filepath]
            },
            "javascript": {
                "ext": ".js",
                "cmd": lambda filepath: ["node", "-c", filepath]
            },
            "cpp": {
                "ext": ".cpp",
                "cmd": lambda filepath: ["g++", "-fsyntax-only", filepath]
            },
            "java": {
                "ext": ".java",
                # Java requires the class name to match the file name if it's public,
                # but for an arbitrary snippet, we just let javac try to parse it.
                "cmd": lambda filepath: ["javac", filepath]
            }
        }

        lang_config = runners.get(language)
        if not lang_config:
            # If we don't know how to check this language, fail-open to let LLM handle it
            return True, None

        # Write code to a temporary file
        fd, filepath = tempfile.mkstemp(suffix=lang_config["ext"])
        try:
            with os.fdopen(fd, 'w') as f:
                f.write(code)

            # Build command array
            cmd = lang_config["cmd"](filepath)

            # Run the syntax checker asynchronously
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await process.communicate()

            # Exit code 0 means syntax is perfect
            if process.returncode == 0:
                return True, None
            
            # If compilation failed, extract the error message
            # Prefer stderr, fallback to stdout
            err_output = stderr.decode().strip() or stdout.decode().strip()
            
            # Clean up the output to make it user-friendly (remove the temp file path)
            err_output = err_output.replace(filepath, "solution" + lang_config["ext"])
            
            # Only return the first few lines to avoid massive spam
            err_lines = err_output.split('\n')
            short_err = '\n'.join(err_lines[:10])
            if len(err_lines) > 10:
                short_err += "\n... (truncated)"

            return False, short_err or "Syntax error."

        except Exception as e:
            # If the compiler itself is missing (e.g. node not installed), fail-open
            return True, None
            
        finally:
            # Always clean up the temp file
            if os.path.exists(filepath):
                try:
                    os.remove(filepath)
                except:
                    pass
