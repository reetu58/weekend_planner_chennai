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

const SEVERITY_COLOR: Record<string, string> = {
  clear: 'bg-green-500', light: 'bg-yellow-400', moderate: 'bg-orange-500',
  heavy: 'bg-red-500', standstill: 'bg-red-700',
};
const SEVERITY_TEXT: Record<string, string> = {
  clear: 'text-green-400', light: 'text-yellow-400', moderate: 'text-orange-400',
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
    <div className="min-h-screen bg-[#0F172A] text-[#FAFAF9] overflow-x-hidden">

      {/* ===== HERO ===== */}
      <section className="relative min-h-[95vh] flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/10070972/pexels-photo-10070972.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
            alt="Kapaleeshwarar Temple Chennai"
            className="w-full h-full object-cover opacity-30 select-none pointer-events-none"
            style={{ filter: 'sepia(0.15) hue-rotate(10deg)' }}
            loading="eager"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0F172A]/90 via-[#0F172A]/60 to-[#0F172A]" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(244,63,94,0.10)_0%,transparent_70%)]" />
        <div className="hero-dots absolute inset-0 opacity-20" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center text-center mt-12">
          {/* Live badge */}
          <div className="animate-fade-in-down inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F43F5E]/10 border border-[#F43F5E]/30 text-[#FB7185] text-xs font-bold uppercase tracking-widest mb-8 shadow-[0_0_20px_rgba(244,63,94,0.15)] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FB7185] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F43F5E]" />
            </span>
            Live Traffic Integrated
          </div>

          <h1 className="animate-fade-in-up text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 tracking-tighter leading-[1.1] mb-6">
            Your weekend.<br />
            <span className="text-white">Zero traffic.</span>
          </h1>

          <p className="animate-fade-in-up text-lg md:text-xl text-slate-400 max-w-2xl mb-12 font-medium leading-relaxed" style={{ animationDelay: '0.1s' }}>
            We handpicked 64 of Chennai&apos;s best spots. Tell us your vibe, and our engine builds a flawless itinerary structured around live OMR/ECR traffic and city weather.
          </p>

          {/* CTA row with avatar social proof */}
          <div className="animate-fade-in-up flex flex-col sm:flex-row items-center gap-6 mb-16" style={{ animationDelay: '0.2s' }}>
            <Link
              href="/plan"
              className="group px-8 py-4 rounded-full bg-[#F43F5E] text-white font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(244,63,94,0.4)] btn-shine chip-press"
            >
              <span className="flex items-center gap-2">
                Start Planning
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </span>
            </Link>
            <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-[#0F172A]" src="https://i.pravatar.cc/100?img=12" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-[#0F172A]" src="https://i.pravatar.cc/100?img=33" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-[#0F172A]" src="https://i.pravatar.cc/100?img=47" alt="User" />
              </div>
              <span>No signup required.<br />Always free.</span>
            </div>
          </div>

          {/* Stats bar */}
          <div className="animate-fade-in-up w-full max-w-3xl grid grid-cols-3 gap-px bg-white/10 rounded-2xl p-px backdrop-blur-md overflow-hidden" style={{ animationDelay: '0.35s' }}>
            <div className="bg-[#0F172A]/80 px-4 py-4 backdrop-blur-xl flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-white">64+</span>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Curated Spots</span>
            </div>
            <div className="bg-[#0F172A]/80 px-4 py-4 backdrop-blur-xl flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-[#F43F5E] flex justify-center">
                {/* navigation arrow icon */}
                <svg viewBox="0 0 256 256" className="w-8 h-8 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M234.35,129,53.34,50a8,8,0,0,0-10.15,10.15L80,128,43.19,196A8,8,0,0,0,50,208a8.22,8.22,0,0,0,3.34-.73l181-79A8,8,0,0,0,234.35,129Z" />
                </svg>
              </span>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Smart Routing</span>
            </div>
            <div className="bg-[#0F172A]/80 px-4 py-4 backdrop-blur-xl flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-white">0₹</span>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Totally Free</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PHOTO MARQUEE ===== */}
      <section className="relative py-12 border-y border-white/5 bg-[#0A1120]/50 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0F172A] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0F172A] to-transparent z-10 pointer-events-none" />

        <div className="marquee-container">
          <div className="marquee-track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((p, i) => (
              <div key={i} className="flex-shrink-0 w-72 h-40 rounded-2xl overflow-hidden mx-3 group relative cursor-pointer">
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent" />
                <span className="absolute bottom-4 left-4 font-bold text-white text-lg">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WEATHER + TRAFFIC ===== */}
      <section className="relative -mt-8 z-20 max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          {/* Real weather widget in a glass wrapper */}
          <div className="rounded-2xl overflow-hidden border border-white/8 bg-white/[0.03] backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-1 w-full md:w-80">
            <WeatherWidget />
          </div>

          {/* Live traffic panel */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.2)] p-5 transition-transform hover:-translate-y-1 w-full md:w-80">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F43F5E] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F43F5E]" />
                </span>
                Traffic Monitor{trafficSummary && !trafficSummary.isLive ? ' (Est.)' : ''}
              </span>
              {trafficSummary ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {trafficSummary.corridors.slice(0, 3).map((c) => (
                    <span
                      key={c.name}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-white/10 bg-white/5 ${SEVERITY_TEXT[c.severity] ?? 'text-slate-300'}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${SEVERITY_COLOR[c.severity] ?? 'bg-slate-400'}`} />
                      {c.name}
                      {c.avgDelay > 0 && <span className="text-slate-500"> +{c.avgDelay}m</span>}
                    </span>
                  ))}
                  {trafficSummary.corridors.length === 0 && (
                    <span className="text-sm text-[#F43F5E] font-medium mt-0.5">All corridors clear</span>
                  )}
                </div>
              ) : (
                <div className="mt-2">
                  <div className="text-xl font-black text-white">OMR Segment</div>
                  <span className="text-sm text-[#F43F5E] font-medium mt-0.5 block">Checking live conditions…</span>
                </div>
              )}
            </div>
            <div className="mt-3 flex items-center justify-end">
              <svg viewBox="0 0 256 256" className="w-8 h-8 text-[#F43F5E] fill-current opacity-60" xmlns="http://www.w3.org/2000/svg">
                <path d="M232,104H184V56a8,8,0,0,0-8-8H80a8,8,0,0,0-8,8v48H24a8,8,0,0,0-8,8v80a8,8,0,0,0,8,8H64v16a8,8,0,0,0,16,0V200h96v16a8,8,0,0,0,16,0V200h40a8,8,0,0,0,8-8V112A8,8,0,0,0,232,104ZM88,64h80v40H88ZM224,184H32V120H224Z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ===== QUICK TEMPLATES ===== */}
      <section id="templates" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Choose your vibe.</h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">6 distinct flavors of Chennai, heavily curated. Select a template and let our engine map out the perfect timing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.map((t) => (
            <Link
              key={t.title}
              href={`/plan?vibes=${t.vibes}&categories=${t.categories}`}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer"
            >
              <img
                src={t.photo}
                alt={t.title}
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105${t.filter ? ` filter ${t.filter}` : ''}`}
                loading="lazy"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.src = `https://placehold.co/600x750/1E293B/F43F5E?text=${encodeURIComponent(t.title)}`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/60 to-transparent" />
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#F43F5E]/50 rounded-3xl transition-colors duration-300" />

              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white">{t.tag}</span>
                    <span className="text-slate-300 text-xs font-medium">
                      <svg className="inline w-3 h-3 mr-1 fill-current" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"/></svg>
                      {t.hours}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2">{t.title}</h3>
                  <p className="text-slate-300 text-sm line-clamp-2">{t.desc}</p>
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
      <section id="preview" className="py-24 relative overflow-hidden bg-[#1E293B]/30 border-y border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#F43F5E]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">

          {/* Copy — 5 cols */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#F43F5E]/20 text-[#F43F5E] mb-6 border border-[#F43F5E]/30">
              {/* git-merge icon */}
              <svg viewBox="0 0 256 256" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M208,104a32.06,32.06,0,0,0-30.56,22.62L142,112.32A48.09,48.09,0,0,0,96,72.57V55.43a32,32,0,1,0-16,0V72.57a48,48,0,0,0,0,110.86v17.14a32,32,0,1,0,16,0V183.43A48.09,48.09,0,0,0,142,143.68l35.44-14.3A32,32,0,1,0,208,104ZM72,40a16,16,0,1,1,16,16A16,16,0,0,1,72,40Zm32,176a16,16,0,1,1-16-16A16,16,0,0,1,104,216Zm24-48a32,32,0,1,1,32-32A32,32,0,0,1,128,168Zm80-48a16,16,0,1,1,16-16A16,16,0,0,1,208,120Z" />
              </svg>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Physics applied to your weekend.</h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              We don&apos;t just give you a list. We structure your day geographically. Our engine calculates travel times, predicts peak bottleneck hours at Adyar/Guindy, and suggests the exact time you need to leave.
            </p>

            <ul className="space-y-4 mb-10">
              {[
                { title: 'Dynamic Padding', desc: 'Automatically adds 15–30 minutes for parking at high-density spots.' },
                { title: 'Weather Avoidance', desc: 'Swaps outdoor spots for indoor alternatives if afternoon heat peaks above 35°C.' },
              ].map(item => (
                <li key={item.title} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/8 backdrop-blur-sm">
                  <div className="text-[#FB7185] mt-1 flex-shrink-0">
                    <svg viewBox="0 0 256 256" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{item.title}</h4>
                    <p className="text-sm text-slate-400 mt-1">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Link href="/plan" className="inline-flex items-center gap-2 text-[#F43F5E] font-bold hover:text-[#FB7185] transition-colors">
              Build my plan
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>

          {/* Itinerary card — 7 cols */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="w-full max-w-lg bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-6 rounded-3xl relative shadow-2xl">
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Saturday: ECR Flow</h3>
                  <p className="text-xs text-slate-400 mt-1">Nov 12 · 3 Stops · 21km Total</p>
                </div>
                <span className="px-3 py-1 bg-[#F43F5E] text-white text-xs font-bold rounded-full">Optimized</span>
              </div>

              <div className="relative pl-6 space-y-8">
                <div className="absolute left-[27px] top-4 bottom-8 w-[2px] bg-white/10" />

                {/* Stop 1 */}
                <div className="relative">
                  <div className="absolute -left-[30px] top-1 w-3 h-3 rounded-full bg-white border-2 border-[#0F172A] z-10" />
                  <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">09:00 AM · Breakfast</div>
                  <div className="bg-[#0F172A]/60 rounded-2xl p-3 border border-white/5 flex gap-4 items-center">
                    <img src="https://images.unsplash.com/photo-1544026266-9ef09ce818c6?auto=format&fit=crop&w=150&q=80" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" alt="Murugan Idli Shop" loading="lazy" />
                    <div>
                      <h4 className="font-bold text-white text-base">Murugan Idli Shop</h4>
                      <div className="flex items-center gap-1.5 text-xs text-yellow-500 mt-1">
                        <svg viewBox="0 0 256 256" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34l13.49-58.54-45.11-39.42a16,16,0,0,1,9.12-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0L191,82.43l59.44,5.16a16,16,0,0,1,9.11,28.79Z"/></svg>
                        4.8 <span className="text-slate-400 ml-1">· Besant Nagar</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Traffic leg */}
                <div className="relative -left-[45px] py-2 flex items-center gap-3 z-10">
                  <div className="w-8 h-8 rounded-full bg-[#0F172A] border border-white/10 flex items-center justify-center">
                    <svg viewBox="0 0 256 256" className="w-4 h-4 text-slate-300 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M240,120H229.2A104.2,104.2,0,0,0,136,26.8V16a8,8,0,0,0-16,0V26.8A104.2,104.2,0,0,0,26.8,120H16a8,8,0,0,0,0,16H26.8A104.2,104.2,0,0,0,120,229.2V240a8,8,0,0,0,16,0V229.2A104.2,104.2,0,0,0,229.2,136H240a8,8,0,0,0,0-16ZM128,216a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm0-144a56,56,0,1,0,56,56A56.06,56.06,0,0,0,128,72Zm0,96a40,40,0,1,1,40-40A40,40,0,0,1,128,168Zm0-64a24,24,0,1,0,24,24A24,24,0,0,0,128,104Z"/></svg>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span className="text-yellow-400 font-medium">35 min drive (Moderate Traffic)</span>
                  </div>
                </div>

                {/* Stop 2 */}
                <div className="relative">
                  <div className="absolute -left-[30px] top-1 w-3 h-3 rounded-full bg-white border-2 border-[#0F172A] z-10" />
                  <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">10:45 AM · Activity</div>
                  <div className="bg-[#0F172A]/60 rounded-2xl p-3 border border-white/5 flex gap-4 items-center">
                    <img src="https://images.unsplash.com/photo-1621508682046-609b5521b585?auto=format&fit=crop&w=150&q=80" className="w-16 h-16 rounded-xl object-cover flex-shrink-0 sepia-[.2]" alt="DakshinaChitra Museum" loading="lazy" />
                    <div>
                      <h4 className="font-bold text-white text-base">DakshinaChitra Museum</h4>
                      <div className="flex items-center gap-1.5 text-xs text-yellow-500 mt-1">
                        <svg viewBox="0 0 256 256" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34l13.49-58.54-45.11-39.42a16,16,0,0,1,9.12-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0L191,82.43l59.44,5.16a16,16,0,0,1,9.11,28.79Z"/></svg>
                        4.9 <span className="text-slate-400 ml-1">· 2 Hours recom.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Traffic leg */}
                <div className="relative -left-[45px] py-2 flex items-center gap-3 z-10">
                  <div className="w-8 h-8 rounded-full bg-[#0F172A] border border-white/10 flex items-center justify-center">
                    <svg viewBox="0 0 256 256" className="w-4 h-4 text-slate-300 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M240,120H229.2A104.2,104.2,0,0,0,136,26.8V16a8,8,0,0,0-16,0V26.8A104.2,104.2,0,0,0,26.8,120H16a8,8,0,0,0,0,16H26.8A104.2,104.2,0,0,0,120,229.2V240a8,8,0,0,0,16,0V229.2A104.2,104.2,0,0,0,229.2,136H240a8,8,0,0,0,0-16ZM128,216a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm0-144a56,56,0,1,0,56,56A56.06,56.06,0,0,0,128,72Zm0,96a40,40,0,1,1,40-40A40,40,0,0,1,128,168Zm0-64a24,24,0,1,0,24,24A24,24,0,0,0,128,104Z"/></svg>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-green-400 font-medium">15 min drive (Clear route)</span>
                  </div>
                </div>

                {/* Stop 3 */}
                <div className="relative">
                  <div className="absolute -left-[30px] top-1 w-3 h-3 rounded-full bg-white border-2 border-[#0F172A] z-10" />
                  <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">01:00 PM · Lunch</div>
                  <div className="bg-[#0F172A]/60 rounded-2xl p-3 border border-white/5 flex gap-4 items-center">
                    <img src="https://images.unsplash.com/photo-1590418386187-578aa0e7d0f9?auto=format&fit=crop&w=150&q=80" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" alt="Surf Turf Cafe" loading="lazy" />
                    <div>
                      <h4 className="font-bold text-white text-base">Surf Turf & Cafe</h4>
                      <div className="flex items-center gap-1.5 text-xs text-yellow-500 mt-1">
                        <svg viewBox="0 0 256 256" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34l13.49-58.54-45.11-39.42a16,16,0,0,1,9.12-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0L191,82.43l59.44,5.16a16,16,0,0,1,9.11,28.79Z"/></svg>
                        4.6 <span className="text-slate-400 ml-1">· Kovalam Beach</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#151f32] to-transparent rounded-b-3xl pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Three steps. Zero hassle.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-[#F43F5E]/30 to-transparent" />

          {/* Step 1 */}
          <div className="relative flex flex-col items-center text-center">
            <div className="absolute -top-12 -left-4 text-[150px] font-black text-white/[0.02] leading-none select-none z-0">1</div>
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10 flex items-center justify-center mb-6 relative z-10 shadow-xl">
              {/* faders / sliders icon */}
              <svg viewBox="0 0 256 256" className="w-8 h-8 text-[#F43F5E] fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M40,88H73a32,32,0,0,0,62,0H216a8,8,0,0,0,0-16H135a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16Zm64-24A16,16,0,1,1,88,80,16,16,0,0,1,104,64ZM216,168H183a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16H121a32,32,0,0,0,62,0h33a8,8,0,0,0,0-16Zm-64,24a16,16,0,1,1,16-16A16,16,0,0,1,152,192Z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Set Parameters</h3>
            <p className="text-slate-400 text-sm max-w-xs relative z-10">Select your base location, time available, and vibe (chill, active, food, culture).</p>
          </div>

          {/* Step 2 */}
          <div className="relative flex flex-col items-center text-center mt-8 md:mt-0">
            <div className="absolute -top-12 -left-4 text-[150px] font-black text-white/[0.02] leading-none select-none z-0">2</div>
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10 flex items-center justify-center mb-6 relative z-10 shadow-xl">
              {/* CPU icon */}
              <svg viewBox="0 0 256 256" className="w-8 h-8 text-[#F43F5E] fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M216,64H176V40a8,8,0,0,0-16,0V64H96V40a8,8,0,0,0-16,0V64H40A16,16,0,0,0,24,80V192a16,16,0,0,0,16,16H80v24a8,8,0,0,0,16,0V208h64v24a8,8,0,0,0,16,0V208h40a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64Zm0,128H40V80H216V192ZM80,112a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,112Zm0,40a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,152Z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Engine Computes</h3>
            <p className="text-slate-400 text-sm max-w-xs relative z-10">We match spots geographically and check live APIs for traffic bottlenecks and sudden rain.</p>
          </div>

          {/* Step 3 */}
          <div className="relative flex flex-col items-center text-center mt-8 md:mt-0">
            <div className="absolute -top-12 -left-4 text-[150px] font-black text-white/[0.02] leading-none select-none z-0">3</div>
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10 flex items-center justify-center mb-6 relative z-10 shadow-xl">
              {/* paper plane right icon */}
              <svg viewBox="0 0 256 256" className="w-8 h-8 text-[#F43F5E] fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M231.87,114l-168-95.89A16,16,0,0,0,40.92,37.34L71.55,128,40.92,218.67A16,16,0,0,0,56,240a16.15,16.15,0,0,0,7.93-2.1l167.94-96.05a16,16,0,0,0,0-27.89ZM56,224a.56.56,0,0,0,0-.12L85.74,136H144a8,8,0,0,0,0-16H85.74L56.06,32.16A.46.46,0,0,0,56,32l168,95.82Z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Drive & Enjoy</h3>
            <p className="text-slate-400 text-sm max-w-xs relative z-10">Get a clean Google Maps multi-stop link sent directly to your phone. Turn the key and go.</p>
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA BANNER ===== */}
      <section className="py-12 px-6 pb-24">
        <div className="max-w-6xl mx-auto bg-[#1E293B] rounded-[3rem] p-12 md:p-20 relative overflow-hidden flex flex-col items-center text-center border border-white/10 shadow-2xl">
          <img
            src="https://images.pexels.com/photos/1212600/pexels-photo-1212600.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop"
            alt="Chennai ECR sunset"
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-transparent" />

          <div className="relative z-10 max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-tight">
              Stop planning.<br />Start driving.
            </h2>
            <p className="text-xl text-slate-300 mb-10 font-medium">
              Break out of your usual routine this weekend. Let the engine build your perfect day out in Chennai.
            </p>
            <Link
              href="/plan"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-[#F43F5E] hover:bg-[#E11D48] text-white font-bold text-lg transition-all shadow-[0_0_40px_rgba(244,63,94,0.3)] hover:shadow-[0_0_60px_rgba(244,63,94,0.5)] hover:-translate-y-1 w-full sm:w-auto btn-shine chip-press"
            >
              Start Planning
            </Link>
            <p className="text-slate-400 text-sm mt-6">100% Free · No account needed</p>
          </div>
        </div>
      </section>

    </div>
  );
}
