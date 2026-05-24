/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef1f7', 100: '#d5ddef', 200: '#aabbdf', 300: '#7e99cf',
          400: '#5277bf', 500: '#2655af', 600: '#1e448c', 700: '#163369',
          800: '#0e2246', 900: '#071123', 950: '#030812',
        },
        gold: {
          50: '#fdfaed', 100: '#faf2cc', 200: '#f5e499', 300: '#f0d666',
          400: '#ebc833', 500: '#d4aa00', 600: '#aa8800', 700: '#7f6600',
        },
        steel: {
          50: '#f4f6f9', 100: '#e4e8f0', 200: '#c9d1e1', 300: '#aebad2',
          400: '#93a3c3', 500: '#788cb4', 600: '#5d6e8d', 700: '#435066',
          800: '#2a3240', 900: '#111419',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['"Source Sans 3"', '"Helvetica Neue"', 'sans-serif'],
        mono:  ['"JetBrains Mono"', '"Courier New"', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
