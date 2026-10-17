import { ArrowRight, ArrowUpRight, Check, Download } from "lucide-react";
import Link from "next/link";

import { Keys } from "@/components/keys";
import { Band, SectionHeader } from "@/components/section";
import {
  acpCommand,
  acpProviders,
  comboFor,
  hasSeven,
  mcpBridgeConfig,
  mcpHttpConfig,
  sevenLabel,
  shortcutCount,
  shortcuts,
  toolCount,
  toolGroups,
} from "@/lib/content";
import { PLATFORMS } from "@/lib/platforms";
import { links } from "@/lib/site";

import { AgentTabs } from "./agent-tabs";
import { BrowserMockup } from "./browser-mockup";
import h from "./home.module.css";

export function Hero({ version }: { version: string }) {
  const seven = sevenLabel(version);
  return (
    <section aria-labelledby="hero-title" className="relative">
      <div className={`gutter flex flex-col items-center pt-16 pb-12 text-center sm:pt-24 sm:pb-14 ${h.heroCopy}`}>
        <Link href="/changelog/" className={h.announce}>
          <span className="tag tag-new">{seven}</span>
          <span>Native look · Plan tab · ⌘/ cheatsheet</span>
          <ArrowRight className="size-3.5 flex-none text-fg-2" aria-hidden />
        </Link>
        <h1 id="hero-title" className="display mt-7 max-w-[17ch]">
          A calm browser, with an agent that shows its work.
        </h1>
        <p className="lede mt-5 max-w-[60ch]">
          Island is a native desktop browser built directly on CEF, with no Electron shell. Tabs and
          spaces sit in a quiet sidebar; Reader view, find in page and a built-in ad and tracker
          blocker keep pages readable; and an agent one keystroke away can research a question and
          hand back a report that cites every claim.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/download/" className="btn btn-primary">
            <Download className="size-4" aria-hidden />
            Download {version}
          </Link>
          <Link href="/docs/" className="btn btn-secondary">
            Read the docs
          </Link>
        </div>
        <p className="mt-5 max-w-[52ch] text-[13px] leading-relaxed text-fg-2">
          Unsigned prereleases for macOS, Windows and Linux. Only macOS on Apple silicon has been
          verified on real hardware.
        </p>
      </div>

      <div className="relative">
        <div className={`gutter ${h.mockupIn}`}>
          <BrowserMockup />
        </div>
        <p className="gutter mx-auto max-w-[760px] py-6 text-center text-[13px] leading-relaxed text-fg-2">
          <span className="tag tag-new mr-2 align-[1px]">{seven}</span>
          The Native look, Island&rsquo;s new default. Pick a tab in the sidebar: the Plan tab, a page
          with blocked trackers, two Reader pages, and the start page.
          {!hasSeven(version) && (
            <> Island {version} still has the Graphite sidebar; 0.7 adds Native, Arc and Graphite as looks in Settings.</>
          )}
        </p>
      </div>
    </section>
  );
}

const STEPS = [
  {
    kicker: "Ask",
    title: "Ask on the start page",
    text: "Pick Research and type the question. The agent opens a new space named after it.",
    seven: false,
  },
  {
    kicker: "Plan",
    title: "Review the plan",
    text: "Steps, branches, a join and a result in a Plan tab, as a graph or a list. Skip, restore, branch or expand a step.",
    seven: true,
  },
  {
    kicker: "Approve",
    title: "Run when you say so",
    text: "Nothing runs until you choose Run plan or Run one branch only. Cancel stops it.",
    seven: true,
  },
  {
    kicker: "Report",
    title: "Read the report",
    text: "Markdown that cites every claim, in a Report tab: copy it, save it as .md, or continue in the panel.",
    seven: false,
  },
];

export function Research({ version }: { version: string }) {
  const seven = sevenLabel(version);
  return (
    <Band id="research" labelledBy="research-title">
      <SectionHeader
        id="research-title"
        label="Research"
        title="Research that is planned before it runs."
        lede={
          <>
            Research sends a question to your agent with Island&rsquo;s browser tools: it opens
            sources in tabs, compares them and finishes with a cited report. In 0.7 the agent first
            proposes a plan, at most three levels of branching deep, and waits for you.
          </>
        }
        action={
          <Link href="/docs/#research" className="btn btn-secondary">
            How research works <ArrowRight className="size-4" aria-hidden />
          </Link>
        }
      />
      <ol className={`gutter pb-16 sm:pb-20 ${h.lane}`} aria-label="A research turn">
        {STEPS.map((st, i) => (
          <li key={st.kicker} className={`card ${h.step}`} data-reveal>
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-[12px] font-semibold text-fg-2">
                {i + 1}. {st.kicker}
              </span>
              {st.seven && <span className="tag tag-new">{seven}</span>}
            </span>
            <b className="mt-2 block text-[15px] font-semibold">{st.title}</b>
            <span className="mt-1 block text-[13.5px] leading-snug text-fg-2">{st.text}</span>
          </li>
        ))}
      </ol>
    </Band>
  );
}

