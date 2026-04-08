'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#1B4965] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FFB703] flex items-center justify-center">
                <span className="text-[#1B4965] font-black text-xl">W</span>
              </div>
              <div>
                <p className="font-bold text-lg">Weekendaa</p>
                <p className="text-white/40 text-xs tracking-widest">CHENNAI</p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              The free weekend planner built for people who LIVE in Chennai.
              Real-time traffic intelligence so you enjoy more, commute less.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="font-semibold text-white/80 text-sm uppercase tracking-wider mb-4">Navigate</p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'Plan Weekend', href: '/plan' },
                { label: 'Explore Places', href: '/explore' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/50 hover:text-[#FFB703] text-sm transition-colors w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="font-semibold text-white/80 text-sm uppercase tracking-wider mb-4">Share the love</p>
            <p className="text-white/60 text-sm mb-3">
              Tag your weekend plans with
            </p>
            <span className="inline-block px-4 py-2 bg-[#FFB703]/10 border border-[#FFB703]/30 rounded-lg text-[#FFB703] font-bold text-sm">
              #WeekendaaChennai
            </span>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">Made with love for Chennai</p>
          <p className="text-white/30 text-xs">Plan smart. Dodge traffic. Enjoy Chennai.</p>
        </div>
      </div>
    </footer>
  );
}
