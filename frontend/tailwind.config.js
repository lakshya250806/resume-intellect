/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#030014',
        card: 'rgba(255, 255, 255, 0.03)',
        'card-border': 'rgba(255, 255, 255, 0.08)',
        accent: {
          purple: '#8b5cf6',
          violet: '#7c3aed',
          fuchsia: '#d946ef',
          dark: '#4c1d95',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 8s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(30px, -50px) scale(1.2)' },
          '100%': { transform: 'translate(-20px, 20px) scale(0.8)' },
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glow-purple': '0 0 40px 5px rgba(139, 92, 246, 0.15)',
        'glow-fuchsia': '0 0 40px 5px rgba(217, 70, 239, 0.15)',
      }
    },
  },
  plugins: [],
}
