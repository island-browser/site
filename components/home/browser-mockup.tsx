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

const TABS = [
  { title: "Island — pull requests", active: true, Icon: GitPullRequest },
  { title: "Agent Client Protocol", Icon: BookOpen },
  { title: "MCP specification", Icon: FileText },
  { title: "Streamable HTTP transport", Icon: Network },
];

const PULLS = [
  { id: "graphite-agent", title: "Restyle the agent panel and All tabs in Graphite", meta: "draft · agent" },
  { id: "graphite-tokens", title: "Adopt the Graphite design tokens (contract v3)", meta: "draft · design" },
  { id: "43", title: "Versioning, a site for 0.4 with auto-deploy", meta: "#43 · release" },
  { id: "42", title: "Arc-style redesign, built-in ACP agent + MCP tools", meta: "#42 · chrome" },
];

/**
 * An illustration of the Island 0.4 window in the Graphite style: a space-tinted sidebar,
 * the page on a floating card, and the agent panel. Purely decorative (aria-hidden); the
 * surrounding copy describes the same controls.
 */
export function BrowserMockup() {
  return (
    <div className={s.window} aria-hidden="true">
      <div className={s.inner}>
        <aside className={s.sidebar}>
          <div className={s.chrome}>
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

          <div className={s.address}>
            <Globe />
            <span>github.com/island-browser/island</span>
          </div>

          <div className={s.pins}>
            {PINS.map(({ name, Icon }, i) => (
              <span key={name} className={`${s.pin} ${i === 0 ? s.pinActive : ""}`}>
                <Icon />
              </span>
            ))}
          </div>

          <p className={s.groupLabel}>
            <i style={{ background: "var(--space-blue)" }} />
            <span>Work</span>
            <em>4</em>
          </p>
          <ul className={s.tabs}>
            {TABS.map(({ title, active, Icon }) => (
              <li key={title} className={`${s.tab} ${active ? s.tabActive : ""}`}>
                <span className={s.favicon}>
                  <Icon />
                </span>
                <span className={s.tabTitle}>{title}</span>
                {active && <X className={s.tabClose} />}
              </li>
            ))}
            <li className={`${s.tab} ${s.tabNew}`}>
              <span className={s.favicon}>
                <Plus />
              </span>
              <span className={s.tabTitle}>New tab</span>
            </li>
          </ul>

          <div className={s.footer}>
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
          <div className={s.card}>
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
                    <GitPullRequest className={s.prIcon} />
                    <span className={s.prText}>
                      <b>{p.title}</b>
                      <span>{p.meta}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <aside className={s.agent}>
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
              <b>Island — pull requests</b>
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
                <span>pull requests</span>
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
