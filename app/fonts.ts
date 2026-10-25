import localFont from "next/font/local";

export const saira = localFont({
  src: [
    { path: "../public/fonts/Saira-latin.woff2", weight: "100 900", style: "normal" },
    { path: "../public/fonts/Saira-latin-ext.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-saira",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const jetbrainsMono = localFont({
  src: [
    { path: "../public/fonts/JetBrainsMono-latin.woff2", weight: "100 800", style: "normal" },
    { path: "../public/fonts/JetBrainsMono-latin-ext.woff2", weight: "100 800", style: "normal" },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

export const estedad = localFont({
  src: [
    { path: "../public/fonts/Estedad-Light.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/Estedad-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/Estedad-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-estedad",
  display: "swap",
  fallback: ["sans-serif"],
});
