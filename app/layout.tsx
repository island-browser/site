import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";

import "./globals.css";

import { RevealObserver } from "@/components/reveal-observer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getVersion } from "@/lib/data";
import { description, siteUrl, tagline } from "@/lib/site";
import { themeInitScript } from "@/lib/theme-script";

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: { default: `Island — ${tagline.toLowerCase()}`, template: "%s — Island" },
  description,
  applicationName: "Island",
  openGraph: {
    type: "website",
    siteName: "Island",
    title: "Island — a calm native browser",
    description:
      "Spaces, pinned tabs, split view, and an AI agent in the sidebar, in a native CEF browser that agents can drive over MCP. Open source, built in the open.",
    url: "./",
    images: [{ url: "og.png", width: 1200, height: 630, alt: "Island — a calm native browser with a built-in AI agent" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Island — a calm native browser",
    description: "Spaces, pinned tabs, split view, and a built-in AI agent in a native CEF browser.",
    images: ["og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const version = getVersion();
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {/* overflow-x: clip trims the cross markers at narrow widths without breaking sticky. */}
        <div className="flex min-h-dvh flex-col overflow-x-clip">
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <SiteHeader version={version} />
          <main id="main" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter version={version} />
        </div>
        <RevealObserver />
      </body>
    </html>
  );
}
