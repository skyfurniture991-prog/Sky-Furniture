const plugin = require("tailwindcss/plugin");

/**
 * Palet warna tunggal (light + dark). Setiap token diubah menjadi CSS variable
 * berformat "R G B" supaya modifier opacity Tailwind (mis. bg-primary/30) tetap bekerja
 * dan tema bisa diganti hanya dengan menambah / menghapus class `dark` pada <html>.
 */
const light = {
  "surface-tint": "#006399",
  "outline-variant": "#c0c7d1",
  "inverse-on-surface": "#eaf1ff",
  "secondary-fixed": "#ffdcbd",
  "on-secondary-container": "#784a10",
  "on-tertiary-fixed-variant": "#004c69",
  "secondary": "#84531a",
  "background": "#f8f9ff",
  "on-primary-fixed-variant": "#004b74",
  "tertiary-fixed-dim": "#7bd0ff",
  "secondary-fixed-dim": "#fbba77",
  "on-primary": "#ffffff",
  "on-error-container": "#93000a",
  "tertiary": "#005271",
  "on-background": "#0b1c30",
  "inverse-surface": "#213145",
  "primary": "#00507d",
  "on-tertiary-container": "#c3e7ff",
  "on-secondary-fixed": "#2c1600",
  "on-tertiary": "#ffffff",
  "on-tertiary-fixed": "#001e2c",
  "secondary-container": "#febc79",
  "on-secondary": "#ffffff",
  "surface-dim": "#cbdbf5",
  "surface-variant": "#d3e4fe",
  "error": "#ba1a1a",
  "inverse-primary": "#94ccff",
  "surface-container-low": "#eff4ff",
  "error-container": "#ffdad6",
  "primary-container": "#0369a1",
  "outline": "#707881",
  "on-secondary-fixed-variant": "#683c02",
  "surface-container-lowest": "#ffffff",
  "surface-container-highest": "#d3e4fe",
  "on-primary-fixed": "#001d32",
  "surface-container": "#e5eeff",
  "on-surface": "#0b1c30",
  "on-error": "#ffffff",
  "on-primary-container": "#cbe4ff",
  "surface-container-high": "#dce9ff",
  "surface": "#f8f9ff",
  "tertiary-fixed": "#c4e7ff",
  "primary-fixed": "#cde5ff",
  "surface-bright": "#f8f9ff",
  "on-surface-variant": "#40474f",
  "tertiary-container": "#006c93",
  "success": "#15803d",
  "success-container": "#dcfce7",
  "on-success-container": "#14532d",
};

const dark = {
  "surface-tint": "#94ccff",
  "outline-variant": "#2c3b50",
  "inverse-on-surface": "#dbe7fb",
  "secondary-fixed": "#3b2509",
  "on-secondary-container": "#ffdcbd",
  "on-tertiary-fixed-variant": "#7bd0ff",
  "secondary": "#fbba77",
  "background": "#0a1220",
  "on-primary-fixed-variant": "#94ccff",
  "tertiary-fixed-dim": "#7bd0ff",
  "secondary-fixed-dim": "#fbba77",
  "on-primary": "#00263d",
  "on-error-container": "#ffdad6",
  "tertiary": "#7bd0ff",
  "on-background": "#e3ebf8",
  "inverse-surface": "#050b15",
  "primary": "#94ccff",
  "on-tertiary-container": "#c3e7ff",
  "on-secondary-fixed": "#ffdcbd",
  "on-tertiary": "#00344a",
  "on-tertiary-fixed": "#c4e7ff",
  "secondary-container": "#5c3a0c",
  "on-secondary": "#4a2800",
  "surface-dim": "#070d18",
  "surface-variant": "#223350",
  "error": "#ffb4ab",
  "inverse-primary": "#00507d",
  "surface-container-low": "#121e31",
  "error-container": "#93000a",
  "primary-container": "#5db4f2",
  "outline": "#7f8b9c",
  "on-secondary-fixed-variant": "#fbba77",
  "surface-container-lowest": "#101b2d",
  "surface-container-highest": "#223350",
  "on-primary-fixed": "#cde5ff",
  "surface-container": "#16233a",
  "on-surface": "#e3ebf8",
  "on-error": "#690005",
  "on-primary-container": "#00263d",
  "surface-container-high": "#1c2b45",
  "surface": "#0a1220",
  "tertiary-fixed": "#0d3b52",
  "primary-fixed": "#12385a",
  "surface-bright": "#1b2638",
  "on-surface-variant": "#aeb9c9",
  "tertiary-container": "#004d6a",
  "success": "#4ade80",
  "success-container": "#0f3a24",
  "on-success-container": "#bbf7d0",
};

const hexToChannels = (hex) => {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(" ");
};

const toVars = (palette) =>
  Object.fromEntries(
    Object.entries(palette).map(([name, hex]) => [`--c-${name}`, hexToChannels(hex)])
  );

const colors = Object.fromEntries(
  Object.keys(light).map((name) => [name, `rgb(var(--c-${name}) / <alpha-value>)`])
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors,
      borderRadius: {
        DEFAULT: "0.375rem",
        lg: "0.625rem",
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        full: "9999px",
      },
      boxShadow: {
        soft: "0 1px 2px rgb(var(--c-on-surface) / 0.04), 0 4px 16px rgb(var(--c-on-surface) / 0.05)",
        lift: "0 2px 4px rgb(var(--c-on-surface) / 0.04), 0 18px 40px -12px rgb(var(--c-on-surface) / 0.22)",
        glow: "0 10px 30px -8px rgb(var(--c-primary-container) / 0.55)",
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
        "label-lg": ["Manrope"],
        "body-md": ["Manrope"],
        "headline-md": ["Epilogue"],
        "headline-lg": ["Epilogue"],
        "display-lg": ["Epilogue"],
        "title-lg": ["Manrope"],
        "title-md": ["Manrope"],
        "body-lg": ["Manrope"],
        "label-sm": ["Manrope"],
        "headline-sm": ["Epilogue"],
        "label-md": ["Manrope"],
        "headline-xl": ["Epilogue"],
        "body-sm": ["Manrope"],
      },
      fontSize: {
        "label-lg": ["14px", { lineHeight: "20px", letterSpacing: "0.04em", fontWeight: "600" }],
        "body-md": ["15px", { lineHeight: "24px", letterSpacing: "0.01em", fontWeight: "400" }],
        "headline-md": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "500" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.015em", fontWeight: "500" }],
        "display-lg": ["56px", { lineHeight: "64px", letterSpacing: "-0.03em", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", letterSpacing: "0em", fontWeight: "400" }],
        "title-lg": ["18px", { lineHeight: "26px", letterSpacing: "0em", fontWeight: "600" }],
        "title-md": ["16px", { lineHeight: "24px", letterSpacing: "0em", fontWeight: "600" }],
        "label-sm": ["11px", { lineHeight: "14px", letterSpacing: "0.08em", fontWeight: "600" }],
        "headline-sm": ["20px", { lineHeight: "28px", letterSpacing: "-0.005em", fontWeight: "600" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.06em", fontWeight: "600" }],
        "headline-xl": ["40px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "500" }],
        "body-sm": ["13px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "400" }],
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ":root": toVars(light),
        ".dark": { ...toVars(dark), colorScheme: "dark" },
      });
    }),
  ],
};
