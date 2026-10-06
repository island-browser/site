#!/usr/bin/env node
// Asserts that the CSS custom properties in app/globals.css match the Graphite design-token
// contract published in Island's DESIGN.md (the fenced `design-tokens` JSON block).
//
// DESIGN.md is read from a sibling checkout (../island/DESIGN.md, or ISLAND_LOCAL_CHECKOUT)
// when present, otherwise fetched from the browser repo's main branch. The browser repo is
// private for now, so the fetch needs ISLAND_READ_TOKEN (or GITHUB_TOKEN) with read access.

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { rawUrl } from "../site.config.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localDesign = path.resolve(
  root,
  process.env.ISLAND_LOCAL_CHECKOUT || "../island",
  "DESIGN.md",
);
const cssPath = path.join(root, "app/globals.css");

async function loadDesign() {
  if (existsSync(localDesign)) {
    return { text: readFileSync(localDesign, "utf8"), source: localDesign };
  }
  const url = rawUrl("DESIGN.md");
  const token = process.env.ISLAND_READ_TOKEN || process.env.GITHUB_TOKEN || "";
  const headers = { "User-Agent": "island-site-check-tokens" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(15_000) });
  if (!res.ok) {
    throw new Error(
      `could not read DESIGN.md: no local checkout at ${localDesign} and ${url} returned HTTP ${res.status}` +
        (token ? "" : " (no ISLAND_READ_TOKEN/GITHUB_TOKEN set; the browser repo is private)"),
    );
  }
  return { text: await res.text(), source: url };
}

function extractTokens(markdown) {
  const match = markdown.match(/```design-tokens\s*\n([\s\S]*?)\n```/);
  if (!match) throw new Error("DESIGN.md has no ```design-tokens fenced block");
  return JSON.parse(match[1]);
}

// Returns the declarations of the first rule whose selector matches exactly (top level or
// nested one level inside an at-rule).
function declarationsFor(css, selector) {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(^|[}{;\\s])${escaped}\\s*\\{([^{}]*)\\}`, "m");
  const m = stripped.match(re);
  if (!m) return null;
  const decls = new Map();
  for (const part of m[2].split(";")) {
    const i = part.indexOf(":");
    if (i === -1) continue;
    const name = part.slice(0, i).trim();
    if (name.startsWith("--")) decls.set(name, part.slice(i + 1).trim());
  }
  return decls;
}

function mediaBlock(css, query) {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const start = stripped.indexOf(`@media ${query}`);
  if (start === -1) return null;
  let depth = 0;
  for (let i = stripped.indexOf("{", start); i < stripped.length; i++) {
    if (stripped[i] === "{") depth++;
    if (stripped[i] === "}" && --depth === 0) {
      return stripped.slice(stripped.indexOf("{", start) + 1, i);
    }
  }
  return null;
}

const norm = (v) => String(v).replace(/\s+/g, " ").replace(/\s*,\s*/g, ", ").trim().toUpperCase();

const COLOR_MAP = {
  background: "--background",
  surface: "--surface",
  surface_secondary: "--surface-2",
  text: "--text",
  text_secondary: "--text-2",
  border: "--border",
  accent: "--accent",
};

async function main() {
  const { text, source } = await loadDesign();
  const tokens = extractTokens(text);
  const css = readFileSync(cssPath, "utf8");

  const light = declarationsFor(css, ":root");
  const dark = declarationsFor(css, ":root.dark");
  const mediaCss = mediaBlock(css, "(prefers-color-scheme: dark)");
  const darkMedia = mediaCss && declarationsFor(mediaCss, ":root:not(.light):not(.dark)");

  const rows = [];
  const expect = (block, blockName, variable, expected) => {
    const actual = block ? block.get(variable) : undefined;
    rows.push({
      where: `${blockName} ${variable}`,
      expected: String(expected),
      actual: actual ?? "(missing)",
      ok: actual !== undefined && norm(actual) === norm(expected),
    });
  };

  if (!light) throw new Error("app/globals.css has no `:root { ... }` block");
  for (const [key, variable] of Object.entries(COLOR_MAP)) {
    expect(light, ":root", variable, tokens.colors.light[key]);
    expect(dark, ":root.dark", variable, tokens.colors.dark[key]);
    expect(darkMedia, "@media dark :root", variable, tokens.colors.dark[key]);
  }
  for (const [key, value] of Object.entries(tokens.colors.site_only ?? {})) {
    expect(light, ":root", `--${key.replace(/_/g, "-")}`, value);
  }
  expect(light, ":root", "--radius-sm", `${tokens.radii.radius_small}px`);
  expect(light, ":root", "--radius-md", `${tokens.radii.radius_medium}px`);
  for (const [key, value] of Object.entries(tokens.spacing ?? {})) {
    expect(light, ":root", `--${key.replace(/_/g, "-")}`, `${value}px`);
  }
  if (tokens.motion) {
    expect(light, ":root", "--motion-fast", `${tokens.motion.fast_ms}ms`);
    expect(light, ":root", "--motion-enter", `${tokens.motion.enter_ms}ms`);
    expect(light, ":root", "--motion-reveal", `${tokens.motion.reveal_ms}ms`);
    expect(light, ":root", "--ease-out", tokens.motion.ease_out);
  }

  const failed = rows.filter((r) => !r.ok);
  console.log(
    `check:tokens — ${tokens.contract} v${tokens.version} (${tokens.accepted_design}) from ${source}`,
  );
  if (failed.length) {
    const w = Math.max(...failed.map((r) => r.where.length));
    console.error(`\n${failed.length} of ${rows.length} tokens drifted from DESIGN.md:\n`);
    for (const r of failed) {
      console.error(`  ${r.where.padEnd(w)}  - expected ${r.expected}`);
      console.error(`  ${" ".repeat(w)}  + found    ${r.actual}`);
    }
    console.error("\nUpdate app/globals.css (or DESIGN.md) so both agree.");
    process.exit(1);
  }
  console.log(`All ${rows.length} tokens match app/globals.css.`);
}

main().catch((err) => {
  console.error(`check:tokens failed: ${err.message}`);
  process.exit(1);
});
