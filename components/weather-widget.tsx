'use client';
import { useState, useEffect } from 'react';
import { WeatherData } from '../types';

function WeatherIcon({ condition, className }: { condition: string; className?: string }) {
  const c = condition.toLowerCase();
  if (c.includes('rain') || c.includes('shower') || c.includes('drizzle')) {
    return (
      <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M48 28a16 16 0 10-31.2 4.8A12 12 0 1016 56h32a12 12 0 003.2-23.6A16 16 0 0048 28z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2"/>
        <line x1="24" y1="52" x2="20" y2="60" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="32" y1="52" x2="28" y2="60" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="40" y1="52" x2="36" y2="60" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    );
  }
  if (c.includes('cloud') || c.includes('overcast') || c.includes('fog') || c.includes('mist') || c.includes('haze')) {
    return (
      <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="30" r="10" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2"/>
        <path d="M46 36a10 10 0 10-20 0" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2"/>
        <rect x="10" y="34" width="42" height="14" rx="7" fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="2"/>
      </svg>
    );
  }
  if (c.includes('thunder') || c.includes('storm')) {
    return (
      <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M48 24a16 16 0 10-31.2 4.8A12 12 0 1016 52h32a12 12 0 003.2-23.6A16 16 0 0048 24z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2"/>
        <path d="M33 34l-6 12h5l-3 8 10-14h-6l4-6h-4z" fill="#FBBF24" stroke="#FBBF24" strokeWidth="0.5" strokeLinejoin="round"/>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="12" fill="currentColor" opacity="0.9"/>
      <line x1="32" y1="8" x2="32" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="32" y1="50" x2="32" y2="56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="8" y1="32" x2="14" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="50" y1="32" x2="56" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="15.5" y1="15.5" x2="19.7" y2="19.7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="44.3" y1="44.3" x2="48.5" y2="48.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="48.5" y1="15.5" x2="44.3" y2="19.7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="19.7" y1="44.3" x2="15.5" y2="48.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

function getWeatherAccent(condition: string, temp: number): { text: string; bg: string; glow: string } {
  const c = condition.toLowerCase();
  if (c.includes('rain') || c.includes('shower') || c.includes('drizzle'))
    return { text: 'text-blue-400', bg: 'bg-blue-500/10', glow: 'shadow-[0_0_30px_rgba(96,165,250,0.15)]' };
  if (c.includes('thunder') || c.includes('storm'))
    return { text: 'text-purple-400', bg: 'bg-purple-500/10', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]' };
  if (c.includes('cloud') || c.includes('overcast') || c.includes('fog') || c.includes('mist') || c.includes('haze'))
    return { text: 'text-slate-300', bg: 'bg-slate-500/10', glow: 'shadow-[0_0_20px_rgba(148,163,184,0.1)]' };
  if (temp >= 38)
    return { text: 'text-red-400', bg: 'bg-red-500/10', glow: 'shadow-[0_0_30px_rgba(239,68,68,0.15)]' };
  return { text: 'text-yellow-400', bg: 'bg-yellow-500/10', glow: 'shadow-[0_0_30px_rgba(251,191,36,0.15)]' };
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/weather')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setWeather(d); })
      .catch(() => setWeather({
        temperature: 32, condition: 'Partly cloudy', icon: '⛅',
        humidity: 70, rainChance: 20, windSpeed: 12, isLive: false,
      }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-md p-5 w-full h-full min-h-[140px] flex items-center justify-center">
        <span className="w-5 h-5 border-2 border-white/10 border-t-white/40 rounded-full animate-spin block" />
      </div>
    );
  }

  if (!weather) return null;

  const accent = getWeatherAccent(weather.condition, weather.temperature);

  return (
    <div className={`relative rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-md p-5 overflow-hidden ${accent.glow}`}>
      <div className={`absolute inset-0 ${accent.bg} pointer-events-none`} />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F43F5E] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F43F5E]" />
            </span>
            Chennai weather
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${weather.isLive ? 'text-emerald-400' : 'text-slate-600'}`}>
            {weather.isLive ? 'Live' : 'Est.'}
          </span>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div className={`${accent.text} flex-shrink-0`}>
            <WeatherIcon condition={weather.condition} className="w-14 h-14" />
          </div>
          <div>
            <div className="flex items-start">
              <span className="text-5xl font-black text-white leading-none">{weather.temperature}</span>
              <span className="text-xl text-white/40 font-light mt-1 ml-0.5">°C</span>
            </div>
            <p className="text-sm text-slate-400 mt-1">{weather.condition}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
            <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/>
            </svg>
            <span className="text-sm font-bold text-white">{weather.humidity}%</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wide">Humidity</span>
          </div>

          <div className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border ${weather.rainChance > 60 ? 'bg-blue-500/10 border-blue-500/20' : 'bg-white/[0.04] border-white/5'}`}>
            <svg className={`w-4 h-4 ${weather.rainChance > 60 ? 'text-blue-400' : 'text-slate-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="19" x2="8" y2="21"/><line x1="8" y1="13" x2="8" y2="15"/>
              <line x1="16" y1="19" x2="16" y2="21"/><line x1="16" y1="13" x2="16" y2="15"/>
              <line x1="12" y1="21" x2="12" y2="23"/><line x1="12" y1="15" x2="12" y2="17"/>
              <path d="M20 16.58A5 5 0 0018 7h-1.26A8 8 0 104 15.25"/>
            </svg>
            <span className={`text-sm font-bold ${weather.rainChance > 60 ? 'text-blue-300' : 'text-white'}`}>{weather.rainChance}%</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wide">Rain</span>
          </div>

          <div className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
            <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1114 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/>
            </svg>
            <span className="text-sm font-bold text-white">{weather.windSpeed}<span className="text-xs font-normal text-slate-500"> km/h</span></span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wide">Wind</span>
          </div>
        </div>

        {(weather.rainChance > 60 || weather.temperature > 38) && (
          <div className={`mt-3 px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 ${weather.temperature > 38 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
            <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/></svg>
            {weather.temperature > 38 ? 'Extreme heat — plan outdoor stops before noon' : 'Rain likely — consider indoor backups'}
          </div>
        )}
      </div>
    </div>
  );
}
