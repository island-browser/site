"use client";

import { ArrowDownToLine, Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { Arch, OsFamily } from "@/lib/platforms";

export type PlatformCard = {
  target: string;
  os: OsFamily;
  arch: Arch;
  name: string;
  detail: string;
  verified: boolean;
  /** The installer's kind ("Disk image"), or null when the download is the archive itself. */
  kind: string | null;
  file: string;
  url: string | null;
  size: number | null;
  /** The portable archive, when an installer is the main download. */
  portable: { file: string; url: string; size: number } | null;
};

type Detected = { os: OsFamily; arch: Arch | null } | null;

type UAData = {
  platform?: string;
  getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string; platform?: string }>;
};

async function detect(): Promise<Detected> {
  const nav = navigator as Navigator & { userAgentData?: UAData };
  const ua = navigator.userAgent;
  const platform = nav.userAgentData?.platform || navigator.platform || "";
  let os: OsFamily | null = null;
  if (/mac/i.test(platform) || /Macintosh|Mac OS X/.test(ua)) os = "macos";
  else if (/win/i.test(platform) || /Windows/.test(ua)) os = "windows";
  else if (/linux/i.test(platform) || /Linux|X11/.test(ua)) os = "linux";
  if (!os || /Android|iPhone|iPad/.test(ua)) return null;

  let arch: Arch | null = null;
  try {
    const hints = await nav.userAgentData?.getHighEntropyValues?.(["architecture"]);
    if (hints?.architecture) arch = /arm/i.test(hints.architecture) ? "arm64" : "x64";
  } catch {
    // Not available (Safari, Firefox): fall back below.
  }
  if (!arch) {
    if (/aarch64|arm64/i.test(ua)) arch = "arm64";
    else if (os !== "macos" && /x86_64|x64|Win64|WOW64|amd64/i.test(ua)) arch = "x64";
    // Safari and Firefox on macOS report Intel even on Apple silicon; most Macs sold today are
    // Apple silicon, so suggest it and let the other card stay one click away.
    else if (os === "macos") arch = "arm64";
  }
  return { os, arch };
}

function formatSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(bytes > 100 * 1024 * 1024 ? 0 : 1)} MB`;
}

export function PlatformGrid({ cards, hasRelease }: { cards: PlatformCard[]; hasRelease: boolean }) {
  const [detected, setDetected] = useState<Detected>(null);

  useEffect(() => {
    let alive = true;
    detect().then((d) => alive && setDetected(d));
    return () => {
      alive = false;
    };
  }, []);

  const isMine = (c: PlatformCard) =>
    detected !== null && c.os === detected.os && (detected.arch === null || c.arch === detected.arch);

  return (
    <ul className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => {
        const mine = isMine(c);
        return (
          <li
            key={c.target}
            className={`cell-pad relative flex flex-col gap-6 bg-bg ${mine ? "z-[1] outline outline-1 -outline-offset-1 outline-accent" : ""}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="h3">
                  {c.name} <span className="font-normal text-fg-2">· {c.detail}</span>
                </h3>
                <p className="mt-1 font-mono text-[11.5px] text-fg-2">{c.target}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                {mine && (
                  <span className="tag tag-new">
                    <Check className="size-3" aria-hidden /> Your system
                  </span>
                )}
                <span className="tag">
                  <span className={`dot ${c.verified ? "text-space-green" : "text-fg-2"}`} aria-hidden="true" />
                  {c.verified ? "Verified" : "Unverified"}
                </span>
              </div>
            </div>
            <div className="mt-auto">
              {c.url ? (
                <>
                  <a href={c.url} className={`btn w-full ${mine ? "btn-primary" : "btn-secondary"}`}>
                    <ArrowDownToLine className="size-4" aria-hidden />
                    {c.kind ?? "Download"}
                    {c.size ? <span className="font-mono text-xs opacity-70">{formatSize(c.size)}</span> : null}
                  </a>
                  <p className="mt-2.5 truncate font-mono text-[11px] text-fg-2" title={c.file}>
                    {c.file}
                  </p>
                  {c.portable && (
                    <p className="mt-1 truncate text-[12px] text-fg-2">
                      or{" "}
                      <a href={c.portable.url} className="link" title={c.portable.file}>
                        portable {c.portable.file.endsWith(".tar.gz") ? ".tar.gz" : ".zip"}
                      </a>{" "}
                      <span className="font-mono text-[11px]">{formatSize(c.portable.size)}</span>
                    </p>
                  )}
                </>
              ) : (
                <div className="rounded-md border border-dashed border-line-strong px-3 py-2.5">
                  <p className="truncate font-mono text-[11.5px]" title={c.file}>
                    {c.file}
                  </p>
                  <p className="mt-1 text-[12.5px] text-fg-2">
                    {hasRelease ? "Not in this release" : "Not published yet"} ·{" "}
                    <Link href="/docs/#quick-start" className="link">
                      build from source
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
