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
    step: '02', icon: '🚦', title: 'We dodge traffic',
    desc: 'Real-time traffic data optimizes your route. No more jams.',
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
              64 handpicked spots, real-time traffic smarts, and routes that actually work.
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
                { val: 'Live', label: 'Traffic data' },
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
