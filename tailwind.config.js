/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        wine: {
          DEFAULT: '#761B1D',
          deep: '#541315',
          dark: '#3C0D0F',
          soft: '#8F2A2C',
          tint: '#FBF4F4',
        },
        graphite: {
          DEFAULT: '#25272B',
          soft: '#3A3D43',
        },
        steel: {
          DEFAULT: '#AEB2B7',
          light: '#F3F4F6',
        },
      },
      fontFamily: {
        display: ['Sora', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(37, 39, 43, 0.04), 0 8px 24px -12px rgba(37, 39, 43, 0.18)',
        'card-hover': '0 2px 4px rgba(37, 39, 43, 0.06), 0 22px 44px -18px rgba(118, 27, 29, 0.32)',
        wine: '0 18px 40px -20px rgba(118, 27, 29, 0.55)',
      },
      backgroundImage: {
        'wine-gradient': 'linear-gradient(135deg, #761B1D 0%, #541315 55%, #3C0D0F 100%)',
        'steel-sheen': 'linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 45%, #E3E5E8 100%)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translate3d(0, 18px, 0)' },
          to: { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '70%': { transform: 'scale(1.5)', opacity: '0' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.5s ease-out both',
        'scale-in': 'scale-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
