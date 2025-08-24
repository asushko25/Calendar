/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontSize: {
        h2: ["24px", { lineHeight: "24px", fontWeight: "500" }],
        formLabel: ["16px", { lineHeight: "16px", fontWeight: "400" }],
      },
      colors: {
        background: "#F0EAF8",
        heading: "#000853",
      },
      spacing: {
        120: "120px",
      },
      maxWidth: {
        formDesktop: "426px",
        formMobile: "342px",
      },
    },
  },
  plugins: [],
};
