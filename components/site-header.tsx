"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

import { GitHubMark, IslandMark } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { links } from "@/lib/site";

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/docs/", label: "Docs" },
  { href: "/changelog/", label: "Changelog" },
  { href: "/download/", label: "Download" },
];

const isCurrent = (pathname: string, href: string) => {
  const here = pathname.replace(/\/?$/, "/");
  // The guide lives under /docs/, so every page below it keeps "Docs" current.
  return !href.includes("#") && (href === "/docs/" ? here.startsWith(href) : here === href);
};

export function SiteHeader({ version }: { version: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const menuId = useId();

  // Close the mobile menu after navigating.
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-[var(--header-bg)] backdrop-blur-md backdrop-saturate-150">
      <div className="frame-inner gutter relative flex h-[52px] items-center gap-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-sm text-[15px] font-semibold tracking-[-0.02em]"
            aria-label="Island home"
          >
            <IslandMark className="size-[22px]" />
            <span>Island</span>
          </Link>
          <Link
            href={`/changelog/#v${version}`}
            className="hidden h-[22px] items-center rounded-full bg-fill px-2 text-[12px] text-fg-2 transition-colors hover:text-fg sm:inline-flex"
            aria-label={`Version ${version} — what's new`}
          >
            v{version}
          </Link>
        </div>

        <nav aria-label="Primary" className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <ul className="segmented">
            {NAV.map((item) => (
              <li key={item.href} className="contents">
                <Link href={item.href} aria-current={isCurrent(pathname, item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <a href={links.repo} className="icon-btn" aria-label="Island on GitHub" title="GitHub">
            <GitHubMark />
          </a>
          <ThemeToggle />
          <button
            type="button"
            className="icon-btn md:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
          </button>
        </div>
      </div>

      <nav
        id={menuId}
        aria-label="Mobile"
        hidden={!open}
        className="border-t border-line bg-bg md:hidden"
      >
        <ul className="gutter flex flex-col py-2">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                className="flex h-11 items-center border-b border-line text-[15px] text-fg-2 last:border-0 hover:text-fg aria-[current=page]:text-fg"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={`/changelog/#v${version}`}
              onClick={() => setOpen(false)}
              className="flex h-11 items-center font-mono text-[13px] text-fg-2 hover:text-fg"
            >
              v{version} — what&rsquo;s new
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
