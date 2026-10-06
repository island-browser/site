import { ArrowRight, ArrowUpRight, FileCheck2, Hammer, ShieldAlert } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlock } from "@/components/code-block";
import { type PlatformCard, PlatformGrid } from "@/components/download/platform-grid";
import { Band } from "@/components/section";
import { getLatestRelease, getNightlyRelease, getVersion, type Release } from "@/lib/data";
import { assetName, installerName, PLATFORMS } from "@/lib/platforms";
import { links } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Download",
  path: "/download/",
  socialTitle: "Download Island",
  description:
    "Download the latest Island build for macOS, Windows, or Linux. Builds are unsigned prereleases; checksums are published with every release.",
});

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function findAsset(release: Release | null, expected: string, suffix: string) {
  // Release files are named island_browser-<version>-<target><suffix>; match on the target so a
  // release whose tag and file versions differ still resolves.
  return (
    release?.assets.find((a) => a.name === expected) ??
    release?.assets.find((a) => a.name.endsWith(suffix)) ??
    null
  );
}

function cardsFor(release: Release | null, version: string): PlatformCard[] {
  return PLATFORMS.map((p) => {
    const expected = assetName(version, p);
    const archive = findAsset(release, expected, `-${p.target}.${p.ext}`);
    const installer = findAsset(release, installerName(version, p), `-${p.target}${p.installer}`);
    // The installer is the download; the archive is the portable build. Releases before 0.5.1
    // carry only the archive, which then becomes the download.
    const main = installer ?? archive;
    return {
      target: p.target,
      os: p.os,
      arch: p.arch,
      name: p.name,
      detail: p.detail,
      verified: p.verified,
      kind: installer ? p.installerKind : null,
      file: main?.name ?? expected,
      url: main?.browser_download_url ?? null,
      size: main?.size ?? null,
      portable:
        installer && archive
          ? { file: archive.name, url: archive.browser_download_url, size: archive.size }
          : null,
    };
  });
}

