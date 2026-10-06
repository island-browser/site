// The six packaging targets of the browser (see scripts/package.py in the browser repo).

export type OsFamily = "macos" | "windows" | "linux";
export type Arch = "arm64" | "x64";

export type Platform = {
  target: string;
  os: OsFamily;
  arch: Arch;
  name: string;
  detail: string;
  ext: "zip" | "tar.gz";
  /** Only macOS arm64 has local build/run/package evidence today. */
  verified: boolean;
};

export const PLATFORMS: Platform[] = [
  { target: "macosarm64", os: "macos", arch: "arm64", name: "macOS", detail: "Apple silicon", ext: "zip", verified: true },
  { target: "macosx64", os: "macos", arch: "x64", name: "macOS", detail: "Intel", ext: "zip", verified: false },
  { target: "windows64", os: "windows", arch: "x64", name: "Windows", detail: "x64", ext: "zip", verified: false },
  { target: "windowsarm64", os: "windows", arch: "arm64", name: "Windows", detail: "arm64", ext: "zip", verified: false },
  { target: "linux64", os: "linux", arch: "x64", name: "Linux", detail: "x64", ext: "tar.gz", verified: false },
  { target: "linuxarm64", os: "linux", arch: "arm64", name: "Linux", detail: "arm64", ext: "tar.gz", verified: false },
];

export const assetName = (version: string, p: Platform) =>
  `island_browser-${version}-${p.target}.${p.ext}`;
