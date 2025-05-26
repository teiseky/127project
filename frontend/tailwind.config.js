/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'up-maroon': '#800000',
        'up-maroon-light': '#990000',
        'up-green': '#006400',
        'up-green-light': '#008000',
      },
    },
  },
  plugins: [],
} 