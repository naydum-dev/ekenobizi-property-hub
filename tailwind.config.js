/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: {
            deep: "#14532D",
            DEFAULT: "#1A6B3C",
          },
          gold: "#B07D2A",
          earth: "#7C4B1E",
        },
      },
    },
  },
  plugins: [],
};
