'use client';
import Link from 'next/link';
import WeatherWidget from '../components/weather-widget';
import { useState, useEffect } from 'react';
import { TrafficSummary } from '../types';

const TEMPLATES = [
  { title: 'Beach Day', emoji: '🏖️', desc: 'Sun, sand & seafood', tag: 'Coastal', hours: '6 Hours', vibes: 'chill,nature', categories: 'beaches,food', photo: 'https://images.pexels.com/photos/982673/pexels-photo-982673.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop' },
  { title: 'Food Trail', emoji: '🍜', desc: 'Eat your way through Chennai', tag: 'Culinary', hours: '4 Hours', vibes: 'foodie,social', categories: 'food', photo: 'https://images.pexels.com/photos/2223247/pexels-photo-2223247.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop' },
  { title: 'Heritage Walk', emoji: '🛕', desc: 'Temples, forts & culture', tag: 'Heritage', hours: '5 Hours', vibes: 'cultural', categories: 'culture', photo: 'https://images.pexels.com/photos/10070972/pexels-photo-10070972.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop' },
  { title: 'Adventure Day', emoji: '🏄', desc: 'Thrills & excitement', tag: 'Active', hours: '8 Hours', vibes: 'adventure,social', categories: 'entertainment', photo: 'https://images.pexels.com/photos/1293261/pexels-photo-1293261.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop' },
  { title: 'Nature Escape', emoji: '🌿', desc: 'Parks, gardens & fresh air', tag: 'Nature', hours: 'Morning', vibes: 'nature,chill', categories: 'nature', photo: 'https://images.pexels.com/photos/1212600/pexels-photo-1212600.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop' },
  { title: 'Date Night', emoji: '💕', desc: 'Romantic spots for two', tag: 'Date Night', hours: 'Evening', vibes: 'romantic,chill', categories: 'food,nightlife', photo: 'https://images.pexels.com/photos/30403595/pexels-photo-30403595.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop' },
];

const SEVERITY_COLOR: Record<string, string> = {
  clear: 'bg-green-500',
  light: 'bg-yellow-400',
  moderate: 'bg-orange-500',
  heavy: 'bg-red-500',
  standstill: 'bg-red-700',
};

