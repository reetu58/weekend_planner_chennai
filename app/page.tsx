'use client';
import Link from 'next/link';
import WeatherWidget from '../components/weather-widget';
import { useState, useEffect } from 'react';
import { TrafficSummary } from '../types';

const TEMPLATES = [
  { title: 'Beach Day', emoji: '🏖️', desc: 'Sun, sand & seafood', vibes: 'chill,nature', categories: 'beaches,street-food', color: 'from-cyan-400 to-blue-600', iconBg: 'bg-cyan-100' },
  { title: 'Cafe Hopping', emoji: '☕', desc: 'Best brews in Chennai', vibes: 'chill,artsy', categories: 'cafes', color: 'from-amber-500 to-orange-600', iconBg: 'bg-amber-100' },
  { title: 'Heritage Walk', emoji: '🛕', desc: 'Temples, history & culture', vibes: 'cultural', categories: 'temples-heritage,art-museums', color: 'from-orange-400 to-red-600', iconBg: 'bg-orange-100' },
  { title: 'Adventure Day', emoji: '🏄', desc: 'Thrills & excitement', vibes: 'adventure,social', categories: 'sports-fun', color: 'from-emerald-400 to-teal-600', iconBg: 'bg-emerald-100' },
  { title: 'Foodie Trail', emoji: '🍜', desc: 'Eat your way through Chennai', vibes: 'foodie', categories: 'street-food,cafes', color: 'from-red-400 to-pink-600', iconBg: 'bg-red-100' },
  { title: 'Photo Walk', emoji: '📸', desc: 'Capture Chennai\'s beauty', vibes: 'artsy,nature', categories: 'photography,temples-heritage', color: 'from-violet-400 to-purple-600', iconBg: 'bg-violet-100' },
];

const SEVERITY_EMOJI: Record<string, string> = {
  clear: '🟢', light: '🟡', moderate: '🟠', heavy: '🔴', standstill: '⛔',
};

const STATS = [
  { value: '65+', label: 'Places', icon: '📍' },
  { value: '15', label: 'Categories', icon: '🏷️' },
  { value: '100%', label: 'Free', icon: '✨' },
  { value: 'Live', label: 'Traffic Data', icon: '🚦' },
];

const STEPS = [
  {
    step: '01', icon: '🎯', title: 'Set your preferences',
    desc: 'Pick your mood, budget, group size, starting location and date. We handle the rest.',
    accent: 'bg-blue-50 border-blue-100',
  },
  {
    step: '02', icon: '🚦', title: 'Get a traffic-smart plan',
    desc: 'Our engine checks real-time traffic, optimizes your route, and schedules every stop.',
    accent: 'bg-amber-50 border-amber-100',
  },
  {
    step: '03', icon: '🎉', title: 'Enjoy your weekend',
    desc: 'Navigate stop by stop with Google Maps integration. Share your plan with friends.',
    accent: 'bg-emerald-50 border-emerald-100',
  },
];

