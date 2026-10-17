import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GuideView } from "@/components/docs/guide-view";
import { getGuidePage, getGuideSlugs } from "@/lib/guide";
import { pageMetadata } from "@/lib/metadata";

type Params = { slug: string[] };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getGuidePage(slug.join("/"));
  if (!page) return {};
  return pageMetadata({
    title: page.title,
    path: page.item.href,
    socialTitle: `${page.title} — Island user guide`,
    description: page.description,
  });
}

export default async function GuidePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = getGuidePage(slug.join("/"));
  if (!page) notFound();
  return (
    <GuideView
      item={page.item}
      title={page.title}
      planned={page.item.planned}
      editUrl={page.editUrl}
      prev={page.prev}
      next={page.next}
    >
      <div className="prose guide-body" dangerouslySetInnerHTML={{ __html: page.html }} />
    </GuideView>
  );
}
