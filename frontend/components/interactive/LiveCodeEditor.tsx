"use client";
import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, RotateCcw, Terminal, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { problemsApi } from "@/lib/api";

interface LiveCodeEditorProps {
  language: string;
  defaultCode: string;
  solution?: {
    code: string;
    explanation: string;
  };
}

export const LiveCodeEditor: React.FC<LiveCodeEditorProps> = ({ language, defaultCode = "", solution }) => {
  const [code, setCode] = useState((defaultCode || "").replace(/\\n/g, '\n'));
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    setError(null);
    setOutput("");
    
    try {
      const response = await problemsApi.execute(language, code);
      const data = response.data;
      
      if (data.run) {
        if (data.run.stderr) {
          setError(data.run.stderr);
          setOutput(data.run.stdout);
        } else {
          setOutput(data.run.stdout || "Code executed successfully (no output).");
        }
      } else {
        throw new Error("Failed to execute code");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Execution failed. Please try again later.");
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(defaultCode.replace(/\\n/g, '\n'));
    setOutput("");
    setError(null);
  };

  return (
    <div className="mt-4 border-2 border-mistral-navy overflow-hidden bg-mistral-navy shadow-[8px_8px_0px_0px_rgba(15,23,42,0.1)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-mistral-orange" />
          <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest">Try it yourself ({language})</span>
        </div>
        <div className="flex items-center gap-2">
          {solution && (
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="flex items-center gap-2 px-3 py-1.5 text-white/60 hover:text-white font-mono text-[10px] uppercase tracking-widest transition-colors"
            >
              {showSolution ? <><EyeOff className="w-3 h-3" /> Hide Answer</> : <><Eye className="w-3 h-3" /> Show Answer</>}
            </button>
          )}
          <button
            onClick={resetCode}
            className="p-1.5 text-white/40 hover:text-white transition-colors"
            title="Reset code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-1.5 bg-mistral-orange text-white font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-mistral-navy transition-all disabled:opacity-50"
          >
            {isRunning ? "Running..." : <><Play className="w-3 h-3 fill-current" /> Run Code</>}
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div 
        className="h-96 border-b border-white/10 relative"
        onClick={() => setIsActive(true)}
      >
        {!isActive && (
          <div className="absolute inset-0 z-10 bg-black/20 backdrop-blur-[1px] cursor-pointer flex items-center justify-center group transition-all">
            <div className="bg-mistral-navy border border-white/10 px-4 py-2 flex items-center gap-3 shadow-2xl group-hover:border-mistral-orange transition-all">
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest group-hover:text-mistral-orange">Click to Activate Editor</span>
            </div>
          </div>
        )}
        <Editor
          height="100%"
          language={language === "cpp" ? "cpp" : language}
          value={code}
          onChange={(val) => setCode(val || "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "var(--font-mono)",
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            glyphMargin: false,
            folding: false,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 3,
            automaticLayout: true,
            scrollbar: {
              alwaysConsumeMouseWheel: false,
            },
            readOnly: !isActive,
          }}
        />
      </div>

      {/* Solution Panel */}
      {showSolution && solution && (
        <div className="p-6 bg-white border-b border-mistral-navy/10 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <h4 className="font-sans font-bold text-xs text-mistral-navy uppercase tracking-widest">Correct Solution</h4>
          </div>
          <div className="bg-mistral-navy p-4 rounded mb-4">
            <pre className="font-mono text-[11px] text-white/90 whitespace-pre-wrap">
              <code>{solution.code}</code>
            </pre>
          </div>
          <div className="prose prose-sm prose-mistral">
            <h5 className="font-sans font-bold text-[10px] text-mistral-navy/40 uppercase mb-2">Explanation</h5>
            <p className="text-xs text-mistral-navy/70 leading-relaxed italic">{solution.explanation}</p>
          </div>
        </div>
      )}

      {/* Output Area */}
      <div className="p-4 bg-black/40 min-h-[80px] font-mono text-sm">
        <div className="flex items-center gap-2 mb-2 text-[10px] text-white/30 uppercase tracking-widest">
          <span>Output</span>
        </div>
        {error ? (
          <div className="text-red-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <pre className="whitespace-pre-wrap">{error}</pre>
          </div>
        ) : output ? (
          <div className="text-emerald-400">
            <pre className="whitespace-pre-wrap">{output}</pre>
          </div>
        ) : (
          <span className="text-white/20 italic">Press run to see output...</span>
        )}
      </div>
    </div>
  );
};
