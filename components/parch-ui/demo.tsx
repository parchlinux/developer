"use client";

import { useState, type ReactNode } from "react";
import { Moon, Sun, CircleCheck, X } from "lucide-react";

/**
 * Interactive demo stage for the design system.
 * Supports rendering children with an isolated light/dark theme
 * (CSS variables cascade, so a scoped .dark wrapper re-themes the subtree).
 */
export function Demo({
  children,
  themeable = true,
  align = "center",
  label,
}: {
  children: ReactNode;
  themeable?: boolean;
  align?: "center" | "stretch";
  label?: string;
}) {
  const [mode, setMode] = useState<"inherit" | "light" | "dark">("inherit");

  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-border bg-surface shadow-card">
      <figcaption className="flex items-center gap-2 border-b border-border bg-surface-2 px-3.5 py-2">
        <span className="text-[0.75rem] font-semibold uppercase tracking-wide text-text-subtle">
          {label ?? "Demo"}
        </span>
        {themeable ? (
          <span
            role="radiogroup"
            aria-label="Preview theme"
            className="ms-auto flex items-center gap-0.5"
          >
            {(
              [
                ["inherit", "Site"],
                ["light", <Sun key="l" className="size-3.5" aria-hidden />],
                ["dark", <Moon key="d" className="size-3.5" aria-hidden />],
              ] as const
            ).map(([value, node]) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={mode === value}
                aria-label={`Preview in ${value} theme`}
                onClick={() => setMode(value)}
                className={`flex h-6 items-center gap-1 rounded-md px-2 text-[0.7rem] font-medium transition-colors ${
                  mode === value
                    ? "bg-accent-soft text-accent"
                    : "text-text-subtle hover:bg-surface-3 hover:text-text"
                }`}
              >
                {node}
                {value === "inherit" ? "Site" : ""}
              </button>
            ))}
          </span>
        ) : null}
      </figcaption>
      <div
        className={`${
          mode === "dark" ? "dark" : mode === "light" ? "light-preview" : ""
        } p-6`}
        style={
          mode === "dark"
            ? { background: "var(--background)", color: "var(--text)" }
            : mode === "light"
              ? { background: "#fbfcfd", color: "#101c26" }
              : undefined
        }
      >
        <div className={`flex ${align === "center" ? "justify-center" : ""}`}>
          {children}
        </div>
      </div>
    </figure>
  );
}

/** HIG do/don't comparison pair. */
export function DoDont({
  do_: { children: doChildren, caption: doCaption },
  dont: { children: dontChildren, caption: dontCaption },
}: {
  do_: { children: ReactNode; caption: string };
  dont: { children: ReactNode; caption: string };
}) {
  return (
    <div className="my-6 grid gap-4 sm:grid-cols-2">
      <div className="overflow-hidden rounded-xl border border-success/40">
        <p className="flex items-center gap-1.5 bg-success-soft px-3.5 py-2 text-[0.8rem] font-semibold text-success">
          <CircleCheck className="size-4" aria-hidden /> Do
        </p>
        <div className="bg-surface p-5">{doChildren}</div>
        <p className="border-t border-border bg-surface px-3.5 py-2.5 text-[0.82rem] leading-relaxed text-text-muted">
          {doCaption}
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border border-danger/40">
        <p className="flex items-center gap-1.5 bg-danger-soft px-3.5 py-2 text-[0.8rem] font-semibold text-danger">
          <X className="size-4" aria-hidden /> Don&apos;t
        </p>
        <div className="bg-surface p-5">{dontChildren}</div>
        <p className="border-t border-border bg-surface px-3.5 py-2.5 text-[0.82rem] leading-relaxed text-text-muted">
          {dontCaption}
        </p>
      </div>
    </div>
  );
}

/** Color swatch grid used on the tokens page. */
export function Swatch({
  name,
  cssVar,
  fallback,
}: {
  name: string;
  cssVar: string;
  fallback?: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div
        className="h-14 w-full border-b border-border"
        style={{ background: fallback ?? `var(${cssVar})` }}
      />
      <div className="bg-surface px-3 py-2">
        <p className="text-[0.8rem] font-medium text-text">{name}</p>
        <p className="font-mono text-[0.68rem] text-text-subtle">{cssVar}</p>
      </div>
    </div>
  );
}

export function SpecTable({
  rows,
  columns = ["Token", "Value", "Usage"],
}: {
  rows: string[][];
  columns?: string[];
}) {
  return (
    <div className="my-5 overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-[0.84rem]">
        <thead>
          <tr className="bg-surface-2">
            {columns.map((c) => (
              <th key={c} className="border-b border-border px-3.5 py-2 text-start font-semibold text-text">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="odd:bg-surface even:bg-surface-2/50">
              {r.map((cell, j) => (
                <td
                  key={j}
                  className={`border-b border-border px-3.5 py-2 align-top ${
                    j === 0 ? "font-mono text-[0.78rem] text-accent" : "text-text-muted"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
