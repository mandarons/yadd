module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'yadd-pink': '#EA1889'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
