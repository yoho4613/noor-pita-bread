import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        buttonBlack: "#000000",
        whitePrimary: "#FAFAFA",
        secondary: "#F5F5F5",
        redPrimary: "#DB4444",
        grayPrimary: "#828282",
        graySecondary: "#2F2E30",
        buttonGreen: "#00FF66",
        textPrimary: "#FAFAFA",
        textBackground: "rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
} satisfies Config;
