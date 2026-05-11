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
          50: '#eef0ff',
          100: '#d5d9ff',
          200: '#b3baff',
          300: '#8d97ff',
          400: '#6673ff',
          500: '#3d4dff',
          600: '#001496',
          700: '#001180',
          800: '#000e6a',
          900: '#000a50',
          950: '#000636',
        },
      },
    },
  },
  plugins: [],
}
