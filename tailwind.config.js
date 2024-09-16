/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B00',
          dark: '#E65100',
        },
        secondary: {
          DEFAULT: '#1A1A1A',
          light: '#333333',
        },
        orange: {
          500: '#ff9800',
        },
        yellow: {
          500: '#ffc107',
        },
        green: {
          500: '#4caf50',
        },
      },
      animation: {
        shrink: 'shrink 3s linear forwards',
      },
      keyframes: {
        shrink: {
          '0%': { width: '100%' },
          '100%': { width: '0%' },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

