/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0A0D14",
        panel: "#121723",
        panel2: "#171D2B",
        edge: "#222B3D",
        ink: "#E8EDF7",
        muted: "#8A97AD",
        signal: "#39D8C8",
        electric: "#5B8DEF",
        healthy: "#3ED598",
        warn: "#F5B14C",
        crit: "#F2557A",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
