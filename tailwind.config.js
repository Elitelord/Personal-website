module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      // Every page gutter comes from here. Sections must not add their own
      // horizontal padding on top, or they sit inboard of the hero.
      padding: {
        DEFAULT: '1.25rem',
        tablet: '2rem',
        laptop: '3rem',
      },
      // Tailwind derives container max-widths from `screens`. Leaving `mob`
      // (375px) in here pinned the container to a 375px column for every
      // viewport from 375px up to 767px. Below `tablet` the container should
      // just be full width.
      screens: {
        tablet: '768px',
        laptop: '1024px',
        desktop: '1280px',
        laptopl: '1440px',
      },
    },
    screens: {
      mob: "375px",
      tablet: "768px",
      laptop: "1024px",
      desktop: "1280px",
      laptopl: "1440px",
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      // Two steps, named by role rather than size. App code should use only
      // these plus `rounded-full` (reserved for genuinely circular controls).
      // The default numeric scale is left in place because the tw-elements
      // plugin's generated CSS reads from it.
      borderRadius: {
        control: "0.375rem", // 6px  — buttons, tags, inputs, pills, nested images
        surface: "0.75rem", // 12px — cards, panels, the sticky bar, modals
      },
    },
  },
  plugins: [require("tw-elements/plugin.cjs")],
};
