import { ChevronDown } from "lucide-react";
import Link from "next/link";

import type { GuideSection } from "@/lib/guide";

function List({ sections, current }: { sections: GuideSection[]; current: string }) {
  return (
    <div className="space-y-5">
      {sections.map((section) => (
        <div key={section.title ?? "top"}>
          {section.title && <p className="label mb-1.5 px-2.5">{section.title}</p>}
          <ul className="space-y-0.5 text-sm">
            {section.items.map((item) => {
              const active = item.slug === current;
              return (
                <li key={item.file}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    style={item.depth ? { paddingLeft: `${10 + item.depth * 12}px` } : undefined}
                    className={`flex items-center justify-between gap-2 rounded-md px-2.5 py-1.5 transition-colors ${
                      active ? "bg-fill font-semibold text-fg" : "text-fg-2 hover:bg-hover hover:text-fg"
                    }`}
                  >
                    <span>{item.title}</span>
                    {item.planned && <span className="text-[11px] font-normal text-fg-3">Planned</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <div>
        <p className="label mb-1.5 px-2.5">More</p>
        <ul className="space-y-0.5 text-sm">
          <li>
            <Link href="/docs/technical/" className="block rounded-md px-2.5 py-1.5 text-fg-2 transition-colors hover:bg-hover hover:text-fg">
              Technical reference
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

/** Guide navigation built from SUMMARY.md: a sticky column on wide screens, a disclosure on phones. */
export function GuideSidebar({
  sections,
  current,
  currentTitle,
}: {
  sections: GuideSection[];
  current: string;
  currentTitle: string;
}) {
  return (
    <>
      <nav aria-label="User guide" className="hidden lg:block">
        <List sections={sections} current={current} />
      </nav>
      <details className="card group lg:hidden">
        <summary className="flex h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
          <span className="truncate">
            <span className="text-fg-2">Guide: </span>
            {currentTitle}
          </span>
          <ChevronDown className="size-4 flex-none text-fg-2 group-open:rotate-180" aria-hidden />
        </summary>
        <nav aria-label="User guide (mobile)" className="border-t border-line px-2 py-3">
          <List sections={sections} current={current} />
        </nav>
      </details>
    </>
  );
}
