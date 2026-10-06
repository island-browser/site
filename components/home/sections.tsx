import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import Link from "next/link";

import { CopyButton } from "@/components/copy-button";
import { Keys, KeyList } from "@/components/keys";
import { Band, SectionHeader } from "@/components/section";
import {
  acpCommand,
  acpProviders,
  mcpBridgeConfig,
  mcpHttpConfig,
  shortcuts,
  toolCount,
  toolGroups,
} from "@/lib/content";
import { links } from "@/lib/site";
import { repoUrl } from "@/site.config";

import { AgentTabs } from "./agent-tabs";
import { BrowserMockup } from "./browser-mockup";
import h from "./home.module.css";

export function Hero({ version }: { version: string }) {
  const minor = version.split(".").slice(0, 2).join(".");
  const clone = `git clone ${repoUrl}`;
  return (
    <section aria-labelledby="hero-title" className="relative">
      <div className={`gutter flex flex-col items-center pt-20 pb-16 text-center sm:pt-28 sm:pb-20 ${h.heroCopy}`}>
        <Link href={`/changelog/#v${version}`} className={h.announce}>
          <span className="tag tag-new">New</span>
          <span>v{minor}: an agent in the sidebar, tools over MCP</span>
          <ArrowRight className="size-3.5 text-fg-2" aria-hidden />
        </Link>
        <h1 id="hero-title" className="display mt-8 max-w-[15ch]">
          A calm browser, with an agent at your side.
        </h1>
        <p className="lede mt-6 max-w-[58ch]">
          Island is a native desktop browser built directly on CEF — no Electron, no web app shell. A
          sidebar tinted by each space holds your pinned and open tabs, an AI agent lives one
          keystroke away, and any agent you already use can drive the browser through its tools.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href="/download/" className="btn btn-primary">
            <Download className="size-4" aria-hidden />
            Download
          </Link>
          <Link href="/docs/" className="btn btn-secondary">
            Read the docs
          </Link>
        </div>
        <div className={h.snippet}>
          <span className="select-none text-fg-2" aria-hidden="true">
            $
          </span>
          <code className="min-w-0 truncate">{clone}</code>
          <CopyButton text={clone} label="Copy the clone command" />
        </div>
        <p className="mt-5 max-w-[46ch] font-mono text-xs leading-relaxed text-fg-2">
          <span className="dot mr-2 align-[1px] text-space-blue" aria-hidden="true" />
          In development for macOS (Apple silicon). Windows and Linux are planned.
        </p>
      </div>

      <div className={`relative border-t border-line ${h.stage}`}>
        <span className="cross cross-tl" aria-hidden="true" />
        <span className="cross cross-tr" aria-hidden="true" />
        <div className={`relative px-3 py-6 sm:px-8 sm:py-10 lg:px-12 lg:py-12 ${h.mockupIn}`}>
          <BrowserMockup />
        </div>
        <p className="gutter relative border-t border-line py-4 text-center text-[13px] text-fg-2">
          <strong className="font-medium text-fg">What&rsquo;s in {minor}.</strong> Spaces tint the
          sidebar, pinned tabs sit in a tray, the page floats on a card, and the agent panel opens
          with <Keys combo={["Cmd", "J"]} />.
        </p>
      </div>
    </section>
  );
}

export function Intro() {
  return (
    <Band labelledBy="about-title" id="about">
      <div className="gutter grid gap-6 py-16 sm:py-24 lg:grid-cols-[240px_1fr] lg:gap-12" data-reveal>
        <p className="label pt-2">Why it&rsquo;s being built</p>
        <div className="max-w-[760px]">
          <h2 id="about-title" className="h2">
            The browser chrome should get out of the way.
          </h2>
          <p className="lede mt-5">
            Island keeps the interface small and legible so the page stays in front. Everything it
            adds — spaces, split view, palettes, an agent — lives in the same calm sidebar or behind
            one keystroke, and every feature listed on this site is in the current source.
          </p>
        </div>
      </div>
    </Band>
  );
}

