import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";

import { Band } from "@/components/section";
import { getVersion } from "@/lib/data";

import { NativeMockup } from "../_shared/native-mockup";
import { heroLede, heroTitle, pillars, research, sevenLabel } from "../_shared/copy";

export const metadata = { title: "Explore: Graphite refreshed", robots: { index: false } };

/** Direction 1: today's Graphite tokens and Geist, a clearer hierarchy, the Native mockup. */
export default function GraphiteExplore() {
  const version = getVersion();
  const seven = sevenLabel(version);
  return (
    <div className="frame">
      <section className="relative" aria-labelledby="g-hero">
        <div className="gutter grid gap-10 pt-16 pb-12 sm:pt-24 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <Link href="/changelog/" className="inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1 pr-3 pl-1 text-[13px]">
              <span className="tag tag-new rounded-full">{seven}</span>
              Native look · Plan tab · ⌘/ cheatsheet
              <ArrowRight className="size-3.5 text-fg-2" aria-hidden />
            </Link>
            <h1 id="g-hero" className="display mt-7 max-w-[14ch]">
              {heroTitle}
            </h1>
          </div>
          <div>
            <p className="lede">{heroLede}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/download/" className="btn btn-primary">
                <Download className="size-4" aria-hidden /> Download {version}
              </Link>
              <Link href="/docs/" className="btn btn-secondary">
                Read the docs
              </Link>
            </div>
            <p className="mt-4 font-mono text-xs text-fg-2">Unsigned prerelease · macOS Apple silicon verified</p>
          </div>
        </div>
        <div className="relative border-t border-line px-3 py-6 sm:px-8 sm:py-10 lg:px-12">
          <span className="cross cross-tl" aria-hidden="true" />
          <span className="cross cross-tr" aria-hidden="true" />
          <NativeMockup />
        </div>
        <ul className="grid grid-cols-2 gap-px border-t border-line bg-line lg:grid-cols-4">
          {pillars.map((p) => (
            <li key={p.id} className="cell-pad bg-bg">
              <p className="label">{p.title}</p>
              <ul className="mt-3 space-y-1.5 text-[14px] text-fg-2">
                {p.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <Band labelledBy="g-research">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="gutter py-16 lg:border-r lg:border-line">
            <div className="flex items-center gap-2">
              <span className="label">{research.label}</span>
              <span className="tag tag-new">{seven}: Plan tab</span>
            </div>
            <h2 id="g-research" className="h2 mt-4">
              {research.title}
            </h2>
            <p className="lede mt-4">{research.body}</p>
          </div>
          <ol className="divide-y divide-line">
            {research.points.map((pt, i) => (
              <li key={pt} className="gutter flex gap-5 py-7">
                <span className="font-mono text-xs text-fg-2">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[15px]">{pt}</span>
              </li>
            ))}
          </ol>
        </div>
      </Band>
    </div>
  );
}
