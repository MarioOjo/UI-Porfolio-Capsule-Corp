/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'capsule-blue': '#3B4CCA',
        'capsule-orange': '#FF9E00',
        // legacy 'gold' token removed; use capsule-accent instead
        'capsule-accent': '#FF9E00'
      }
    }
  },
  plugins: []
};