export default function DownloadPage() {
  const release = getLatestRelease();
  const nightly = getNightlyRelease();
  const releaseVersion = release ? release.tag_name.replace(/^v/, "") : getVersion();
  const cards = cardsFor(release, releaseVersion);
  const sums = release?.assets.find((a) => a.name === "SHA256SUMS.txt") ?? null;
  const nightlySums = nightly?.assets.find((a) => a.name === "SHA256SUMS.txt") ?? null;

  return (
    <div className="frame">
      <div className="gutter py-16 sm:py-20">
        <p className="label mb-4">Download</p>
        <h1 className="h1">Get Island.</h1>
        {release ? (
          <p className="lede mt-5 max-w-[64ch]">
            The latest build is{" "}
            <a href={release.html_url} className="font-mono text-[0.9em] text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">
              {release.tag_name}
            </a>
            {release.published_at && <>, published {formatDate(release.published_at)}</>}. It is an
            unsigned prerelease: read the notes below before opening it.
          </p>
        ) : (
          <p className="lede mt-5 max-w-[64ch]">
            Island is a development build. When a release is published on GitHub its archives appear
            here, one per platform, with a checksum file next to them.
          </p>
        )}
      </div>

      {!release && (
        <Band crosses>
          <div className="gutter flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid size-10 flex-none place-items-center rounded-md border border-line bg-surface">
                <Hammer className="size-4" aria-hidden />
              </span>
              <div>
                <h2 className="h3">No builds published yet — build from source</h2>
                <p className="mt-1 max-w-[60ch] text-sm text-fg-2">
                  The quick start vendors the pinned dependencies and builds the app with CMake in a
                  few commands. macOS on Apple silicon is the verified path today.
                </p>
              </div>
            </div>
            <Link href="/docs/#quick-start" className="btn btn-primary flex-none">
              Quick start <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </Band>
      )}

      <Band labelledBy="platforms-title">
        <div className="gutter flex flex-wrap items-end justify-between gap-4 py-8">
          <h2 id="platforms-title" className="label">
            Platforms
            {release && <span className="normal-case"> · {release.tag_name}</span>}
          </h2>
          {sums ? (
            <a href={sums.browser_download_url} className="inline-flex items-center gap-1.5 font-mono text-xs text-fg-2 hover:text-fg">
              <FileCheck2 className="size-3.5" aria-hidden /> SHA256SUMS.txt
            </a>
          ) : release ? (
            <span className="font-mono text-xs text-fg-2">No SHA256SUMS.txt in this release</span>
          ) : null}
        </div>
        <div className="border-t border-line">
          <PlatformGrid cards={cards} hasRelease={Boolean(release)} />
        </div>
      </Band>

      <Band labelledBy="unsigned-title">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="gutter py-14 lg:border-r lg:border-line">
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-4 text-space-coral" aria-hidden />
              <h2 id="unsigned-title" className="label !text-fg">
                Unsigned prerelease
              </h2>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-fg-2">
              Island builds are not signed with a developer certificate or notarized yet — each
              archive&rsquo;s{" "}
              <code className="icode">build-metadata.json</code> says so (
              <code className="icode">signed: false</code>). Your operating system will warn before
              the first launch.
            </p>
            <dl className="mt-6 divide-y divide-line border-y border-line text-sm">
              <div className="grid gap-1 py-4 sm:grid-cols-[120px_1fr] sm:gap-4">
                <dt className="font-medium">macOS</dt>
                <dd className="text-fg-2">
                  Open the <code className="icode">.dmg</code> and drag Island onto Applications. On
                  the first launch macOS says it cannot verify the app: open{" "}
                  <strong className="font-medium text-fg">System Settings › Privacy &amp; Security</strong>{" "}
                  and choose <strong className="font-medium text-fg">Open Anyway</strong>.
                </dd>
              </div>
              <div className="grid gap-1 py-4 sm:grid-cols-[120px_1fr] sm:gap-4">
                <dt className="font-medium">Windows</dt>
                <dd className="text-fg-2">
                  Run the <code className="icode">-setup.exe</code>; it installs for your user, no
                  administrator rights needed. SmartScreen shows &ldquo;Windows protected your
                  PC&rdquo;: choose{" "}
                  <strong className="font-medium text-fg">More info</strong>, then{" "}
                  <strong className="font-medium text-fg">Run anyway</strong>.
                </dd>
              </div>
              <div className="grid gap-1 py-4 sm:grid-cols-[120px_1fr] sm:gap-4">
                <dt className="font-medium">Linux</dt>
                <dd className="text-fg-2">
                  Install the package with{" "}
                  <code className="icode">sudo apt install ./island_browser-…-linux64.deb</code>, then
                  start Island from the app menu or with <code className="icode">island-browser</code>.
                  Or extract the portable <code className="icode">.tar.gz</code> and run{" "}
                  <code className="icode">island_browser</code> inside it.
                </dd>
              </div>
            </dl>
            <p className="mt-6 text-[13px] text-fg-2">
              Only macOS on Apple silicon has been built and run on real hardware so far. Other
              targets are packaged by CI but still need platform verification.
            </p>
          </div>
          <div className="gutter border-t border-line py-14 lg:border-t-0">
            <h2 className="label !text-fg">Verify the checksum</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-fg-2">
              Every release publishes <code className="icode">SHA256SUMS.txt</code>. Download it next
              to the download and check before opening anything.
            </p>
            <div className="mt-6 space-y-3">
              <CodeBlock filename="macOS" code={`$ shasum -a 256 -c SHA256SUMS.txt --ignore-missing`} />
              <CodeBlock filename="Linux" code={`$ sha256sum -c SHA256SUMS.txt --ignore-missing`} />
              <CodeBlock
                filename="Windows (PowerShell)"
                code={`$ Get-FileHash .\\island_browser-${releaseVersion}-windows64-setup.exe`}
              />
            </div>
          </div>
        </div>
      </Band>

      <Band labelledBy="nightly-title">
        <div className="gutter flex flex-col gap-6 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-[64ch]">
            <h2 id="nightly-title" className="h3 flex items-center gap-2">
              Nightly <span className="tag">Moving tag</span>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-fg-2">
              {nightly ? (
                <>
                  {nightly.name ?? "Nightly"}
                  {nightly.published_at && <>, published {formatDate(nightly.published_at)}</>}. The{" "}
                </>
              ) : (
                <>The </>
              )}
              <code className="icode">nightly</code> prerelease is replaced with the packages of the
              latest completed packaging run. Same caveats: unsigned, not notarized
              {nightlySums ? ", and checked against its own SHA256SUMS.txt" : ""}.
            </p>
          </div>
          <a href={nightly?.html_url ?? links.nightly} className="btn btn-secondary flex-none">
            Nightly on GitHub <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </div>
      </Band>
    </div>
  );
}
