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
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#1B4965] to-[#2d7da8] text-white overflow-hidden">
        <div className="hero-pattern absolute inset-0" />
        <div className="relative max-w-3xl mx-auto text-center px-4 py-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white/70 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB703]" />
            Step 1 of 2
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Plan Your Weekend</h1>
          <p className="text-white/50 text-sm">Tell us what you&apos;re in the mood for. We&apos;ll handle the traffic.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40h1440V20c-240 15-480 22-720 15S240 10 0 25v15z" fill="#FAF7F2"/></svg>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <PreferenceBuilder onGenerate={handleGenerate} isGenerating={isGenerating} />
      </div>
    </div>
  );
}
