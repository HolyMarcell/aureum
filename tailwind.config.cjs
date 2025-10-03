/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        aureum: {
          // Main brand color (was yellow)
          yellow: '#00829A',
          // Primary button text color
          buttonText: '#f4f1e6',
          // Default body text color
          text: '#f4f1e6',
        },
      },
    },
  },
  plugins: [],
}