export default function Home() {
  const [trafficSummary, setTrafficSummary] = useState<TrafficSummary | null>(null);

  useEffect(() => {
    fetch('/api/traffic?summary=true')
      .then(r => r.ok ? r.json() : null)
      .then(setTrafficSummary)
      .catch(() => null);
  }, []);

  return (
    <div className="min-h-screen bg-sand">
      {/* ===== HERO ===== */}
      <section className="relative bg-gradient-hero text-white overflow-hidden">
        <div className="hero-pattern absolute inset-0" />
        <div className="hero-dots absolute inset-0" />

        {/* Decorative floating orbs */}
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-[#FFB703]/10 rounded-full blur-[100px] animate-breathe" />
        <div className="absolute bottom-20 right-[15%] w-56 h-56 bg-[#2d7da8]/20 rounded-full blur-[80px] animate-breathe" style={{ animationDelay: '1.5s' }} />

        <div className="relative max-w-5xl mx-auto px-4 pt-32 pb-28 md:pt-40 md:pb-36">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/10 text-sm text-white/70 mb-8 animate-fade-in-down backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFB703] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFB703]" />
              </span>
              Free weekend planner for Chennai
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 animate-fade-in-up leading-[1.05] tracking-tight">
              Plan your weekend.
              <br />
              <span className="gradient-text">Dodge the traffic.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
              65+ curated places, real-time traffic intelligence, and smart routing.
              Built for people who actually live in Chennai.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Link
                href="/plan"
                className="group px-8 py-4 bg-[#FFB703] text-[#1B4965] text-lg font-bold rounded-2xl hover:bg-accent-light transition-all duration-300 shadow-glow-accent hover:shadow-lg hover:scale-[1.03] animate-pulse-glow btn-shine chip-press"
              >
                <span className="flex items-center gap-2">
                  Plan My Weekend
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </span>
              </Link>
              <Link
                href="/explore"
                className="px-8 py-4 bg-white/8 text-white text-lg font-medium rounded-2xl hover:bg-white/15 transition-all duration-300 border border-white/15 backdrop-blur-sm chip-press"
              >
                Explore Places
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {STATS.map(s => (
                <div key={s.label} className="text-center p-3 rounded-2xl bg-white/5 border border-white/8 backdrop-blur-sm">
                  <p className="text-xs mb-1">{s.icon}</p>
                  <p className="text-2xl md:text-3xl font-bold text-[#FFB703]">{s.value}</p>
                  <p className="text-[11px] text-white/35 mt-0.5 uppercase tracking-wider font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80h1440V40c-240 30-480 45-720 30S240 20 0 50v30z" fill="#FAF7F2"/>
          </svg>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 space-y-16 pb-20">
        {/* ===== WEATHER + TRAFFIC ROW ===== */}
        <div className="grid md:grid-cols-2 gap-5 -mt-6">
          <WeatherWidget />
          {trafficSummary && (
            <div className="bg-white rounded-2xl shadow-card border border-gray-100/80 p-6 card-lift">
              <div className="flex items-center gap-2 mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                </span>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Chennai Traffic {trafficSummary.isLive ? '' : '(Estimated)'}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {trafficSummary.corridors.map((c) => (
                  <span key={c.name} className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-xl text-sm font-medium border border-gray-100/80 transition-colors hover:bg-gray-100">
                    {SEVERITY_EMOJI[c.severity]} {c.name}
                    {c.avgDelay > 0 && <span className="text-gray-400 text-xs">(+{c.avgDelay}m)</span>}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ===== QUICK TEMPLATES ===== */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-[#FFB703] uppercase tracking-wider mb-1">Quick Start</p>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1B4965]">Pick a Theme</h2>
              <p className="text-gray-400 text-sm mt-1.5">One tap, instant itinerary tailored to your mood</p>
            </div>
            <Link href="/explore" className="text-sm text-[#1B4965] font-medium hover:text-[#2d7da8] transition-colors group flex items-center gap-1">
              View all
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 stagger-children">
            {TEMPLATES.map((t) => (
              <Link
                key={t.title}
                href={`/plan?vibes=${t.vibes}&categories=${t.categories}`}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-card border border-gray-100/80 card-hover"
              >
                <div className={`relative h-28 bg-gradient-to-br ${t.color} flex items-center justify-center overflow-hidden`}>
                  {/* Decorative circles */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
                  <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-white/8 rounded-full" />
                  <span className="text-5xl group-hover:scale-125 transition-transform duration-500 animate-float relative z-10 drop-shadow-lg">{t.emoji}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#1B4965] text-base group-hover:text-[#2d7da8] transition-colors">{t.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{t.desc}</p>
                  <div className="mt-3 flex items-center text-xs font-medium text-[#1B4965]/50 group-hover:text-[#FFB703] transition-colors">
                    Plan now
                    <svg className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section>
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-[#FFB703] uppercase tracking-wider mb-1">Simple & Smart</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1B4965]">How it works</h2>
            <p className="text-gray-400 text-sm mt-2">Three steps. Zero cost. No sign-up required.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 stagger-children">
            {STEPS.map((s) => (
              <div key={s.step} className={`relative bg-white rounded-2xl p-7 shadow-card border ${s.accent} card-hover overflow-hidden`}>
                {/* Step number watermark */}
                <span className="absolute -top-2 -right-1 text-7xl font-black text-gray-50 select-none">{s.step}</span>
                {/* Icon with accent bg */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1B4965] to-[#2d7da8] flex items-center justify-center mb-5 shadow-md">
                  <span className="text-2xl">{s.icon}</span>
                </div>
                <h3 className="font-bold text-[#1B4965] text-lg mb-2 relative">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed relative">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="relative text-center bg-gradient-to-br from-[#1B4965] via-[#1B4965] to-[#2d7da8] rounded-3xl p-14 md:p-16 shadow-elevated overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFB703]/8 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#2d7da8]/20 rounded-full blur-[60px]" />
          <div className="hero-dots absolute inset-0 opacity-50" />

          <div className="relative">
            <p className="text-xs font-semibold text-[#FFB703] uppercase tracking-wider mb-3">Let&apos;s Go</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to plan your weekend?</h2>
            <p className="text-white/50 mb-10 max-w-md mx-auto">No sign-up. No cost. Just great weekends in Chennai with traffic-smart routing.</p>
            <Link
              href="/plan"
              className="inline-flex items-center gap-2 px-10 py-5 bg-[#FFB703] text-[#1B4965] text-lg font-bold rounded-2xl hover:bg-accent-light transition-all duration-300 shadow-glow-accent hover:scale-[1.03] btn-shine chip-press"
            >
              Get Started
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
