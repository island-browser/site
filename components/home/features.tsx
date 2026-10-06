import { Check, CornerDownLeft, FileText, Globe, Search, Shield, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import { Keys } from "@/components/keys";
import { SectionHeader } from "@/components/section";

import f from "./features.module.css";

type Feature = {
  id: string;
  label: string;
  title: string;
  body: ReactNode;
  isNew?: boolean;
  span?: string;
  wide?: boolean;
  art: ReactNode;
};

function AgentArt() {
  return (
    <div className={f.panel}>
      <div className={f.panelHead}>
        <span className="flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-accent" /> Agent
        </span>
        <Keys combo={["Cmd", "J"]} />
      </div>
      <div className={f.panelBody}>
        <p className={f.userMsg}>Summarize this page and open the spec.</p>
        <div className={f.permission}>
          <p className={f.permTitle}>
            <Shield className="size-3.5" />
            <span>
              Allow <code>page_read</code>?
            </span>
          </p>
          <p className={f.permText}>Reads the text of github.com/island-browser/island</p>
          <div className={f.permActions}>
            <span className={f.allow}>Allow</span>
            <span className={f.deny}>Deny</span>
          </div>
        </div>
        <p className={f.agentMsg}>
          <span className={f.streamDot} />
          Streaming reply…
        </p>
      </div>
    </div>
  );
}

function McpArt() {
  const calls = [
    ["browser_open_tab", "200"],
    ["page_snapshot", "200"],
    ["page_click #12", "200"],
    ["page_screenshot", "200"],
  ];
  return (
    <div className={f.terminal}>
      <p className={f.termLine}>
        <span className={f.dim}>POST</span> 127.0.0.1:9223/mcp
      </p>
      <p className={f.termLine}>
        <span className={f.dim}>Authorization:</span> Bearer ••••••
      </p>
      <div className={f.termCalls}>
        {calls.map(([name]) => (
          <p key={name} className={f.termCall}>
            <span>{name}</span>
            <Check className="size-3.5 text-space-green" />
          </p>
        ))}
      </div>
    </div>
  );
}

function SpacesArt() {
  const spaces = [
    { name: "Work", color: "var(--space-blue)" },
    { name: "Research", color: "var(--space-green)" },
    { name: "Home", color: "var(--space-coral)" },
  ];
  return (
    <div className={f.spaces}>
      {spaces.map((sp, i) => (
        <div
          key={sp.name}
          className={`${f.miniSidebar} ${i === 1 ? f.miniActive : ""}`}
          style={{ ["--c" as string]: sp.color }}
        >
          <div className={f.miniPins}>
            <i />
            <i />
            <i />
            <i />
          </div>
          <span className={f.miniTab} />
          <span className={f.miniTab} />
          <span className={`${f.miniTab} ${f.short}`} />
          <p className={f.miniName}>
            <span className="dot" style={{ color: sp.color }} />
            {sp.name}
          </p>
        </div>
      ))}
    </div>
  );
}

function AllTabsArt() {
  const cards = [
    "var(--space-blue)",
    "var(--space-blue)",
    "var(--space-green)",
    "var(--space-green)",
    "var(--space-coral)",
    "var(--space-amber)",
  ];
  return (
    <div className={f.allTabs}>
      <div className={f.searchField}>
        <Search className="size-3.5" />
        <span>mcp</span>
      </div>
      <div className={f.cardGrid}>
        {cards.map((c, i) => (
          <div key={i} className={`${f.tabCard} ${i === 2 ? f.tabCardActive : ""}`}>
            <span className="dot" style={{ color: c }} />
            <span className={f.tabCardLine} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ShortcutsArt() {
  return (
    <div className={f.recorder}>
      <div className={f.recRow}>
        <span>Command palette</span>
        <Keys combo={["Cmd", "K"]} />
      </div>
      <div className={f.recRow}>
        <span>All tabs</span>
        <Keys combo={["Cmd", "Shift", "A"]} />
      </div>
      <div className={`${f.recRow} ${f.recording}`}>
        <span>Show or hide the agent</span>
        <span className={f.recPill}>
          <span className={f.recDot} />
          Press keys…
        </span>
      </div>
    </div>
  );
}

function ImportArt() {
  const sources = [
    ["Chrome", "Bookmarks"],
    ["Edge", "Bookmarks"],
    ["Brave", "Bookmarks"],
    ["Safari", "Bookmarks"],
    ["Firefox", "Backups"],
    ["Arc", "4 spaces · 23 pins"],
  ];
  return (
    <ul className={f.importList}>
      {sources.map(([name, what], i) => (
        <li key={name}>
          <span className={`${f.check} ${i === 0 || i === 5 ? f.checked : ""}`}>
            {(i === 0 || i === 5) && <Check className="size-3" />}
          </span>
          <span className={f.importName}>{name}</span>
          <span className={f.importWhat}>{what}</span>
        </li>
      ))}
    </ul>
  );
}

function SplitArt() {
  return (
    <div className={f.split}>
      <div className={f.pane}>
        <span className={f.paneBar} />
        <span className={f.paneLine} />
        <span className={`${f.paneLine} ${f.short}`} />
        <span className={f.paneLine} />
      </div>
      <div className={f.divider}>
        <i />
      </div>
      <div className={f.pane}>
        <span className={f.paneBar} />
        <span className={`${f.paneLine} ${f.short}`} />
        <span className={f.paneLine} />
      </div>
    </div>
  );
}

function PaletteArt() {
  const rows = [
    { icon: <Globe className="size-3.5" />, title: "MCP specification", kind: "Tab" },
    { icon: <span className="dot" style={{ color: "var(--space-green)" }} />, title: "Research", kind: "Space" },
    { icon: <FileText className="size-3.5" />, title: "Streamable HTTP", kind: "Bookmark" },
  ];
  return (
    <div className={f.palette}>
      <div className={f.paletteInput}>
        <span className={f.dim}>›</span> mcp<span className={f.inputCaret} />
      </div>
      <ul>
        {rows.map((r, i) => (
          <li key={r.title} className={i === 0 ? f.paletteActive : ""}>
            <span className={f.paletteIcon}>{r.icon}</span>
            <span className="min-w-0 flex-1 truncate">{r.title}</span>
            <span className={f.dim}>{r.kind}</span>
            {i === 0 && <CornerDownLeft className="size-3" />}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SessionArt() {
  const log = [
    ["quit", "clean shutdown", ""],
    ["launch", "restoring session", ""],
    ["spaces", "3 restored", "ok"],
    ["tabs", "14 restored · 4 pinned", "ok"],
    ["split", "1 pair restored", "ok"],
    ["urls", "validated like typed input", "ok"],
  ];
  return (
    <div className={f.log}>
      {log.map(([k, v, ok]) => (
        <p key={k}>
          <span className={f.logKey}>{k}</span>
          <span className={f.logVal}>{v}</span>
          {ok && <Check className="size-3.5 text-space-green" />}
        </p>
      ))}
    </div>
  );
}

const FEATURES: Feature[] = [
  {
    id: "acp",
    label: "Agent · ACP",
    title: "An agent in the sidebar",
    isNew: true,
    span: "md:col-span-2",
    wide: true,
    body: (
      <>
        Press <Keys combo={["Cmd", "J"]} /> and an Agent Client Protocol agent opens beside the
        page — Claude Code by default, or any ACP agent you configure. Replies stream in, tool
        calls ask before they act, and the agent already knows which tab you are looking at.
      </>
    ),
    art: <AgentArt />,
  },
  {
    id: "mcp",
    label: "Tools · MCP",
    title: "Tools any agent can use",
    isNew: true,
    body: (
      <>
        A loopback-only MCP endpoint: list and open tabs, switch spaces, read page text, take
        screenshots, evaluate JavaScript, and pin tabs. Settings has the config ready to copy.
      </>
    ),
    art: <McpArt />,
  },
  {
    id: "spaces",
    label: "Spaces",
    title: "Spaces that color the sidebar",
    isNew: true,
    body: (
      <>
        Each space is a named, colored context with its own tabs, and the sidebar takes on its
        tint — always above WCAG contrast. Pinned tabs sit in a tray at the top (
        <Keys combo={["Cmd", "D"]} />
        ).
      </>
    ),
    art: <SpacesArt />,
  },
  {
    id: "all-tabs",
    label: "Overview",
    title: "All tabs at a glance",
    isNew: true,
    body: (
      <>
        <Keys combo={["Cmd", "Shift", "A"]} /> lays every space&rsquo;s tabs out as searchable
        cards. Arrows and Enter jump, Delete closes, <Keys combo={["P"]} /> pins, and dragging a
        card onto another space moves it there.
      </>
    ),
    art: <AllTabsArt />,
  },
  {
    id: "settings",
    label: "Settings",
    title: "Settings and your own shortcuts",
    isNew: true,
    body: (
      <>
        <Keys combo={["Cmd", ","]} /> opens Settings: theme, the agent command, the MCP config, and
        every keyboard shortcut. Click one, press new keys; conflicts are flagged.
      </>
    ),
    art: <ShortcutsArt />,
  },
  {
    id: "import",
    label: "Import",
    title: "Bring everything with you",
    isNew: true,
    body: (
      <>
        Bookmarks from Chrome, Edge, Brave, Safari, and Firefox — or your Arc spaces with their
        colors and pinned tabs. Read from disk on your machine; nothing is uploaded.
      </>
    ),
    art: <ImportArt />,
  },
  {
    id: "split",
    label: "Layout",
    title: "Split view",
    body: (
      <>
        Pair any two tabs of a space side by side with a keyboard-adjustable divider. Closing
        either half returns the survivor to full width.
      </>
    ),
    art: <SplitArt />,
  },
  {
    id: "palettes",
    label: "Palettes",
    title: "Command and search palettes",
    span: "md:col-span-2 lg:col-span-1",
    body: (
      <>
        <Keys combo={["Cmd", "K"]} /> lists open tabs, spaces, and bookmarks, with a go-to-URL
        affordance. <Keys combo={["Cmd", "Shift", "K"]} /> searches the web with your pick of
        providers.
      </>
    ),
    art: <PaletteArt />,
  },
  {
    id: "session",
    label: "Session",
    title: "Session restore",
    span: "md:col-span-2 lg:col-span-3",
    wide: true,
    body: (
      <>
        Quit cleanly and Island rebuilds your spaces, tabs, pins, and active selections on the
        next launch — including split pairs. Restored URLs pass the same validation as anything
        you type; nothing bypasses policy.
      </>
    ),
    art: <SessionArt />,
  },
];

export function Features() {
  return (
    <>
      <SectionHeader
        id="features-title"
        label="The browser, today"
        title="What the current build actually has."
        lede={
          <>
            Working pieces of the build in development — not a roadmap and not a promise of what&rsquo;s
            next. Items marked <span className="tag tag-new align-[1px]">New</span> landed in 0.4.
          </>
        }
      />
      <div className="grid grid-cols-1 gap-px border-t border-line bg-line md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feat, i) => (
          <article
            key={feat.id}
            id={`feature-${feat.id}`}
            data-reveal
            className={`cell-pad ${f.cell} ${feat.wide ? f.cellWide : ""} ${feat.span ?? ""}`}
          >
            <div className={f.copy}>
              <div className="mb-4 flex h-5 items-center gap-2">
                <span className="label">
                  {String(i + 1).padStart(2, "0")} · {feat.label}
                </span>
                {feat.isNew && <span className="tag tag-new">New</span>}
              </div>
              <h3 className="h3">{feat.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-fg-2">{feat.body}</p>
            </div>
            <div className={f.art} aria-hidden="true">
              {feat.art}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
