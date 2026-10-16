import { BookOpen, Download, Search, Shield, Sparkles, Waypoints } from "lucide-react";
import Link from "next/link";

import { IslandMark } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { getVersion } from "@/lib/data";

import { NativeMockup } from "../_shared/native-mockup";
import { heroLede, heroTitle, research, sevenLabel } from "../_shared/copy";
import n from "./native.module.css";

export const metadata = { title: "Explore: Native", robots: { index: false } };

const NAV = ["Overview", "Docs", "Changelog", "Download"];

const ROWS = [
  { Icon: Waypoints, title: "Plan tab", text: "Graph or List of the agent's plan", value: "0.7" },
  { Icon: Sparkles, title: "Research", text: "Sources compared, every claim cited", value: "Report tab" },
  { Icon: BookOpen, title: "Reader", text: "Size, width and four themes", value: "⌥⌘R" },
  { Icon: Shield, title: "Blocking", text: "EasyList and EasyPrivacy on device", value: "On" },
  { Icon: Search, title: "History search", text: "50,000 visits, searched from ⌘K", value: "Local" },
];

/** Direction 2: the site speaks the browser's Native look (system font, grey source list, one blue). */
export default function NativeExplore() {
  const version = getVersion();
  const seven = sevenLabel(version);
  return (
    <div className={n.root}>
      {/* Prototype only: the Native direction brings its own header and footer. */}
      <style>{`#main ~ footer, body header.sticky { display: none; }`}</style>
      <header className={n.toolbar}>
        <Link href="/" className={n.brand}>
          <IslandMark className="size-[20px]" />
          Island
        </Link>
        <nav aria-label="Prototype" className={n.seg}>
          {NAV.map((label, i) => (
            <Link key={label} href={i === 0 ? "/_explore/native/" : "/docs/"} className={i === 0 ? n.segActive : n.segItem}>
              {label}
            </Link>
          ))}
        </nav>
        <span className={n.toolEnd}>
          <ThemeToggle />
        </span>
      </header>

      <section className={n.hero} aria-labelledby="n-hero">
        <p className={n.pill}>{seven}: the Native look is the default</p>
        <h1 id="n-hero" className={n.title}>
          {heroTitle}
        </h1>
        <p className={n.lede}>{heroLede}</p>
        <div className={n.actions}>
          <Link href="/download/" className={n.primary}>
            <Download aria-hidden /> Download {version}
          </Link>
          <Link href="/docs/" className={n.secondary}>
            Read the docs
          </Link>
        </div>
        <p className={n.note}>Unsigned prerelease · macOS on Apple silicon is the verified target</p>
      </section>

      <div className={n.stage}>
        <NativeMockup />
      </div>

      <section className={n.block} aria-labelledby="n-research">
        <div>
          <p className={n.kicker}>{research.label}</p>
          <h2 id="n-research" className={n.h2}>
            {research.title}
          </h2>
          <p className={n.body}>{research.body}</p>
        </div>
        <div className={n.group}>
          <p className={n.groupHead}>What a research turn uses</p>
          <ul className={n.card}>
            {ROWS.map(({ Icon, title, text, value }) => (
              <li key={title} className={n.cardRow}>
                <span className={n.rowIcon}>
                  <Icon aria-hidden />
                </span>
                <span className={n.rowText}>
                  <b>{title}</b>
                  <span>{text}</span>
                </span>
                <span className={n.rowValue}>{value}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
