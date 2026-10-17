import type { Metadata } from "next";

import { getVersion } from "@/lib/data";
import { links } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  path: "/privacy/",
  socialTitle: "Privacy — Island",
  description:
    "No analytics, trackers or remote fonts on this site; what the Island browser sends (blocklists, update checks, searches, your agent) and what it keeps on your device.",
});

const SITE = [
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
];

/** What Island's own code sends, besides the pages you open (from the browser repository). */
const SENDS = [
  {
    what: "Ad and tracker lists",
    where: "easylist.to",
    when: "EasyList and EasyPrivacy, refreshed in the background at most every four days.",
  },
  {
    what: "Update checks",
    where: "api.github.com",
    when: "At most once a day after startup, or when you ask; the archive is downloaded only when an update exists. Off with ISLAND_DISABLE_UPDATES=1, and never from a CMake build directory.",
  },
  {
    what: "Searches",
    where: "Your search engine",
    when: "Text you search from the address bar or the start page goes to Google, DuckDuckGo or Yandex, as chosen in Settings. The search palette sends it to the provider you pick there.",
  },
  {
    what: "The agent",
    where: "The program you run",
    when: "Questions, Research and the page text it reads through Island's tools go to the ACP agent you configured. What that agent sends to its own provider is governed by its terms, not Island's.",
  },
];

const KEEPS = [
  "Browsing history: the address and title of http and https pages, up to 50,000 visits. Settings can stop recording or clear it.",
  "Research reports in reports.json, listed in Settings → Reports.",
  "Your session (spaces and tabs), your settings and shortcuts in prefs.json, and the cached blocklists.",
  "The agent tools endpoint's port and token in agent-endpoint.json, readable only by your user. The endpoint listens on 127.0.0.1 only, and the token changes on every launch.",
];

export default function PrivacyPage() {
  const version = getVersion();
  return (
    <div className="frame">
      <div className="gutter border-b border-line py-16 sm:py-20">
        <p className="label mb-3">Privacy</p>
        <h1 className="h1">A quiet site, and a quiet browser.</h1>
        <p className="lede mt-5 max-w-[62ch]">
          This static site runs no first-party analytics, advertising scripts, trackers, or remote
          fonts. The browser keeps what it stores on your device, and this page lists every request
          its own code makes besides the pages you open.
        </p>
      </div>

      <section aria-labelledby="privacy-site" className="gutter border-b border-line py-14">
        <h2 id="privacy-site" className="h2">
          This site
        </h2>
        <div className="card mt-6 max-w-[860px]">
          {SITE.map((s) => (
            <div key={s.title} className="card-row !block !py-4">
              <h3 className="h3">{s.title}</h3>
              <div className="prose mt-1 !text-[14.5px]">{s.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="browser" aria-labelledby="privacy-browser" className="gutter scroll-mt-20 py-14">
        <h2 id="privacy-browser" className="h2">
          The browser
        </h2>
        <p className="lede mt-3 max-w-[66ch]">
          As of Island {version}. Island has no analytics, telemetry or crash reporting, and
          importing from another browser only reads that browser&rsquo;s files on your computer.
        </p>

        <h3 className="label mt-10 mb-2 px-1">What it sends</h3>
        <ul className="card max-w-[860px]">
          {SENDS.map((r) => (
            <li key={r.what} className="card-row !items-start !py-4 max-sm:flex-col max-sm:!gap-1">
              <span className="w-[180px] flex-none">
                <b className="block text-[14px] font-semibold">{r.what}</b>
                <span className="text-[12.5px] text-fg-2">{r.where}</span>
              </span>
              <span className="text-[14px] leading-relaxed text-fg-2">{r.when}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 max-w-[860px] px-1 text-[13px] text-fg-2">
          The start page, Reader, Peek, Report and Plan tabs are local documents: they request
          nothing on their own. Favicons are fetched for web pages only. Site permission requests
          (camera, microphone, location, notifications) are declined.
        </p>

        <h3 className="label mt-10 mb-2 px-1">What it keeps, on this device</h3>
        <ul className="card max-w-[860px]">
          {KEEPS.map((k) => (
            <li key={k} className="card-row text-[14px] leading-relaxed text-fg-2">
              {k}
            </li>
          ))}
        </ul>

        <h3 className="label mt-10 mb-2 px-1">Product status</h3>
        <p className="max-w-[66ch] px-1 text-[14.5px] leading-relaxed text-fg-2">
          Island is an unsigned prerelease. This page describes the repository as it stands; if a
          later version sends anything else, this list changes with it.
        </p>
      </section>
    </div>
  );
}
