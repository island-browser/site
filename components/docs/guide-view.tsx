import { ArrowLeft, ArrowRight, Pencil } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { GuideSidebar } from "@/components/docs/guide-sidebar";
import { getGuideSections, type GuideItem } from "@/lib/guide";

function PagerLink({ item, dir }: { item: GuideItem; dir: "prev" | "next" }) {
  const next = dir === "next";
  return (
    <Link
      href={item.href}
      rel={dir}
      className={`card flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-hover ${next ? "items-end text-right sm:col-start-2" : ""}`}
    >
      <span className="flex items-center gap-1.5 text-xs text-fg-2">
        {!next && <ArrowLeft className="size-3.5" aria-hidden />}
        {next ? "Next" : "Previous"}
        {next && <ArrowRight className="size-3.5" aria-hidden />}
      </span>
      <span className="text-sm font-medium">{item.title}</span>
    </Link>
  );
}

/** Shared frame of every guide page: sidebar, content column, "Edit on GitHub", previous/next. */
export function GuideView({
  item,
  title,
  planned,
  editUrl,
  prev,
  next,
  children,
}: {
  item: GuideItem;
  title: string;
  planned: boolean;
  editUrl: string;
  prev: GuideItem | null;
  next: GuideItem | null;
  children: ReactNode;
}) {
  const sections = getGuideSections();
  return (
    <div className="frame">
      <div className="grid grid-cols-1 lg:grid-cols-[264px_minmax(0,1fr)]">
        <aside className="gutter border-b border-line py-4 lg:border-r lg:border-b-0 lg:!pr-6 lg:py-12">
          <div className="lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto">
            <GuideSidebar sections={sections} current={item.slug} currentTitle={title} />
          </div>
        </aside>

        <div className="gutter min-w-0 py-10 sm:py-14">
          <article className="guide max-w-[760px]">
            <header className="mb-8">
              <p className="label mb-3 flex items-center gap-2">
                User guide
                {planned && <span className="tag tag-next">Planned</span>}
              </p>
              <h1 className="h1">{title}</h1>
            </header>
            {children}

            <footer className="mt-14 border-t border-line pt-6">
              <a href={editUrl} className="link inline-flex items-center gap-1.5 text-sm">
                <Pencil className="size-3.5" aria-hidden />
                Edit this page on GitHub
              </a>
              {(prev || next) && (
                <nav aria-label="Pages" className="mt-6 grid gap-3 sm:grid-cols-2">
                  {prev && <PagerLink item={prev} dir="prev" />}
                  {next && <PagerLink item={next} dir="next" />}
                </nav>
              )}
            </footer>
          </article>
        </div>
      </div>
    </div>
  );
}
