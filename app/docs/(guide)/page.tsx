import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GuideView } from "@/components/docs/guide-view";
import { getGuideLanding, getGuidePage, getGuideSections } from "@/lib/guide";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "User guide",
  path: "/docs/",
  socialTitle: "Island user guide",
  description:
    "Task-first guide to Island: install it, organize tabs with spaces, search with the command palette, use the agent, and tune privacy and settings.",
});

export default function DocsLandingPage() {
  const landing = getGuideLanding();
  const page = landing ? getGuidePage(landing.slug) : null;
  if (!landing || !page) notFound();
  const sections = getGuideSections().filter((s) => s.title);

  return (
    <GuideView
      item={page.item}
      title={page.title}
      planned={false}
      editUrl={page.editUrl}
      prev={null}
      next={sections[0]?.items[0] ?? null}
    >
      <div className="prose guide-body" dangerouslySetInnerHTML={{ __html: page.html }} />
      <div className="prose guide-body mt-11">

        <h2 id="all-pages">
          <a className="anchor" href="#all-pages">
            All pages
          </a>
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {sections.map((section) => (
            <div key={section.title} className="card">
              <p className="label border-b border-line px-4 py-2.5">{section.title}</p>
              <ul className="plain">
                {section.items.map((item) => (
                  <li key={item.file} className="card-row !min-h-0 py-2 text-sm">
                    <Link href={item.href} className="flex-1 text-fg hover:underline">
                      {item.title}
                    </Link>
                    {item.planned && <span className="text-[11px] text-fg-3">Planned</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 id="technical-reference">
          <a className="anchor" href="#technical-reference">
            Technical reference
          </a>
        </h2>
        <p>
          Building from source, the exact MCP configuration, the project layout and an honest status
          of every feature are on the <Link href="/docs/technical/">technical reference</Link> page.
        </p>
      </div>
    </GuideView>
  );
}
