// Single source of the repository coordinates and public URLs used by the site and its scripts.
// Pure data (no imports) so the Node build scripts can load it directly.

export const siteConfig = {
  name: "Island",
  /** GitHub owner of both repositories. */
  owner: "island-browser",
  /** The browser repository: CHANGELOG.md, VERSION, DESIGN.md, and releases come from here. */
  repo: "island",
  /** This website's repository. */
  siteRepo: "site",
  /** Branch the build-time data is read from. */
  branch: "main",
  /**
   * Branch DESIGN.md is read from by `check:tokens`. The `design-tokens-native` block reaches
   * `main` only with Island 0.7, so until then it is read from the branch that defines it.
   * Set this back to "main" once 0.7 is merged there.
   */
  designBranch: "design/macos-native-spec",
  /** Canonical public URL (overridable with NEXT_PUBLIC_SITE_URL). */
  defaultSiteUrl: "https://island-browser.github.io/site",
} as const;

export const repoSlug = `${siteConfig.owner}/${siteConfig.repo}`;
export const repoUrl = `https://github.com/${repoSlug}`;
export const siteRepoUrl = `https://github.com/${siteConfig.owner}/${siteConfig.siteRepo}`;
export const rawUrl = (file: string) =>
  `https://raw.githubusercontent.com/${repoSlug}/${siteConfig.branch}/${file}`;
export const designRawUrl = (file: string) =>
  `https://raw.githubusercontent.com/${repoSlug}/${siteConfig.designBranch}/${file}`;
export const releasesApiUrl = `https://api.github.com/repos/${repoSlug}/releases`;

export default siteConfig;
