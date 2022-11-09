/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Nunito', 'Roboto', ],
        'serif': ['ui-serif', 'Georgia', ],
      },
    },
  },
  plugins: [],
}