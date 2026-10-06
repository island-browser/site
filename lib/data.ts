import "server-only";

import { readFileSync } from "node:fs";
import path from "node:path";

import { marked } from "marked";

// Build-time data written by scripts/fetch-data.mjs (with committed snapshots as fallback).
const dataDir = path.join(process.cwd(), "data");
const read = (file: string) => readFileSync(path.join(dataDir, file), "utf8");

export type ChangeGroup = { title: string; html: string };
export type ChangelogEntry = {
  version: string;
  date: string | null;
  link: string | null;
  groups: ChangeGroup[];
};

const HEADING = /^## \[([^\]]+)\](?:\s*-\s*(\d{4}-\d{2}-\d{2}))?\s*$/gm;
const LINK_REF = /^\[([^\]]+)\]:\s*(\S+)\s*$/gm;

function renderMarkdown(md: string) {
  return marked.parse(md, { async: false, gfm: true }) as string;
}

let cachedChangelog: { intro: string; entries: ChangelogEntry[] } | null = null;

export function getChangelog() {
  if (cachedChangelog) return cachedChangelog;
  const source = read("changelog.md").replace(/\r\n/g, "\n");

  const refs = new Map<string, string>();
  for (const m of source.matchAll(LINK_REF)) refs.set(m[1], m[2]);
  const body = source.replace(LINK_REF, "").trimEnd();

  const heads = [...body.matchAll(HEADING)];
  const preamble = body.slice(0, heads[0]?.index ?? body.length);
  const intro = renderMarkdown(
    preamble
      .replace(/^# .*$/m, "")
      .trim(),
  );

  const entries: ChangelogEntry[] = [];
  heads.forEach((h, i) => {
    const start = (h.index ?? 0) + h[0].length;
    const end = heads[i + 1]?.index ?? body.length;
    const section = body.slice(start, end).trim();
    const groups: ChangeGroup[] = [];
    const parts = section.split(/^### (.+)$/m);
    // parts: [lead, title1, body1, title2, body2, ...]
    if (parts[0].trim()) groups.push({ title: "Notes", html: renderMarkdown(parts[0].trim()) });
    for (let j = 1; j < parts.length; j += 2) {
      const content = parts[j + 1]?.trim();
      if (content) groups.push({ title: parts[j].trim(), html: renderMarkdown(content) });
    }
    const version = h[1];
    if (version.toLowerCase() === "unreleased" && groups.length === 0) return;
    const ref = refs.get(version) ?? null;
    entries.push({
      version,
      date: h[2] ?? null,
      link: ref && /\/releases\/tag\//.test(ref) ? ref : null,
      groups,
    });
  });

  cachedChangelog = { intro, entries };
  return cachedChangelog;
}

/** The current version: data/VERSION, falling back to the newest released changelog entry. */
export function getVersion(): string {
  try {
    const v = read("VERSION").trim();
    if (/^\d+\.\d+\.\d+/.test(v)) return v;
  } catch {
    // fall through to the changelog
  }
  const released = getChangelog().entries.find((e) => /^\d+\.\d+\.\d+/.test(e.version));
  return released?.version ?? "0.0.0";
}

export type ReleaseAsset = { name: string; size: number; browser_download_url: string };
export type Release = {
  tag_name: string;
  name: string | null;
  prerelease: boolean;
  published_at: string | null;
  html_url: string;
  assets: ReleaseAsset[];
};

export function getReleases(): Release[] {
  try {
    const list = JSON.parse(read("releases.json"));
    return Array.isArray(list) ? (list as Release[]) : [];
  } catch {
    return [];
  }
}

const byDateDesc = (a: Release, b: Release) =>
  (b.published_at ?? "").localeCompare(a.published_at ?? "");

/** Newest versioned (vX.Y.Z) release, prerelease or not. */
export function getLatestRelease(): Release | null {
  return getReleases().filter((r) => /^v\d+\.\d+\.\d+/.test(r.tag_name)).sort(byDateDesc)[0] ?? null;
}

export function getNightlyRelease(): Release | null {
  return getReleases().find((r) => r.tag_name === "nightly") ?? null;
}
