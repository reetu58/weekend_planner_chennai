'use client';

import { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Plan', href: '/plan' },
  { label: 'Explore', href: '/explore' },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{ backgroundColor: '#1B4965' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-tight group">
            <span className="text-white text-xl font-bold tracking-tight group-hover:opacity-90 transition-opacity">
              Weekendaa
            </span>
            <span className="text-white/60 text-xs font-light tracking-wide">
              வாரயிறுதி
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-white text-sm font-medium transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Hamburger button (mobile) */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span
              className={`block h-0.5 w-5 bg-white rounded transition-transform duration-200 ${
                menuOpen ? 'translate-y-2 rotate-45' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-white rounded transition-opacity duration-200 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-white rounded transition-transform duration-200 ${
                menuOpen ? '-translate-y-2 -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t border-white/10"
          style={{ backgroundColor: '#1B4965' }}
        >
          <div className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-white text-sm font-medium py-2 px-2 rounded hover:bg-white/10 transition-colors duration-150"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
