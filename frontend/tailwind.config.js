/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'rd-dark': '#002233',
        'rd-darker': '#06151E',
        'rd-cyan': '#7BE1C5',
        'rd-cyan-light': '#94EFF3',
        'rd-white': '#F1F3F5',
      },
    },
  },
  plugins: [],
}