const LOOKS = [
  {
    id: "native",
    name: "Native",
    note: "Default for new profiles",
    text: "A grey source-list sidebar, a segmented space switcher, system-blue selection, and page state as indicators in the address field. No space colors.",
  },
  {
    id: "arc",
    name: "Arc",
    note: "Existing profiles keep it",
    text: "The sidebar and window margin tinted by the space, the page on an inset rounded card, and a frameless window on macOS.",
  },
  {
    id: "graphite",
    name: "Graphite",
    note: "The 0.6 sidebar",
    text: "Neutral greys and hairlines, a near-white sidebar, and an outlined selected row.",
  },
] as const;

export function Looks({ version }: { version: string }) {
  const seven = sevenLabel(version);
  return (
    <Band id="looks" labelledBy="looks-title">
      <SectionHeader
        id="looks-title"
        label="Looks"
        tag={<span className="tag tag-new">{seven}</span>}
        title="Three looks, one browser."
        lede="Settings → Appearance starts with a look preset. Change any control (space color, tint, sidebar side, corner radius, density, font, shadow, full bleed) and the look becomes Custom."
      />
      <ul className="gutter grid grid-cols-1 gap-4 pb-16 sm:pb-20 md:grid-cols-3">
        {LOOKS.map((l) => (
          <li key={l.id} className="card" data-reveal>
            <div className={`${h.look} ${h[l.id]}`} aria-hidden="true">
              <div className={h.lookSide}>
                <i />
                <i className={h.selected} />
                <i />
                <i />
              </div>
              <div className={h.lookPage} />
            </div>
            <div className="p-4">
              <p className="flex items-baseline justify-between gap-3">
                <b className="text-[15px] font-semibold">{l.name}</b>
                <span className="text-[12px] text-fg-2">{l.note}</span>
              </p>
              <p className="mt-1.5 text-[13.5px] leading-snug text-fg-2">{l.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </Band>
  );
}

export function Agents() {
  const tabs = [
    {
      id: "acp",
      label: "ACP agents",
      short: "ACP",
      filename: "the agent that runs in the sidebar",
      lang: "shell" as const,
      code: acpCommand,
      note: "Island hands every provider the browser tools and tells it which tab you are looking at.",
    },
    {
      id: "http",
      label: "HTTP (MCP)",
      short: "HTTP",
      filename: "mcp.json · Claude Code, Cursor, any MCP client",
      lang: "json" as const,
      code: mcpHttpConfig,
      note: "Settings → Agent & tools shows this config with the current token, ready to copy. The port is 9223 unless it is taken.",
    },
    {
      id: "stdio",
      label: "stdio bridge",
      short: "stdio",
      filename: "mcp.json · clients that only speak stdio",
      lang: "json" as const,
      code: mcpBridgeConfig,
      note: "The bundled island_mcp_bridge reads the port and token from agent-endpoint.json for you.",
    },
  ];

  return (
    <Band id="agents" labelledBy="agents-title">
      <SectionHeader
        id="agents-title"
        label="Made for agents"
        title="Bring your agent. Lend it the browser."
        lede={
          <>
            <Keys combo={comboFor("toggle_agent")} /> opens an Agent Client Protocol agent beside the
            page. Replies stream in as Markdown and tool calls ask before they act. Any MCP client can
            use the same tools: Island listens on <code className="icode">127.0.0.1</code> only,
            behind a bearer token that changes on every launch.
          </>
        }
        action={
          <Link href="/docs/#agents" className="btn btn-secondary">
            Set up an agent <ArrowRight className="size-4" aria-hidden />
          </Link>
        }
      />
      <div className="gutter grid grid-cols-1 gap-6 pb-16 sm:pb-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-6" data-reveal>
          <AgentTabs tabs={tabs} />
          <div>
            <div className="mb-2 flex items-baseline justify-between gap-4 px-1">
              <h3 className="label">ACP providers</h3>
              <span className="text-[12px] text-fg-2">Settings → Agent &amp; tools</span>
            </div>
            <ul className="card">
              {acpProviders.map((p) => (
                <li key={p.id} className="card-row flex-col !items-start !gap-1 sm:flex-row sm:!items-center sm:justify-between sm:!gap-4">
                  <span className="flex min-w-0 flex-col">
                    <span className="text-[14px] font-semibold">{p.name}</span>
                    <span className="text-[12px] text-fg-2">{p.needs}</span>
                  </span>
                  <code className="min-w-0 break-all font-mono text-[12px] sm:text-right">{p.command}</code>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="min-w-0" data-reveal>
          <div className="mb-2 flex items-baseline justify-between gap-4 px-1">
            <h3 className="label">All {toolCount} tools</h3>
            <span className="font-mono text-[12px] text-fg-2">browser_* · page_*</span>
          </div>
          <dl className="card">
            {toolGroups.map((g) => (
              <div key={g.label} className="card-row !items-start">
                <dt className="w-[68px] flex-none pt-0.5 text-[13px] font-semibold">{g.label}</dt>
                <dd className="min-w-0">
                  <ul className="flex flex-wrap gap-1.5">
                    {g.tools.map((t) => (
                      <li key={t}>
                        <code className="inline-flex h-6 items-center rounded-[5px] bg-fill px-1.5 font-mono text-[11.5px]">{t}</code>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-1.5 text-[13px] text-fg-2">{g.summary}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Band>
  );
}

const HOME_SHORTCUTS = [
  "command_palette",
  "toggle_agent",
  "toggle_sidebar",
  "toggle_split",
  "find_in_page",
  "reader_mode",
  "tab_overview",
  "cheatsheet",
];

export function KeyboardSection({ version }: { version: string }) {
  const seven = sevenLabel(version);
  const items = HOME_SHORTCUTS.map((id) => shortcuts.find((s) => s.id === id)!);
  return (
    <Band id="keyboard" labelledBy="keyboard-title">
      <SectionHeader
        id="keyboard-title"
        label="Keyboard first"
        title="One keystroke from anything."
        lede={
          <>
            Island {version} has {shortcutCount(version)} actions with a default binding, and each one can be re-recorded in
            Settings → Shortcuts. Shown for macOS; on Windows and Linux use{" "}
            <Keys combo={["Ctrl"]} /> for <Keys combo={["Cmd"]} /> and <Keys combo={["Alt"]} /> for{" "}
            <Keys combo={["Opt"]} />.
          </>
        }
        action={
          <Link href="/docs/#shortcuts" className="btn btn-secondary">
            All shortcuts <ArrowRight className="size-4" aria-hidden />
          </Link>
        }
      />
      <ul className="gutter grid grid-cols-2 gap-3 pb-16 sm:pb-20 lg:grid-cols-4">
        {items.map((s) => (
          <li key={s.id} className="card keys-lg flex min-h-[104px] flex-col justify-between gap-5 p-4" data-reveal>
            <span className="flex items-start justify-between gap-2">
              <Keys combo={comboFor(s.id)} />
              {s.since && <span className="tag tag-new">{seven}</span>}
            </span>
            <span className="text-[14px] text-fg-2">{s.action}</span>
          </li>
        ))}
      </ul>
    </Band>
  );
}

export function Availability({ version }: { version: string }) {
  return (
    <Band id="availability" labelledBy="availability-title">
      <div className="gutter grid grid-cols-1 gap-10 py-16 sm:py-20 lg:grid-cols-2">
        <div className="flex flex-col gap-8" data-reveal>
          <div>
            <p className="label mb-3">Availability</p>
            <h2 id="availability-title" className="h2">
              Six targets, one verified.
            </h2>
            <p className="lede mt-4">
              Since 0.5 every release is packaged for macOS, Windows and Linux, on x64 and arm64, as
              unsigned prereleases with a checksum file. Only macOS on Apple silicon has been built
              and run on real hardware so far.
            </p>
          </div>
          <ul className="card">
            {PLATFORMS.map((p) => (
              <li key={p.target} className="card-row justify-between">
                <span className="text-[14px] font-semibold">
                  {p.name} <span className="font-normal text-fg-2">· {p.detail}</span>
                </span>
                <span className="tag">
                  <span className={`dot ${p.verified ? "text-success" : "text-fg-3"}`} aria-hidden="true" />
                  {p.verified ? "Verified" : "Packaged, unverified"}
                </span>
              </li>
            ))}
          </ul>
          <div>
            <Link href="/download/" className="btn btn-primary">
              <Download className="size-4" aria-hidden /> Download {version}
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-8" data-reveal>
          <div>
            <p className="label mb-3">First run</p>
            <h2 className="h2">A welcome that offers, never blocks.</h2>
            <p className="lede mt-4">
              A fresh install shows one card: pick a theme, tick the browsers to import from, and
              start browsing. Escape skips it, and Settings can import again at any time.
            </p>
          </div>
          <div className={`card ${h.welcome}`} aria-hidden="true">
            <p className="text-[15px] font-semibold">Welcome to Island</p>
            <p className="mt-1 text-[12.5px] text-fg-2">
              Choose how Island looks, and bring your bookmarks and spaces from the browser you were
              using.
            </p>
            <div className="segmented mt-4 w-full [&>span]:flex-1">
              <span aria-checked="true">System</span>
              <span>Light</span>
              <span>Dark</span>
            </div>
            <ul className={h.importRows}>
              <li>
                <span className={`${h.box} ${h.boxOn}`}>
                  <Check className="size-3" />
                </span>{" "}
                Arc — 4 spaces, 23 pinned tabs
              </li>
              <li>
                <span className={`${h.box} ${h.boxOn}`}>
                  <Check className="size-3" />
                </span>{" "}
                Google Chrome
              </li>
              <li>
                <span className={h.box} /> Firefox
              </li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="btn btn-primary btn-sm">Import and start</span>
              <span className="btn btn-secondary btn-sm">Just start browsing</span>
            </div>
          </div>
        </div>
      </div>
    </Band>
  );
}

const NEXT = [
  {
    title: "Agent actions you can trust",
    text: "The agent takes reversible steps on its own and stops at a confirmation card before it submits, buys, pays, sends or deletes, fills card fields, or moves to another site mid-task. “Trust this site” skips the card there. Password fields stay off-limits, even on trusted sites.",
  },
  {
    title: "One task at a time, in a visible queue",
    text: "Background tasks run one by one. Reorder, remove or stop them; the queue pauses while a task waits for you.",
  },
  {
    title: "Ask from where you are",
    text: "Ask or Explain on a selection, Summarize a link through Peek, palette commands for the page and for collecting from tabs, and ⌘J that carries the current page along.",
  },
  {
    title: "Collect from tabs",
    text: "Pull the same facts out of several tabs into a table in a Report tab, then export it as CSV, JSON or Markdown.",
  },
  {
    title: "Everyday browsing",
    text: "A favorites grid shared by every space, folders for pinned tabs, a downloads popover, a now-playing control with per-tab mute, and optional auto-archive of old tabs.",
  },
  {
    title: "Reading and a Library",
    text: "Highlights with notes, Read later as an offline Reader copy, and island://library to search reports, highlights, saved pages and archived tabs together, all on the device.",
  },
  {
    title: "Release readiness",
    text: "Updates checked against Island's own signed manifest, history import from Chrome, Safari and Firefox, and local crash reports that are uploaded only if you agree.",
  },
];

export function ComingNext() {
  return (
    <Band id="next" labelledBy="next-title">
      <SectionHeader
        id="next-title"
        label="Coming next"
        tag={<span className="tag tag-next">Roadmap · not in a release</span>}
        title="What the next big release is building."
        lede="This is the direction of work in progress, not a schedule: there are no dates, and any of it may change or slip before it ships. Builds will stay unsigned prereleases until a developer certificate is in place."
      />
      <ol className="gutter grid grid-cols-1 gap-3 pb-16 sm:pb-20 md:grid-cols-2">
        {NEXT.map((n, i) => (
          <li key={n.title} className="rounded-[10px] border border-dashed border-line-strong p-4" data-reveal>
            <p className="flex items-baseline gap-2">
              <span className="text-[12px] font-semibold text-fg-3">{String(i + 1).padStart(2, "0")}</span>
              <b className="text-[15px] font-semibold">{n.title}</b>
            </p>
            <p className="mt-1.5 text-[13.5px] leading-snug text-fg-2">{n.text}</p>
          </li>
        ))}
      </ol>
    </Band>
  );
}

export function OpenSource() {
  return (
    <Band labelledBy="source-title">
      <div className="gutter flex flex-col items-start gap-8 py-16 sm:py-24 lg:flex-row lg:items-end lg:justify-between" data-reveal>
        <div className="max-w-[640px]">
          <p className="label mb-3">Open source</p>
          <h2 id="source-title" className="h1">
            Built in the open.
          </h2>
          <p className="lede mt-5">
            Island is made in public under the MIT license: specs, plans and acceptance checklists
            live in the repository next to the code.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={links.repo} className="btn btn-primary">
            Visit the repository <ArrowUpRight className="size-4" aria-hidden />
          </a>
          <Link href="/docs/#quick-start" className="btn btn-secondary">
            Build from source
          </Link>
        </div>
      </div>
    </Band>
  );
}
