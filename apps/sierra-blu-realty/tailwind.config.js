/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Sierra Estates Official Palette V2.1 — Beyond Brokerage
        gold: {
          50: '#FFFBF5',
          100: '#F5E070',
          300: '#E9C176',
          400: '#D4AF37',
          500: '#C8961A',
          600: '#A07820',
          DEFAULT: '#E9C176',
        },
        navy: {
          50: '#E0E8F0',
          100: '#0D2035',
          200: '#0A1520',
          300: '#071422',
          400: '#050D1E',
          DEFAULT: '#0D2035',
        },
        text: {
          light: '#EFF8F7',
          muted: 'rgba(239,248,247,0.78)',
          subtle: 'rgba(239,248,247,0.50)',
        },
        surface: {
          default: 'rgba(255,255,255,0.055)',
          hover: 'rgba(233,193,118,0.10)',
        },
        teal: {
          400: '#4ECDC4',
        },
        purple: {
          400: '#C084FC',
        },
      },
      // Brand families — authoritative source is the Tailwind v4 @theme
      // block in app/globals.css; kept in sync here. Faces self-hosted via
      // next/font (app/layout.tsx).
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
        display: ['var(--font-manrope)', 'Manrope', 'system-ui', 'sans-serif'],
        sans: ['var(--font-jost)', 'var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'DM Mono', 'ui-monospace', 'monospace'],
        arabic: ['var(--font-cairo)', 'Cairo', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['4rem', { lineHeight: '1.1', fontWeight: '300' }],
        'display-md': ['3rem', { lineHeight: '1.15', fontWeight: '300' }],
        'heading-lg': ['2rem', { lineHeight: '1.2', fontWeight: '600' }],
        'heading-md': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'label': ['0.75rem', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.05em' }],
      },
      spacing: {
        safe: 'max(1rem, env(safe-area-inset-left))',
        'safe-r': 'max(1rem, env(safe-area-inset-right))',
      },
      backgroundImage: {
        'gradient-subtle': 'linear-gradient(135deg, rgba(244, 240, 232, 0.1) 0%, rgba(30, 136, 217, 0.05) 100%)',
        'gradient-hero': 'linear-gradient(130deg, rgba(11, 35, 65, 0.97) 0%, rgba(13, 32, 53, 0.85) 45%, rgba(11, 35, 65, 0.4) 100%)',
      },
      boxShadow: {
        'luxury': '0 20px 60px rgba(0, 0, 0, 0.15)',
        'card': '0 8px 24px rgba(0, 0, 0, 0.08)',
        'sm-luxury': '0 4px 12px rgba(0, 0, 0, 0.06)',
      },
      blur: {
        xs: '2px',
      },
      opacity: {
        3: '0.03',
        8: '0.08',
      },
    },
  },
  plugins: [],
};
