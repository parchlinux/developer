"use client";

import { useId, type ReactNode } from "react";
import { Check } from "lucide-react";

export function Switch({
  checked,
  onCheckedChange,
  label,
  description,
  disabled,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <label htmlFor={id} className="block text-[0.875rem] font-medium text-text">
          {label}
        </label>
        {description ? (
          <p id={`${id}-desc`} className="mt-0.5 text-[0.78rem] leading-snug text-text-muted">
            {description}
          </p>
        ) : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={description ? `${id}-desc` : undefined}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={`relative h-6 w-10 shrink-0 rounded-full border transition-colors disabled:opacity-45 ${
          checked ? "border-accent bg-accent" : "border-border-strong bg-surface-3"
        }`}
      >
        <span
          aria-hidden
          className={`absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-white shadow transition-[left] ${
            checked ? "left-[calc(100%-1.125rem)]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export function Checkbox({
  checked,
  onCheckedChange,
  label,
  disabled,
  indeterminate,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  label: ReactNode;
  disabled?: boolean;
  indeterminate?: boolean;
}) {
  const id = useId();
  const showCheck = checked && !indeterminate;
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-center gap-2.5 text-[0.875rem] text-text ${
        disabled ? "cursor-not-allowed opacity-45" : ""
      }`}
    >
      <button
        id={id}
        type="button"
        role="checkbox"
        aria-checked={indeterminate ? "mixed" : checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={`flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
          checked || indeterminate
            ? "border-accent bg-accent text-white"
            : "border-border-strong bg-surface"
        }`}
      >
        {showCheck ? (
          <Check className="size-3" strokeWidth={3} aria-hidden />
        ) : indeterminate ? (
          <span className="h-0.5 w-2.5 rounded-full bg-white" aria-hidden />
        ) : null}
      </button>
      <span>{label}</span>
    </label>
  );
}

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export function RadioGroup({
  value,
  onValueChange,
  options,
  name,
}: {
  value: string;
  onValueChange: (v: string) => void;
  options: RadioOption[];
  name: string;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="flex flex-col gap-2.5">
      {options.map((o) => {
        const selected = value === o.value;
        return (
          <label key={o.value} className="flex cursor-pointer items-start gap-2.5">
            <span
              aria-hidden
              className={`mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full border transition-colors ${
                selected ? "border-accent" : "border-border-strong bg-surface"
              }`}
            >
              {selected ? <span className="size-2.5 rounded-full bg-accent" /> : null}
            </span>
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={selected}
              onChange={() => onValueChange(o.value)}
              className="sr-only"
            />
            <span>
              <span className="block text-[0.875rem] text-text">{o.label}</span>
              {o.description ? (
                <span className="mt-0.5 block text-[0.78rem] text-text-muted">{o.description}</span>
              ) : null}
            </span>
          </label>
        );
      })}
    </div>
  );
}
