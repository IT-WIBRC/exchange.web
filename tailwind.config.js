/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Kumbh: ["Kumbh Sans", "sans-serif"],
        Sora: ["Sora", "sans-serif"],
      },
      fontSize: {
        "2.5xl": "27px",
      },
    },
  },
  plugins: [],
};
