'use client';

import Link from 'next/link';

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'Plan Weekend', href: '/plan' },
  { label: 'Explore Places', href: '/explore' },
];

const features = ['Traffic-Smart', 'Zero Cost', 'No Sign-up', '65+ Places'];

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#0F172A] text-white overflow-hidden">
      {/* Top wave */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1440 40" fill="none" className="w-full">
          <path d="M0 0h1440v20c-240-15-480-20-720-12S240 28 0 12V0z" fill="#FAFAF9" />
        </svg>
      </div>

      {/* Decorative glow */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#F43F5E]/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 right-1/6 w-64 h-64 bg-[#334155]/10 rounded-full blur-[80px]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-[#F43F5E] flex items-center justify-center shadow-glow-accent">
                <span className="text-[#0F172A] font-black text-xl">W</span>
              </div>
              <div>
                <p className="font-bold text-xl tracking-tight">Weekendaa</p>
                <p className="text-white/30 text-xs tracking-[0.2em]">CHENNAI</p>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-6">
              The free weekend planner built for people who actually live in Chennai.
              Real-time traffic intelligence so you enjoy more, commute less.
            </p>
            <div className="flex flex-wrap gap-2">
              {features.map(f => (
                <span key={f} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-xs text-white/40 font-medium">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-3">
            <p className="font-semibold text-white/70 text-xs uppercase tracking-[0.15em] mb-5">Navigate</p>
            <div className="flex flex-col gap-3">
              {footerLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/40 hover:text-[#F43F5E] text-sm transition-colors duration-300 w-fit group flex items-center gap-2"
                >
                  <span className="w-0 group-hover:w-3 h-px bg-[#F43F5E] transition-all duration-300" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="md:col-span-4">
            <p className="font-semibold text-white/70 text-xs uppercase tracking-[0.15em] mb-5">Share the love</p>
            <p className="text-white/40 text-sm mb-4 leading-relaxed">
              Tag your weekend plans and let the city know you dodge traffic like a pro.
            </p>
            <div className="inline-flex items-center gap-2 px-5 py-3 bg-[#F43F5E]/8 border border-[#F43F5E]/20 rounded-xl text-[#F43F5E] font-bold text-sm hover:bg-[#F43F5E]/12 transition-colors cursor-default">
              <span className="text-base">#</span>
              WeekendaaChennai
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 mt-14 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs">Made with love for Chennai</p>
          <p className="text-white/25 text-xs">Plan smart. Dodge traffic. Enjoy Chennai.</p>
        </div>
      </div>
    </footer>
  );
}
