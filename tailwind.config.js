/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      colors: {
        bg: {
          primary: '#080C18',
          secondary: '#0D1225',
          card: '#111827',
        },
        accent: {
          cyan: '#00D4FF',
          amber: '#F59E0B',
          violet: '#7C3AED',
        },
        brand: {
          text: '#F0F4FF',
          secondary: '#94A3B8',
          muted: '#4B5E7A',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-hero': 'linear-gradient(135deg, #080C18 0%, #0D1225 50%, #080C18 100%)',
        'gradient-cyan': 'linear-gradient(135deg, #00B4D8, #00D4FF)',
        'gradient-card': 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(124,58,237,0.08))',
      },
      animation: {
        'float': 'floatY 6s ease-in-out infinite',
        'float-delayed': 'floatY2 8s ease-in-out infinite -2s',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spinSlow 20s linear infinite',
        'shimmer': 'shimmer 4s linear infinite',
        'fade-up': 'fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
      },
      keyframes: {
        floatY: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        floatY2: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.5)' },
        },
        spinSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(32px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 40px rgba(0, 212, 255, 0.15)',
        'glow-amber': '0 0 40px rgba(245, 158, 11, 0.15)',
        'glow-violet': '0 0 40px rgba(124, 58, 237, 0.15)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 24px 60px rgba(0, 0, 0, 0.4)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};