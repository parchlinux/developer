"use client";

import { useEffect, useState } from "react";
import { ListTree } from "lucide-react";
import type { TocEntry } from "@/lib/content";

export function TableOfContents({ entries }: { entries: TocEntry[] }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const headings = entries
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (changes) => {
        for (const c of changes) {
          if (c.isIntersecting) {
            setActive(c.target.id);
          }
        }
      },
      { rootMargin: "-5% 0% -75% 0%" },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <nav aria-label="On this page" className="text-[0.82rem]">
      <p className="mb-2 flex items-center gap-1.5 font-semibold uppercase tracking-wide text-text-subtle">
        <ListTree className="size-3.5" aria-hidden />
        On this page
      </p>
      <ul className="space-y-0.5 border-s border-border">
        {entries.map((e) => (
          <li key={e.id}>
            <a
              href={`#${e.id}`}
              aria-current={active === e.id ? "location" : undefined}
              className={`-ms-px block border-s-2 py-1 pe-1 leading-snug transition-colors ${
                e.depth === 3 ? "ps-6" : e.depth === 4 ? "ps-8" : "ps-3"
              } ${
                active === e.id
                  ? "border-accent font-medium text-text"
                  : "border-transparent text-text-muted hover:border-border-strong hover:text-text"
              }`}
            >
              {e.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
