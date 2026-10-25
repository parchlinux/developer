"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

export type ButtonVariant = "accent" | "default" | "flat" | "destructive" | "link";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  accent:
    "bg-accent text-white hover:bg-accent-strong border border-transparent shadow-sm",
  default:
    "bg-surface text-text border border-border-strong hover:border-accent/60 hover:bg-surface-2 shadow-sm",
  flat: "bg-transparent text-text-muted border border-transparent hover:bg-surface-2 hover:text-text",
  destructive:
    "bg-danger text-white hover:bg-danger-strong border border-transparent shadow-sm",
  link: "bg-transparent text-link underline-offset-2 hover:underline border border-transparent p-0",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-7 px-2.5 text-[0.8rem] gap-1.5 rounded-md",
  md: "h-9 px-3.5 text-[0.875rem] gap-2 rounded-lg",
  lg: "h-11 px-5 text-[0.95rem] gap-2 rounded-lg",
};

/** The canonical Parch button. Used verbatim in HIG examples and mock apps. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "default", size = "md", loading, iconStart, iconEnd, className = "", children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex select-none items-center justify-center font-medium transition-[background-color,border-color,box-shadow,transform] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        VARIANT_CLASSES[variant]
      } ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      {loading ? (
        <span
          aria-hidden
          className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : (
        iconStart
      )}
      {children}
      {iconEnd}
    </button>
  );
});

/** Pill-shaped chip used for statuses, categories, and filters. */
export function Chip({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "info" | "success" | "warning" | "danger";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-surface-2 text-text-muted border-border",
    accent: "bg-accent-soft text-accent border-accent/30",
    info: "bg-info-soft text-info border-info/30",
    success: "bg-success-soft text-success border-success/30",
    warning: "bg-warning-soft text-warning-strong border-warning/40",
    danger: "bg-danger-soft text-danger border-danger/30",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.72rem] font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
