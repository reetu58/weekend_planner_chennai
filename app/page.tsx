'use client';
import Link from 'next/link';
import WeatherWidget from '../components/weather-widget';
import { useState, useEffect } from 'react';
import { TrafficSummary } from '../types';

const TEMPLATES = [
  { title: 'Beach Day', emoji: '🏖️', desc: 'Sun, sand & seafood', vibes: 'chill,nature', categories: 'beaches,street-food', color: 'from-cyan-500 to-blue-600' },
  { title: 'Cafe Hopping', emoji: '☕', desc: 'Best brews in Chennai', vibes: 'chill,artsy', categories: 'cafes', color: 'from-amber-600 to-orange-700' },
  { title: 'Heritage Walk', emoji: '🛕', desc: 'Temples, history & culture', vibes: 'cultural', categories: 'temples-heritage,art-museums', color: 'from-orange-500 to-red-600' },
  { title: 'Adventure Day', emoji: '🏄', desc: 'Thrills & excitement', vibes: 'adventure,social', categories: 'sports-fun', color: 'from-emerald-500 to-teal-600' },
  { title: 'Foodie Trail', emoji: '🍜', desc: 'Eat your way through Chennai', vibes: 'foodie', categories: 'street-food,cafes', color: 'from-red-500 to-pink-600' },
  { title: 'Photo Walk', emoji: '📸', desc: 'Capture Chennai\'s beauty', vibes: 'artsy,nature', categories: 'photography,temples-heritage', color: 'from-violet-500 to-purple-600' },
];

const SEVERITY_EMOJI: Record<string, string> = {
  clear: '🟢', light: '🟡', moderate: '🟠', heavy: '🔴', standstill: '⛔',
};

const STATS = [
  { value: '65+', label: 'Places' },
  { value: '15', label: 'Categories' },
  { value: '100%', label: 'Free' },
  { value: 'Live', label: 'Traffic Data' },
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
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1B4965] via-[#1B4965] to-[#2d7da8] text-white overflow-hidden">
        <div className="hero-pattern absolute inset-0" />
        <div className="relative max-w-5xl mx-auto px-4 py-24 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-sm text-white/80 mb-6 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-[#FFB703] animate-pulse" />
              Free weekend planner for Chennai
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up leading-tight">
              Plan your weekend.
              <br />
              <span className="gradient-text">Dodge the traffic.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto animate-fade-in-up">
              65+ curated places, real-time traffic intelligence, and smart routing.
              Built for people who actually live in Chennai.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up">
              <Link
                href="/plan"
                className="px-8 py-4 bg-[#FFB703] text-[#1B4965] text-lg font-bold rounded-2xl hover:bg-[#e5a503] transition-all shadow-lg hover:shadow-xl hover:scale-105 animate-pulse-glow btn-shine"
              >
                Plan My Weekend
              </Link>
              <Link
                href="/explore"
                className="px-8 py-4 bg-white/10 text-white text-lg font-medium rounded-2xl hover:bg-white/20 transition-all border border-white/20"
              >
                Explore Places
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
              {STATS.map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-[#FFB703]">{s.value}</p>
                  <p className="text-xs text-white/40 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80h1440V40c-240 30-480 45-720 30S240 20 0 50v30z" fill="#FAF7F2"/>
          </svg>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 space-y-12 pb-16">
        {/* Weather + Traffic row */}
        <div className="grid md:grid-cols-2 gap-4 -mt-4">
          <WeatherWidget />
          {trafficSummary && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <h3 className="text-sm font-semibold text-gray-500">
                  Chennai Traffic {trafficSummary.isLive ? '(Live)' : '(Estimated)'}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {trafficSummary.corridors.map((c) => (
                  <span key={c.name} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-sm">
                    {SEVERITY_EMOJI[c.severity]} {c.name}
                    {c.avgDelay > 0 && <span className="text-gray-400">(+{c.avgDelay}m)</span>}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Templates */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1B4965]">Quick Plans</h2>
              <p className="text-gray-400 text-sm mt-1">One tap, instant itinerary</p>
            </div>
            <Link href="/explore" className="text-sm text-[#1B4965] font-medium hover:underline">
              View all places &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 stagger-children">
            {TEMPLATES.map((t) => (
              <Link
                key={t.title}
                href={`/plan?vibes=${t.vibes}&categories=${t.categories}`}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover"
              >
                <div className={`h-24 bg-gradient-to-br ${t.color} flex items-center justify-center`}>
                  <span className="text-5xl group-hover:scale-110 transition-transform animate-float">{t.emoji}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#1B4965]">{t.title}</h3>
                  <p className="text-sm text-gray-400 mt-0.5">{t.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1B4965] mb-2 text-center">How it works</h2>
          <p className="text-gray-400 text-center text-sm mb-8">Three steps. Zero cost. No sign-up.</p>
          <div className="grid md:grid-cols-3 gap-6 stagger-children">
            {[
              { step: '01', icon: '🎯', title: 'Set your preferences', desc: 'Pick your mood, budget, group size, starting location and date. We handle the rest.' },
              { step: '02', icon: '🚦', title: 'Get a traffic-smart plan', desc: 'Our engine checks real-time traffic, optimizes your route, and schedules every stop.' },
              { step: '03', icon: '🎉', title: 'Enjoy your weekend', desc: 'Navigate stop by stop with Google Maps integration. Share your plan with friends.' },
            ].map((s) => (
              <div key={s.step} className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover">
                <span className="text-5xl font-black text-gray-100 absolute top-4 right-4">{s.step}</span>
                <span className="text-3xl mb-4 block">{s.icon}</span>
                <h3 className="font-bold text-[#1B4965] text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-br from-[#1B4965] to-[#2d7da8] rounded-3xl p-12 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to plan your weekend?</h2>
          <p className="text-white/60 mb-8">No sign-up. No cost. Just great weekends.</p>
          <Link
            href="/plan"
            className="inline-block px-8 py-4 bg-[#FFB703] text-[#1B4965] text-lg font-bold rounded-2xl hover:bg-[#e5a503] transition-all shadow-lg hover:scale-105 btn-shine"
          >
            Get Started
          </Link>
        </section>
      </div>
    </div>
  );
}
