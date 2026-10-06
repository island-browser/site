import { Fragment } from "react";

import type { Combo } from "@/lib/content";

const SYMBOLS: Record<string, { glyph: string; name: string }> = {
  Cmd: { glyph: "⌘", name: "Command" },
  Shift: { glyph: "⇧", name: "Shift" },
  Opt: { glyph: "⌥", name: "Option" },
  Ctrl: { glyph: "Ctrl", name: "Control" },
  Esc: { glyph: "Esc", name: "Escape" },
};

/** One key cap. Symbol keys keep a spoken name for screen readers. */
export function Key({ k }: { k: string }) {
  const sym = SYMBOLS[k];
  if (!sym || sym.glyph === sym.name) return <kbd className="kbd">{sym?.glyph ?? k}</kbd>;
  return (
    <kbd className="kbd" title={sym.name}>
      <span aria-hidden="true">{sym.glyph}</span>
      <span className="sr-only">{sym.name}</span>
    </kbd>
  );
}

/** A key combination such as ⌘ ⇧ K, rendered as separate caps. */
export function Keys({ combo, className = "" }: { combo: Combo; className?: string }) {
  return (
    <span className={`kbd-combo ${className}`}>
      {combo.map((k, i) => (
        <Key key={`${k}-${i}`} k={k} />
      ))}
    </span>
  );
}

/** Several combinations joined by a separator ("/" or "…"). */
export function KeyList({ combos, separator = "/" }: { combos: Combo[]; separator?: string }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-1">
      {combos.map((c, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="text-fg-2 font-mono text-xs">{separator}</span>}
          <Keys combo={c} />
        </Fragment>
      ))}
    </span>
  );
}
