/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '104': '26rem',
        '208': '100rem' // Largura/altura de 32rem
      },
    },
  },
  plugins: [],
}

