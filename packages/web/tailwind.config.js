module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#019267",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
