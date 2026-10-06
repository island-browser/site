import Link from "next/link";

import { IslandMark } from "@/components/logo";
import { ThemeSwitcher } from "@/components/theme-toggle";
import { links } from "@/lib/site";

const COLUMNS = [
  {
    title: "Product",
    items: [
      { href: "/#features", label: "Features" },
      { href: "/#agents", label: "Agents" },
      { href: "/download/", label: "Download" },
      { href: "/changelog/", label: "Changelog" },
    ],
  },
  {
    title: "Resources",
    items: [
      { href: "/docs/", label: "Docs" },
      { href: "/docs/#quick-start", label: "Quick start" },
      { href: "/privacy/", label: "Privacy" },
      { href: links.repo, label: "GitHub", external: true },
    ],
  },
];

export function SiteFooter({ version }: { version: string }) {
  return (
    <footer className="border-t border-line">
      <div className="frame">
        <div className="gutter grid gap-10 py-14 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col items-start gap-4">
            <Link href="/" className="flex items-center gap-2 rounded-sm font-semibold tracking-[-0.02em]">
              <IslandMark className="size-[22px]" />
              <span>Island</span>
            </Link>
            <p className="max-w-[34ch] text-sm text-fg-2">
              Made openly. Browser software is in development.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="label mb-4">{col.title}</p>
              <ul className="space-y-2.5 text-sm">
                {col.items.map((item) => (
                  <li key={item.href}>
                    {"external" in item ? (
                      <a href={item.href} className="text-fg-2 transition-colors hover:text-fg">
                        {item.label}
                      </a>
                    ) : (
                      <Link href={item.href} className="text-fg-2 transition-colors hover:text-fg">
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="gutter flex flex-wrap items-center justify-between gap-4 border-t border-line py-5">
          <p className="font-mono text-xs text-fg-2">
            Island v{version} · MIT License
          </p>
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
}
