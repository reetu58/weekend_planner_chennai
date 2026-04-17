'use client';
import Link from 'next/link';
import WeatherWidget from '../components/weather-widget';
import { useState, useEffect } from 'react';
import { TrafficSummary } from '../types';

const TEMPLATES = [
  { title: 'Beach Day', emoji: '🏖️', desc: 'Sun, sand & seafood', vibes: 'chill,nature', categories: 'beaches,food', photo: 'https://images.pexels.com/photos/982673/pexels-photo-982673.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop' },
  { title: 'Food Trail', emoji: '🍜', desc: 'Eat your way through Chennai', vibes: 'foodie,social', categories: 'food', photo: 'https://images.pexels.com/photos/2223247/pexels-photo-2223247.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop' },
  { title: 'Heritage Walk', emoji: '🛕', desc: 'Temples, forts & culture', vibes: 'cultural', categories: 'culture', photo: 'https://images.pexels.com/photos/10070972/pexels-photo-10070972.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop' },
  { title: 'Adventure Day', emoji: '🏄', desc: 'Thrills & excitement', vibes: 'adventure,social', categories: 'entertainment', photo: 'https://images.pexels.com/photos/1293261/pexels-photo-1293261.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop' },
  { title: 'Nature Escape', emoji: '🌿', desc: 'Parks, gardens & fresh air', vibes: 'nature,chill', categories: 'nature', photo: 'https://images.pexels.com/photos/1212600/pexels-photo-1212600.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop' },
  { title: 'Date Night', emoji: '💕', desc: 'Romantic spots for two', vibes: 'romantic,chill', categories: 'food,nightlife', photo: 'https://images.pexels.com/photos/30403595/pexels-photo-30403595.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop' },
];

const SEVERITY_EMOJI: Record<string, string> = {
  clear: '🟢', light: '🟡', moderate: '🟠', heavy: '🔴', standstill: '⛔',
};

// Photo marquee images — a mix of Chennai landmarks
const MARQUEE_PHOTOS = [
  { src: '/api/photo?q=Marina+Beach+Chennai', label: 'Marina Beach' },
  { src: '/api/photo?q=Kapaleeshwarar+Temple', label: 'Kapaleeshwarar Temple' },
  { src: '/api/photo?q=Fort+St+George+Chennai', label: 'Fort St. George' },
  { src: '/api/photo?q=San+Thome+Cathedral', label: 'San Thome Cathedral' },
  { src: '/api/photo?q=Mahabalipuram+Shore+Temple', label: 'Mahabalipuram' },
  { src: '/api/photo?q=Birla+Planetarium+Chennai', label: 'Birla Planetarium' },
  { src: '/api/photo?q=Semmozhi+Poonga', label: 'Semmozhi Poonga' },
  { src: '/api/photo?q=Chennai+Lighthouse', label: 'Chennai Lighthouse' },
];

