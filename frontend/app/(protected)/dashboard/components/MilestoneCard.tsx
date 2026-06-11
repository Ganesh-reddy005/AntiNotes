"use client";
import { motion } from "framer-motion";
import { Target } from "lucide-react";

export function MilestoneCard({ solved }: { solved: number }) {
    const milestones = [5, 10, 25, 50, 100];
    const next = milestones.find(m => m > solved) ?? milestones[milestones.length - 1];
    const prev = milestones[milestones.indexOf(next) - 1] ?? 0;
    const pct = Math.min(((solved - prev) / (next - prev)) * 100, 100);

    return (
        <div className="bg-white border border-mistral-navy/10 p-5">
            <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-mistral-navy" />
                <span className="font-mono text-xs text-mistral-navy/60 uppercase tracking-wider">Next Milestone</span>
            </div>
            <div className="flex justify-between items-baseline mb-2">
                <span className="font-serif text-2xl font-bold text-mistral-navy">{solved}</span>
                <span className="font-mono text-xs text-mistral-navy/40">/ {next} problems</span>
            </div>
            <div className="h-2 bg-mistral-navy/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-mistral-navy to-mistral-orange"
                />
            </div>
            <p className="font-mono text-[10px] text-mistral-navy/40 mt-2">
                {next - solved} more to reach the <span className="text-mistral-orange font-bold">{next}</span> problems milestone
            </p>
        </div>
    );
}
