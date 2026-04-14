"use client";
import Link from "next/link";
import { Sparkles, Zap, Clock, Star, ChevronRight, Check } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-gray-950/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-indigo-400" size={24} />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Genify
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
              Sign in
            </Link>
            <Link
              href="/register"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full px-4 py-1.5 text-sm text-indigo-300 mb-8">
          <Zap size={14} />
          Powered by GPT-4o-mini
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          Create viral content
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            in seconds
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Stop staring at a blank page. Genify generates scroll-stopping posts, ideas, scripts, and captions for any platform — instantly.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 flex items-center gap-2"
          >
            Start generating free <ChevronRight size={20} />
          </Link>
          <span className="text-gray-500 text-sm">10 free generations · No credit card needed</span>
        </div>
      </section>

      {/* Demo card */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-gray-500 text-sm">Genify Generator</span>
          </div>
          <div className="space-y-4">
            <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-lg p-3 text-sm text-indigo-300">
              ?? &ldquo;Give me 5 TikTok ideas about fitness for Gen Z&rdquo;
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-sm text-gray-300 space-y-2">
              <p className="font-semibold text-white">? Generated in 2 seconds:</p>
              <p>1. &ldquo;POV: You completed 30 days of morning workouts&rdquo; — Show the transformation timelapse</p>
              <p>2. &ldquo;Rating every viral fitness trend so you dont have to&rdquo; — React + duet format</p>
              <p>3. &ldquo;5-minute dorm room workout with zero equipment&rdquo; — Perfect for college students</p>
              <p>4. &ldquo;What I eat in a day as a broke fitness girlie&rdquo; — Budget meal prep</p>
              <p>5. &ldquo;Gym anxiety vs me after 3 months&rdquo; — Mindset + confidence story arc</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need to dominate social media</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: "?", iconColor: "text-indigo-400", title: "AI-Powered Generation", desc: "GPT-4o crafts engaging content tailored to your platform, tone, and audience." },
            { icon: "?", iconColor: "text-yellow-400", title: "Instant Results", desc: "Get posts, scripts, ideas, and captions in under 5 seconds with real-time streaming." },
            { icon: "??", iconColor: "text-green-400", title: "Content History", desc: "All your generations saved. Copy, reuse, and build on your best content anytime." },
          ].map((f) => (
            <div key={f.title} className="bg-gray-900/60 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/40 transition-colors">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center mb-4">Simple pricing</h2>
        <p className="text-gray-400 text-center mb-12">Start free, scale when you need more.</p>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { name: "Free", price: "$0", desc: "Perfect to try Genify", credits: "10 generations", features: ["All content types", "All platforms", "History saved 7 days"], cta: "Start free", href: "/register", highlight: false },
            { name: "Pro", price: "$9", desc: "For serious creators", credits: "500 generations/mo", features: ["All content types", "All platforms", "Unlimited history", "Priority generation"], cta: "Get Pro", href: "/register", highlight: true },
          ].map((p) => (
            <div key={p.name} className={"rounded-2xl p-6 border " + (p.highlight ? "bg-indigo-600/20 border-indigo-500" : "bg-gray-900 border-white/10")}>
              {p.highlight && <div className="text-xs text-indigo-300 font-medium mb-3">? Most popular</div>}
              <h3 className="text-xl font-bold mb-1">{p.name}</h3>
              <div className="text-4xl font-extrabold mb-1">{p.price}<span className="text-sm font-normal text-gray-400">/mo</span></div>
              <p className="text-gray-400 text-sm mb-4">{p.desc}</p>
              <div className="text-indigo-300 font-semibold mb-4">? {p.credits}</div>
              <ul className="space-y-2 mb-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-green-400">?</span> {f}
                  </li>
                ))}
              </ul>
              <Link href={p.href} className={"block text-center py-3 rounded-xl font-semibold transition-all " + (p.highlight ? "bg-indigo-600 hover:bg-indigo-500 text-white" : "bg-white/10 hover:bg-white/20 text-white")}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-indigo-400" size={18} />
            <span className="text-gray-400">Genify © 2026</span>
          </div>
          <p className="text-gray-600 text-sm">Built with Next.js · NestJS · OpenAI</p>
        </div>
      </footer>
    </div>
  );
}
