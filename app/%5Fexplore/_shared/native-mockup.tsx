"use client";

import { useId, useRef, useState } from "react";

import {
  ArrowUp,
  BookOpen,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  GitPullRequest,
  LayoutGrid,
  Mail,
  MessagesSquare,
  Plus,
  RotateCw,
  Search,
  Settings,
  Share,
  Shield,
  Sparkles,
  Waypoints,
} from "lucide-react";

import s from "./native-mockup.module.css";

type PageId = "plan" | "repo" | "cef" | "acp" | "newtab";
type AgentDot = "reading" | "waiting" | null;

type MockTab = {
  id: PageId;
  title: string;
  Icon: typeof Mail;
  url: string;
  /** Blocked requests for the address-field shield (hidden at 0). */
  blocked: number;
  reader: boolean;
  agent: AgentDot;
};

const FAVORITES = [
  { name: "Mail", Icon: Mail },
  { name: "Calendar", Icon: CalendarDays },
];

const TABS: MockTab[] = [
  { id: "plan", title: "Research plan", Icon: Waypoints, url: "Research plan", blocked: 0, reader: false, agent: "waiting" },
  { id: "repo", title: "island-browser/island", Icon: GitPullRequest, url: "github.com", blocked: 14, reader: false, agent: "reading" },
  { id: "cef", title: "Alloy style and browser views", Icon: MessagesSquare, url: "magpcss.org", blocked: 3, reader: true, agent: null },
  { id: "acp", title: "Agent Client Protocol", Icon: BookOpen, url: "agentclientprotocol.com", blocked: 0, reader: true, agent: null },
];

const NEW_TAB: MockTab = {
  id: "newtab",
  title: "New Tab",
  Icon: Plus,
  url: "Search or enter address",
  blocked: 0,
  reader: false,
  agent: null,
};

const SPACES = ["Work", "Read", "Home"];

/**
 * The Island window in its 0.7 default look ("Native"): a grey source-list sidebar with the tabs
 * of one space, New Tab under them, the segmented space switcher and one Agent button at the
 * bottom; a toolbar whose address field carries the shield, Reader and agent indicators; and the
 * agent panel. Sidebar rows are WAI-ARIA tabs that switch the page, the address field and its
 * indicators. Everything else is decorative.
 */
