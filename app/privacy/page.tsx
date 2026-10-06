import type { Metadata } from "next";

import { links } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  path: "/privacy/",
  socialTitle: "Privacy — Island",
  description: "Island product site privacy information: no analytics, trackers, or remote fonts.",
});

const SECTIONS = [
  {
    title: "Information collection",
    body: (
      <p>
        Island does not collect personal information through this site. Visiting these pages does
        not create an account or send first-party analytics events.
      </p>
    ),
  },
  {
    title: "Hosting and delivery",
    body: (
      <p>
        When this site is served through GitHub Pages, GitHub and its delivery providers may process
        ordinary web requests such as IP address, browser, and request-log information to operate and
        secure the service. Island does not control that processing.
      </p>
    ),
  },
  {
    title: "GitHub and external links",
    body: (
      <p>
        GitHub links and GitHub Pages hosting are governed by the{" "}
        <a href={links.githubPrivacy}>GitHub Privacy Statement</a>. Other external links are governed
        by their respective privacy policies.
      </p>
    ),
  },
  {
    title: "The browser and your data",
    body: (
      <p>
        Importing from another browser reads that browser&rsquo;s files on your own computer;
        nothing is uploaded. The agent tools endpoint listens on <code>127.0.0.1</code> only, behind
        a token that changes on every launch and is stored in a file only your user account can read.
        The sidebar agent is a program you choose and run locally — what it sends to its own provider
        is governed by that agent&rsquo;s terms, not by Island.
      </p>
    ),
  },
  {
    title: "Product status",
    body: (
      <p>
        The browser is under development. Any future product data practices will be documented
        separately before a public release.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="frame">
      <div className="gutter border-b border-line py-16 sm:py-20">
        <p className="label mb-4">Privacy</p>
        <h1 className="h1">A quiet product site.</h1>
        <p className="lede mt-5 max-w-[60ch]">
          This static site does not run first-party analytics, advertising scripts, trackers, or
          remote fonts.
        </p>
      </div>
      <div>
        {SECTIONS.map((s, i) => (
          <section
            key={s.title}
            aria-labelledby={`privacy-${i}`}
            className="grid grid-cols-1 gap-3 border-b border-line last:border-b-0 lg:grid-cols-[260px_minmax(0,1fr)]"
            data-reveal
          >
            <h2 id={`privacy-${i}`} className="gutter pt-10 text-[15px] font-semibold tracking-[-0.01em] lg:border-r lg:border-line lg:!pr-8 lg:pb-10">
              <span className="mr-3 font-mono text-xs font-normal text-fg-2">{String(i + 1).padStart(2, "0")}</span>
              {s.title}
            </h2>
            <div className="gutter prose max-w-[720px] pb-10 lg:pt-10">{s.body}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
