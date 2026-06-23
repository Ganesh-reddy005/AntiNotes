"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { userApi, Profile } from "@/lib/api";
import {
    User as UserIcon, LogOut, Code2, RefreshCw, LayoutDashboard,
    Save, Sparkles, Loader2, CheckCircle2, Cpu
} from "lucide-react";

// ── Navbar ─────────────────────────────────────────────────────────────────────
const AppNav = ({ onLogout }: { onLogout: () => void }) => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-mistral-bg/80 backdrop-blur-md border-b border-mistral-navy/10">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
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
                    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
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

// ── Form Options ───────────────────────────────────────────────────────────────
const FIELD_OPTIONS = {
    skill_level: [
        { id: "beginner", label: "Beginner", desc: "Just starting to learn coding" },
        { id: "intermediate", label: "Intermediate", desc: "Know the basics, want to improve" },
        { id: "advanced", label: "Advanced", desc: "Prepping for hard interviews" },
    ],
    goal: [
        { id: "get_job", label: "Landing a Job", desc: "Interview prep & LC grinding" },
        { id: "faang", label: "Cracking FAANG", desc: "Hard algorithms & system design" },
        { id: "startup", label: "Building Startups", desc: "Fast, practical problem solving" },
        { id: "learn_for_fun", label: "Deep Learning", desc: "Mastering CS fundamentals" },
    ],
    preferred_explanation_style: [
        { id: "socratic", label: "Socratic Method", desc: "Ask me questions, don't give the answer" },
        { id: "direct", label: "Direct & Clear", desc: "Just tell me what I did wrong" },
        { id: "visual", label: "Visual & Analogies", desc: "Explain concepts using real-world analogies" },
    ]
};

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ProfilePage() {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Form state (only editables)
    const [form, setForm] = useState({
        skill_level: "",
        goal: "",
        primary_language: "",
        preferred_explanation_style: "",
    });

    useEffect(() => {
        userApi.profile()
            .then(res => {
                setProfile(res.data);
                setForm({
                    skill_level: res.data.skill_level || "beginner",
                    goal: res.data.goal || "learn_for_fun",
                    primary_language: res.data.primary_language ? res.data.primary_language.toLowerCase() : "python",
                    preferred_explanation_style: res.data.preferred_explanation_style || "direct",
                });
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await userApi.updateProfile(form);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);

            // Update local profile state
            if (profile) {
                setProfile({ ...profile, ...form });
            }
            setIsEditing(false);
        } catch {
            alert("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-mistral-bg flex items-center justify-center">
            <div className="grid grid-cols-2 gap-1">
                {["bg-mistral-navy", "bg-mistral-orange", "bg-mistral-sand", "bg-mistral-yellow"].map((c, i) => (
                    <div key={i} className={`w-2 h-2 ${c} animate-pulse`} style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-mistral-bg pb-20">
            <AppNav onLogout={logout} />

            <div className="max-w-4xl mx-auto px-6 pt-24 space-y-8">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                    <div>
                        <h1 className="font-serif text-3xl font-medium text-mistral-navy mb-1">
                            Your Profile
                        </h1>
                        <p className="font-sans text-sm text-mistral-navy/50">
                            {user?.email}
                        </p>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">

                    {/* Left Col: Editable Preferences */}
                    <div className="md:col-span-2 space-y-6">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="bg-white border border-mistral-navy/10 p-6 space-y-6">

                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-mistral-orange" />
                                <h2 className="font-mono text-xs uppercase tracking-wider text-mistral-navy/60">AI Personalization Settings</h2>
                            </div>

                            {/* Primary Language */}
                            <div>
                                <label className="block font-mono text-xs text-mistral-navy mb-2">Primary Language</label>
                                <select
                                    value={form.primary_language}
                                    onChange={e => setForm({ ...form, primary_language: e.target.value })}
                                    disabled={!isEditing}
                                    className="w-full bg-mistral-bg border border-mistral-navy/20 px-4 py-2 font-mono text-sm text-mistral-navy focus:outline-none focus:border-mistral-orange transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="python">Python</option>
                                    <option value="javascript">JavaScript</option>
                                    <option value="java">Java</option>
                                    <option value="cpp">C++</option>
                                </select>
                                <p className="font-sans text-[10px] text-mistral-navy/40 mt-1">Default language for new code problems.</p>
                            </div>

                            {/* Skill Level */}
                            <div>
                                <label className="block font-mono text-xs text-mistral-navy mb-2">Skill Level</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {FIELD_OPTIONS.skill_level.map(opt => (
                                        <button key={opt.id} onClick={() => setForm({ ...form, skill_level: opt.id })}
                                            disabled={!isEditing}
                                            className={`p-3 border text-left transition-all ${form.skill_level === opt.id
                                                ? "border-mistral-orange bg-orange-50/50"
                                                : "border-mistral-navy/10 hover:border-mistral-navy/30 bg-mistral-bg/50"
                                                } ${!isEditing ? "opacity-60 cursor-not-allowed" : ""}`}>
                                            <div className={`font-mono text-xs mb-1 ${form.skill_level === opt.id ? "text-mistral-orange font-bold" : "text-mistral-navy"}`}>
                                                {opt.label}
                                            </div>
                                            <div className="font-sans text-[10px] text-mistral-navy/50 leading-tight">
                                                {opt.desc}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Goal */}
                            <div>
                                <label className="block font-mono text-xs text-mistral-navy mb-2">Current Goal</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {FIELD_OPTIONS.goal.map(opt => (
                                        <button key={opt.id} onClick={() => setForm({ ...form, goal: opt.id })}
                                            disabled={!isEditing}
                                            className={`p-3 border text-left transition-all ${form.goal === opt.id
                                                ? "border-mistral-orange bg-orange-50/50"
                                                : "border-mistral-navy/10 hover:border-mistral-navy/30 bg-mistral-bg/50"
                                                } ${!isEditing ? "opacity-60 cursor-not-allowed" : ""}`}>
                                            <div className={`font-mono text-xs mb-1 ${form.goal === opt.id ? "text-mistral-orange font-bold" : "text-mistral-navy"}`}>
                                                {opt.label}
                                            </div>
                                            <div className="font-sans text-[10px] text-mistral-navy/50 leading-tight">
                                                {opt.desc}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Teaching Style */}
                            <div>
                                <label className="block font-mono text-xs text-mistral-navy mb-2">Preferred AI Teaching Style</label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    {FIELD_OPTIONS.preferred_explanation_style.map(opt => (
                                        <button key={opt.id} onClick={() => setForm({ ...form, preferred_explanation_style: opt.id })}
                                            disabled={!isEditing}
                                            className={`p-3 border text-left transition-all ${form.preferred_explanation_style === opt.id
                                                ? "border-mistral-orange bg-orange-50/50"
                                                : "border-mistral-navy/10 hover:border-mistral-navy/30 bg-mistral-bg/50"
                                                } ${!isEditing ? "opacity-60 cursor-not-allowed" : ""}`}>
                                            <div className={`font-mono text-xs mb-1 ${form.preferred_explanation_style === opt.id ? "text-mistral-orange font-bold" : "text-mistral-navy"}`}>
                                                {opt.label}
                                            </div>
                                            <div className="font-sans text-[10px] text-mistral-navy/50 leading-tight">
                                                {opt.desc}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="pt-4 border-t border-mistral-navy/10 flex items-center justify-end gap-3">
                                {saved && <span className="font-mono text-xs text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Saved</span>}
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-mistral-bg text-mistral-navy font-mono text-xs border border-mistral-navy/20 hover:border-mistral-navy transition-all"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                if (profile) {
                                                    setForm({
                                                        skill_level: profile.skill_level || "beginner",
                                                        goal: profile.goal || "learn_for_fun",
                                                        primary_language: profile.primary_language ? profile.primary_language.toLowerCase() : "python",
                                                        preferred_explanation_style: profile.preferred_explanation_style || "direct",
                                                    });
                                                }
                                            }}
                                            disabled={saving}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-transparent text-mistral-navy/60 font-mono text-xs hover:text-mistral-navy transition-all disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-mistral-navy text-white font-mono text-xs border border-mistral-navy shadow-[3px_3px_0px_0px_#f97316] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#f97316] active:shadow-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                            Save Preferences
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Col: Read-only Dynamic Profile Stats */}
                    <div className="md:col-span-1 space-y-4">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="bg-mistral-navy p-5 text-white">
                            <div className="flex items-center gap-2 mb-4 text-mistral-sand">
                                <Cpu className="w-4 h-4" />
                                <h2 className="font-mono text-xs uppercase tracking-wider">Dynamic Profile</h2>
                            </div>
                            <p className="font-sans text-sm text-white/70 mb-5 leading-relaxed">
                                As you solve problems, the AI builds a map of your knowledge to customize advice and recommendations.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-mono text-[10px] text-mistral-sand uppercase tracking-wider mb-2">Known Concepts</h3>
                                    <div className="flex flex-wrap gap-1">
                                        {profile?.known_concepts?.slice(0, 10).map((c, i) => (
                                            <span key={i} className="font-mono text-[10px] bg-white/10 px-2 py-0.5">{c}</span>
                                        ))}
                                        {profile?.known_concepts?.length === 0 && <span className="text-xs text-white/40 italic">Not enough data yet</span>}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-mono text-[10px] text-mistral-orange uppercase tracking-wider mb-2">Identified Weaknesses</h3>
                                    <ul className="space-y-1">
                                        {profile?.weaknesses?.slice(0, 5).map((w, i) => (
                                            <li key={i} className="font-sans text-xs text-white/80 flex items-start gap-1.5">
                                                <span className="text-mistral-orange mt-0.5 flex-shrink-0">•</span>{w}
                                            </li>
                                        ))}
                                        {profile?.weaknesses?.length === 0 && <span className="text-xs text-white/40 italic">Not enough data yet</span>}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider mb-2">Core Strengths</h3>
                                    <ul className="space-y-1">
                                        {profile?.strengths?.slice(0, 5).map((s, i) => (
                                            <li key={i} className="font-sans text-xs text-white/80 flex items-start gap-1.5">
                                                <span className="text-emerald-400 mt-0.5 flex-shrink-0">•</span>{s}
                                            </li>
                                        ))}
                                        {profile?.strengths?.length === 0 && <span className="text-xs text-white/40 italic">Not enough data yet</span>}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
