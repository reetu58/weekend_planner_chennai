'use client';
import Link from 'next/link';
import WeatherWidget from '../components/weather-widget';
import { useState, useEffect } from 'react';
import { TrafficSummary } from '../types';

const TEMPLATES = [
  {
    title: 'Marina to Besant Nagar', tag: 'Coastal', hours: '6 Hours',
    desc: "Start at Asia's longest beach, end the evening at Elliot's with sundowners and seafood.",
    vibes: 'chill,nature', categories: 'beaches,food',
    photo: 'https://images.pexels.com/photos/982673/pexels-photo-982673.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
  },
  {
    title: 'Mylapore Food Crawl', tag: 'Culinary', hours: '4 Hours',
    desc: 'Filter kaapi at Murugan, crispy vadas at Ratna Café, and heritage meals in Brahmin agraharam lanes.',
    vibes: 'foodie,social', categories: 'food',
    photo: 'https://images.pexels.com/photos/2223247/pexels-photo-2223247.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
  },
  {
    title: 'Kapaleeshwarar & Fort Walk', tag: 'Heritage', hours: '5 Hours',
    desc: 'Dravidian gopurams, Fort St. George, and the colonial quarter — all before the afternoon heat peaks.',
    vibes: 'cultural', categories: 'culture',
    photo: 'https://images.pexels.com/photos/10070972/pexels-photo-10070972.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
  },
  {
    title: 'Nungambakkam Evening', tag: 'Date Night', hours: 'Evening',
    desc: 'Rooftop dining, Chamiers Road cafes, and live indie acts in the heart of Namma Chennai.',
    vibes: 'romantic,chill', categories: 'food,nightlife',
    photo: 'https://images.pexels.com/photos/30403595/pexels-photo-30403595.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
  },
  {
    title: 'Muttukadu Backwaters', tag: 'Nature', hours: 'Morning',
    desc: 'Early morning kayaking, bird watching, and a quiet breakfast before OMR fills up.',
    vibes: 'nature,chill', categories: 'nature',
    photo: 'https://images.pexels.com/photos/1212600/pexels-photo-1212600.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
  },
  {
    title: 'ECR Adventure Run', tag: 'Active', hours: '8 Hours',
    desc: 'Go-karting at MGM Dizzee World, ATV rides at Muttukadu, and a sunset dip at Covelong.',
    vibes: 'adventure,social', categories: 'entertainment',
    photo: 'https://images.pexels.com/photos/1293261/pexels-photo-1293261.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
  },
];

const MARQUEE_ITEMS = [
  { src: '/api/photo?q=Marina+Beach+Chennai', label: 'Marina Beach' },
  { src: '/api/photo?q=Kapaleeshwarar+Temple+Mylapore', label: 'Kapaleeshwarar Temple' },
  { src: '/api/photo?q=Fort+St+George+Chennai', label: 'Fort St. George' },
  { src: '/api/photo?q=Mahabalipuram+Shore+Temple', label: 'Mahabalipuram' },
  { src: '/api/photo?q=Semmozhi+Poonga+Chennai', label: 'Semmozhi Poonga' },
  { src: '/api/photo?q=Besant+Nagar+Beach+Chennai', label: 'Besant Nagar Beach' },
  { src: '/api/photo?q=DakshinaChitra+Chennai', label: 'DakshinaChitra' },
  { src: '/api/photo?q=ECR+East+Coast+Road+Chennai', label: 'ECR Drive' },
];

const SEVERITY_ORDER: Record<string, number> = {
  standstill: 5, heavy: 4, moderate: 3, light: 2, clear: 1,
};
const SEVERITY_DOT: Record<string, string> = {
  clear: 'bg-emerald-400', light: 'bg-yellow-400', moderate: 'bg-orange-500',
  heavy: 'bg-red-500', standstill: 'bg-red-700',
};
const SEVERITY_LABEL: Record<string, string> = {
  clear: 'Clear', light: 'Light', moderate: 'Moderate',
  heavy: 'Heavy', standstill: 'Standstill',
};
const SEVERITY_TEXT: Record<string, string> = {
  clear: 'text-emerald-400', light: 'text-yellow-300', moderate: 'text-orange-400',
  heavy: 'text-red-400', standstill: 'text-red-500',
};

