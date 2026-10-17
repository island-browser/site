import type { ReactNode } from "react";

/** A full-width band inside the page column, with a hairline on top. */
export function Band({
  children,
  id,
  className = "",
  labelledBy,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`relative border-t border-line ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeader({
  label,
  title,
  lede,
  id,
  action,
  tag,
}: {
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  id?: string;
  action?: ReactNode;
  /** A status pill next to the label, such as "Coming in 0.7". */
  tag?: ReactNode;
}) {
  return (
    <div className="gutter flex flex-col gap-6 pt-16 pb-8 sm:pt-20 lg:flex-row lg:items-end lg:justify-between" data-reveal>
      <div className="max-w-[680px]">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <p className="label">{label}</p>
          {tag}
        </div>
        <h2 id={id} className="h2">
          {title}
        </h2>
        {lede && <p className="lede mt-4">{lede}</p>}
      </div>
      {action && <div className="flex-none">{action}</div>}
    </div>
  );
}
