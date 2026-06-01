/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#060608",
          800: "#0a0a0d",
          700: "#101014",
          600: "#16161c",
          500: "#1d1d24",
        },
        bone: "#f4f4f6",
        muted: "#9a9aa2",
        amber: {
          DEFAULT: "#d6bc82",
          soft: "#e7d6ac",
          deep: "#b8995a",
        },
        teal: "#7fd8d0",
      },
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: "-0.05em",
        widest2: "0.32em",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
        smooth: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        spinSlow: {
          to: { transform: "rotate(360deg)" },
        },
        pulseRing: {
          "0%": { transform: "scale(1)", opacity: "0.55" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        gridDrift: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "60px 60px" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
        spinSlow: "spinSlow 14s linear infinite",
        pulseRing: "pulseRing 2.4s ease-out infinite",
        gridDrift: "gridDrift 18s linear infinite",
      },
    },
  },
  plugins: [],
};
