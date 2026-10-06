import { repoUrl, siteConfig } from "@/site.config";

export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

/** Canonical origin + base path, without a trailing slash. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || siteConfig.defaultSiteUrl).replace(
  /\/+$/,
  "",
);

/** Absolute canonical URL for a site path such as "/docs/". */
export const absoluteUrl = (pathname: string) =>
  `${siteUrl}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;

/** Prefix a public/ asset path with the base path (next/link does this for routes). */
export const assetPath = (pathname: string) => `${basePath}${pathname}`;

export const links = {
  repo: repoUrl,
  releases: `${repoUrl}/releases`,
  nightly: `${repoUrl}/releases/tag/nightly`,
  changelogSource: `${repoUrl}/blob/${siteConfig.branch}/CHANGELOG.md`,
  issues: `${repoUrl}/issues`,
  acp: "https://agentclientprotocol.com/",
  mcp: "https://modelcontextprotocol.io/",
  semver: "https://semver.org/",
  keepAChangelog: "https://keepachangelog.com/en/1.1.0/",
  githubPrivacy:
    "https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement",
};

export const tagline = "A calm native browser with a built-in AI agent";

export const description =
  "Island is an open-source native desktop browser built on CEF: an Arc-style sidebar with colored spaces and pinned tabs, split view, an all-tabs overview, a built-in ACP agent, and browser tools any AI agent can use over MCP.";
