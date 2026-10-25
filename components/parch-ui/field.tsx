"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { Search, CircleAlert } from "lucide-react";

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  error?: string;
  iconStart?: ReactNode;
  trailing?: ReactNode;
}

/** Labeled text input with description and validation slot. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, description, error, iconStart, trailing, className = "", id, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `field-${autoId}`;
  const describedBy = error ? `${inputId}-error` : description ? `${inputId}-desc` : undefined;
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={inputId} className="text-[0.85rem] font-medium text-text">
        {label}
      </label>
      <div
        className={`flex h-9 items-center gap-2 rounded-lg border bg-surface px-3 transition-colors focus-within:border-accent focus-within:outline focus-within:outline-2 focus-within:outline-accent/30 ${
          error ? "border-danger" : "border-border-strong"
        }`}
      >
        {iconStart ? <span className="text-text-subtle">{iconStart}</span> : null}
        <input
          ref={ref}
          id={inputId}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className="w-full bg-transparent text-[0.875rem] text-text outline-none placeholder:text-text-subtle"
          {...rest}
        />
        {trailing}
      </div>
      {description && !error ? (
        <p id={`${inputId}-desc`} className="text-[0.78rem] text-text-subtle">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={`${inputId}-error`} className="flex items-center gap-1 text-[0.78rem] text-danger" role="alert">
          <CircleAlert className="size-3.5" aria-hidden />
          {error}
        </p>
      ) : null}
    </div>
  );
});

export function SearchField({
  placeholder = "Search…",
  value,
  onValueChange,
  label = "Search",
}: {
  placeholder?: string;
  value: string;
  onValueChange: (v: string) => void;
  label?: string;
}) {
  return (
    <div className="flex h-9 w-full items-center gap-2 rounded-lg border border-border-strong bg-surface px-3 focus-within:border-accent">
      <Search className="size-4 text-text-subtle" aria-hidden />
      <input
        type="search"
        aria-label={label}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-full bg-transparent text-[0.875rem] text-text outline-none placeholder:text-text-subtle"
      />
    </div>
  );
}
