/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f1ff',
          100: '#dddefa',
          200: '#b6b9f5',
          300: '#878df2',
          400: '#545cf5',
          500: '#2a33ff',
          600: '#001496',
          700: '#000c70',
          800: '#000852',
          900: '#000436',
          950: '#000220',
        },
      },
    },
  },
  plugins: [],
}
