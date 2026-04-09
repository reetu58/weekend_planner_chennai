'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PreferenceBuilder from '../../components/preference-builder';
import { UserPrefs } from '../../types';

export default function PlanPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleGenerate = async (prefs: UserPrefs) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      });
      if (res.ok) {
        const { id } = await res.json();
        router.push(`/itinerary/${id}`);
      } else {
        const encoded = btoa(JSON.stringify(prefs));
        router.push(`/itinerary/${encoded}`);
      }
    } catch {
      const encoded = btoa(JSON.stringify(prefs));
      router.push(`/itinerary/${encoded}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand">
      {/* Header */}
      <div className="relative bg-gradient-hero text-white overflow-hidden">
        <div className="hero-pattern absolute inset-0" />
        <div className="hero-dots absolute inset-0" />

        {/* Decorative orbs */}
        <div className="absolute top-10 right-[20%] w-40 h-40 bg-[#FFB703]/10 rounded-full blur-[60px]" />

        <div className="relative max-w-3xl mx-auto text-center px-4 pt-28 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/10 text-xs text-white/60 mb-5 animate-fade-in-down backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFB703] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FFB703]" />
            </span>
            Step 1 of 2
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3 animate-fade-in-up tracking-tight">Plan Your Weekend</h1>
          <p className="text-white/45 text-sm md:text-base animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Tell us what you&apos;re in the mood for. We&apos;ll handle the traffic.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40h1440V20c-240 15-480 22-720 15S240 10 0 25v15z" fill="#FAF7F2"/></svg>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <PreferenceBuilder onGenerate={handleGenerate} isGenerating={isGenerating} />
      </div>
    </div>
  );
}
