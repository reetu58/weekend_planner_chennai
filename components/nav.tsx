'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Plan', href: '/plan' },
  { label: 'Explore', href: '/explore' },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full glass-dark shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#FFB703] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <span className="text-[#1B4965] font-black text-lg">W</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-white text-lg font-bold tracking-tight">Weekendaa</span>
              <span className="text-white/40 text-[10px] font-light tracking-widest">CHENNAI</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? 'bg-white/15 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/plan"
              className="ml-3 px-5 py-2 bg-[#FFB703] text-[#1B4965] rounded-lg text-sm font-bold hover:bg-[#e5a503] transition-all btn-shine"
            >
              Plan Now
            </Link>
          </div>

          <button
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg focus:outline-none hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className={`block h-0.5 w-5 bg-white rounded transition-all duration-200 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-5 bg-white rounded transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-white rounded transition-all duration-200 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-white/10 glass-dark">
          <div className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium py-2.5 px-3 rounded-lg transition-all ${
                  pathname === link.href ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/plan"
              className="mt-2 text-center py-2.5 bg-[#FFB703] text-[#1B4965] rounded-lg text-sm font-bold"
              onClick={() => setMenuOpen(false)}
            >
              Plan Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
