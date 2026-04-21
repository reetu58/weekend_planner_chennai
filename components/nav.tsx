'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Plan', href: '/plan' },
  { label: 'Escapes', href: '/mood' },
  { label: 'Explore', href: '/explore' },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'glass-dark shadow-lg'
        : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl bg-[#F43F5E] flex items-center justify-center shadow-md group-hover:shadow-glow-accent transition-all duration-300 group-hover:scale-105">
              <span className="text-[#0F172A] font-black text-lg">W</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-white text-lg font-bold tracking-tight">Weekendaa</span>
              <span className="text-white/30 text-[10px] font-light tracking-[0.2em]">CHENNAI</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  pathname === link.href
                    ? 'bg-white/15 text-white shadow-inner-soft'
                    : 'text-white/60 hover:text-white hover:bg-white/8'
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#F43F5E]" />
                )}
              </Link>
            ))}
            <Link
              href="/plan"
              className="ml-4 px-5 py-2 bg-[#F43F5E] text-white rounded-xl text-sm font-bold hover:bg-accent-light hover:shadow-glow-accent transition-all duration-300 btn-shine chip-press"
            >
              Plan Now
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-xl focus:outline-none hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0 scale-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-white rounded-full transition-all duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${
        menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="glass-dark border-t border-white/5">
          <div className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium py-3 px-4 rounded-xl transition-all duration-200 ${
                  pathname === link.href
                    ? 'bg-white/12 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/8'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/plan"
              className="mt-2 text-center py-3 bg-[#F43F5E] text-white rounded-xl text-sm font-bold hover:bg-accent-light transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Plan Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
