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
          DEFAULT: "#1B4965",
          light: "#2d7da8",
          dark: "#123347",
          50: "#f0f7fb",
          100: "#dbedf5",
          200: "#b8dcea",
          300: "#85c3db",
          400: "#4ba5c7",
          500: "#2d7da8",
          600: "#1B4965",
          700: "#163c54",
          800: "#123347",
          900: "#0e2838",
        },
        accent: {
          DEFAULT: "#FFB703",
          light: "#ffc733",
          dark: "#e5a503",
          50: "#fffbeb",
          100: "#fff3c6",
          200: "#ffe588",
          300: "#ffd24a",
          400: "#FFB703",
          500: "#f59e0b",
          600: "#d97706",
        },
        alert: "#FB8500",
        success: "#2D6A4F",
        danger: "#E24B4A",
        warning: "#EF9F27",
        sand: {
          DEFAULT: "#FAF7F2",
          dark: "#f0ebe3",
          light: "#FDFCFA",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "DM Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(27, 73, 101, 0.06)',
        'card': '0 4px 16px -4px rgba(27, 73, 101, 0.08)',
        'card-hover': '0 20px 50px -12px rgba(27, 73, 101, 0.15)',
        'elevated': '0 8px 30px -8px rgba(27, 73, 101, 0.12)',
        'glow-accent': '0 4px 20px -4px rgba(255, 183, 3, 0.35)',
        'glow-primary': '0 4px 20px -4px rgba(27, 73, 101, 0.3)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(27, 73, 101, 0.04)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1B4965 0%, #2d7da8 100%)',
        'gradient-accent': 'linear-gradient(135deg, #FFB703 0%, #FB8500 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FFB703 0%, #FF8C42 100%)',
        'gradient-hero': 'linear-gradient(160deg, #1B4965 0%, #1B4965 40%, #2d7da8 100%)',
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
