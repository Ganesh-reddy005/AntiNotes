"use client";
import React, { useState, useEffect } from "react";

interface CodeTabsProps {
  children: React.ReactNode;
  defaultLang?: string;
}

export const CodeTabs: React.FC<CodeTabsProps> = ({ children, defaultLang = "python" }) => {
  const [activeLang, setActiveLang] = useState<string>(defaultLang.toLowerCase());

  // Update activeLang if defaultLang changes (e.g. after profile fetch)
  useEffect(() => {
    if (defaultLang) {
      setActiveLang(defaultLang.toLowerCase());
    }
  }, [defaultLang]);

  // Extract data from children
  const tabs = React.Children.toArray(children)
    .filter((child): child is React.ReactElement<{ "data-lang"?: string; children?: any }> => 
      React.isValidElement(child)
    )
    .map((child) => {
      const lang = child.props["data-lang"] || "unknown";
      const rawContent = child.props.children;
      
      let parsed = { code: "", output: "", explanation: "" };
      
      try {
        // If it's a JSON string from the backend
        if (typeof rawContent === 'string' && rawContent.trim().startsWith('{')) {
          const data = JSON.parse(rawContent);
          parsed = {
            code: data.code || "",
            output: data.output || "",
            explanation: data.explanation || ""
          };
        } else if (typeof rawContent === 'object' && rawContent !== null) {
          // If it's already an object (passed via WidgetRenderer)
          parsed = {
            code: rawContent.code || "",
            output: rawContent.output || "",
            explanation: rawContent.explanation || ""
          };
        } else {
          // Fallback for legacy simple strings
          parsed = { code: String(rawContent), output: "", explanation: "" };
        }
      } catch (e) {
        parsed = { code: String(rawContent), output: "", explanation: "" };
      }

      return { lang, ...parsed };
    });

  if (tabs.length === 0) {
    return <div className="p-4 bg-amber-50 text-amber-600 font-mono text-xs italic">Example code is coming soon...</div>;
  }

  // Set initial lang if the requested one isn't available
  const currentTab = tabs.find((t) => t.lang === activeLang) || tabs[0];
  const currentLang = currentTab.lang;

  return (
    <div className="my-6 border border-mistral-navy/10 overflow-hidden bg-white shadow-sm">
      <div className="flex border-b border-mistral-navy/10 bg-mistral-bg">
        {tabs.map((tab) => (
          <button
            key={tab.lang}
            onClick={() => setActiveLang(tab.lang)}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-widest transition-all ${
              currentLang === tab.lang
                ? "bg-white text-mistral-orange border-b-2 border-mistral-orange font-bold"
                : "text-mistral-navy/40 hover:text-mistral-navy hover:bg-mistral-navy/5"
            }`}
          >
            {tab.lang}
          </button>
        ))}
      </div>
      
      {/* Code Area */}
      <div className="p-4 bg-mistral-navy overflow-x-auto">
        <pre className="font-mono text-sm text-white/90">
          <code>{currentTab.code}</code>
        </pre>
      </div>

      {/* Output & Explanation (New!) */}
      {(currentTab.output || currentTab.explanation) && (
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-mistral-navy/10">
          {currentTab.output && (
            <div className="p-4 bg-mistral-bg border-r border-mistral-navy/5">
              <h5 className="font-sans font-bold text-[9px] text-mistral-navy/30 uppercase tracking-widest mb-2">Output</h5>
              <pre className="font-mono text-[11px] text-emerald-700 bg-emerald-50/50 p-2 border border-emerald-100/50 rounded">
                <code>{currentTab.output}</code>
              </pre>
            </div>
          )}
          {currentTab.explanation && (
            <div className="p-4 bg-white">
              <h5 className="font-sans font-bold text-[9px] text-mistral-navy/30 uppercase tracking-widest mb-2">Explanation</h5>
              <p className="text-[11px] text-mistral-navy/70 leading-relaxed italic">
                {currentTab.explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
