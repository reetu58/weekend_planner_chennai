'use client';
import Link from 'next/link';
import WeatherWidget from '../components/weather-widget';
import { useState, useEffect } from 'react';
import { TrafficSummary } from '../types';

const TEMPLATES = [
  { title: 'Beach Day', emoji: '🏖️', desc: 'Sun, sand & seafood', vibes: 'chill,nature', categories: 'beaches,street-food' },
  { title: 'Cafe Hopping', emoji: '☕', desc: 'Best brews in Chennai', vibes: 'chill,artsy', categories: 'cafes' },
  { title: 'Heritage Walk', emoji: '🛕', desc: 'Temples, history & culture', vibes: 'cultural', categories: 'temples-heritage,art-museums' },
  { title: 'Adventure Day', emoji: '🏄', desc: 'Thrills & excitement', vibes: 'adventure,social', categories: 'sports-fun' },
  { title: 'Foodie Trail', emoji: '🍜', desc: 'Eat your way through Chennai', vibes: 'foodie', categories: 'street-food,cafes' },
  { title: 'Photo Walk', emoji: '📸', desc: 'Capture Chennai\'s beauty', vibes: 'artsy,nature', categories: 'photography,temples-heritage' },
];

const SEVERITY_EMOJI: Record<string, string> = {
  clear: '🟢', light: '🟡', moderate: '🟠', heavy: '🔴', standstill: '⛔',
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
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1B4965] to-[#2d7da8] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-[#FFB703] font-medium mb-2">வாரயிறுதி</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Plan your Chennai weekend.<br />
            <span className="text-[#FFB703]">Dodge the traffic.</span> Zero cost.
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            The free weekend planner built for people who LIVE in Chennai.
            Real-time traffic intelligence so you spend time enjoying, not stuck in traffic.
          </p>
          <Link
            href="/plan"
            className="inline-block px-8 py-4 bg-[#FFB703] text-[#1B4965] text-lg font-bold rounded-full hover:bg-[#e5a503] transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            Plan My Weekend ✨
          </Link>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-10 space-y-8">
        {/* Weather */}
        <WeatherWidget />

        {/* Traffic Summary Strip */}
        {trafficSummary && (
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">
              Chennai traffic right now {trafficSummary.isLive ? '📡' : '📊'}
            </h3>
            <div className="flex flex-wrap gap-3">
              {trafficSummary.corridors.map((c) => (
                <span key={c.name} className="text-sm">
                  {SEVERITY_EMOJI[c.severity]} {c.name}
                  {c.avgDelay > 0 && <span className="text-gray-400 ml-1">(+{c.avgDelay}m)</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Quick Templates */}
        <section>
          <h2 className="text-2xl font-bold text-[#1B4965] mb-4">Quick Plans</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TEMPLATES.map((t) => (
              <Link
                key={t.title}
                href={`/plan?vibes=${t.vibes}&categories=${t.categories}`}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all hover:scale-105 border border-gray-100"
              >
                <span className="text-3xl mb-2 block">{t.emoji}</span>
                <h3 className="font-bold text-[#1B4965]">{t.title}</h3>
                <p className="text-sm text-gray-500">{t.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="pb-16">
          <h2 className="text-2xl font-bold text-[#1B4965] mb-6 text-center">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🎯', title: 'Pick your preferences', desc: 'Mood, budget, who\'s coming, where you\'re starting from' },
              { icon: '🚦', title: 'Get a traffic-smart plan', desc: 'We check live traffic and build a route that avoids jams' },
              { icon: '🎉', title: 'Go enjoy Chennai!', desc: 'Navigate stop by stop. Check traffic before heading out.' },
            ].map((s) => (
              <div key={s.title} className="text-center bg-white rounded-xl p-6 shadow-sm">
                <span className="text-4xl mb-3 block">{s.icon}</span>
                <h3 className="font-bold text-[#1B4965] mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
