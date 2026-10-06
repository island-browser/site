import {
  Check,
  ChevronLeft,
  ChevronRight,
  GitPullRequest,
  Globe,
  LayoutGrid,
  Plus,
  RotateCw,
  Settings,
  Sparkles,
  X,
} from "lucide-react";

import s from "./browser-mockup.module.css";

const PINS = [
  { letter: "G", tint: "var(--text)" },
  { letter: "L", tint: "var(--space-purple)" },
  { letter: "M", tint: "var(--space-coral)" },
  { letter: "C", tint: "var(--space-amber)" },
];

const TABS = [
  { title: "Island — pull requests", active: true, icon: "pr" },
  { title: "Agent Client Protocol", icon: "globe" },
  { title: "MCP specification", icon: "globe" },
  { title: "Streamable HTTP transport", icon: "globe" },
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
            {PINS.map((p, i) => (
              <span key={p.letter} className={`${s.pin} ${i === 0 ? s.pinActive : ""}`}>
                <b style={{ color: p.tint }}>{p.letter}</b>
              </span>
            ))}
          </div>

          <p className={s.groupLabel}>Today</p>
          <ul className={s.tabs}>
            {TABS.map((t) => (
              <li key={t.title} className={`${s.tab} ${t.active ? s.tabActive : ""}`}>
                <span className={s.favicon}>{t.icon === "pr" ? <GitPullRequest /> : <Globe />}</span>
                <span className={s.tabTitle}>{t.title}</span>
                {t.active && <X className={s.tabClose} />}
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
            <span className={s.agentTitle}>
              <Sparkles />
              Agent
            </span>
            <span className={s.agentModel}>claude-code-acp</span>
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
          <div className={s.input}>
            <span className={s.placeholder}>
              Ask the agent<span className={s.caret} />
            </span>
            <span className={s.inputKeys}>
              <kbd>⌘</kbd>
              <kbd>J</kbd>
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}
