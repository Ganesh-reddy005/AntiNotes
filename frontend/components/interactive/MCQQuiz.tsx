"use client";
import React, { useState } from "react";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";

interface MCQQuizProps {
  question: string;
  options: string | string[]; 
  answer?: string;
  correctIndex?: number;
  explanation?: string;
}

export const MCQQuiz: React.FC<MCQQuizProps> = ({ question, options, answer, correctIndex, explanation }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Safety parsing
  let parsedOptions: string[] = [];
  try {
    if (Array.isArray(options)) {
      parsedOptions = options;
    } else if (typeof options === "string") {
      parsedOptions = JSON.parse(options);
    }
  } catch (err) {
    console.error("Failed to parse MCQ options:", err);
  }

  const handleSelect = (opt: string) => {
    if (submitted) return;
    setSelected(opt);
  };

  const actualCorrectAnswer = correctIndex !== undefined ? parsedOptions[correctIndex] : answer;
  const isCorrect = selected === actualCorrectAnswer;

  if (!parsedOptions || parsedOptions.length === 0) {
    return <div className="p-4 bg-red-50 text-red-500 font-mono text-xs">Error: Missing or invalid quiz options.</div>;
  }

  return (
    <div className="my-8 p-6 bg-white border-2 border-mistral-navy/5 shadow-[4px_4px_0px_0px_rgba(15,23,42,0.05)]">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-mistral-orange" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-mistral-navy/40">Knowledge Check</span>
      </div>
      
      <h3 className="font-sans font-bold text-mistral-navy mb-6 text-lg">{question}</h3>
      
      <div className="space-y-3">
        {parsedOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            disabled={submitted}
            className={`w-full text-left p-4 font-mono text-sm border transition-all ${
              selected === opt
                ? submitted
                  ? isCorrect
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                    : "bg-red-50 border-red-500 text-red-700"
                  : "bg-mistral-navy text-white border-mistral-navy"
                : submitted && opt === actualCorrectAnswer
                  ? "bg-emerald-50 border-emerald-500 text-emerald-700 opacity-60"
                  : "bg-mistral-bg border-mistral-navy/10 text-mistral-navy/60 hover:border-mistral-navy hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{opt}</span>
              {submitted && (
                opt === actualCorrectAnswer ? (
                   <CheckCircle className="w-4 h-4 text-emerald-600" />
                ) : (
                   selected === opt && <XCircle className="w-4 h-4 text-red-600" />
                )
              )}
            </div>
          </button>
        ))}
      </div>

      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          disabled={!selected}
          className="mt-6 w-full py-3 bg-mistral-orange text-white font-mono text-xs font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-mistral-navy transition-colors"
        >
          Check Answer
        </button>
      ) : (
        <div className="mt-6 space-y-4">
            <div className={`p-4 font-mono text-xs flex items-center gap-2 ${isCorrect ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"}`}>
            {isCorrect ? (
                <>
                <CheckCircle className="w-4 h-4" /> Correct! You've grasped this concept.
                </>
            ) : (
                <>
                <XCircle className="w-4 h-4" /> Not quite. The correct answer was highlighted above.
                </>
            )}
            <button 
                onClick={() => {setSubmitted(false); setSelected(null);}} 
                className="ml-auto underline hover:text-mistral-navy"
            >
                Try Again
            </button>
            </div>
            
            {explanation && (
                <div className="p-6 bg-mistral-bg border border-mistral-navy/5 rounded-sm">
                    <h5 className="font-sans font-bold text-[10px] uppercase tracking-widest text-mistral-navy/40 mb-2">Pedagogical Breakdown</h5>
                    <p className="text-sm text-mistral-navy/70 leading-relaxed italic">
                        {explanation}
                    </p>
                </div>
            )}
        </div>
      )}
    </div>
  );
};
