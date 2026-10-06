import type { Metadata } from "next";

import { Features } from "@/components/home/features";
import {
  Agents,
  FirstRunAndAvailability,
  Hero,
  Intro,
  Keyboard,
  OpenSource,
} from "@/components/home/sections";
import { Band } from "@/components/section";
import { getVersion } from "@/lib/data";
import { absoluteUrl, description, links } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  path: "/",
  description,
  socialTitle: "Island — a calm native browser",
});

export default function HomePage() {
  const version = getVersion();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Island",
    applicationCategory: "BrowserApplication",
    operatingSystem: "macOS",
    url: absoluteUrl("/"),
    downloadUrl: absoluteUrl("/download/"),
    releaseNotes: absoluteUrl("/changelog/"),
    description,
    softwareVersion: version,
    license: "https://opensource.org/licenses/MIT",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@type": "Organization", name: "Island contributors" },
    codeRepository: links.repo,
  };

  return (
    <div className="frame">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero version={version} />
      <Intro />
      <Band id="features" labelledBy="features-title" className="!border-t">
        <Features />
      </Band>
      <Agents />
      <Keyboard />
      <FirstRunAndAvailability />
      <OpenSource />
    </div>
  );
}
