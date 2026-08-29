/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            50: "#EFF6FF",
            100: "#DBEAFE",
            500: "#2563EB",
            600: "#1D4ED8",
            800: "#1E3A8A", // Royal Deep Blue (Primary)
            900: "#0F172A", // Midnight Navy
          },
          gold: {
            100: "#FEF08A",
            400: "#FACC15",
            500: "#EAB308", // Golden Yellow (Accent)
            600: "#CA8A04",
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