const STEPS = [
  {
    step: '01', icon: '🎯', title: 'Set your vibe',
    desc: 'Pick your mood, budget, group size & starting area. Takes 30 seconds.',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    step: '02', icon: '🚦', title: 'We plan around traffic',
    desc: 'Tell us when you\'re leaving. We order your stops to avoid Chennai\'s busiest corridors at the worst times.',
    color: 'from-amber-500 to-orange-400',
  },
  {
    step: '03', icon: '🎉', title: 'Enjoy your weekend',
    desc: 'Navigate with Google Maps. Share with friends. Have fun!',
    color: 'from-emerald-500 to-green-400',
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
      {/* ===== HERO WITH CHENNAI PHOTO ===== */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background photo */}
        <img
          src="https://images.pexels.com/photos/10070972/pexels-photo-10070972.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Chennai Temple"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/70 via-[#0F172A]/50 to-[#030712]/90" />
        {/* Dot pattern */}
        <div className="hero-dots absolute inset-0 opacity-30" />

        <div className="relative max-w-5xl mx-auto px-4 pt-24 pb-20 w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm text-white/80 mb-8 animate-fade-in-down backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F43F5E] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F43F5E]" />
              </span>
              Your free Chennai weekend planner
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 animate-fade-in-up leading-[1.02] tracking-tight text-white">
              Your weekend.
              <br />
              <span className="gradient-text">Zero traffic.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/60 mb-10 max-w-xl animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
              64 handpicked spots, departure-time aware routing, and itineraries that actually work for Chennai.
              Made by Chennaiites, for Chennaiites.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Link
                href="/plan"
                className="group px-8 py-4 bg-[#F43F5E] text-white text-lg font-bold rounded-2xl hover:bg-accent-light transition-all duration-300 shadow-glow-accent hover:shadow-lg hover:scale-[1.03] btn-shine chip-press"
              >
                <span className="flex items-center gap-2">
                  Plan My Weekend
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </span>
              </Link>
              <Link
                href="/explore"
                className="px-8 py-4 bg-white/10 text-white text-lg font-medium rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 backdrop-blur-md chip-press"
              >
                Explore 64 Places
              </Link>
            </div>

            {/* Quick stats row */}
            <div className="flex flex-wrap gap-6 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
              {[
                { val: '64+', label: 'Curated places' },
                { val: 'Smart', label: 'Traffic routing' },
                { val: 'Free', label: 'No sign-up' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="text-2xl font-black text-[#F43F5E]">{s.val}</span>
                  <span className="text-xs text-white/40 uppercase tracking-wider font-medium">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1 h-2.5 bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ===== PHOTO MARQUEE ===== */}
      <section className="py-6 bg-white/50 border-y border-gray-100/50 overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-track">
            {[...MARQUEE_PHOTOS, ...MARQUEE_PHOTOS].map((p, i) => (
              <div key={i} className="flex-shrink-0 w-52 h-32 rounded-xl overflow-hidden shadow-card mx-2 group relative">
                <img
                  src={p.src}
                  alt={p.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    t.src = `https://placehold.co/400x250/0F172A/F43F5E?text=${encodeURIComponent(p.label)}`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-2 left-3 text-white text-xs font-semibold drop-shadow-lg">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 space-y-20 py-16">
        {/* ===== WEATHER + TRAFFIC ===== */}
        <div className="grid md:grid-cols-2 gap-5">
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

        {/* ===== QUICK TEMPLATES WITH PHOTOS ===== */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold text-[#F43F5E] uppercase tracking-widest mb-2">Quick Start</p>
              <h2 className="text-3xl md:text-4xl font-black text-[#0F172A]">Pick a vibe</h2>
              <p className="text-gray-400 text-sm mt-2">One tap. Instant plan. Let&apos;s go.</p>
            </div>
            <Link href="/explore" className="text-sm text-[#0F172A] font-semibold hover:text-[#334155] transition-colors group flex items-center gap-1">
              All places
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 stagger-children">
            {TEMPLATES.map((t) => (
              <Link
                key={t.title}
                href={`/plan?vibes=${t.vibes}&categories=${t.categories}`}
                className="group relative rounded-2xl overflow-hidden shadow-card card-hover aspect-[4/3]"
              >
                {/* Photo background */}
                <img
                  src={t.photo}
                  alt={t.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <span className="text-3xl mb-2 drop-shadow-lg group-hover:scale-110 transition-transform origin-left">{t.emoji}</span>
                  <h3 className="font-bold text-white text-lg drop-shadow-lg">{t.title}</h3>
                  <p className="text-sm text-white/70 mt-0.5">{t.desc}</p>
                  <div className="mt-2 flex items-center text-xs font-semibold text-[#F43F5E] group-hover:gap-2 transition-all">
                    Plan now
                    <svg className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ===== SAMPLE PLAN PREVIEW ===== */}
        <section>
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-[#F43F5E] uppercase tracking-widest mb-2">What You Get</p>
            <h2 className="text-3xl md:text-4xl font-black text-[#0F172A]">A real plan, not a list</h2>
            <p className="text-gray-400 text-sm mt-2">Time-blocked stops, travel gaps, and meal timing — all figured out for you.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-elevated border border-gray-100/80 overflow-hidden max-w-2xl mx-auto">
            {/* Plan header */}
            <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">Sample Plan</p>
                <h3 className="text-white font-bold text-lg">Morning Beach Day · Couple</h3>
              </div>
              <div className="text-right">
                <div className="text-[#F43F5E] font-black text-xl">4h</div>
                <div className="text-white/40 text-xs">Sat · 08:00 start</div>
              </div>
            </div>

            {/* Stops */}
            <div className="px-6 py-5 space-y-0 divide-y divide-gray-50">

              {/* Stop 1 */}
              <div className="py-4 flex gap-4 items-start">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-[#F43F5E] text-white font-black text-sm flex items-center justify-center shadow-sm">1</div>
                  <div className="w-0.5 h-10 bg-gray-100" />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-[#0F172A] text-sm">Murugan Idli Shop</p>
                      <p className="text-gray-400 text-xs mt-0.5">Mylapore · 🍜 Breakfast</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-semibold text-[#0F172A]">08:00 – 08:45</p>
                      <p className="text-gray-400 text-xs">45 min</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-yellow-50 border border-yellow-100 rounded-full text-xs text-yellow-700 font-medium">⭐ 4.5</span>
                    <span className="px-2 py-0.5 bg-green-50 border border-green-100 rounded-full text-xs text-green-700 font-medium">Free parking</span>
                  </div>
                </div>
              </div>

              {/* Travel badge 1→2 */}
              <div className="py-2 flex gap-4 items-center">
                <div className="w-9 flex-shrink-0 flex justify-center">
                  <div className="w-0.5 h-full bg-gray-100" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700 font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  12 min drive · Light traffic
                </div>
              </div>

              {/* Stop 2 */}
              <div className="py-4 flex gap-4 items-start">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-[#0F172A] text-white font-black text-sm flex items-center justify-center shadow-sm">2</div>
                  <div className="w-0.5 h-10 bg-gray-100" />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-[#0F172A] text-sm">Kapaleeshwarar Temple</p>
                      <p className="text-gray-400 text-xs mt-0.5">Mylapore · 🛕 Culture</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-semibold text-[#0F172A]">09:05 – 10:15</p>
                      <p className="text-gray-400 text-xs">70 min</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-yellow-50 border border-yellow-100 rounded-full text-xs text-yellow-700 font-medium">⭐ 4.7</span>
                    <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full text-xs text-gray-600 font-medium">Free entry</span>
                  </div>
                </div>
              </div>

              {/* Travel badge 2→3 */}
              <div className="py-2 flex gap-4 items-center">
                <div className="w-9 flex-shrink-0 flex justify-center">
                  <div className="w-0.5 h-full bg-gray-100" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-xl text-xs text-green-700 font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  18 min drive · Clear roads
                </div>
              </div>

              {/* Stop 3 */}
              <div className="py-4 flex gap-4 items-start">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-[#0F172A] text-white font-black text-sm flex items-center justify-center shadow-sm">3</div>
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-[#0F172A] text-sm">Besant Nagar Beach</p>
                      <p className="text-gray-400 text-xs mt-0.5">Besant Nagar · 🏖️ Beach</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-semibold text-[#0F172A]">10:35 – 12:00</p>
                      <p className="text-gray-400 text-xs">85 min</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-yellow-50 border border-yellow-100 rounded-full text-xs text-yellow-700 font-medium">⭐ 4.4</span>
                    <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-full text-xs text-blue-700 font-medium">Romantic spot</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Plan footer */}
            <div className="px-6 py-4 bg-gray-50/60 border-t border-gray-100 flex items-center justify-between">
              <div className="flex gap-4 text-xs text-gray-500">
                <span>⏱ 4h total</span>
                <span>📍 3 stops</span>
                <span>💰 Free–₹500</span>
              </div>
              <Link href="/plan" className="px-4 py-2 bg-[#F43F5E] text-white text-xs font-bold rounded-xl hover:bg-accent-light transition-colors chip-press">
                Build Mine →
              </Link>
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section>
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-[#F43F5E] uppercase tracking-widest mb-2">Dead Simple</p>
            <h2 className="text-3xl md:text-4xl font-black text-[#0F172A]">How it works</h2>
            <p className="text-gray-400 text-sm mt-2">Three steps. Zero cost. No sign-up.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 stagger-children">
            {STEPS.map((s) => (
              <div key={s.step} className="relative bg-white rounded-2xl p-8 shadow-card border border-gray-100/80 card-hover overflow-hidden group">
                {/* Step number watermark */}
                <span className="absolute -top-3 -right-2 text-8xl font-black text-gray-50 select-none group-hover:text-gray-100 transition-colors">{s.step}</span>
                {/* Colored icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="text-3xl">{s.icon}</span>
                </div>
                <h3 className="font-bold text-[#0F172A] text-xl mb-2 relative">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed relative">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== BOTTOM CTA WITH PHOTO ===== */}
        <section className="relative rounded-3xl overflow-hidden shadow-elevated">
          {/* Background photo */}
          <img
            src="https://images.pexels.com/photos/1212600/pexels-photo-1212600.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop"
            alt="Chennai sunset"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 to-[#0F172A]/70" />
          <div className="hero-dots absolute inset-0 opacity-30" />

          <div className="relative p-14 md:p-16 max-w-xl">
            <p className="text-xs font-bold text-[#F43F5E] uppercase tracking-widest mb-3">Let&apos;s Go</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
              This weekend is going to be different.
            </h2>
            <p className="text-white/50 mb-8 leading-relaxed">
              No more &quot;where should we go?&quot; No more sitting in traffic.
              Just good places, smart routes, and great weekends.
            </p>
            <Link
              href="/plan"
              className="inline-flex items-center gap-2 px-10 py-5 bg-[#F43F5E] text-white text-lg font-bold rounded-2xl hover:bg-accent-light transition-all duration-300 shadow-glow-accent hover:scale-[1.03] btn-shine chip-press"
            >
              Start Planning
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
