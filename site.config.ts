// Single source of the repository coordinates and public URLs used by the site and its scripts.
// Pure data (no imports) so the Node build scripts can load it directly.

export const siteConfig = {
  name: "Island",
  /** GitHub owner of both repositories. */
  owner: "island-browser",
  /** The browser repository: CHANGELOG.md, VERSION, DESIGN.md, and releases come from here. */
  repo: "island",
  /** This website's repository. */
  siteRepo: "island-site",
  /** Branch the build-time data is read from. */
  branch: "main",
  /** Canonical public URL (overridable with NEXT_PUBLIC_SITE_URL). */
  defaultSiteUrl: "https://island-browser.github.io/island-site",
} as const;

export const repoSlug = `${siteConfig.owner}/${siteConfig.repo}`;
export const repoUrl = `https://github.com/${repoSlug}`;
export const siteRepoUrl = `https://github.com/${siteConfig.owner}/${siteConfig.siteRepo}`;
export const rawUrl = (file: string) =>
  `https://raw.githubusercontent.com/${repoSlug}/${siteConfig.branch}/${file}`;
export const releasesApiUrl = `https://api.github.com/repos/${repoSlug}/releases`;

export default siteConfig;
