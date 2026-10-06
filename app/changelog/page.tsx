import { ArrowUpRight, Link2 } from "lucide-react";
import type { Metadata } from "next";

import { getChangelog, getVersion } from "@/lib/data";
import { links } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Changelog",
  path: "/changelog/",
  socialTitle: "Island Changelog",
  description:
    "What changed in each Island release, generated from the browser repository's CHANGELOG.md on every deploy.",
});

const GROUP_COLOR: Record<string, string> = {
  added: "var(--space-green)",
  changed: "var(--space-blue)",
  fixed: "var(--space-coral)",
  removed: "var(--space-coral)",
  security: "var(--space-amber)",
  deprecated: "var(--space-amber)",
};

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function ChangelogPage() {
  const { intro, entries } = getChangelog();
  const version = getVersion();
  const latest = entries.find((e) => /^\d/.test(e.version))?.version;

  return (
    <div className="frame">
      <div className="gutter border-b border-line py-16 sm:py-20">
        <p className="label mb-4">Changelog</p>
        <h1 className="h1">What changed, release by release.</h1>
        <p className="lede mt-5 max-w-[64ch]">
          Island follows Semantic Versioning. The current version is{" "}
          <a href={`#v${version}`} className="font-mono text-[0.9em] text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">
            v{version}
          </a>{" "}
          — this page is generated from{" "}
          <a href={links.changelogSource} className="link">
            CHANGELOG.md
          </a>{" "}
          on every deploy.
        </p>
        {intro && (
          <details className="group mt-6 max-w-[64ch] text-sm">
            <summary className="cursor-pointer list-none font-mono text-xs text-fg-2 hover:text-fg [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">+ About this changelog</span>
              <span className="hidden group-open:inline">− About this changelog</span>
            </summary>
            <div className="prose mt-3 !text-sm" dangerouslySetInnerHTML={{ __html: intro }} />
          </details>
        )}
      </div>

      <ol aria-label="Releases">
        {entries.map((entry) => {
          const anchor = /^\d/.test(entry.version) ? `v${entry.version}` : entry.version.toLowerCase();
          return (
            <li
              key={entry.version}
              id={anchor}
              className="grid grid-cols-1 scroll-mt-20 border-b border-line last:border-b-0 lg:grid-cols-[260px_minmax(0,1fr)]"
            >
              <div className="gutter pt-10 lg:border-r lg:border-line lg:!pr-8 lg:pb-12">
                <div className="lg:sticky lg:top-24">
                  <h2 className="group flex items-center gap-2 font-mono text-2xl font-medium tracking-[-0.02em]">
                    <a href={`#${anchor}`} className="rounded-sm">
                      {/^\d/.test(entry.version) ? `v${entry.version}` : entry.version}
                    </a>
                    <Link2 className="size-4 text-fg-2 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {entry.date && (
                      <time dateTime={entry.date} className="text-sm text-fg-2">
                        {formatDate(entry.date)}
                      </time>
                    )}
                    {entry.version === latest && <span className="tag tag-new">Latest</span>}
                  </div>
                  {entry.link && (
                    <a
                      href={entry.link}
                      className="mt-3 inline-flex items-center gap-1 text-[13px] text-fg-2 transition-colors hover:text-fg"
                    >
                      Release on GitHub <ArrowUpRight className="size-3.5" aria-hidden />
                    </a>
                  )}
                </div>
              </div>
              <div className="gutter pt-6 pb-12 lg:pt-10">
                <div className="max-w-[720px] space-y-8">
                  {entry.groups.map((group) => (
                    <section key={group.title} aria-label={`${group.title} in ${entry.version}`}>
                      <h3 className="label mb-3 flex items-center gap-2 !text-fg">
                        <span
                          className="dot"
                          style={{ color: GROUP_COLOR[group.title.toLowerCase()] ?? "var(--text-2)" }}
                          aria-hidden="true"
                        />
                        {group.title}
                      </h3>
                      <div className="prose changelog-list" dangerouslySetInnerHTML={{ __html: group.html }} />
                    </section>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
