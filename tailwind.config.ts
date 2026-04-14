import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F172A",
          light: "#334155",
          dark: "#020617",
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        accent: {
          DEFAULT: "#F43F5E",
          light: "#FB7185",
          dark: "#E11D48",
          50: "#FFF1F2",
          100: "#FFE4E6",
          200: "#FECDD3",
          300: "#FDA4AF",
          400: "#FB7185",
          500: "#F43F5E",
          600: "#E11D48",
        },
        alert: "#E11D48",
        success: "#2D6A4F",
        danger: "#E24B4A",
        warning: "#EF9F27",
        sand: {
          DEFAULT: "#FAFAF9",
          dark: "#f0ebe3",
          light: "#FDFCFA",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "DM Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(15, 23, 42, 0.06)',
        'card': '0 4px 16px -4px rgba(15, 23, 42, 0.08)',
        'card-hover': '0 20px 50px -12px rgba(15, 23, 42, 0.15)',
        'elevated': '0 8px 30px -8px rgba(15, 23, 42, 0.12)',
        'glow-accent': '0 4px 20px -4px rgba(244, 63, 94, 0.35)',
        'glow-primary': '0 4px 20px -4px rgba(15, 23, 42, 0.3)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(15, 23, 42, 0.04)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0F172A 0%, #334155 100%)',
        'gradient-accent': 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
        'gradient-warm': 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
        'gradient-hero': 'linear-gradient(160deg, #0F172A 0%, #0F172A 40%, #334155 100%)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
      },
    },
  },
  plugins: [],
};
export default config;
