/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      fontFamily: {
        'saiyan': ['Orbitron', 'monospace'],
      },
      colors: {
        'capsule-blue': '#3B4CCA',
        'capsule-orange': '#FF9E00',
        'saiyan-gold': '#FFD700',
        // Dark mode colors
        'dark-bg': '#0f172a',
        'dark-surface': '#1e293b', 
        'dark-border': '#334155',
      },
      animation: {
        'slide-in': 'slide-in 0.5s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'power-up': 'power-up 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'slide-in': {
          from: {
            transform: 'translateX(100%)',
            opacity: '0',
          },
          to: {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
        'power-up': {
          '0%, 100%': { 
            transform: 'scale(1)',
            filter: 'brightness(1) drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))',
          },
          '50%': { 
            transform: 'scale(1.05)',
            filter: 'brightness(1.2) drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}