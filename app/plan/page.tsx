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
        setPlanError(data.error || 'Something went wrong. Try adjusting your choices.');
      }
    } catch {
      setPlanError('Could not connect. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-slate-50">
      {/* Decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[500px] h-[500px] -top-32 -right-32 bg-rose-100/60 rounded-full blur-[120px]" />
        <div className="absolute w-[400px] h-[400px] bottom-0 -left-20 bg-violet-100/40 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-32 pb-20">
        {/* Page heading */}
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#F43F5E] mb-3">Chennai · Weekend Discovery</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#0F172A] mb-3">
            Plan your escape.
          </h1>
          <p className="text-slate-500 text-base">
            Pick a date, tell us your vibe — we&apos;ll handle the route.
          </p>
        </div>

        {planError && (
          <div className="flex items-start gap-3 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-600 mb-0.5">Couldn&apos;t build this plan</p>
              <p className="text-sm text-red-500">{planError}</p>
            </div>
          </div>
        )}

        <PreferenceBuilder onGenerate={handleGenerate} isGenerating={isGenerating} />
      </div>
    </div>
  );
}
