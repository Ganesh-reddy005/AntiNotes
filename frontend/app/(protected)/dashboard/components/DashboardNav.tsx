"use client";
import Link from "next/link";
import { Code2, RefreshCw, User as UserIcon, LogOut } from "lucide-react";

export const DashboardNav = ({ onLogout }: { onLogout: () => void }) => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-mistral-bg/80 backdrop-blur-md border-b border-mistral-navy/10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
                <div className="grid grid-cols-2 gap-0.5">
                    <div className="w-1.5 h-1.5 bg-mistral-navy" />
                    <div className="w-1.5 h-1.5 bg-mistral-orange" />
                    <div className="w-1.5 h-1.5 bg-mistral-sand" />
                    <div className="w-1.5 h-1.5 bg-mistral-yellow" />
                </div>
                <span className="font-serif text-lg font-bold text-mistral-navy">
                    AntiNotes<span className="text-mistral-orange">.</span>
                </span>
            </Link>
            <div className="flex items-center gap-1">
                {[
                    { label: "Problems", href: "/problems", icon: Code2 },
                    { label: "Revision", href: "/revision", icon: RefreshCw },
                    { label: "Profile", href: "/profile", icon: UserIcon },
                ].map(({ label, href, icon: Icon }) => (
                    <Link key={href} href={href} className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs text-mistral-navy/60 hover:text-mistral-navy hover:bg-mistral-navy/5 transition-all">
                        <Icon className="w-3.5 h-3.5" /> {label}
                    </Link>
                ))}
                <button onClick={onLogout} className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs text-mistral-navy/40 hover:text-red-500 transition-all ml-2">
                    <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
            </div>
        </div>
    </nav>
);
