/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#111827',
        },
        indigo: {
          950: '#1e1b4b',
        },
      },
    },
  },
  plugins: [],
}