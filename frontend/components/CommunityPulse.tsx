"use client";
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { BrainCircuit, Terminal, Loader2 } from "lucide-react"; // Added Loader2

export default function CommunityPulse() {
  const [voted, setVoted] = useState<string | null>(null);
  const [votes, setVotes] = useState({ logic: 0, syntax: 0 }); // Start at 0
  const [loading, setLoading] = useState(false);

  // 1. Fetch initial stats on load
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/pulse');
        const data = await res.json();
        if (data.logic !== undefined) setVotes(data);
      } catch (e) {
        console.error("Failed to load pulse stats");
      }
    }
    fetchStats();
  }, []);

  // 2. Handle Vote
  const handleVote = async (type: 'logic' | 'syntax') => {
    if (voted || loading) return;
    setLoading(true);

    try {
      const res = await fetch('/api/pulse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: type }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setVotes(data.counts);
        setVoted(type);
      }
    } catch (e) {
      console.error("Vote failed");
    } finally {
      setLoading(false);
    }
  };

  const total = votes.logic + votes.syntax;
  // Prevent division by zero if total is 0
  const logicPercent = total === 0 ? 50 : Math.round((votes.logic / total) * 100);
  const syntaxPercent = total === 0 ? 50 : Math.round((votes.syntax / total) * 100);

  return (
    <section className="w-full border-t border-mistral-navy/5 bg-white py-16">
      <div className="max-w-2xl mx-auto px-6 text-center">
        
        <h3 className="font-serif text-2xl text-mistral-navy mb-2">
          Community Pulse
        </h3>
        <p className="font-sans text-sm text-mistral-navy/60 mb-8">
          One click. Help us train the Profile Agent. What holds you back the most?
        </p>

        {!voted ? (
          /* VOTING BUTTONS */
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => handleVote('logic')}
              disabled={loading}
              className="group flex-1 max-w-[200px] p-4 rounded-xl border border-mistral-navy/10 hover:border-mistral-orange hover:bg-mistral-orange/5 transition-all flex flex-col items-center gap-3 disabled:opacity-50"
            >
              <div className="p-2 bg-mistral-navy/5 rounded-full group-hover:bg-mistral-orange/10 text-mistral-navy group-hover:text-mistral-orange transition-colors">
                {loading && voted === 'logic' ? <Loader2 className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
              </div>
              <span className="font-mono text-xs font-bold text-mistral-navy uppercase tracking-wider">Logic Gaps</span>
            </button>

            <button 
              onClick={() => handleVote('syntax')}
              disabled={loading}
              className="group flex-1 max-w-[200px] p-4 rounded-xl border border-mistral-navy/10 hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center gap-3 disabled:opacity-50"
            >
              <div className="p-2 bg-mistral-navy/5 rounded-full group-hover:bg-blue-100 text-mistral-navy group-hover:text-blue-600 transition-colors">
                 {loading && voted === 'syntax' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Terminal className="w-5 h-5" />}
              </div>
              <span className="font-mono text-xs font-bold text-mistral-navy uppercase tracking-wider">Syntax Errors</span>
            </button>
          </div>
        ) : (
          /* RESULTS VIEW (Live Data) */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-mistral-navy/5 rounded-xl p-6 border border-mistral-navy/10"
          >
             <div className="mb-4 flex justify-between text-xs font-mono text-mistral-navy/60 uppercase tracking-widest">
                <span>Live Results ({total} Votes)</span>
                <span>{voted === 'logic' ? "You picked Logic" : "You picked Syntax"}</span>
             </div>

             {/* Logic Bar */}
             <div className="mb-4">
               <div className="flex justify-between text-sm font-bold text-mistral-navy mb-1">
                 <span>Logic Gaps</span>
                 <span>{logicPercent}%</span>
               </div>
               <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }} 
                   animate={{ width: `${logicPercent}%` }}
                   transition={{ duration: 1, ease: "easeOut" }}
                   className="h-full bg-mistral-orange" 
                 />
               </div>
             </div>

             {/* Syntax Bar */}
             <div>
               <div className="flex justify-between text-sm font-bold text-mistral-navy mb-1">
                 <span>Syntax Errors</span>
                 <span>{syntaxPercent}%</span>
               </div>
               <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }} 
                   animate={{ width: `${syntaxPercent}%` }}
                   transition={{ duration: 1, ease: "easeOut" }}
                   className="h-full bg-blue-500" 
                 />
               </div>
             </div>
             
             <p className="mt-6 text-xs text-mistral-navy/40 italic">
               "Thanks for the signal. The Profile Agent is learning."
             </p>
          </motion.div>
        )}

      </div>
    </section>
  );
}