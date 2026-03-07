/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: '#2d2d2d',
        input: '#2d2d2d',
        ring: '#FACC15',
        background: '#0a0a0a',
        foreground: '#fafafa',
        primary: {
          DEFAULT: '#FACC15',
          foreground: '#0a0a0a',
        },
        secondary: {
          DEFAULT: '#262626',
          foreground: '#fafafa',
        },
        muted: {
          DEFAULT: '#262626',
          foreground: '#a3a3a3',
        },
        accent: {
          DEFAULT: '#FACC15',
          foreground: '#0a0a0a',
        },
        destructive: '#ef4444',
        'destructive-foreground': '#ffffff',
        card: {
          DEFAULT: '#141414',
          foreground: '#fafafa',
        },
        brand: {
          yellow: '#FACC15',
          'yellow-dim': '#EAB308',
          dark: '#0F0F0F',
          card: '#1A1A1A',
          border: '#2D2D2D',
        },
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.625rem',
        sm: '0.5rem',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgb(0 0 0 / 0.15), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.2), 0 1px 2px -1px rgb(0 0 0 / 0.2)',
        'glow': '0 0 40px -10px rgba(250, 204, 21, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
