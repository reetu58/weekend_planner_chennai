'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PreferenceBuilder from '../../components/preference-builder';
import { UserPrefs } from '../../types';

export default function PlanPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const router = useRouter();

  const handleGenerate = async (prefs: UserPrefs) => {
    setIsGenerating(true);
    setPlanError(null);
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
        const data = await res.json().catch(() => ({}));
        setPlanError(data.error || 'Something went wrong. Try adjusting your preferences.');
      }
    } catch {
      setPlanError('Could not connect to the server. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] -top-32 -right-32 bg-[#F43F5E]/8 rounded-full blur-[120px]" />
        <div className="absolute w-[500px] h-[500px] bottom-0 -left-20 bg-blue-500/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-32 pb-20">
        {/* Page heading */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white/95 mb-3">
            Curate your weekend.
          </h1>
          <p className="text-white/40 text-base">
            Define your parameters for the perfect Chennai experience.
          </p>
        </div>

        {planError && (
          <div className="flex items-start gap-3 px-5 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl mb-8 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-400 mb-0.5">Can&apos;t build this plan</p>
              <p className="text-sm text-red-400/70">{planError}</p>
            </div>
          </div>
        )}

        <PreferenceBuilder onGenerate={handleGenerate} isGenerating={isGenerating} />
      </div>
    </div>
  );
}