export function NativeMockup({ initial = 0 }: { initial?: number }) {
  const [active, setActive] = useState(initial);
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

  function row(t: MockTab, i: number, extra = "") {
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
          className={`${s.row} ${selected ? s.rowSelected : ""} ${extra}`}
        >
          <span className={t.id === "newtab" ? s.plusGlyph : s.favicon} aria-hidden="true">
            <t.Icon />
          </span>
          <span className={s.rowTitle}>{t.title}</span>
          {t.agent && !selected && (
            <span className={`${s.rowDot} ${t.agent === "waiting" ? s.dotWaiting : s.dotReading}`} aria-hidden="true" />
          )}
        </button>
      </li>
    );
  }

  return (
    <div className={s.window} role="group" aria-label="Island browser preview in the Native look: pick a tab in the sidebar">
      <div className={s.inner}>
        <aside className={s.sidebar}>
          <div className={s.lights} aria-hidden="true">
            <i />
            <i />
            <i />
          </div>

          <p className={s.section} aria-hidden="true">
            Favorites
          </p>
          <ul className={s.list} aria-hidden="true">
            {FAVORITES.map(({ name, Icon }) => (
              <li key={name} className={s.row}>
                <span className={s.favicon}>
                  <Icon />
                </span>
                <span className={s.rowTitle}>{name}</span>
              </li>
            ))}
          </ul>

          <p className={s.section} aria-hidden="true">
            Work · Tabs
          </p>
          <ul className={s.list} role="tablist" aria-orientation="vertical" aria-label="Tabs in the Work space" onKeyDown={onKeyDown}>
            {TABS.map((t, i) => row(t, i))}
            {row(NEW_TAB, TABS.length, s.rowNew)}
          </ul>

          <div className={s.bottom} aria-hidden="true">
            <div className={s.switcher}>
              <span className={s.track}>
                {SPACES.map((name, i) => (
                  <span key={name} className={i === 0 ? s.segActive : s.seg}>
                    {name}
                  </span>
                ))}
              </span>
              <span className={s.iconBtn}>
                <Plus />
              </span>
              <span className={s.iconBtn}>
                <LayoutGrid />
              </span>
              <span className={s.iconBtn}>
                <Settings />
              </span>
            </div>
            <span className={s.agentButton}>
              <Sparkles />
              Agent
            </span>
          </div>
        </aside>

        <div className={s.main}>
          <div className={s.toolbar} aria-hidden="true">
            <span className={s.navBtn}>
              <ChevronLeft />
            </span>
            <span className={s.navBtn}>
              <ChevronRight />
            </span>
            <div className={s.address}>
              <span className={s.indLeft}>
                {tab.blocked > 0 && (
                  <span className={s.shield} title={`${tab.blocked} requests blocked`}>
                    <Shield />
                    {tab.blocked}
                  </span>
                )}
              </span>
              <span className={`${s.addressText} ${tab.id === "newtab" ? s.addressEmpty : ""}`}>{tab.url}</span>
              <span className={s.indRight}>
                {tab.reader && (
                  <span className={s.reader} title="Reader view">
                    <BookOpen />
                  </span>
                )}
                {tab.agent && <span className={`${s.agentDot} ${tab.agent === "waiting" ? s.dotWaiting : s.dotReading}`} />}
                <RotateCw className={s.reload} />
              </span>
            </div>
            <span className={s.toolText}>
              <Share />
              <span className={s.toolLabel}>Share</span>
            </span>
          </div>

          <div className={s.page} role="tabpanel" id={`${base}-panel`} aria-labelledby={`${base}-tab-${tab.id}`}>
            <div key={tab.id} className={s.pageIn}>
              <Page id={tab.id} />
            </div>
          </div>
        </div>

        <aside className={s.agent} aria-hidden="true">
          <div className={s.agentHead}>
            <b>Agent</b>
            <span className={s.waitPill}>Waiting for approval</span>
          </div>
          <div className={s.thread}>
            <p className={s.question}>Can one CEF window host several browser views?</p>
            <p className={s.toolRow}>
              <Check className={s.tick} />
              <code>browser_list_tabs</code>
            </p>
            <p className={s.toolRow}>
              <Check className={s.tick} />
              <code>page_read</code> magpcss.org
            </p>
            <p className={s.reply}>
              I proposed a plan with two branches in the <b>Research plan</b> tab. Nothing runs until you approve it.
            </p>
          </div>
          <div className={s.composer}>
            <span className={s.placeholder}>Ask about this tab or anything</span>
            <div className={s.composerRow}>
              <span className={s.chip}>
                <tab.Icon />
                <span>{tab.title}</span>
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
  if (id === "plan") return <PlanPage />;
  if (id === "newtab") return <StartPage />;
  if (id === "repo") return <RepoPage />;
  return <ArticlePage id={id} />;
}

/* The Plan tab: a question, two branches, a join and a result; nothing runs before approval. */
const NODES = [
  { id: "q", x: 4, y: 98, kicker: "Question", title: "One window, many views?", kind: "question" },
  { id: "a1", x: 152, y: 24, kicker: "Branch A", title: "Read the CEF docs", kind: "a" },
  { id: "a2", x: 300, y: 24, kicker: "Branch A", title: "Compare styles", kind: "a" },
  { id: "b1", x: 152, y: 172, kicker: "Branch B", title: "Search the forum", kind: "b" },
  { id: "b2", x: 300, y: 172, kicker: "Branch B", title: "Related issues", kind: "b" },
  { id: "j", x: 448, y: 98, kicker: "Join", title: "Joins A + B", kind: "join" },
  { id: "r", x: 596, y: 98, kicker: "Result", title: "Report tab", kind: "result" },
] as const;
const EDGES: [string, string, "a" | "b" | "trunk"][] = [
  ["q", "a1", "a"],
  ["a1", "a2", "a"],
  ["q", "b1", "b"],
  ["b1", "b2", "b"],
  ["a2", "j", "a"],
  ["b2", "j", "b"],
  ["j", "r", "trunk"],
];
const W = 136;
const H = 64;

