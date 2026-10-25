"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown, Check, X } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

/** Headless-style dropdown implementing the HIG selection control. */
export function Select({
  value,
  onValueChange,
  options,
  label,
  className = "",
}: {
  value: string;
  onValueChange: (v: string) => void;
  options: SelectOption[];
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {label ? (
        <p className="mb-1.5 text-[0.85rem] font-medium text-text">{label}</p>
      ) : null}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-border-strong bg-surface px-3 text-[0.875rem] text-text transition-colors hover:border-accent/50 focus-visible:outline-2 focus-visible:outline-accent"
      >
        <span className="truncate">{selected?.label ?? "Select…"}</span>
        <ChevronDown className={`size-4 shrink-0 text-text-subtle transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open ? (
        <ul
          role="listbox"
          aria-label={label ?? "Options"}
          className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-raised"
        >
          {options.map((o) => {
            const isSel = o.value === value;
            return (
              <li key={o.value} role="option" aria-selected={isSel}>
                <button
                  type="button"
                  onClick={() => {
                    onValueChange(o.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-1.5 text-[0.85rem] transition-colors ${
                    isSel ? "bg-accent-soft text-accent" : "text-text hover:bg-surface-2"
                  }`}
                >
                  {o.label}
                  {isSel ? <Check className="size-3.5" aria-hidden /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

/** In-app tab bar implementing the HIG navigation pattern. */
export function SegmentedTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { value: string; label: string; icon?: ReactNode }[];
  active: string;
  onChange: (v: string) => void;
}) {
  return (
    <div role="tablist" className="flex gap-1 border-b border-border" aria-label="Sections">
      {tabs.map((t) => {
        const selected = t.value === active;
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(t.value)}
            className={`-mb-px flex items-center gap-1.5 border-b-2 px-3.5 py-2 text-[0.85rem] transition-colors ${
              selected
                ? "border-accent font-medium text-text"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/** Parch toast (transient notification). */
export function Toast({
  title,
  description,
  tone = "neutral",
  onDismiss,
}: {
  title: string;
  description?: string;
  tone?: "neutral" | "success" | "danger" | "info";
  onDismiss?: () => void;
}) {
  const tones: Record<string, string> = {
    neutral: "border-border",
    success: "border-success/40",
    danger: "border-danger/40",
    info: "border-info/40",
  };
  return (
    <div
      role="status"
      className={`pointer-events-auto flex w-80 items-start gap-3 rounded-xl border bg-surface p-3.5 shadow-raised ${tones[tone]}`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-[0.85rem] font-semibold text-text">{title}</p>
        {description ? (
          <p className="mt-0.5 text-[0.8rem] leading-snug text-text-muted">{description}</p>
        ) : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="flex size-6 shrink-0 items-center justify-center rounded-md text-text-subtle hover:bg-surface-2"
        >
          <X className="size-3.5" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}

export function useToastDemo() {
  const [toast, setToast] = useState<null | { title: string; description?: string; tone: "neutral" | "success" | "danger" | "info" }>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(null);
  const show = (t: { title: string; description?: string; tone?: "neutral" | "success" | "danger" | "info" }) => {
    setToast({ tone: "neutral", ...t });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 4000);
  };
  const node = toast ? (
    <div className="pointer-events-none fixed bottom-5 end-5 z-50 flex flex-col gap-2">
      <Toast {...toast} onDismiss={() => setToast(null)} />
    </div>
  ) : null;
  return { show, node };
}
