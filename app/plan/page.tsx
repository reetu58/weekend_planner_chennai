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
    <div className="min-h-screen bg-sand">
      {/* Header with Chennai photo */}
      <div className="relative text-white overflow-hidden">
        {/* Background photo — Marina Beach */}
        <img
          src="https://images.pexels.com/photos/982673/pexels-photo-982673.jpeg?auto=compress&cs=tinysrgb&w=1920&h=600&fit=crop"
          alt="Chennai Beach"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/75 via-[#0F172A]/60 to-[#030712]/90" />
        <div className="hero-dots absolute inset-0 opacity-30" />

        <div className="relative max-w-3xl mx-auto text-center px-4 pt-28 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/10 text-xs text-white/60 mb-5 animate-fade-in-down backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F43F5E] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#F43F5E]" />
            </span>
            Step 1 of 2
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3 animate-fade-in-up tracking-tight">Plan Your Weekend</h1>
          <p className="text-white/45 text-sm md:text-base animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Tell us what you&apos;re in the mood for. We&apos;ll handle the traffic.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40h1440V20c-240 15-480 22-720 15S240 10 0 25v15z" fill="#FAFAF9"/></svg>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {planError && (
          <div className="flex items-start gap-3 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl mb-6 animate-fade-in">
            <span className="text-xl mt-0.5">🚫</span>
            <div>
              <p className="text-sm font-semibold text-red-700 mb-0.5">Can&apos;t build this plan</p>
              <p className="text-sm text-red-600">{planError}</p>
            </div>
          </div>
        )}
        <PreferenceBuilder onGenerate={handleGenerate} isGenerating={isGenerating} />
      </div>
    </div>
  );
}
