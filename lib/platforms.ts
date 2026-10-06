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
  /** Suffix of the installer released next to the archive (scripts/installers.py). */
  installer: ".dmg" | ".deb" | "-setup.exe";
  /** What the installer is, shown on the download button. */
  installerKind: string;
  /** Only macOS arm64 has local build/run/package evidence today. */
  verified: boolean;
};

export const PLATFORMS: Platform[] = [
  { target: "macosarm64", os: "macos", arch: "arm64", name: "macOS", detail: "Apple silicon", ext: "zip", installer: ".dmg", installerKind: "Disk image", verified: true },
  { target: "macosx64", os: "macos", arch: "x64", name: "macOS", detail: "Intel", ext: "zip", installer: ".dmg", installerKind: "Disk image", verified: false },
  { target: "windows64", os: "windows", arch: "x64", name: "Windows", detail: "x64", ext: "zip", installer: "-setup.exe", installerKind: "Installer", verified: false },
  { target: "windowsarm64", os: "windows", arch: "arm64", name: "Windows", detail: "arm64", ext: "zip", installer: "-setup.exe", installerKind: "Installer", verified: false },
  { target: "linux64", os: "linux", arch: "x64", name: "Linux", detail: "x64", ext: "tar.gz", installer: ".deb", installerKind: "Debian / Ubuntu package", verified: false },
  { target: "linuxarm64", os: "linux", arch: "arm64", name: "Linux", detail: "arm64", ext: "tar.gz", installer: ".deb", installerKind: "Debian / Ubuntu package", verified: false },
];

export const assetName = (version: string, p: Platform) =>
  `island_browser-${version}-${p.target}.${p.ext}`;

export const installerName = (version: string, p: Platform) =>
  `island_browser-${version}-${p.target}${p.installer}`;
