export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkGreen: '#233824',
        midGreen: '#2D452E',
        lightGreen: '#456943',
        gold: '#EBB455',
        textSoft: '#B9CCB8',
      },
      fontFamily: {
        bengali: ['"Hind Siliguri"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
