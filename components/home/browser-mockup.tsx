"use client";

import { useId, useRef, useState } from "react";

import {
  ArrowUp,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  GitPullRequest,
  Globe,
  LayoutGrid,
  Mail,
  MessagesSquare,
  Network,
  Plus,
  RotateCw,
  Search,
  Settings,
  Sparkles,
  SquarePen,
  X,
} from "lucide-react";

import s from "./browser-mockup.module.css";

const PINS = [
  { name: "Mail", Icon: Mail },
  { name: "Calendar", Icon: CalendarDays },
  { name: "Chat", Icon: MessagesSquare },
  { name: "Notes", Icon: FileText },
];

type PageId = "pulls" | "acp" | "mcp" | "http" | "newtab";

type MockTab = {
  id: PageId;
  title: string;
  Icon: typeof GitPullRequest;
  url: string;
  /** What the agent panel's context chip calls the page. */
  chip: string;
};

const TABS: MockTab[] = [
  {
    id: "pulls",
    title: "Island — pull requests",
    Icon: GitPullRequest,
    url: "github.com/island-browser/island/pulls",
    chip: "pull requests",
  },
  {
    id: "acp",
    title: "Agent Client Protocol",
    Icon: BookOpen,
    url: "agentclientprotocol.com",
    chip: "agentclientprotocol.com",
  },
  {
    id: "mcp",
    title: "MCP specification",
    Icon: FileText,
    url: "modelcontextprotocol.io/specification",
    chip: "specification",
  },
  {
    id: "http",
    title: "Streamable HTTP transport",
    Icon: Network,
    url: "modelcontextprotocol.io/specification/basic/transports",
    chip: "transports",
  },
];

const NEW_TAB: MockTab = {
  id: "newtab",
  title: "New tab",
  Icon: Plus,
  url: "Search or enter address",
  chip: "new tab",
};

/** Short, factual stand-ins for the three documentation tabs. */
const DOCS: Record<"acp" | "mcp" | "http", { site: string; title: string; lead: string; sections: { head: string; body: string }[]; code: string }> = {
  acp: {
    site: "agentclientprotocol.com / overview",
    title: "Agent Client Protocol",
    lead: "A standard way for editors and other clients to talk to coding agents: the client starts the agent as a subprocess and they exchange JSON-RPC messages over stdio.",
    sections: [
      { head: "Lifecycle", body: "initialize, then session/new, then one session/prompt per turn. The agent streams session/update notifications while it works." },
      { head: "Permissions", body: "Tool calls that need approval arrive as session/request_permission; the client answers with the option the user picked." },
    ],
    code: '{"jsonrpc":"2.0","id":3,"method":"session/prompt",\n "params":{"sessionId":"s1","prompt":[{"type":"text","text":"…"}]}}',
  },
  mcp: {
    site: "modelcontextprotocol.io / specification",
    title: "Model Context Protocol",
    lead: "An open protocol that connects LLM applications to external tools and data. Messages are JSON-RPC 2.0 between a client and a server.",
    sections: [
      { head: "Server features", body: "Resources (context and data), prompts (templated messages) and tools (functions the model can call)." },
      { head: "Lifecycle", body: "The client sends initialize with its capabilities, the server answers with its own, and the client confirms with notifications/initialized." },
    ],
    code: '{"jsonrpc":"2.0","id":7,"method":"tools/call",\n "params":{"name":"browser_list_tabs","arguments":{}}}',
  },
  http: {
    site: "modelcontextprotocol.io / transports",
    title: "Streamable HTTP",
    lead: "The server exposes one MCP endpoint. The client POSTs each JSON-RPC message to it; the server answers with JSON or opens a Server-Sent Events stream.",
    sections: [
      { head: "Sessions", body: "A server may return an Mcp-Session-Id header at initialization; the client sends it back on every later request." },
      { head: "Security", body: "Local servers should bind to 127.0.0.1 and validate Origin. Island's endpoint also requires a bearer token." },
    ],
    code: "POST /mcp HTTP/1.1\nHost: 127.0.0.1:9223\nAccept: application/json, text/event-stream\nAuthorization: Bearer …",
  },
};

const PULLS = [
  { id: "graphite-agent", title: "Restyle the agent panel and All tabs in Graphite", meta: "draft · agent" },
  { id: "graphite-tokens", title: "Adopt the Graphite design tokens (contract v3)", meta: "draft · design" },
  { id: "43", title: "Versioning, a site for 0.4 with auto-deploy", meta: "#43 · release" },
  { id: "42", title: "Arc-style redesign, built-in ACP agent + MCP tools", meta: "#42 · chrome" },
];

/**
 * An interactive illustration of the Island window in the Graphite style: a space-tinted sidebar
 * whose tabs switch the page on the floating card (WAI-ARIA tabs, arrow keys), and the agent
 * panel, which follows the active tab. The window chrome and the agent panel are decorative.
 */
