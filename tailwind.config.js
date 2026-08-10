/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        devanagari: ['Noto Serif Devanagari', 'Rozha One', 'Teko', 'serif'],
      },
    },
  },
  plugins: [],
}
