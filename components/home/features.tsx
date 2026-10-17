import {
  ArrowDownToLine,
  BookOpen,
  Columns2,
  FileText,
  History,
  Import,
  Keyboard,
  LayoutGrid,
  MessageSquareText,
  Moon,
  Palette,
  PanelLeft,
  Pin,
  RefreshCw,
  RotateCcw,
  Search,
  Shield,
  Sparkles,
  SquareDashedMousePointer,
  TextSearch,
  Waypoints,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Keys } from "@/components/keys";
import { SectionHeader } from "@/components/section";
import { comboFor, hasSeven, sevenLabel, toolCount } from "@/lib/content";

type Row = {
  Icon: typeof Pin;
  title: string;
  text: ReactNode;
  /** A shortcut id from keymap.cc, shown as key caps. */
  keys?: string;
  value?: string;
  /** Not in the current release yet: shows the 0.7 pill. */
  seven?: boolean;
};

type Group = { id: string; title: string; href: string; rows: Row[] };

const GROUPS: Group[] = [
  {
    id: "browse",
    title: "Browse",
    href: "/docs/#tabs",
    rows: [
      { Icon: Pin, title: "Spaces and pinned tabs", text: "Named spaces, each with its own tabs; pinned tabs stay first.", keys: "toggle_pin" },
      { Icon: PanelLeft, title: "Icon rail", text: "The sidebar collapses to one icon per tab and comes back as you left it.", keys: "toggle_sidebar" },
      { Icon: Columns2, title: "Split view", text: "Two tabs of a space side by side, with a keyboard-adjustable divider.", keys: "toggle_split" },
      { Icon: LayoutGrid, title: "All tabs", text: "Every space as searchable cards, with blocked-request counts.", keys: "tab_overview" },
      { Icon: Moon, title: "Tab sleep", text: "Idle tabs free their memory and reload where you left off.", value: "30 min" },
      { Icon: SquareDashedMousePointer, title: "Peek", text: "⌘-click or middle-click a link to open it in a floating card.", value: "⌘-click" },
      { Icon: RotateCcw, title: "Session restore", text: "Spaces, tabs, pins and split pairs come back after a clean quit." },
    ],
  },
  {
    id: "read",
    title: "Read",
    href: "/docs/#reader",
    rows: [
      { Icon: Search, title: "Start page", text: "One field to search, ask the agent or start research. Speed dial in 0.7.", value: "New tab" },
      { Icon: TextSearch, title: "Address bar search", text: "Type words, not an address, and get results from Google, DuckDuckGo or Yandex." },
      { Icon: BookOpen, title: "Reader view", text: "The article alone, with text size, width and Auto, Light, Sepia or Dark.", keys: "reader_mode" },
      { Icon: Search, title: "Find in page", text: "A match count and match case, with next and previous.", keys: "find_in_page" },
      { Icon: Shield, title: "Ad and tracker blocking", text: "EasyList and EasyPrivacy in Brave's adblock engine, with a per-site allowlist.", value: "On" },
      { Icon: History, title: "History search", text: "Up to 50,000 visits, kept on this device and searched from the command palette.", keys: "command_palette" },
    ],
  },
  {
    id: "agent",
    title: "Agent",
    href: "/docs/#agents",
    rows: [
      { Icon: Sparkles, title: "Agent in the sidebar", text: "Claude Code, Codex, OpenCode, Gemini CLI, Qwen Code, Goose or any ACP agent.", keys: "toggle_agent" },
      { Icon: Wrench, title: "Browser tools over MCP", text: "Island's tools for any agent, on 127.0.0.1 behind a per-launch token.", value: `${toolCount} tools` },
      { Icon: FileText, title: "Research and reports", text: "Several sources compared, then a Markdown report that cites every claim.", value: "Report tab" },
      { Icon: Waypoints, title: "Plan tab", text: "The agent's research plan as a graph or a list. Nothing runs until you approve it.", seven: true },
      { Icon: MessageSquareText, title: "Markdown replies", text: "Headings, code, lists and tables, with links limited to http, https and mailto." },
    ],
  },
  {
    id: "yours",
    title: "Yours",
    href: "/docs/#looks",
    rows: [
      { Icon: Palette, title: "Looks", text: "Native, Arc or Graphite in Settings → Appearance, or tune your own.", seven: true },
      { Icon: Keyboard, title: "Shortcuts", text: "Every action can be rebound in Settings; ⌘/ shows a cheatsheet in 0.7.", keys: "settings" },
      { Icon: Import, title: "Import", text: "Bookmarks from Chrome, Edge, Brave, Safari and Firefox; Arc spaces and pins." },
      { Icon: ArrowDownToLine, title: "Downloads", text: "Saved straight to Downloads; an existing file is never overwritten." },
      { Icon: RefreshCw, title: "Updates", text: "Checked at most once a day and verified against the release checksums." },
    ],
  },
];

export function Features({ version }: { version: string }) {
  const seven = sevenLabel(version);
  return (
    <>
      <SectionHeader
        id="features-title"
        label="The browser, today"
        title={`Everything in Island ${version}.`}
        lede={
          hasSeven(version) ? (
            <>
              Every row is in the current release; rows marked{" "}
              <span className="tag tag-new align-[1px]">{seven}</span> arrived with 0.7.
            </>
          ) : (
            <>
              Each row is in the current release unless it carries the{" "}
              <span className="tag tag-new align-[1px]">{seven}</span> pill: those are merged and
              land with the next version.
            </>
          )
        }
      />
      <div className="gutter grid grid-cols-1 gap-6 pb-16 sm:pb-20 lg:grid-cols-2">
        {GROUPS.map((g) => (
          <section key={g.id} id={`feature-${g.id}`} aria-labelledby={`feature-${g.id}-title`} data-reveal>
            <div className="mb-2 flex items-baseline justify-between gap-4 px-1">
              <h3 id={`feature-${g.id}-title`} className="label">
                {g.title}
              </h3>
              <Link href={g.href} className="link text-[13px]">
                In the docs
              </Link>
            </div>
            <ul className="card">
              {g.rows.map((r) => (
                <li key={r.title} className="card-row">
                  <span className="row-icon">
                    <r.Icon aria-hidden />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] font-semibold">
                      {r.title}
                      {r.seven && <span className="tag tag-new">{seven}</span>}
                    </span>
                    <span className="text-[13px] leading-snug text-fg-2">{r.text}</span>
                  </span>
                  {r.keys ? (
                    <span className="hidden flex-none sm:inline-flex">
                      <Keys combo={comboFor(r.keys)} />
                    </span>
                  ) : r.value ? (
                    <span className="hidden flex-none text-[13px] text-fg-2 sm:inline">{r.value}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
