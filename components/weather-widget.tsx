'use client';
import { useState, useEffect } from 'react';
import { WeatherData } from '../types';

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch('/api/weather');
        if (res.ok) {
          setWeather(await res.json());
        }
      } catch {
        setWeather({
          temperature: 32, condition: 'Partly cloudy', icon: '⛅',
          humidity: 70, rainChance: 20, windSpeed: 12, isLive: false,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100/80">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl shimmer-bg" />
          <div className="flex-1">
            <div className="h-8 w-24 shimmer-bg rounded-lg mb-2" />
            <div className="h-4 w-36 shimmer-bg rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100/80 card-lift">
      <div className="flex items-center gap-5 flex-wrap">
        {/* Weather icon with glow */}
        <div className="relative">
          <div className="absolute inset-0 text-5xl blur-md opacity-30">{weather.icon}</div>
          <span className="relative text-5xl block">{weather.icon}</span>
        </div>

        <div className="flex-1 min-w-[120px]">
          <div className="flex items-baseline gap-1">
            <p className="text-4xl font-bold text-[#1B4965]">{weather.temperature}</p>
            <span className="text-lg text-gray-300 font-light">°C</span>
          </div>
          <p className="text-gray-500 text-sm font-medium">{weather.condition}</p>
        </div>

        {/* Stats pills */}
        <div className="flex gap-2 text-sm flex-wrap">
          <span className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 rounded-xl text-blue-600 font-medium">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15z" /></svg>
            {weather.humidity}%
          </span>
          <span className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium ${
            weather.rainChance > 60 ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-500'
          }`}>
            🌧️ {weather.rainChance}%
          </span>
          <span className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-xl text-gray-500 font-medium">
            💨 {weather.windSpeed}
          </span>
        </div>
      </div>

      {/* Alerts */}
      {weather.rainChance > 60 && (
        <div className="mt-4 flex items-center gap-2 text-sm text-orange-700 bg-orange-50 rounded-xl px-4 py-2.5 border border-orange-100">
          <span className="text-base">🌧️</span>
          <span>High chance of rain — consider indoor activities!</span>
        </div>
      )}
      {weather.temperature > 38 && (
        <div className="mt-4 flex items-center gap-2 text-sm text-red-700 bg-red-50 rounded-xl px-4 py-2.5 border border-red-100">
          <span className="text-base">🔥</span>
          <span>Extreme heat — prefer indoor spots between 12-4 PM</span>
        </div>
      )}

      {/* Live indicator */}
      <div className="flex items-center gap-1.5 mt-3">
        <span className={`w-1.5 h-1.5 rounded-full ${weather.isLive ? 'bg-green-400' : 'bg-gray-300'}`} />
        <p className="text-xs text-gray-400">
          {weather.isLive ? 'Live weather' : 'Estimated'}
        </p>
      </div>
    </div>
  );
}
