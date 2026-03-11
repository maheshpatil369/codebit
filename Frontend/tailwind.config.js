/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['DM Sans', 'sans-serif'],
        display: ['Cormorant Garamond', 'serif'],
      },
      colors: {
        gold: {
          400: '#e2c47a',
          500: '#d4a847',
          600: '#c9a96e',
        },
        dark: {
          500: '#26262f',
          600: '#1c1c24',
          700: '#16161c',
          800: '#111115',
          900: '#0d0d0f',
        },
      },
    },
  },
  plugins: [],
};