/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      boxShadow: {
        "custom-white": "0px 0px 4px 10px rgba(255, 255, 255, 0.2)",
      },
      colors: {
        customGreen: "#273f44",
        customGrayText: "#888a8c",
        customBlue: "#aadaf1",
        customGraySkip: "#888A8C",
        customBlueButton: "#007aff",
        customGrayAddress: "#707579",
        customGrayWallet: "#efeff4",
        customBlackText: "#212121",
        customBlueSelected: "#B9C1F4",
        customGrayLine: "#c6c6c6",
        customGrayAccountDetails: "#616161",
        customDarkModeBackground: "#262233",
        customDarkModeTextColor: "#DEDEDE",
        dimGray: "#4D4D4D", // Dim Gray - Main dark tone
        oceanGreen: "#26A17B", // Ocean Green - Main green tone
        orangePeel: "#F7970A", // Orange Peel - Main amber tone
        azureishWhite: "#DDE9EA", // Azureish White - Light blue tone
        customGrayAlternative: "#434647", // Alternative dark gray
        customGrayLine: "#D68A09", // Amber variant for lines
        customGrayLight: "#C0D5D7", // Light gray tone
        customGrayMuted: "#A8C3C6", // Muted gray tone
        customDarkBackground: "#303131", // Background dark tone
        customDarkText: "#DEDEDE", // Light text for dark mode
      },
      gridTemplateColumns: {
        "custom-1-3-1": "1fr 3fr 1fr",
      },
    },
  },
  plugins: [],
};
