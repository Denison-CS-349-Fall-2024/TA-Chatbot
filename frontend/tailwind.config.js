/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f3',
          100: '#fde6e7',
          200: '#fbd0d5',
          300: '#f7a9b3',
          400: '#f27688',
          500: '#e63d54',
          600: '#c8102e',  // Base primary color
          700: '#aa0e27',
          800: '#8d0b20',
          900: '#760a1c',
          950: '#400711',
        }
      }
    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

