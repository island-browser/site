import type { ReactNode } from "react";

import { CopyButton } from "@/components/copy-button";

export type CodeLang = "json" | "shell" | "text";

function highlightJson(code: string): ReactNode[] {
  // Strings followed by a colon are keys; other strings are values; braces are dimmed.
  const out: ReactNode[] = [];
  const re = /("(?:[^"\\]|\\.)*")(\s*:)?|([{}[\],])/g;
  let last = 0;
  let i = 0;
  for (const m of code.matchAll(re)) {
    if (m.index! > last) out.push(code.slice(last, m.index));
    if (m[1] && m[2]) {
      out.push(<span key={i++}>{m[1]}</span>, <span key={i++} className="tok-dim">{m[2]}</span>);
    } else if (m[1]) {
      out.push(<span key={i++} className="tok-str">{m[1]}</span>);
    } else {
      out.push(<span key={i++} className="tok-dim">{m[3]}</span>);
    }
    last = m.index! + m[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

function highlightShell(code: string): ReactNode[] {
  return code.split("\n").map((line, i, all) => {
    const nl = i < all.length - 1 ? "\n" : "";
    if (line.startsWith("#")) {
      return (
        <span key={i} className="tok-dim">
          {line}
          {nl}
        </span>
      );
    }
    if (line.startsWith("$ ")) {
      return (
        <span key={i}>
          <span className="tok-dim select-none">$ </span>
          {line.slice(2)}
          {nl}
        </span>
      );
    }
    return (
      <span key={i}>
        {line}
        {nl}
      </span>
    );
  });
}

/** What the copy button puts on the clipboard: shell blocks lose prompts and comments. */
export function copyTextFor(code: string, lang: CodeLang) {
  if (lang !== "shell") return code;
  return code
    .split("\n")
    .filter((l) => !l.startsWith("#"))
    .map((l) => (l.startsWith("$ ") ? l.slice(2) : l))
    .join("\n");
}

export function CodeBody({ code, lang }: { code: string; lang: CodeLang }) {
  const content = lang === "json" ? highlightJson(code) : lang === "shell" ? highlightShell(code) : code;
  return (
    <pre tabIndex={0}>
      <code>{content}</code>
    </pre>
  );
}

export function CodeBlock({
  code,
  lang = "shell",
  filename,
  className = "",
}: {
  code: string;
  lang?: CodeLang;
  filename?: string;
  className?: string;
}) {
  const name = filename ?? (lang === "shell" ? "Terminal" : lang === "json" ? "JSON" : "Text");
  return (
    <figure className={`codeblock ${className}`}>
      <figcaption className="codeblock-head">
        <span className="font-mono text-xs text-fg-2">{name}</span>
        <CopyButton text={copyTextFor(code, lang)} label={`Copy ${name}`} />
      </figcaption>
      <CodeBody code={code} lang={lang} />
    </figure>
  );
}
