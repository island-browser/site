"use client";

import { useId, useRef, useState } from "react";

import { type CodeLang, CodeBody, copyTextFor } from "@/components/code-block";
import { CopyButton } from "@/components/copy-button";

export type AgentTab = {
  id: string;
  label: string;
  /** Shown instead of `label` on phones so the tab row never clips. */
  short: string;
  filename: string;
  lang: CodeLang;
  code: string;
  note: string;
};

/** Tabbed code sample (WAI-ARIA tabs pattern with arrow-key navigation). */
export function AgentTabs({ tabs }: { tabs: AgentTab[] }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const tab = tabs[active];

  function onKeyDown(e: React.KeyboardEvent) {
    const last = tabs.length - 1;
    let next = active;
    if (e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  }

  return (
    <div className="codeblock">
      <div className="codeblock-head !pl-1.5">
        <div role="tablist" aria-label="Connection type" className="flex min-w-0 items-center gap-0.5 overflow-x-auto" onKeyDown={onKeyDown}>
          {tabs.map((t, i) => {
            const selected = i === active;
            return (
              <button
                key={t.id}
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
                className={`h-7 flex-none rounded-[5px] px-2.5 font-mono text-xs transition-colors ${
                  selected ? "bg-surface text-fg shadow-[0_0_0_1px_var(--border)]" : "text-fg-2 hover:text-fg"
                }`}
              >
                <span className="sm:hidden">{t.short}</span>
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            );
          })}
        </div>
        <CopyButton text={copyTextFor(tab.code, tab.lang)} label={`Copy ${tab.label} config`} />
      </div>
      <div role="tabpanel" id={`${base}-panel`} aria-labelledby={`${base}-tab-${tab.id}`}>
        <div className="flex items-center justify-between gap-3 border-b border-dashed border-line px-4 py-2">
          <span className="font-mono text-[11.5px] text-fg-2">{tab.filename}</span>
        </div>
        <CodeBody code={tab.code} lang={tab.lang} />
        <p className="border-t border-line px-4 py-3 text-[13px] leading-relaxed text-fg-2">{tab.note}</p>
      </div>
    </div>
  );
}
