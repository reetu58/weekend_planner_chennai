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
        // Fallback: encode prefs in URL
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
      <div className="bg-gradient-to-br from-[#1B4965] to-[#2d7da8] text-white py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-[#FFB703] mb-1">வாரயிறுதி</p>
          <h1 className="text-3xl font-bold mb-2">Plan Your Weekend</h1>
          <p className="text-white/70">Tell us what you&apos;re in the mood for</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <PreferenceBuilder onGenerate={handleGenerate} isGenerating={isGenerating} />
      </div>
    </div>
  );
}
