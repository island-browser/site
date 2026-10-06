import type { ReactNode } from "react";

/** A full-width band inside the page frame: hairline on top, cross markers at the corners. */
export function Band({
  children,
  id,
  className = "",
  labelledBy,
  crosses = true,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  labelledBy?: string;
  crosses?: boolean;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`relative border-t border-line ${className}`}>
      {crosses && (
        <>
          <span className="cross cross-tl" aria-hidden="true" />
          <span className="cross cross-tr" aria-hidden="true" />
        </>
      )}
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
}: {
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  id?: string;
  action?: ReactNode;
}) {
  return (
    <div className="gutter flex flex-col gap-6 py-16 sm:py-20 lg:flex-row lg:items-end lg:justify-between" data-reveal>
      <div className="max-w-[640px]">
        <p className="label mb-4">{label}</p>
        <h2 id={id} className="h2">
          {title}
        </h2>
        {lede && <p className="lede mt-4">{lede}</p>}
      </div>
      {action && <div className="flex-none">{action}</div>}
    </div>
  );
}