export function BrowserMockup() {
  const [active, setActive] = useState(0);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const all = [...TABS, NEW_TAB];
  const tab = all[active];

  function onKeyDown(e: React.KeyboardEvent) {
    const last = all.length - 1;
    let next = active;
    if (e.key === "ArrowDown") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowUp") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  }

  function tabButton(t: MockTab, i: number, extra = "") {
    const selected = i === active;
    return (
      <li key={t.id} role="presentation">
        <button
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          role="tab"
          id={`${base}-tab-${t.id}`}
          aria-selected={selected}
          aria-controls={`${base}-panel`}
          tabIndex={selected ? 0 : -1}
          onClick={() => setActive(i)}
          className={`${s.tab} ${selected ? s.tabActive : ""} ${extra}`}
        >
          <span className={s.favicon} aria-hidden="true">
            <t.Icon />
          </span>
          <span className={s.tabTitle}>{t.title}</span>
          {selected && t.id !== "newtab" && <X className={s.tabClose} aria-hidden="true" />}
        </button>
      </li>
    );
  }

  return (
    <div className={s.window} role="group" aria-label="Island browser preview: pick a tab in the sidebar">
      <div className={s.inner}>
        <aside className={s.sidebar}>
          <div className={s.chrome} aria-hidden="true">
            <span className={s.dots}>
              <i />
              <i />
              <i />
            </span>
            <span className={s.navIcons}>
              <ChevronLeft />
              <ChevronRight />
              <RotateCw />
            </span>
          </div>

          <div className={s.address} aria-hidden="true">
            {tab.id === "newtab" ? <Search /> : <Globe />}
            <span className={tab.id === "newtab" ? s.addressEmpty : undefined}>{tab.url}</span>
          </div>

          <div className={s.pins} aria-hidden="true">
            {PINS.map(({ name, Icon }, i) => (
              <span key={name} className={`${s.pin} ${i === 0 ? s.pinActive : ""}`}>
                <Icon />
              </span>
            ))}
          </div>

          <p className={s.groupLabel} aria-hidden="true">
            <i style={{ background: "var(--space-blue)" }} />
            <span>Work</span>
            <em>4</em>
          </p>
          <ul className={s.tabs} role="tablist" aria-orientation="vertical" aria-label="Tabs in the Work space" onKeyDown={onKeyDown}>
            {TABS.map((t, i) => tabButton(t, i))}
            {tabButton(NEW_TAB, TABS.length, s.tabNew)}
          </ul>

          <div className={s.footer} aria-hidden="true">
            <span className={s.spaces}>
              <i className={s.spaceActive} style={{ background: "var(--space-blue)" }} />
              <i style={{ background: "var(--space-green)" }} />
              <i style={{ background: "var(--space-coral)" }} />
            </span>
            <span className={s.footerIcons}>
              <LayoutGrid />
              <Sparkles className={s.iconActive} />
              <Settings />
            </span>
          </div>
        </aside>

        <div className={s.canvas}>
          <div className={s.card} role="tabpanel" id={`${base}-panel`} aria-labelledby={`${base}-tab-${tab.id}`}>
            <div key={tab.id} className={s.page}>
              <Page id={tab.id} />
            </div>
          </div>
        </div>

        <aside className={s.agent} aria-hidden="true">
          <div className={s.agentHead}>
            <span className={s.provider}>
              <Sparkles />
              Claude Code
              <ChevronDown className={s.chevron} />
            </span>
            <span className={s.headIcon}>
              <SquarePen />
            </span>
          </div>
          <div className={s.thread}>
            <p className={s.context}>
              <Globe />
              <span>Looking at</span>
              <b>{tab.title}</b>
            </p>
            <p className={`${s.bubbleUser} ${s.step1}`}>Which tabs in Research are about MCP?</p>
            <p className={`${s.toolChip} ${s.step2}`}>
              <span className={s.toolStatus}>
                <span className={s.spinner} />
                <Check className={s.toolCheck} />
              </span>
              browser_list_tabs
            </p>
            <p className={`${s.reply} ${s.step3}`}>
              Two: <em>MCP specification</em> and <em>Streamable HTTP</em>. Want them in a split?
            </p>
          </div>
          <div className={s.composer}>
            <span className={s.placeholder}>
              Ask anything, or tell it what to do<span className={s.caret} />
            </span>
            <div className={s.composerRow}>
              <span className={s.contextChip}>
                <Globe />
                <span>{tab.chip}</span>
              </span>
              <span className={s.send}>
                <ArrowUp />
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Page({ id }: { id: PageId }) {
  if (id === "pulls") return <PullsPage />;
  if (id === "newtab") return <NewTabPage />;
  return <DocPage doc={DOCS[id]} />;
}

function PullsPage() {
  return (
    <>
      <div className={s.pageHead}>
        <p className={s.repo}>
          <span>island-browser</span>
          <span className={s.slash}>/</span>
          <b>island</b>
        </p>
        <div className={s.pageTabs}>
          <span>Code</span>
          <span>Issues</span>
          <span className={s.pageTabActive}>
            Pull requests <em>4</em>
          </span>
          <span>Actions</span>
        </div>
      </div>
      <div className={s.pageBody}>
        <div className={s.filterRow}>
          <span className={s.filter}>is:pr is:open</span>
          <span className={s.newPr}>New pull request</span>
        </div>
        <ul className={s.pulls}>
          {PULLS.map((p) => (
            <li key={p.id}>
              <GitPullRequest className={s.prIcon} aria-hidden="true" />
              <span className={s.prText}>
                <b>{p.title}</b>
                <span>{p.meta}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function DocPage({ doc }: { doc: (typeof DOCS)[keyof typeof DOCS] }) {
  return (
    <article className={s.doc}>
      <p className={s.docSite}>{doc.site}</p>
      <h3 className={s.docTitle}>{doc.title}</h3>
      <p className={s.docLead}>{doc.lead}</p>
      {doc.sections.map((section) => (
        <section key={section.head} className={s.docSection}>
          <h4>{section.head}</h4>
          <p>{section.body}</p>
        </section>
      ))}
      <pre className={s.docCode}>{doc.code}</pre>
    </article>
  );
}

function NewTabPage() {
  return (
    <div className={s.newTab}>
      <p className={s.newTabSearch}>
        <Search aria-hidden="true" />
        <span>Search or enter address</span>
      </p>
      <ul className={s.newTabPins}>
        {PINS.map(({ name, Icon }) => (
          <li key={name}>
            <span aria-hidden="true">
              <Icon />
            </span>
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
