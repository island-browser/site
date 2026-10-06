import type { Metadata } from "next";

const OG_IMAGE = {
  url: "og.png",
  width: 1200,
  height: 630,
  alt: "Island — a calm native browser with a built-in AI agent",
};

/**
 * Metadata for one page. Next merges `openGraph`/`twitter` shallowly, so every page restates the
 * shared fields (site name, image) here instead of losing them.
 * `path` is the route with a trailing slash ("/docs/"); it becomes the canonical URL.
 */
export function pageMetadata({
  title,
  description,
  path,
  socialTitle,
}: {
  title?: string;
  description: string;
  path: string;
  socialTitle: string;
}): Metadata {
  const url = path.replace(/^\//, "") || "./";
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: "Island",
      title: socialTitle,
      description,
      url,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
