"use client";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Comparison from "@/components/Comparison";
import BentoGrid from "@/components/BentoGrid";
import Roadmap from "@/components/Roadmap";
import FaqFooter from "@/components/FaqFooter";
import SocialProof from "@/components/SocialProof";
import BackgroundGraph from "@/components/BackgroundGraph";
import { Analytics } from "@vercel/analytics/next";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-hidden bg-mistral-bg selection:bg-mistral-orange selection:text-white">
      <BackgroundGraph />

      {/* Subtle radial fade at edges */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(252,251,249,0.5)_100%)] z-0"></div>

      {/* Content layer */}
      <div className="relative z-10 w-full">

        {/* 1. Navbar */}
        <Navbar />

        {/* 2. Hero */}
        <section id="hero" className="w-full">
          <Hero />
        </section>

        {/* 3. Social Proof — Stats + Testimonials */}
        <section id="social-proof" className="w-full">
          <SocialProof />
        </section>

        {/* 4. Methodology — The Comparison */}
        <section id="methodology" className="w-full">
          <Comparison />
        </section>

        {/* 5. Features — Bento Grid */}
        <section id="features" className="w-full">
          <BentoGrid />
        </section>

        {/* 6. Roadmap */}
        <section id="roadmap" className="w-full">
          <Roadmap />
        </section>

        {/* 7. FAQ + Footer */}
        <section id="faq" className="w-full">
          <FaqFooter />
        </section>

      </div>
      <Analytics />
    </main>
  );
}