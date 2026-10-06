"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

import { GitHubMark, IslandMark } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { links } from "@/lib/site";

const NAV = [
  { href: "/#features", label: "Features" },
  { href: "/#agents", label: "Agents" },
  { href: "/docs/", label: "Docs" },
  { href: "/changelog/", label: "Changelog" },
  { href: "/download/", label: "Download" },
];

const isCurrent = (pathname: string, href: string) =>
  !href.includes("#") && pathname.replace(/\/?$/, "/") === href;

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
      <div className="frame-inner gutter flex h-16 items-center gap-6">
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
            className="hidden h-6 items-center rounded-full border border-line bg-surface px-2 font-mono text-[11px] text-fg-2 transition-colors hover:border-line-strong hover:text-fg sm:inline-flex"
            aria-label={`Version ${version} — what's new`}
          >
            v{version}
          </Link>
        </div>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const current = isCurrent(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={`rounded-sm px-2.5 py-1.5 text-sm transition-colors ${
                      current ? "text-fg" : "text-fg-2 hover:text-fg"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
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
