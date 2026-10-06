"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export type TocItem = { id: string; label: string };

/** Sticky table of contents that highlights the section currently in view. */
export function DocsToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const onScroll = () => {
      const offset = 120;
      let current = sections[0]?.id;
      for (const el of sections) {
        if (el.getBoundingClientRect().top - offset <= 0) current = el.id;
      }
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        current = sections[sections.length - 1]?.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  const list = (
    <ul className="space-y-0.5 text-sm">
      {items.map((item) => {
        const current = item.id === active;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={current ? "location" : undefined}
              className={`-ml-px block border-l py-1.5 pl-4 transition-colors ${
                current
                  ? "border-fg font-medium text-fg"
                  : "border-transparent text-fg-2 hover:border-line-strong hover:text-fg"
              }`}
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <nav aria-label="On this page" className="hidden lg:block">
        <p className="label mb-4">On this page</p>
        <div className="border-l border-line">{list}</div>
      </nav>
      <details className="group rounded-md border border-line bg-surface lg:hidden">
        <summary className="flex h-11 cursor-pointer list-none items-center justify-between px-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
          On this page
          <ChevronDown className="size-4 text-fg-2 transition-transform group-open:rotate-180" aria-hidden />
        </summary>
        <nav aria-label="On this page (mobile)" className="border-t border-line px-4 py-3">
          <div className="border-l border-line">{list}</div>
        </nav>
      </details>
    </>
  );
}
