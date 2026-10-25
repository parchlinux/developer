import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export function CardGrid({ children, cols = 2 }: { children: ReactNode; cols?: 2 | 3 }) {
  return (
    <div
      className={
        cols === 3
          ? "my-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          : "my-5 grid gap-3 sm:grid-cols-2"
      }
    >
      {children}
    </div>
  );
}

export function Card({
  title,
  href,
  icon,
  children,
}: {
  title: string;
  href?: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  const body = (
    <>
      <div className="flex items-center gap-2">
        {icon ? <span className="text-accent">{icon}</span> : null}
        <h3 className="text-[0.98rem] font-semibold text-text">{title}</h3>
        {href ? (
          <ChevronRight className="ml-auto size-4 text-text-subtle transition-transform group-hover:translate-x-0.5" aria-hidden />
        ) : null}
      </div>
      {/* div, not p: MDX parses multi-line card bodies into <p> elements */}
      <div className="mt-1.5 text-sm leading-relaxed text-text-muted [&_p]:my-0">{children}</div>
    </>
  );
  if (href) {
    return (
      <Link
        href={href}
        className="group my-0 flex flex-col rounded-lg border border-border bg-surface p-4 no-underline shadow-card transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-raised [&_h3]:no-underline"
      >
        {body}
      </Link>
    );
  }
  return (
    <div className="my-0 flex flex-col rounded-lg border border-border bg-surface p-4 shadow-card">
      {body}
    </div>
  );
}
