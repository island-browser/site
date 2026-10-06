import { Link2 } from "lucide-react";
import type { ReactNode } from "react";

/** A docs section with a hairline above and a hover anchor on its heading. */
export function DocSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 border-t border-line py-14 first:border-t-0 first:pt-0">
      <div className="prose">
        <h2 id={`${id}-title`} className="group flex items-center gap-2">
          {title}
          <a
            href={`#${id}`}
            className="text-fg-2 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            aria-label={`Link to ${title}`}
          >
            <Link2 className="size-4" aria-hidden />
          </a>
        </h2>
        {children}
      </div>
    </section>
  );
}