export function Agents() {
  const tabs = [
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
    {
      id: "acp",
      label: "ACP agents",
      short: "ACP",
      filename: "the agent that runs in the sidebar",
      lang: "shell" as const,
      code: acpCommand,
      note: "Claude Code, Codex, OpenCode, Gemini CLI, Qwen Code, Goose — or any Agent Client Protocol agent. Island hands every one the browser tools and tells it which tab you are looking at.",
    },
  ];

  return (
    <Band id="agents" labelledBy="agents-title">
      <SectionHeader
        id="agents-title"
        label="Made for agents"
        title="Your agent can use the browser you use."
        lede={
          <>
            While Island runs, it listens on <code className="icode">127.0.0.1</code> only, behind a
            bearer token that changes on every launch. Add it to any MCP client, or use the{" "}
            <code className="icode">island_mcp_bridge</code> stdio bridge for clients that only speak
            stdio.
          </>
        }
        action={
          <Link href="/docs/#agents" className="btn btn-secondary">
            Set up an agent <ArrowRight className="size-4" aria-hidden />
          </Link>
        }
      />
      <div className="grid grid-cols-1 border-t border-line lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div className="gutter py-10 sm:py-12 lg:border-r lg:border-line">
          <div className="lg:sticky lg:top-24" data-reveal>
            <AgentTabs tabs={tabs} />
            <div className="mt-8">
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <h3 className="h3">Bring your agent</h3>
                <span className="font-mono text-xs text-fg-2">Agent Client Protocol</span>
              </div>
              <ul className="divide-y divide-line overflow-hidden rounded-[10px] border border-line bg-surface">
                {acpProviders.map((p) => (
                  <li
                    key={p.id}
                    className="flex min-w-0 flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className="text-[13.5px] font-medium">{p.name}</span>
                      <span className="font-mono text-[11px] text-fg-2">{p.needs}</span>
                    </span>
                    <code className="min-w-0 break-all font-mono text-[11.5px] text-fg sm:text-right">{p.command}</code>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="gutter py-10 sm:py-12" data-reveal>
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <h3 className="h3">All {toolCount} tools</h3>
            <span className="font-mono text-xs text-fg-2">browser_* · page_*</span>
          </div>
          <dl className="divide-y divide-line border-y border-line">
            {toolGroups.map((g) => (
              <div key={g.label} className="grid grid-cols-[76px_1fr] gap-4 py-3 sm:grid-cols-[88px_1fr]">
                <dt className="label pt-0.5 !text-[11px]">{g.label}</dt>
                <dd className="min-w-0">
                  <ul className="flex flex-wrap gap-1.5">
                    {g.tools.map((t) => (
                      <li key={t}>
                        <code className="inline-flex h-6 items-center rounded-[5px] border border-line bg-surface px-1.5 text-[11.5px]">
                          {t}
                        </code>
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
  "Command palette",
  "Search palette",
  "Show or hide the agent",
  "All tabs",
  "Settings",
  "Show or hide the sidebar",
  "Pin or unpin the tab",
  "Split view with the next tab",
];

export function Keyboard() {
  const items = HOME_SHORTCUTS.map((a) => shortcuts.find((s) => s.action === a)!).filter(Boolean);
  return (
    <Band id="keyboard" labelledBy="keyboard-title">
      <SectionHeader
        id="keyboard-title"
        label="Keyboard first"
        title="One keystroke from anything."
        lede={
          <>
            Defaults shown for macOS; on Windows and Linux use <Keys combo={["Ctrl"]} /> for{" "}
            <Keys combo={["Cmd"]} />. Every shortcut can be re-recorded in Settings.
          </>
        }
        action={
          <Link href="/docs/#shortcuts" className="btn btn-secondary">
            Full shortcut table <ArrowRight className="size-4" aria-hidden />
          </Link>
        }
      />
      <ul className="grid grid-cols-1 gap-px border-t border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {items.map((s) => (
          <li key={s.action} className="keys-lg cell-pad flex min-h-[132px] flex-col justify-between gap-8 bg-bg transition-colors hover:bg-surface" data-reveal>
            <KeyList combos={s.combos} separator={s.separator} />
            <span className="text-sm text-fg-2">{s.action}</span>
          </li>
        ))}
      </ul>
    </Band>
  );
}

export function FirstRunAndAvailability() {
  return (
    <Band id="welcome" labelledBy="welcome-title">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="gutter flex flex-col gap-10 py-16 sm:py-20 lg:border-r lg:border-line" data-reveal>
          <div>
            <p className="label mb-4">First run</p>
            <h2 id="welcome-title" className="h2">
              A welcome that offers, never blocks.
            </h2>
            <p className="lede mt-4">
              On a fresh install Island shows one card: pick how it looks, tick the browsers to import
              from, and start browsing. Escape skips it — and Settings can import again anytime.
            </p>
          </div>
          <div className={h.welcome} aria-hidden="true">
            <p className="text-[15px] font-semibold tracking-[-0.01em]">Welcome to Island</p>
            <p className="mt-1 text-[12.5px] text-fg-2">
              Choose how Island looks, and bring your bookmarks and spaces from the browser you were
              using.
            </p>
            <div className={h.segmented}>
              <span className={h.segActive}>System</span>
              <span>Light</span>
              <span>Dark</span>
            </div>
            <ul className={h.importRows}>
              <li>
                <span className={`${h.box} ${h.boxOn}`}>✓</span> Arc — 4 spaces, 23 pinned tabs
              </li>
              <li>
                <span className={`${h.box} ${h.boxOn}`}>✓</span> Google Chrome
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

        <div className="gutter flex flex-col gap-10 border-t border-line py-16 sm:py-20 lg:border-t-0" data-reveal>
          <div>
            <p className="label mb-4">Availability</p>
            <h2 id="availability-title" className="h2">
              Where you can run it.
            </h2>
            <p className="lede mt-4">
              Honest platform status for the in-development build. Signed public releases are still
              to come.
            </p>
          </div>
          <div className="grid gap-3">
            <article className={h.platform}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="h3">macOS</h3>
                <span className="tag">
                  <span className="dot text-accent" /> In development
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-fg-2">
                Built and verified on Apple silicon. You can build it from source today — the{" "}
                <Link href="/docs/#quick-start" className="link">
                  quick start
                </Link>{" "}
                takes a few minutes.
              </p>
            </article>
            <article className={h.platform}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="h3">Windows &amp; Linux</h3>
                <span className="tag">
                  <span className="dot text-fg-2" /> Planned
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-fg-2">
                The code targets Windows and Linux (x64 and arm64) and CI builds search and packaging
                on all six platforms, but native browser builds still need platform verification.
              </p>
            </article>
          </div>
        </div>
      </div>
    </Band>
  );
}

export function OpenSource() {
  return (
    <Band labelledBy="source-title">
      <div className="gutter flex flex-col items-start gap-8 py-20 sm:py-28 lg:flex-row lg:items-end lg:justify-between" data-reveal>
        <div className="max-w-[640px]">
          <p className="label mb-4">Open source</p>
          <h2 id="source-title" className="h1">
            Built in the open.
          </h2>
          <p className="lede mt-5">
            Island is made in public: phase specs, plans, and acceptance checklists live in the
            repository next to the code. Read the docs, run the tests, or contribute when the project
            is ready for you.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={links.repo} className="btn btn-primary">
            Visit the repository <ArrowUpRight className="size-4" aria-hidden />
          </a>
          <Link href="/docs/#quick-start" className="btn btn-secondary">
            Quick start
          </Link>
        </div>
      </div>
    </Band>
  );
}
