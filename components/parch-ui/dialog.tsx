"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

/** Modal dialog styled as a Parch application window. */
export function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
  width = 420,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ width }}
        className="max-w-full overflow-hidden rounded-xl border border-border bg-surface shadow-raised"
      >
        <div className="flex items-center justify-between border-b border-border bg-surface-2 px-4 py-2.5">
          <p className="text-[0.9rem] font-semibold text-text">{title}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex size-6 items-center justify-center rounded-md text-text-subtle hover:bg-surface-3 hover:text-text"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
        <div className="px-4 py-4 text-[0.875rem] leading-relaxed text-text-muted [&>p]:m-0">
          {children}
        </div>
        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-border bg-surface-2 px-4 py-3">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ProgressBar({
  value,
  indeterminate,
  label,
  tone = "accent",
}: {
  value?: number;
  indeterminate?: boolean;
  label?: string;
  tone?: "accent" | "info" | "success";
}) {
  const tones: Record<string, string> = {
    accent: "bg-accent",
    info: "bg-info",
    success: "bg-success",
  };
  return (
    <div>
      {label ? (
        <div className="mb-1.5 flex items-center justify-between text-[0.8rem] text-text-muted">
          <span>{label}</span>
          {!indeterminate && value !== undefined ? (
            <span className="font-mono">{Math.round(value)}%</span>
          ) : null}
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-label={label ?? "Progress"}
        className="h-2 w-full overflow-hidden rounded-full bg-surface-3"
      >
        {indeterminate ? (
          <div className={`progress-indeterminate h-full w-1/3 rounded-full ${tones[tone]}`} />
        ) : (
          <div
            className={`h-full rounded-full transition-[width] ${tones[tone]}`}
            style={{ width: `${value ?? 0}%` }}
          />
        )}
      </div>
    </div>
  );
}
