import "server-only";

import { readFileSync } from "node:fs";
import path from "node:path";

import { Marked, type Tokens } from "marked";

import { rawUrl, repoUrl, siteConfig } from "@/site.config";
import { basePath } from "@/lib/site";

// The user guide is Island's docs/user-guide/ in GitBook layout, copied into data/user-guide/ by
// scripts/fetch-data.mjs: SUMMARY.md is the table of contents, README.md the landing page.
const GUIDE_DIR = "docs/user-guide";
const guideRoot = path.join(process.cwd(), "data", "user-guide");

/** Route segment for the hand-written technical reference, which the guide's slugs must not shadow. */
export const TECHNICAL_SEGMENT = "technical";

export type GuideItem = {
  title: string;
  /** Source path relative to the guide root, e.g. "getting-started/install.md". */
  file: string;
  /** Route slug without slashes at the ends; "" for the landing page. */
  slug: string;
  /** Site route with a trailing slash, e.g. "/docs/getting-started/install/". */
  href: string;
  /** Nesting level in SUMMARY.md (0 = top). */
  depth: number;
  planned: boolean;
};

export type GuideSection = { title: string | null; items: GuideItem[] };

export type GuidePage = {
  item: GuideItem;
  title: string;
  description: string;
  html: string;
  prev: GuideItem | null;
  next: GuideItem | null;
  editUrl: string;
};

const read = (file: string) => readFileSync(path.join(guideRoot, file), "utf8").replace(/\r\n/g, "\n");

const slugOf = (file: string) => file.replace(/\.md$/, "").replace(/(^|\/)README$/, "").replace(/\/$/, "");
const hrefOf = (slug: string) => (slug ? `/docs/${slug}/` : "/docs/");

/** A page is "planned" when its first paragraph opens with **Planned.** */
const isPlanned = (md: string) => /^\*\*Planned\.\*\*/m.test(md.replace(/^# .*\n+/, ""));

let cached: { sections: GuideSection[]; items: GuideItem[] } | null = null;

function load() {
  if (cached) return cached;
  const summary = read("SUMMARY.md");
  const sections: GuideSection[] = [{ title: null, items: [] }];
  for (const line of summary.split("\n")) {
    const heading = /^##\s+(.+?)\s*$/.exec(line);
    if (heading) {
      sections.push({ title: heading[1], items: [] });
      continue;
    }
    const entry = /^(\s*)[*-]\s+\[([^\]]+)\]\(([^)#?\s]+\.md)\)/.exec(line);
    if (!entry) continue;
    const file = path.posix.normalize(entry[3]);
    if (file.startsWith("..") || file.toLowerCase() === "summary.md") continue;
    let md: string;
    try {
      md = read(file);
    } catch {
      continue;
    }
    const slug = slugOf(file);
    if (slug.split("/")[0] === TECHNICAL_SEGMENT) continue;
    sections[sections.length - 1].items.push({
      title: entry[2],
      file,
      slug,
      href: hrefOf(slug),
      depth: Math.floor(entry[1].replace(/\t/g, "  ").length / 2),
      planned: isPlanned(md),
    });
  }
  const kept = sections.filter((s) => s.items.length > 0);
  cached = { sections: kept, items: kept.flatMap((s) => s.items) };
  return cached;
}

export const getGuideSections = () => load().sections;
export const getGuideItems = () => load().items;
export const getGuideSlugs = () => load().items.filter((i) => i.slug).map((i) => i.slug.split("/"));
export const getGuideLanding = () => load().items.find((i) => !i.slug) ?? null;

const HINT = /\{%\s*hint\s+style="(\w+)"\s*%\}([\s\S]*?)\{%\s*endhint\s*%\}/g;
const HINT_STYLES = new Set(["info", "warning", "danger", "success"]);
const HINT_LABEL: Record<string, string> = { info: "Note", warning: "Warning", danger: "Caution", success: "Tip" };

const SCHEME = /^[a-z][a-z0-9+.-]*:/i;

/** Resolves a relative link in `fromFile` to a site route, or to the file on GitHub if it is not a guide page. */
function rewriteHref(href: string, fromFile: string, known: Map<string, GuideItem>) {
  if (!href || SCHEME.test(href) || href.startsWith("//") || href.startsWith("#")) return href;
  const [target, frag] = href.split("#");
  const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), target));
  const hash = frag ? `#${frag}` : "";
  const hit = known.get(resolved);
  if (hit) return `${basePath}${hit.href}${hash}`;
  if (resolved.startsWith("..")) return href;
  return `${repoUrl}/blob/${siteConfig.branch}/${GUIDE_DIR}/${resolved}${hash}`;
}

