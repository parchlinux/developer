"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

interface PagefindResult {
  meta: { title?: string };
  excerpt: string;
  url: string;
  sub_results?: { title: string; url: string }[];
}

interface Pagefind {
  search: (q: string) => Promise<{
    results: { data: () => Promise<PagefindResult> }[];
  }>;
}

declare global {
  interface Window {
    pagefind?: Pagefind;
  }
}

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PagefindResult[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error" | "noindex">("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Cmd/Ctrl+K opens the dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
      setStatus("idle");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setStatus("idle");
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        let pf = window.pagefind;
        if (!pf) {
          setStatus("loading");
          // Served from the pagefind build step; URL is runtime-only so TS ignores it.
          const url = "/_pagefind/pagefind.js";
          const mod = (await import(/* webpackIgnore: true */ url)) as any;
          pf = window.pagefind = mod as Pagefind;
        }
        const res = await pf.search(q);
        const data = await Promise.all(res.results.slice(0, 12).map((r) => r.data()));
        if (cancelled) return;
        setResults(data);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("noindex");
      }
    }, 120);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-8 items-center gap-2 rounded-full border border-border bg-surface px-3 text-[0.82rem] text-text-subtle transition-colors hover:border-border-strong hover:text-text"
        aria-label="Search documentation (Ctrl+K)"
      >
        <Search className="size-3.5" aria-hidden />
        <span className="hidden sm:inline">Search docs…</span>
        <kbd className="hidden rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[0.68rem] sm:inline">
          Ctrl K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-overlay px-4 pt-[12vh]"
          onMouseDown={(e) => {
            if (!dialogRef.current?.contains(e.target as Node)) close();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search documentation"
            className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-surface shadow-raised"
          >
            <div className="flex items-center gap-2.5 border-b border-border px-4">
              <Search className="size-4 text-text-subtle" aria-hidden />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the developer portal…"
                className="h-12 flex-1 bg-transparent text-[0.95rem] text-text outline-none placeholder:text-text-subtle"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Close search"
                className="flex size-6 items-center justify-center rounded-md text-text-subtle hover:bg-surface-2"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {status === "idle" && (
                <p className="px-3 py-6 text-center text-sm text-text-subtle">
                  Type at least two characters. Indexes all portal documentation.
                </p>
              )}
              {status === "loading" && (
                <p className="px-3 py-6 text-center text-sm text-text-subtle" role="status">
                  Loading search index…
                </p>
              )}
              {status === "noindex" && (
                <p className="px-3 py-6 text-center text-sm text-text-subtle">
                  Search index is built during production builds (<code className="font-mono text-xs">bun run build</code>).
                </p>
              )}
              {status === "ready" && results.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-text-subtle" role="status">
                  No results for “{query}”.
                </p>
              )}
              {results.map((r, i) => (
                <a
                  key={i}
                  href={r.url}
                  onClick={close}
                  className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-surface-2"
                >
                  <p className="text-sm font-medium text-text">
                    {r.meta?.title ?? r.url}
                  </p>
                  <div
                    className="mt-0.5 line-clamp-2 text-[0.82rem] leading-relaxed text-text-muted [&_mark]:rounded [&_mark]:bg-accent-soft [&_mark]:px-0.5 [&_mark]:text-text [&_p]:my-0"
                    dangerouslySetInnerHTML={{ __html: r.excerpt }}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
