/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#5dade2',
          DEFAULT: '#21618c',
          dark: '#1b4f72',
        },
        secondary: {
          light: '#f2f4f4',
          DEFAULT: '#d5d8dc',
          dark: '#abb2b9',
        },
      },
    },
  },
  plugins: [],
};