const SEVERITY_TEXT: Record<string, string> = {
  clear: 'text-green-400',
  light: 'text-yellow-400',
  moderate: 'text-orange-400',
  heavy: 'text-red-400',
  standstill: 'text-red-500',
};

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
  },
  {
    step: '02', icon: '🚦', title: 'We plan around traffic',
    desc: "Tell us when you're leaving. We order your stops to avoid Chennai's busiest corridors at the worst times.",
  },
  {
    step: '03', icon: '🎉', title: 'Enjoy your weekend',
    desc: 'Navigate with Google Maps. Share with friends. Have fun!',
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
    <div className="min-h-screen bg-[#0F172A] text-[#FAFAF9] overflow-x-hidden">

      {/* ===== HERO ===== */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <img
          src="https://images.pexels.com/photos/10070972/pexels-photo-10070972.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Chennai Temple"
          className="absolute inset-0 w-full h-full object-cover opacity-30 select-none pointer-events-none"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/90 via-[#0F172A]/60 to-[#0F172A]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,63,94,0.08)_0%,transparent_70%)]" />
        <div className="hero-dots absolute inset-0 opacity-20" />

        <div className="relative max-w-5xl mx-auto px-4 pt-28 pb-20 w-full">
          <div className="max-w-3xl">

            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F43F5E]/10 border border-[#F43F5E]/30 text-[#FB7185] text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in-down backdrop-blur-md shadow-[0_0_20px_rgba(244,63,94,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FB7185] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F43F5E]" />
              </span>
              Live Traffic Integrated
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 animate-fade-in-up leading-[1.05] tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500">
              Your weekend.
              <br />
              <span className="text-white">Zero traffic.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-xl animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
              64 handpicked spots, departure-time aware routing, and itineraries that actually work for Chennai.
              Made by Chennaiites, for Chennaiites.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Link
                href="/plan"
                className="group px-8 py-4 bg-[#F43F5E] text-white text-lg font-bold rounded-2xl hover:bg-[#E11D48] transition-all duration-300 shadow-[0_0_30px_rgba(244,63,94,0.3)] hover:shadow-[0_0_50px_rgba(244,63,94,0.5)] hover:scale-[1.03] btn-shine chip-press"
              >
                <span className="flex items-center gap-2">
                  Plan My Weekend
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </span>
              </Link>
              <Link
                href="/explore"
                className="px-8 py-4 bg-white/10 text-white text-lg font-medium rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/15 backdrop-blur-md chip-press"
              >
                Explore 64 Places
              </Link>
            </div>

            {/* Stats */}
            <div className="w-full max-w-xl grid grid-cols-3 gap-px bg-white/10 rounded-2xl p-px overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
              {[
                { val: '64+', label: 'Curated places' },
                { val: '🧭', label: 'Smart routing' },
                { val: '0₹', label: 'No sign-up' },
              ].map(s => (
                <div key={s.label} className="bg-[#0F172A]/80 backdrop-blur-xl px-4 py-4 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-white">{s.val}</span>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1 h-2.5 bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ===== PHOTO MARQUEE ===== */}
      <section className="relative py-10 border-y border-white/5 bg-[#0A1120]/60 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0F172A] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0F172A] to-transparent z-10 pointer-events-none" />

        <div className="marquee-container">
          <div className="marquee-track">
            {[...MARQUEE_PHOTOS, ...MARQUEE_PHOTOS].map((p, i) => (
              <div key={i} className="flex-shrink-0 w-60 h-36 rounded-2xl overflow-hidden mx-2 group relative shadow-lg">
                <img
                  src={p.src}
                  alt={p.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    t.src = `https://placehold.co/400x250/1E293B/F43F5E?text=${encodeURIComponent(p.label)}`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/30 to-transparent" />
                <span className="absolute bottom-3 left-3 text-white text-sm font-bold drop-shadow-lg">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WEATHER + TRAFFIC ===== */}
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-4">
        <div className="grid md:grid-cols-2 gap-5">
          {/* WeatherWidget rendered in a dark glass wrapper */}
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
            <WeatherWidget />
          </div>

          {trafficSummary && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.2)] p-6 transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F43F5E] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F43F5E]" />
                </span>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Traffic Monitor {trafficSummary.isLive ? '' : '(Estimated)'}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {trafficSummary.corridors.map((c) => (
                  <span
                    key={c.name}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-white/10 bg-white/5 ${SEVERITY_TEXT[c.severity] ?? 'text-slate-300'}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${SEVERITY_COLOR[c.severity] ?? 'bg-slate-400'}`} />
                    {c.name}
                    {c.avgDelay > 0 && <span className="text-slate-500">(+{c.avgDelay}m)</span>}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== QUICK TEMPLATES ===== */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-[#F43F5E] uppercase tracking-widest mb-3">Quick Start</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Choose your vibe.</h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">6 distinct flavors of Chennai, heavily curated. One tap — instant plan.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.map((t) => (
            <Link
              key={t.title}
              href={`/plan?vibes=${t.vibes}&categories=${t.categories}`}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-xl"
            >
              <img
                src={t.photo}
                alt={t.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.src = `https://placehold.co/600x750/1E293B/F43F5E?text=${encodeURIComponent(t.title)}`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/60 to-transparent" />
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#F43F5E]/50 rounded-3xl transition-colors duration-300" />

              <div className="absolute inset-0 p-7 flex flex-col justify-end">
                <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl drop-shadow-lg">{t.emoji}</span>
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white">{t.tag}</span>
                    <span className="text-slate-300 text-xs font-medium">⏱ {t.hours}</span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-1">{t.title}</h3>
                  <p className="text-slate-300 text-sm">{t.desc}</p>
                  <div className="mt-3 flex items-center text-xs font-bold text-[#F43F5E] opacity-0 group-hover:opacity-100 transition-opacity">
                    Plan now
                    <svg className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== SAMPLE PLAN PREVIEW ===== */}
      <section className="relative py-24 border-y border-white/5 bg-[#0A1120]/50 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F43F5E]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

          {/* Copy */}
          <div>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#F43F5E]/20 text-[#F43F5E] mb-6 border border-[#F43F5E]/30 text-xl">
              🗺️
            </div>
            <p className="text-xs font-bold text-[#F43F5E] uppercase tracking-widest mb-3">What You Get</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">A real plan, not a list.</h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Time-blocked stops, travel gaps, and meal timing — all figured out for you. Our engine structures your day geographically and predicts peak traffic at Adyar/Guindy.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                { title: 'Dynamic Padding', desc: 'Adds 15–30 min buffer for parking at high-density spots.' },
                { title: 'Weather Avoidance', desc: 'Swaps outdoor spots if afternoon heat peaks above 35°C.' },
              ].map(item => (
                <li key={item.title} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
                  <span className="text-[#F43F5E] mt-0.5 text-lg">✓</span>
                  <div>
                    <h4 className="font-bold text-white">{item.title}</h4>
                    <p className="text-sm text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/plan" className="inline-flex items-center gap-2 text-[#F43F5E] font-bold hover:text-[#FB7185] transition-colors">
              Build my plan
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>

          {/* Itinerary card */}
          <div className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Morning Beach Day · Couple</h3>
                <p className="text-xs text-slate-400 mt-1">Sat · 08:00 start · 3 stops · ~12 km</p>
              </div>
              <span className="px-3 py-1 bg-[#F43F5E] text-white text-xs font-bold rounded-full">Optimized</span>
            </div>

            <div className="relative pl-6 space-y-6">
              <div className="absolute left-[27px] top-2 bottom-6 w-[2px] bg-white/10" />

              {/* Stop 1 */}
              <div className="relative">
                <div className="absolute -left-[30px] top-1 w-3 h-3 rounded-full bg-white border-2 border-[#0F172A] z-10" />
                <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">08:00 AM • Breakfast</div>
                <div className="bg-[#0F172A]/60 rounded-2xl p-3 border border-white/5 flex gap-3 items-center">
                  <div className="w-9 h-9 rounded-xl bg-[#F43F5E] text-white font-black text-sm flex items-center justify-center flex-shrink-0">1</div>
                  <div>
                    <p className="font-bold text-white text-sm">Murugan Idli Shop</p>
                    <div className="flex items-center gap-2 text-xs text-yellow-400 mt-0.5">
                      ⭐ 4.5 <span className="text-slate-500">• Mylapore</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Traffic badge */}
              <div className="relative -left-[42px] flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#0F172A] border border-white/10 flex items-center justify-center text-xs">🚗</div>
                <div className="px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-xs text-yellow-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  12 min · Light traffic
                </div>
              </div>

              {/* Stop 2 */}
              <div className="relative">
                <div className="absolute -left-[30px] top-1 w-3 h-3 rounded-full bg-white border-2 border-[#0F172A] z-10" />
                <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">09:05 AM • Culture</div>
                <div className="bg-[#0F172A]/60 rounded-2xl p-3 border border-white/5 flex gap-3 items-center">
                  <div className="w-9 h-9 rounded-xl bg-[#1E293B] text-white font-black text-sm flex items-center justify-center flex-shrink-0">2</div>
                  <div>
                    <p className="font-bold text-white text-sm">Kapaleeshwarar Temple</p>
                    <div className="flex items-center gap-2 text-xs text-yellow-400 mt-0.5">
                      ⭐ 4.7 <span className="text-slate-500">• Mylapore · Free entry</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Traffic badge */}
              <div className="relative -left-[42px] flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#0F172A] border border-white/10 flex items-center justify-center text-xs">🚗</div>
                <div className="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-xs text-green-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  18 min · Clear roads
                </div>
              </div>

              {/* Stop 3 */}
              <div className="relative">
                <div className="absolute -left-[30px] top-1 w-3 h-3 rounded-full bg-white border-2 border-[#0F172A] z-10" />
                <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">10:35 AM • Beach</div>
                <div className="bg-[#0F172A]/60 rounded-2xl p-3 border border-white/5 flex gap-3 items-center">
                  <div className="w-9 h-9 rounded-xl bg-[#1E293B] text-white font-black text-sm flex items-center justify-center flex-shrink-0">3</div>
                  <div>
                    <p className="font-bold text-white text-sm">Besant Nagar Beach</p>
                    <div className="flex items-center gap-2 text-xs text-yellow-400 mt-0.5">
                      ⭐ 4.4 <span className="text-slate-500">• Besant Nagar</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex gap-4 text-xs text-slate-500">
                <span>⏱ 4h total</span>
                <span>📍 3 stops</span>
                <span>💰 Free–₹500</span>
              </div>
              <Link href="/plan" className="px-4 py-2 bg-[#F43F5E] text-white text-xs font-bold rounded-xl hover:bg-[#E11D48] transition-colors chip-press">
                Build Mine →
              </Link>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#0F172A]/80 to-transparent rounded-b-3xl pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-[#F43F5E] uppercase tracking-widest mb-3">Dead Simple</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Three steps. Zero hassle.</h2>
          <p className="text-slate-400 text-base mt-3">No account. No cost. Just a great Chennai weekend.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-[18%] right-[18%] h-px bg-gradient-to-r from-transparent via-[#F43F5E]/30 to-transparent" />

          {STEPS.map((s) => (
            <div key={s.step} className="group relative flex flex-col items-center text-center">
              <div className="absolute -top-8 text-[120px] font-black text-white/[0.025] leading-none select-none">{s.step}</div>
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10 flex items-center justify-center mb-6 relative z-10 shadow-xl group-hover:border-[#F43F5E]/40 transition-colors">
                <span className="text-3xl group-hover:scale-110 transition-transform">{s.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
              <p className="text-slate-400 text-sm max-w-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="px-4 pb-24">
        <div className="max-w-6xl mx-auto relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
          <img
            src="https://images.pexels.com/photos/1212600/pexels-photo-1212600.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop"
            alt="Chennai sunset"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/95 via-[#0F172A]/80 to-[#0F172A]/70" />
          <div className="hero-dots absolute inset-0 opacity-20" />

          <div className="relative p-14 md:p-20 max-w-2xl">
            <p className="text-xs font-bold text-[#F43F5E] uppercase tracking-widest mb-4">Let&apos;s Go</p>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-5 leading-tight">
              This weekend is going to be different.
            </h2>
            <p className="text-slate-300 mb-10 text-lg leading-relaxed">
              No more &quot;where should we go?&quot; No more sitting in traffic.
              Just good places, smart routes, and great weekends.
            </p>
            <Link
              href="/plan"
              className="inline-flex items-center gap-2 px-10 py-5 bg-[#F43F5E] text-white text-lg font-bold rounded-2xl hover:bg-[#E11D48] transition-all duration-300 shadow-[0_0_40px_rgba(244,63,94,0.3)] hover:shadow-[0_0_60px_rgba(244,63,94,0.5)] hover:scale-[1.03] btn-shine chip-press"
            >
              Start Planning — Free
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            <p className="text-slate-500 text-sm mt-5">100% Free · No account needed</p>
          </div>
        </div>
      </section>

    </div>
  );
}
