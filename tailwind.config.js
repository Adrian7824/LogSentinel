/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0b1120',
          800: '#111a2e',
          700: '#19243b',
        },
        accent: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
        },
      },
      boxShadow: {
        panel: '0 18px 50px -24px rgba(15, 23, 42, 0.28)',
      },
    },
  },
  plugins: [],
}
