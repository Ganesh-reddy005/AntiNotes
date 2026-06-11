"use client";
import { LucideIcon } from "lucide-react";

export const StatCard = ({ icon: Icon, label, value, accent, sub }: {
    icon: LucideIcon; label: string; value: string | number; accent?: boolean; sub?: string;
}) => (
    <div className={`bg-white border p-4 flex items-center gap-3 ${accent ? "border-mistral-orange shadow-[4px_4px_0px_0px_#f97316]" : "border-mistral-navy/10"}`}>
        <div className={`w-9 h-9 flex items-center justify-center flex-shrink-0 ${accent ? "bg-mistral-orange" : "bg-mistral-navy/5"}`}>
            <Icon className={`w-4 h-4 ${accent ? "text-white" : "text-mistral-navy"}`} />
        </div>
        <div>
            <p className="font-mono text-xs text-mistral-navy/50 uppercase tracking-wide">{label}</p>
            <p className="font-serif text-2xl font-bold text-mistral-navy leading-none mt-0.5">{value}</p>
            {sub && <p className="font-mono text-[10px] text-mistral-navy/30 mt-0.5">{sub}</p>}
        </div>
    </div>
);
