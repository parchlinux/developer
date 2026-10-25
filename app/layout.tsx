import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { saira, jetbrainsMono, estedad } from "./fonts";

const SITE_URL = "https://developer.parchlinux.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Parch Developer Portal",
    template: "%s · Parch Developer Portal",
  },
  description:
    "Official developer documentation, design guidelines, and engineering handbook for Parch GNU/Linux.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    siteName: "Parch Developer Portal",
    type: "website",
    url: SITE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${saira.variable} ${jetbrainsMono.variable} ${estedad.variable}`}
    >
      <body>
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}
