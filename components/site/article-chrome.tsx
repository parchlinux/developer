import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import type { PageMetaWithHref } from "@/lib/content";

export function Breadcrumbs({ page }: { page: PageMetaWithHref }) {
  const parts = [
    { label: "Docs", href: "/" },
    { label: page.sectionTitle, href: `/${page.section}/` },
  ];
  if (!page.index) parts.push({ label: page.title, href: page.href });

  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-[0.8rem] text-text-subtle">
      {parts.map((p, i) => (
        <span key={p.href} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="size-3" aria-hidden />}
          {i === 0 && <Home className="size-3" aria-hidden />}
          {i < parts.length - 1 ? (
            <Link href={p.href} className="transition-colors hover:text-text">
              {p.label}
            </Link>
          ) : (
            <span aria-current="page" className="text-text-muted">
              {p.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PagePager({
  prev,
  next,
}: {
  prev?: { title: string; href: string };
  next?: { title: string; href: string };
}) {
  return (
    <nav aria-label="Article pagination" className="mt-14 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
      {prev ? (
        <Link
          href={prev.href}
          className="group rounded-lg border border-border bg-surface p-3.5 shadow-card transition-colors hover:border-accent/40"
        >
          <p className="text-xs text-text-subtle">Previous</p>
          <p className="mt-0.5 text-sm font-medium text-text group-hover:text-accent">{prev.title}</p>
        </Link>
      ) : (
        <span aria-hidden />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group rounded-lg border border-border bg-surface p-3.5 text-end shadow-card transition-colors hover:border-accent/40 sm:col-start-2"
        >
          <p className="text-xs text-text-subtle">Next</p>
          <p className="mt-0.5 text-sm font-medium text-text group-hover:text-accent">{next.title}</p>
        </Link>
      ) : null}
    </nav>
  );
}
