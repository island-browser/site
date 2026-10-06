#!/usr/bin/env node
// Refreshes the build-time data the site renders: Island's CHANGELOG.md, its VERSION file,
// and the list of GitHub releases. Runs as `prebuild`.
//
// Each file is resolved in order and the first good source wins:
//   1. GitHub (raw.githubusercontent.com / api.github.com; ISLAND_READ_TOKEN or GITHUB_TOKEN
//      is sent when set — the browser repo is private for now, so unauthenticated calls 404),
//   2. a sibling checkout at ../island (local development),
//   3. the snapshot already committed under data/ (left untouched).
// A failed or blocked network never fails the build; it only means the snapshot is used.
// Set ISLAND_DATA_OFFLINE=1 to skip the network entirely.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { rawUrl, releasesApiUrl, repoSlug } from "../site.config.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localCheckout = path.resolve(root, process.env.ISLAND_LOCAL_CHECKOUT || "../island");
const offline = process.env.ISLAND_DATA_OFFLINE === "1";
// ISLAND_READ_TOKEN: a fine-grained token with read access to the (currently private) browser repo.
const token = process.env.ISLAND_READ_TOKEN || process.env.GITHUB_TOKEN || "";
const TIMEOUT_MS = 10_000;

function headers(accept) {
  const h = { "User-Agent": "island-site-build", Accept: accept };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function fetchText(url, accept = "text/plain") {
  const res = await fetch(url, { headers: headers(accept), signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function readLocal(file) {
  const p = path.join(localCheckout, file);
  return existsSync(p) ? readFileSync(p, "utf8") : null;
}

function slimReleases(list) {
  if (!Array.isArray(list)) throw new Error("releases response is not an array");
  return list
    .filter((r) => r && !r.draft)
    .map((r) => ({
      tag_name: r.tag_name,
      name: r.name,
      prerelease: Boolean(r.prerelease),
      published_at: r.published_at,
      html_url: r.html_url,
      assets: (r.assets || []).map((a) => ({
        name: a.name,
        size: a.size,
        browser_download_url: a.browser_download_url,
      })),
    }));
}

const jobs = [
  {
    out: "data/changelog.md",
    remote: () => fetchText(rawUrl("CHANGELOG.md")),
    local: () => readLocal("CHANGELOG.md"),
    validate: (s) => typeof s === "string" && /^## \[/m.test(s),
  },
  {
    out: "data/VERSION",
    remote: () => fetchText(rawUrl("VERSION")),
    local: () => readLocal("VERSION"),
    validate: (s) => typeof s === "string" && /^\d+\.\d+\.\d+\S*\s*$/.test(s),
    normalize: (s) => `${s.trim()}\n`,
  },
  {
    out: "data/releases.json",
    remote: async () =>
      JSON.stringify(
        slimReleases(
          JSON.parse(
            await fetchText(
              `${releasesApiUrl}?per_page=30`,
              "application/vnd.github+json",
            ),
          ),
        ),
        null,
        2,
      ) + "\n",
    local: () => null,
    validate: (s) => {
      try {
        return Array.isArray(JSON.parse(s));
      } catch {
        return false;
      }
    },
  },
];

console.log(`[fetch-data] source repository: ${repoSlug}${token ? " (authenticated)" : ""}`);
let failures = 0;
for (const job of jobs) {
  const target = path.join(root, job.out);
  const sources = [];
  if (!offline) sources.push(["github", job.remote]);
  sources.push(["../island", job.local]);

  let written = false;
  for (const [label, read] of sources) {
    try {
      const value = await read();
      if (value == null) continue;
      if (!job.validate(value)) throw new Error("unexpected content");
      const text = job.normalize ? job.normalize(value) : value;
      writeFileSync(target, text);
      console.log(`[fetch-data] ${job.out} <- ${label}`);
      written = true;
      break;
    } catch (err) {
      console.log(`[fetch-data] ${job.out}: ${label} unavailable (${err.message})`);
    }
  }
  if (!written) {
    if (existsSync(target) && job.validate(readFileSync(target, "utf8"))) {
      console.log(`[fetch-data] ${job.out} <- committed snapshot`);
    } else {
      console.error(`[fetch-data] ${job.out}: no usable source and no valid snapshot`);
      failures += 1;
    }
  }
}

process.exit(failures ? 1 : 0);