/** Relative images are not copied into the data snapshot; point them at the file in the repository. */
const rewriteSrc = (src: string, fromFile: string) => {
  if (!src || SCHEME.test(src) || src.startsWith("//") || src.startsWith("/")) return src;
  const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), src));
  return resolved.startsWith("..") ? src : rawUrl(`${GUIDE_DIR}/${resolved}`);
};

const escapeAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-") || "section";

function render(md: string, file: string, known: Map<string, GuideItem>) {
  const used = new Set<string>();
  const marked = new Marked({
    gfm: true,
    async: false,
    walkTokens(token) {
      if (token.type === "link") token.href = rewriteHref(token.href, file, known);
      else if (token.type === "image") token.href = rewriteSrc(token.href, file);
    },
    renderer: {
      heading({ tokens, depth, text }: Tokens.Heading) {
        const inner = this.parser.parseInline(tokens);
        let id = slugify(text);
        for (let n = 2; used.has(id); n += 1) id = `${slugify(text)}-${n}`;
        used.add(id);
        return `<h${depth} id="${id}"><a class="anchor" href="#${id}">${inner}</a></h${depth}>\n`;
      },
      table(token: Tokens.Table) {
        // Keep marked's table markup, wrapped so wide tables scroll inside a hairline frame.
        return `<div class="table-wrap"><table class="data-table">${
          `<thead><tr>${token.header
            .map((c) => `<th${c.align ? ` style="text-align:${c.align}"` : ""}>${this.parser.parseInline(c.tokens)}</th>`)
            .join("")}</tr></thead>`
        }<tbody>${token.rows
          .map(
            (row) =>
              `<tr>${row
                .map((c) => `<td${c.align ? ` style="text-align:${c.align}"` : ""}>${this.parser.parseInline(c.tokens)}</td>`)
                .join("")}</tr>`,
          )
          .join("")}</tbody></table></div>\n`;
      },
      code({ text, lang }: Tokens.Code) {
        const cls = lang ? ` class="language-${escapeAttr(lang.split(/\s/)[0])}"` : "";
        const body = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        // Focusable so keyboard users can scroll a long line.
        return `<pre class="guide-pre" tabindex="0"><code${cls}>${body}</code></pre>\n`;
      },
    },
  });

  // GitBook hints become callouts; the body is Markdown, so the blank lines let it parse as such.
  const withHints = md.replace(HINT, (_m, style: string, body: string) => {
    const kind = HINT_STYLES.has(style) ? style : "info";
    return `\n<aside class="callout callout-${kind}" aria-label="${HINT_LABEL[kind]}">\n\n${body.trim()}\n\n</aside>\n`;
  });
  return marked.parse(withHints) as string;
}

const plain = (md: string) =>
  md
    .replace(/\{%[\s\S]*?%\}/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();

function summarize(md: string, fallback: string) {
  for (const block of md.split(/\n{2,}/)) {
    const t = block.trim();
    if (!t || /^(#|\{%|\*|-|\d+\.|\||```|<)/.test(t)) continue;
    const text = plain(t).replace(/^Planned\.\s*/, "");
    if (!text) continue;
    return text.length > 180 ? `${text.slice(0, 177).replace(/\s+\S*$/, "")}…` : text;
  }
  return fallback;
}

export function getGuidePage(slug: string): GuidePage | null {
  const { items } = load();
  const index = items.findIndex((i) => i.slug === slug);
  if (index < 0) return null;
  const item = items[index];
  const known = new Map(items.map((i) => [i.file, i]));
  const source = read(item.file);
  const heading = /^# (.+)$/m.exec(source);
  const title = heading ? plain(heading[1]) : item.title;
  const body = source.replace(/^# .*\n+/, "");
  return {
    item,
    title,
    description: summarize(body, `Island user guide: ${title}.`),
    html: render(body, item.file, known),
    prev: items[index - 1] ?? null,
    next: items[index + 1] ?? null,
    editUrl: `${repoUrl}/edit/${siteConfig.branch}/${GUIDE_DIR}/${item.file}`,
  };
}