function PlanPage() {
  const at = (id: string) => NODES.find((n) => n.id === id)!;
  return (
    <div className={s.plan}>
      <div className={s.planBar}>
        <Waypoints />
        <b>Research plan</b>
        <span className={s.pausedPill}>Paused · nothing runs until you approve</span>
        <span className={s.planSeg}>
          <span className={s.segActive}>Graph</span>
          <span className={s.seg}>List</span>
        </span>
      </div>
      <div className={s.canvas}>
        <svg viewBox="0 0 736 260" className={s.graph} role="img" aria-label="Plan graph: a question, branch A and branch B with two steps each, a join and a result">
          {EDGES.map(([from, to, kind]) => {
            const a = at(from);
            const b = at(to);
            const x1 = a.x + W;
            const y1 = a.y + H / 2;
            const x2 = b.x;
            const y2 = b.y + H / 2;
            return (
              <g key={`${from}-${to}`} className={kind === "a" ? s.edgeA : kind === "b" ? s.edgeB : s.edgeTrunk}>
                <path d={`M${x1} ${y1} C${x1 + 30} ${y1} ${x2 - 30} ${y2} ${x2} ${y2}`} fill="none" strokeWidth="1.6" />
                <circle cx={x2} cy={y2} r="2.6" />
              </g>
            );
          })}
          {NODES.map((n) => (
            <g key={n.id} className={`${s.node} ${s[`node_${n.kind}`]}`}>
              <rect x={n.x} y={n.y} width={W} height={H} rx="8" />
              {(n.kind === "a" || n.kind === "b") && <rect x={n.x} y={n.y + 6} width="3" height={H - 12} rx="1.5" className={s.stripe} />}
              <text x={n.x + 12} y={n.y + 20} className={s.kicker}>
                {n.kicker.toUpperCase()}
              </text>
              <text x={n.x + 12} y={n.y + 40} className={s.nodeTitle}>
                {n.title}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className={s.planFoot}>
        <span className={s.summary}>5 steps · 2 branches · reads pages, never posts or buys</span>
        <span className={s.btnPrimary}>Run plan</span>
        <span className={s.btn}>Run A only</span>
        <span className={s.btn}>Cancel</span>
      </div>
    </div>
  );
}

function StartPage() {
  const tiles = ["GitHub", "CEF Forum", "MDN", "Hacker News", "Wikipedia", "Mail"];
  return (
    <div className={s.start}>
      <span className={s.startSeg}>
        <span className={s.segActive}>Search</span>
        <span className={s.seg}>Ask Agent</span>
        <span className={s.seg}>Research</span>
      </span>
      <p className={s.startField}>
        <Search aria-hidden="true" />
        <span>Search with Google</span>
      </p>
      <ul className={s.tiles}>
        {tiles.map((t) => (
          <li key={t}>
            <span aria-hidden="true">{t[0]}</span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RepoPage() {
  const rows = [
    ["Native look: source-list sidebar and address indicators", "#58 · open"],
    ["Research plan graph in a Plan tab", "#57 · open"],
    ["Shortcut cheatsheet on ⌘/", "#56 · merged"],
    ["Release 0.6.2", "#55 · merged"],
  ];
  return (
    <div className={s.doc}>
      <p className={s.docSite}>
        island-browser / <b>island</b>
      </p>
      <p className={s.docH}>Pull requests</p>
      <ul className={s.prs}>
        {rows.map(([title, meta]) => (
          <li key={title}>
            <GitPullRequest aria-hidden="true" />
            <span>
              <b>{title}</b>
              <em>{meta}</em>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArticlePage({ id }: { id: "cef" | "acp" }) {
  const doc =
    id === "cef"
      ? {
          site: "magpcss.org / forum",
          title: "Alloy style and several browser views",
          lead: "Alloy runtime style lets one top-level window host several browser views, which an embedder needs for split view and side panels.",
          body: "Chrome style windows own their own toolbar and cannot share a window with other views.",
        }
      : {
          site: "agentclientprotocol.com / overview",
          title: "Agent Client Protocol",
          lead: "A standard way for clients to talk to coding agents: the client starts the agent as a subprocess and they exchange JSON-RPC over stdio.",
          body: "Agents stream session/update notifications while they work, including plan updates.",
        };
  return (
    <article className={s.doc}>
      <p className={s.docSite}>
        <FileText aria-hidden="true" /> {doc.site}
      </p>
      <p className={s.docH}>{doc.title}</p>
      <p className={s.docLead}>{doc.lead}</p>
      <p className={s.docBody}>{doc.body}</p>
      <span className={s.docLine} />
      <span className={`${s.docLine} ${s.short}`} />
    </article>
  );
}