export default function Home() {
  const [trafficSummary, setTrafficSummary] = useState<TrafficSummary | null>(null);

  useEffect(() => {
    fetch('/api/traffic?summary=true')
      .then(r => r.ok ? r.json() : null)
      .then(setTrafficSummary)
      .catch(() => null);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#0F172A] overflow-x-hidden">

      {/* ===== HERO — pastel light ===== */}
      <section className="relative min-h-[95vh] flex items-center justify-center pt-20 overflow-hidden bg-gradient-to-br from-rose-50 via-white to-slate-50">
        {/* Very faint background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/10070972/pexels-photo-10070972.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
            alt="Kapaleeshwarar Temple Chennai"
            className="w-full h-full object-cover opacity-[0.06] select-none pointer-events-none"
            style={{ filter: 'sepia(0.2) saturate(0.5) brightness(1.2)' }}
            loading="eager"
          />
        </div>
        {/* Soft gradient overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-rose-50/80 via-white/60 to-white/90" />
        {/* Decorative blobs */}
        <div className="absolute top-24 right-[10%] w-96 h-96 bg-rose-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-16 left-[5%] w-72 h-72 bg-pink-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="hero-dots absolute inset-0 opacity-[0.06]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center text-center mt-12">
          {/* Live badge */}
          <div className="animate-fade-in-down inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F43F5E]/10 border border-[#F43F5E]/20 text-[#F43F5E] text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F43F5E] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F43F5E]" />
            </span>
            Live traffic data
          </div>

          <h1 className="animate-fade-in-up text-6xl md:text-8xl font-black tracking-tighter leading-[1.05] mb-6 text-[#0F172A]">
            Your weekend.<br />
            <span className="text-[#F43F5E]">Zero traffic.</span>
          </h1>

          <p className="animate-fade-in-up text-lg md:text-xl text-slate-500 max-w-2xl mb-12 font-medium leading-relaxed" style={{ animationDelay: '0.1s' }}>
            64 handpicked Chennai spots, ordered around live OMR/ECR traffic. Pick your escape and start time — we sequence the rest.
          </p>

          {/* CTA */}
          <div className="animate-fade-in-up flex flex-col sm:flex-row items-center gap-5 mb-16" style={{ animationDelay: '0.2s' }}>
            <Link
              href="/plan"
              className="group px-8 py-4 rounded-full bg-[#F43F5E] text-white font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_8px_30px_rgba(244,63,94,0.35)] btn-shine chip-press"
            >
              <span className="flex items-center gap-2">
                Start Planning
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </span>
            </Link>
            <span className="text-slate-400 text-sm">Free · No account needed</span>
          </div>

          {/* Stats bar */}
          <div className="animate-fade-in-up w-full max-w-3xl grid grid-cols-3 divide-x divide-slate-200 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" style={{ animationDelay: '0.35s' }}>
            <div className="px-4 py-5 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-[#0F172A]">64+</span>
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Handpicked spots</span>
            </div>
            <div className="px-4 py-5 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-[#F43F5E] flex justify-center">
                <svg viewBox="0 0 256 256" className="w-8 h-8 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M234.35,129,53.34,50a8,8,0,0,0-10.15,10.15L80,128,43.19,196A8,8,0,0,0,50,208a8.22,8.22,0,0,0,3.34-.73l181-79A8,8,0,0,0,234.35,129Z" />
                </svg>
              </span>
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Traffic-aware routing</span>
            </div>
            <div className="px-4 py-5 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-[#0F172A]">0₹</span>
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">No sign-up</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PHOTO MARQUEE ===== */}
      <section className="relative py-12 border-y border-slate-100 bg-white overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        <div className="marquee-container">
          <div className="marquee-track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((p, i) => (
              <div key={i} className="flex-shrink-0 w-72 h-40 rounded-2xl overflow-hidden mx-3 group relative cursor-pointer shadow-md">
                <img
                  src={p.src}
                  alt={p.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    t.src = `https://placehold.co/600x300/1E293B/F43F5E?text=${encodeURIComponent(p.label)}`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 font-bold text-white text-base">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WEATHER + TRAFFIC — indigo-violet band ===== */}
      <section className="relative py-10 px-6 bg-gradient-to-br from-violet-950 via-indigo-950 to-purple-900 overflow-hidden">
        {/* Subtle glow orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Weather */}
            <WeatherWidget />

            {/* Traffic */}
            {(() => {
              const sorted = trafficSummary
                ? [...trafficSummary.corridors]
                    .sort((a, b) => (SEVERITY_ORDER[b.severity] ?? 0) - (SEVERITY_ORDER[a.severity] ?? 0))
                    .slice(0, 3)
                : null;
              const worst = sorted?.[0];

              const TRAFFIC_ACCENT: Record<string, { text: string; bg: string; glow: string }> = {
                clear:      { text: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: 'shadow-[0_0_30px_rgba(52,211,153,0.12)]' },
                light:      { text: 'text-yellow-300',  bg: 'bg-yellow-500/10',  glow: 'shadow-[0_0_30px_rgba(251,191,36,0.12)]' },
                moderate:   { text: 'text-orange-400',  bg: 'bg-orange-500/10',  glow: 'shadow-[0_0_30px_rgba(249,115,22,0.12)]' },
                heavy:      { text: 'text-red-400',     bg: 'bg-red-500/10',     glow: 'shadow-[0_0_30px_rgba(239,68,68,0.12)]' },
                standstill: { text: 'text-red-500',     bg: 'bg-red-700/10',     glow: 'shadow-[0_0_30px_rgba(185,28,28,0.12)]' },
              };
              const accent = TRAFFIC_ACCENT[trafficSummary?.overall ?? 'clear'];

              return (
                <div className={`relative rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-md p-4 overflow-hidden ${accent.glow}`}>
                  <div className={`absolute inset-0 ${accent.bg} pointer-events-none`} />

                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F43F5E] opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F43F5E]" />
                        </span>
                        Road conditions
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${trafficSummary?.isLive ? 'text-emerald-400' : 'text-slate-600'}`}>
                        {trafficSummary ? (trafficSummary.isLive ? 'Live' : 'Est.') : '—'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <div className={`flex-shrink-0 ${accent.text}`}>
                        <svg viewBox="0 0 64 64" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="22" y="8" width="20" height="34" rx="4" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="32" cy="18" r="4" fill="currentColor" opacity="0.5"/>
                          <circle cx="32" cy="30" r="4" fill="currentColor" opacity="0.5"/>
                          <circle cx="32" cy="42" r="4" fill={
                            (trafficSummary?.overall ?? 'clear') === 'clear' ? '#34D399' :
                            (trafficSummary?.overall ?? 'clear') === 'light' ? '#FBBF24' :
                            (trafficSummary?.overall ?? 'clear') === 'moderate' ? '#F97316' : '#EF4444'
                          } opacity="0.9"/>
                          <line x1="20" y1="54" x2="44" y2="54" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.3"/>
                        </svg>
                      </div>
                      <div>
                        <div className={`text-3xl font-black leading-none ${trafficSummary ? accent.text : 'text-slate-600'}`}>
                          {trafficSummary ? SEVERITY_LABEL[trafficSummary.overall] : '—'}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {worst ? `Worst: ${worst.name}` : 'Checking corridors…'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-1.5">
                      {sorted ? sorted.map(c => (
                        <div key={c.name} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/5">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${SEVERITY_DOT[c.severity]}`} />
                          <span className="text-sm text-slate-300 flex-1 font-medium">{c.name}</span>
                          <span className={`text-xs font-bold ${SEVERITY_TEXT[c.severity]}`}>{SEVERITY_LABEL[c.severity]}</span>
                          {c.avgDelay > 0 && <span className="text-[11px] text-slate-600">+{c.avgDelay}m</span>}
                        </div>
                      )) : ['OMR', 'ECR', 'T. Nagar'].map(name => (
                        <div key={name} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/5 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-white/10 flex-shrink-0" />
                          <span className="text-sm text-slate-700 flex-1">{name}</span>
                        </div>
                      ))}
                    </div>

                    {trafficSummary && (trafficSummary.overall === 'heavy' || trafficSummary.overall === 'standstill') && (
                      <div className="mt-3 px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/></svg>
                        Heavy congestion — plan to leave before 8 AM or after 8 PM
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* ===== CHOOSE YOUR ESCAPE — centered ===== */}
      <section id="templates" className="py-24 px-6 max-w-screen-xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#F43F5E] mb-4">Chennai · Weekend Discovery</p>
          <h2 className="font-playfair text-5xl md:text-6xl font-black tracking-tight text-[#0F172A] mb-4">
            Choose Your Escape.
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">Six ways to spend your Chennai weekend, each timed around traffic corridors.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {TEMPLATES.map((t) => (
            <Link
              key={t.title}
              href={`/plan?vibes=${t.vibes}&categories=${t.categories}`}
              className="group relative aspect-[2/3] rounded-3xl overflow-hidden cursor-pointer"
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/50 to-transparent" />
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#F43F5E]/50 rounded-3xl transition-colors duration-300" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white">{t.tag}</span>
                    <span className="text-slate-300 text-xs">{t.hours}</span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">{t.title}</h3>
                  <p className="text-slate-300 text-sm line-clamp-2">{t.desc}</p>
                  <div className="mt-3 flex items-center text-xs font-bold text-[#F43F5E] opacity-0 group-hover:opacity-100 transition-opacity">
                    Plan this
                    <svg className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== SAMPLE PLAN PREVIEW ===== */}
      <section id="preview" className="py-24 relative overflow-hidden bg-slate-50 border-y border-slate-100">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#F43F5E]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#F43F5E]/10 text-[#F43F5E] mb-6 border border-[#F43F5E]/20">
              <svg viewBox="0 0 256 256" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M208,104a32.06,32.06,0,0,0-30.56,22.62L142,112.32A48.09,48.09,0,0,0,96,72.57V55.43a32,32,0,1,0-16,0V72.57a48,48,0,0,0,0,110.86v17.14a32,32,0,1,0,16,0V183.43A48.09,48.09,0,0,0,142,143.68l35.44-14.3A32,32,0,1,0,208,104ZM72,40a16,16,0,1,1,16,16A16,16,0,0,1,72,40Zm32,176a16,16,0,1,1-16-16A16,16,0,0,1,104,216Zm24-48a32,32,0,1,1,32-32A32,32,0,0,1,128,168Zm80-48a16,16,0,1,1,16-16A16,16,0,0,1,208,120Z" />
              </svg>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#0F172A] mb-6">Ordered by geography, not guesswork.</h2>
            <p className="text-slate-500 text-lg mb-8 leading-relaxed">
              Stops are sequenced to cut across Chennai efficiently — accounting for travel time, parking, and when each corridor gets heavy.
            </p>
            <ul className="space-y-4 mb-10">
              {[
                { title: 'Parking buffer', desc: 'Adds 15–30 min at busy spots like Besant Nagar Beach or Marina.' },
                { title: 'Heat scheduling', desc: 'Moves outdoor stops earlier when afternoon temps climb past 35°C.' },
              ].map(item => (
                <li key={item.title} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-[#F43F5E] mt-1 flex-shrink-0">
                    <svg viewBox="0 0 256 256" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F172A]">{item.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/plan" className="inline-flex items-center gap-2 text-[#F43F5E] font-bold hover:text-[#E11D48] transition-colors">
              Plan my weekend
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>

          {/* Itinerary card — kept dark as product mockup */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="w-full max-w-lg bg-[#0F172A] border border-white/10 p-6 rounded-3xl relative shadow-2xl">
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Saturday: ECR Day</h3>
                  <p className="text-xs text-slate-400 mt-1">3 stops · 21 km · leave by 8:45 AM</p>
                </div>
                <span className="px-3 py-1 bg-[#F43F5E]/20 text-[#FB7185] text-xs font-bold rounded-full border border-[#F43F5E]/30">Traffic-timed</span>
              </div>
              <div className="relative pl-6 space-y-8">
                <div className="absolute left-[27px] top-4 bottom-8 w-[2px] bg-white/10" />
                <div className="relative">
                  <div className="absolute -left-[30px] top-1 w-3 h-3 rounded-full bg-white border-2 border-[#0F172A] z-10" />
                  <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">09:00 AM · Breakfast</div>
                  <div className="bg-white/[0.06] rounded-2xl p-3 border border-white/5 flex gap-4 items-center">
                    <img src="/api/photo?q=Murugan+Idli+Shop+Chennai" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" alt="Murugan Idli Shop" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/64x64/1E293B/F43F5E?text=M'; }} />
                    <div><h4 className="font-bold text-white text-base">Murugan Idli Shop</h4><p className="text-xs text-slate-400 mt-1">Besant Nagar · ★ 4.8</p></div>
                  </div>
                </div>
                <div className="relative -left-[45px] py-2 flex items-center gap-3 z-10">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0" /><span className="text-yellow-400 font-medium">35 min · Moderate on OMR</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[30px] top-1 w-3 h-3 rounded-full bg-white border-2 border-[#0F172A] z-10" />
                  <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">10:45 AM · Museum</div>
                  <div className="bg-white/[0.06] rounded-2xl p-3 border border-white/5 flex gap-4 items-center">
                    <img src="/api/photo?q=DakshinaChitra+Museum+Chennai" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" alt="DakshinaChitra" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/64x64/1E293B/F43F5E?text=D'; }} />
                    <div><h4 className="font-bold text-white text-base">DakshinaChitra Museum</h4><p className="text-xs text-slate-400 mt-1">ECR · ★ 4.9 · ~2 hrs</p></div>
                  </div>
                </div>
                <div className="relative -left-[45px] py-2 flex items-center gap-3 z-10">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" /><span className="text-green-400 font-medium">15 min · Clear to Kovalam</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[30px] top-1 w-3 h-3 rounded-full bg-white border-2 border-[#0F172A] z-10" />
                  <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">01:00 PM · Lunch</div>
                  <div className="bg-white/[0.06] rounded-2xl p-3 border border-white/5 flex gap-4 items-center">
                    <img src="/api/photo?q=Covelong+Beach+Chennai" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" alt="Covelong Beach" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/64x64/1E293B/F43F5E?text=C'; }} />
                    <div><h4 className="font-bold text-white text-base">Surf Turf & Cafe</h4><p className="text-xs text-slate-400 mt-1">Kovalam Beach · ★ 4.6</p></div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#0F172A] to-transparent rounded-b-3xl pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS — rose-tinted ===== */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#0F172A] mb-4">How it works.</h2>
            <p className="text-slate-500 text-base max-w-md mx-auto">Three steps from idea to navigation link.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-[#F43F5E]/30 to-transparent" />

            {[
              {
                n: '1', title: 'Pick your day',
                body: 'Choose your area in Chennai, how long you have, and what kind of day you want.',
                icon: <path d="M40,88H73a32,32,0,0,0,62,0H216a8,8,0,0,0,0-16H135a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16Zm64-24A16,16,0,1,1,88,80,16,16,0,0,1,104,64ZM216,168H183a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16H121a32,32,0,0,0,62,0h33a8,8,0,0,0,0-16Zm-64,24a16,16,0,1,1,16-16A16,16,0,0,1,152,192Z" />,
              },
              {
                n: '2', title: 'We sort the route',
                body: 'Stops are ordered around live traffic on OMR, ECR, and Adyar. We tell you when to leave.',
                icon: <path d="M216,64H176V40a8,8,0,0,0-16,0V64H96V40a8,8,0,0,0-16,0V64H40A16,16,0,0,0,24,80V192a16,16,0,0,0,16,16H80v24a8,8,0,0,0,16,0V208h64v24a8,8,0,0,0,16,0V208h40a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm0,128H40V80H216V192ZM80,112a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,112Zm0,40a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,152Z" />,
              },
              {
                n: '3', title: 'Navigate and go',
                body: 'One multi-stop Google Maps link, ready on your phone. Turn the key and go.',
                icon: <path d="M231.87,114l-168-95.89A16,16,0,0,0,40.92,37.34L71.55,128,40.92,218.67A16,16,0,0,0,56,240a16.15,16.15,0,0,0,7.93-2.1l167.94-96.05a16,16,0,0,0,0-27.89ZM56,224a.56.56,0,0,0,0-.12L85.74,136H144a8,8,0,0,0,0-16H85.74L56.06,32.16A.46.46,0,0,0,56,32l168,95.82Z" />,
              },
            ].map((step) => (
              <div key={step.n} className="relative flex flex-col items-center text-center">
                <div className="absolute -top-12 -left-4 text-[150px] font-black text-[#0F172A] leading-none select-none z-0">{step.n}</div>
                <div className="w-20 h-20 rounded-2xl bg-white border border-rose-200 shadow-md flex items-center justify-center mb-6 relative z-10">
                  <svg viewBox="0 0 256 256" className="w-8 h-8 text-[#F43F5E] fill-current" xmlns="http://www.w3.org/2000/svg">
                    {step.icon}
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] mb-3 relative z-10">{step.title}</h3>
                <p className="text-slate-500 text-sm max-w-xs relative z-10">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA BANNER ===== */}
      <section className="py-12 px-6 pb-24 bg-white">
        <div className="max-w-6xl mx-auto bg-[#0F172A] rounded-[3rem] p-12 md:p-20 relative overflow-hidden flex flex-col items-center text-center border border-white/5 shadow-2xl">
          <img
            src="https://images.pexels.com/photos/1212600/pexels-photo-1212600.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop"
            alt="Chennai ECR sunset"
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-transparent" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-tight">
              Stop deciding.<br />Start going.
            </h2>
            <p className="text-lg text-slate-300 mb-10">Pick your spots, we handle the order. No account, no cost.</p>
            <Link
              href="/plan"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-[#F43F5E] hover:bg-[#E11D48] text-white font-bold text-lg transition-all shadow-[0_0_40px_rgba(244,63,94,0.3)] hover:shadow-[0_0_60px_rgba(244,63,94,0.5)] hover:-translate-y-1 w-full sm:w-auto btn-shine chip-press"
            >
              Start Planning
            </Link>
            <p className="text-slate-500 text-sm mt-6">Free · No account needed</p>
          </div>
        </div>
      </section>

    </div>
  );
}
