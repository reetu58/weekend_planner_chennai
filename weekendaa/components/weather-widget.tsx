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
      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 animate-pulse">
        <div className="h-12 w-32 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-48 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-5xl">{weather.icon}</span>
        <div>
          <p className="text-4xl font-bold text-[#1B4965]">{weather.temperature}°C</p>
          <p className="text-gray-600">{weather.condition}</p>
        </div>
        <div className="flex gap-4 text-sm text-gray-500 ml-auto">
          <span>💧 {weather.humidity}%</span>
          <span>🌧️ {weather.rainChance}%</span>
          <span>💨 {weather.windSpeed} km/h</span>
        </div>
      </div>
      {weather.rainChance > 60 && (
        <p className="mt-3 text-sm text-orange-600 bg-orange-50 rounded-lg px-3 py-2">
          🌧️ High chance of rain — consider indoor activities!
        </p>
      )}
      {weather.temperature > 38 && (
        <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          🔥 Extreme heat — prefer indoor spots between 12-4 PM
        </p>
      )}
      <p className="text-xs text-gray-400 mt-2">
        {weather.isLive ? '📡 Live weather' : '📊 Estimated'}
      </p>
    </div>
  );
}
