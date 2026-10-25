"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { HEADER_SECTIONS, SECTIONS } from "@/lib/navigation";
import type { PageMetaWithHref } from "@/lib/content";
import { SectionIcon } from "@/components/site/section-icon";
import { CodeEnhancer } from "@/components/site/code-enhancer";

export interface NavSection {
  id: string;
  title: string;
  shortTitle?: string;
  pages: { title: string; href: string; status?: string }[];
}

export function DocsShell({
  nav,
  children,
  toc,
}: {
  nav: NavSection[];
  children: ReactNode;
  toc?: ReactNode;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Client navigations must land at the top of the new page. The site uses
  // smooth scrolling for in-page anchors, so reset instantly here.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  // Auto-expand the section containing the active page; close drawer on nav.
  useEffect(() => {
    const current = nav.find((s) => s.pages.some((p) => p.href === pathname));
    if (current) setExpanded((e) => ({ ...e, [current.id]: true }));
    setDrawerOpen(false);
  }, [pathname, nav]);

  // On docs landing pages (/section/) open the section group.
  useEffect(() => {
    const m = pathname.match(/^\/([a-z-]+)\/?$/);
    if (m) setExpanded((e) => ({ ...e, [m[1]]: true }));
  }, [pathname]);

  const sidebar = (
    <nav aria-label="Documentation sections" className="space-y-0.5 pb-10">
      {SECTIONS.map((section) => {
        const group = nav.find((n) => n.id === section.id);
        if (!group || group.pages.length === 0) return null;
        const isOpen = expanded[section.id] ?? false;
        const isCurrentSection = pathname === `/${section.id}/`;
        return (
          <div key={section.id}>
            <button
              type="button"
              onClick={() => setExpanded((e) => ({ ...e, [section.id]: !e[section.id] }))}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[0.86rem] font-medium text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
            >
              <SectionIcon name={section.icon} className={`size-4 ${isCurrentSection ? "text-accent" : "text-text-subtle"}`} />
              <span className="flex-1 text-start">{section.shortTitle ?? section.title}</span>
              <ChevronDown
                className={`size-3.5 text-text-subtle transition-transform ${isOpen ? "" : "-rotate-90"}`}
                aria-hidden
              />
            </button>
            {isOpen && (
              <ul className="mb-1.5 ms-[1.32rem] border-s border-border ps-2">
                {group.pages.map((p) => {
                  const active = p.href === pathname;
                  return (
                    <li key={p.href}>
                      <Link
                        href={p.href}
                        aria-current={active ? "page" : undefined}
                        className={`-ms-px block truncate border-s-2 py-1 pe-2 text-[0.84rem] transition-colors ${
                          active
                            ? "border-accent font-medium text-text"
                            : "border-transparent text-text-muted hover:border-border-strong hover:text-text"
                        }`}
                      >
                        {p.title}
                        {p.status === "draft" && (
                          <span className="ms-1.5 align-middle text-[0.62rem] font-semibold uppercase tracking-wide text-warning">
                            draft
                          </span>
                        )}
                        {p.status === "proposal" && (
                          <span className="ms-1.5 align-middle text-[0.62rem] font-semibold uppercase tracking-wide text-text-subtle">
                            proposal
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <div className="mx-auto flex max-w-[var(--container-docs)] gap-8 px-4 sm:px-6">
      {/* Mobile docs bar */}
      <div className="fixed inset-x-0 top-14 z-30 border-b border-border bg-background/90 backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-text-muted"
          aria-expanded={drawerOpen}
        >
          <Menu className="size-4" aria-hidden />
          Browse documentation
        </button>
      </div>
      <div className="h-11 shrink-0 lg:hidden" aria-hidden />

      {/* Desktop sidebar */}
      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto py-6 pe-2 lg:block">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-overlay" onClick={() => setDrawerOpen(false)} aria-hidden />
          <div className="absolute inset-y-0 start-0 w-80 max-w-[85vw] overflow-y-auto border-e border-border bg-background p-4 shadow-raised">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-text">Documentation</p>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation"
                className="flex size-8 items-center justify-center rounded-md text-text-subtle hover:bg-surface-2"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            {sidebar}
          </div>
        </div>
      )}

      {/* Article */}
      <main className="min-w-0 flex-1 pb-20 pt-6">
        <CodeEnhancer />
        {children}
      </main>

      {/* Right TOC */}
      {toc && (
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto py-6 xl:block">
          {toc}
        </aside>
      )}
    </div>
  );
}

/** Quick links strip rendered on the site landing page. */
export function HeaderSectionsLinks() {
  return (
    <nav aria-label="Primary sections" className="flex flex-wrap gap-2">
      {HEADER_SECTIONS.map((s) => (
        <Link
          key={s.id}
          href={`/${s.id}/`}
          className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-[0.85rem] font-medium text-text-muted transition-colors hover:border-accent/50 hover:text-text"
        >
          {s.shortTitle ?? s.title}
        </Link>
      ))}
    </nav>
  );
}
