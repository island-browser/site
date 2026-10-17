import type { MetadataRoute } from "next";

import { getChangelog } from "@/lib/data";
import { getGuideItems } from "@/lib/guide";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastRelease = getChangelog().entries.find((e) => e.date)?.date;
  const lastModified = lastRelease ? new Date(`${lastRelease}T00:00:00Z`) : undefined;
  const pages: [string, number][] = [
    ["/", 1],
    ["/download/", 0.8],
    ["/docs/", 0.7],
    ...getGuideItems()
      .filter((item) => item.slug)
      .map((item): [string, number] => [item.href, 0.6]),
    ["/docs/technical/", 0.5],
    ["/changelog/", 0.6],
    ["/privacy/", 0.3],
  ];
  return pages.map(([path, priority]) => ({ url: absoluteUrl(path), lastModified, priority }));
}
