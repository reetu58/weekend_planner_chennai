'use client';

import Link from 'next/link';

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'Plan', href: '/plan' },
  { label: 'Explore', href: '/explore' },
];

export default function Footer() {
  return (
    <footer
      className="w-full py-12"
      style={{ backgroundColor: '#1B4965' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6 text-center">
        {/* Brand */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-white text-xl font-bold tracking-tight">
            Weekendaa
          </span>
          <span className="text-white/50 text-xs">வாரயிறுதி</span>
        </div>

        {/* Taglines */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-white/90 text-sm font-medium">
            Built for Chennai. Share with your gang →{' '}
            <span className="font-bold text-[#FFB703]">#WeekendaaChennai</span>
          </p>
          <p className="text-white/70 text-sm italic">
            Plan smart. Dodge traffic. Enjoy Chennai.
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex items-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/60 hover:text-white text-sm transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="w-full max-w-xs border-t border-white/10" />

        {/* Credit */}
        <p className="text-white/50 text-xs">
          Made with ❤️ for Chennai
        </p>
      </div>
    </footer>
  );
}
