/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        'nv': '1000px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.max-w-custom': {
          'max-width': '1300px',
        },
      }, ['responsive']);
    },
  ],
};
