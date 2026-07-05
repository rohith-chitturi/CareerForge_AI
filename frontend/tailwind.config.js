/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#c5a396', // Sand
          600: '#b38270', // Terracotta Light
          700: '#945d49', // Terracotta Core
          800: '#7a4b3a', 
          900: '#5c3a2d',
        },
        sage: {
          400: '#a3b19b',
          500: '#869d7a',
          600: '#69815d',
        },
        background: '#1f1b18', // Deep Espresso
        surface: '#2a2420',   // Lighter Espresso
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Keep it clean
      },
    },
  },
  plugins: [],
}
