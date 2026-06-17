"use client";
import React from "react";
import { CodeTabs } from "./CodeTabs";
import { MCQQuiz } from "./MCQQuiz";
import { LiveCodeEditor } from "./LiveCodeEditor";
import { InteractiveWidget } from "@/lib/api";

interface WidgetRendererProps {
  widget?: InteractiveWidget;
  userLanguage?: string;
  debugId?: string; // Optional ID for debugging
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({ widget, userLanguage = "python", debugId }) => {
  if (!widget) {
    return (
      <div className="p-4 bg-amber-50 text-amber-600 font-mono text-xs italic border border-amber-100 my-4">
        Interactive widget not found{debugId ? ` (ID: ${debugId})` : ""}.
      </div>
    );
  }

  const { type, data } = widget;
  const lang = userLanguage.toLowerCase();

  switch (type) {
    case "mcq": {
      // Look for language-specific version, or fallback to direct properties if it's a legacy widget
      const mcqData = data[lang] || data["python"] || (data.question ? data : null);
      
      if (!mcqData) {
        return <div className="p-4 bg-red-50 text-red-400 font-mono text-xs italic my-4">Quiz not available for {userLanguage}{debugId ? ` (ID: ${debugId})` : ""}.</div>;
      }

      return (
        <MCQQuiz 
          question={mcqData.question} 
          options={mcqData.options} 
          answer={mcqData.answer} 
          correctIndex={mcqData.correctIndex}
          explanation={mcqData.explanation}
        />
      );
    }
    
    case "code_tabs":
      return (
        <CodeTabs defaultLang={userLanguage}>
          {Object.entries(data).map(([langKey, content]) => (
            <div key={langKey} data-lang={langKey}>
              {content as any}
            </div>
          ))}
        </CodeTabs>
      );
    
    case "live_editor": {
      const editorData = data[lang] || data["python"] || (data.defaultCode || data.code ? data : null);

      if (!editorData) {
        return <div className="p-4 bg-red-50 text-red-400 font-mono text-xs italic my-4">Live practice not available for {userLanguage}{debugId ? ` (ID: ${debugId})` : ""}.</div>;
      }

      // Handle both formats of solution (string or object)
      const formattedSolution = typeof editorData.solution === 'string' 
        ? { code: editorData.solution, explanation: "Follow this implementation to solve the challenge." }
        : editorData.solution;

      return (
        <LiveCodeEditor 
          language={lang} 
          defaultCode={editorData.defaultCode || editorData.code} 
          solution={formattedSolution}
        />
      );
    }

    default:
      return (
        <div className="p-4 bg-red-50 text-red-500 font-mono text-xs border border-red-100 my-4">
          Unknown widget type: {type}
        </div>
      );
  }
};
