import type { ReactNode } from "react";
import { Minus, Square, X } from "lucide-react";

/**
 * Application window frame used by the mock-app gallery and HIG examples.
 * Renders KDE-style header bar with window controls; children are the app body.
 */
export function AppWindow({
  title,
  icon,
  children,
  toolbar,
  className = "",
  width,
  height,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  toolbar?: ReactNode;
  className?: string;
  width?: number | string;
  height?: number | string;
}) {
  return (
    <div
      style={{ width, height }}
      className={`flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-raised ${className}`}
    >
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border bg-surface-2 px-3">
        {icon}
        <p className="truncate text-[0.82rem] font-semibold text-text">{title}</p>
        <div className="ms-auto flex items-center gap-1" aria-hidden>
          <span className="flex size-5 items-center justify-center rounded text-text-subtle hover:bg-surface-3">
            <Minus className="size-3" />
          </span>
          <span className="flex size-5 items-center justify-center rounded text-text-subtle hover:bg-surface-3">
            <Square className="size-2.5" />
          </span>
          <span className="flex size-5 items-center justify-center rounded text-text-subtle hover:bg-danger hover:text-white">
            <X className="size-3" />
          </span>
        </div>
      </div>
      {toolbar ? <div className="shrink-0 border-b border-border bg-surface">{toolbar}</div> : null}
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

/** Empty state block per HIG "empty states" rules. */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-surface-2 text-text-subtle">
        {icon}
      </span>
      <p className="mt-3 text-[0.95rem] font-semibold text-text">{title}</p>
      <p className="mt-1 max-w-sm text-[0.84rem] leading-relaxed text-text-muted">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

/** Settings-style row: leading icon, label+description, trailing control. */
export function SettingsRow({
  icon,
  label,
  description,
  control,
  onClick,
}: {
  icon?: ReactNode;
  label: string;
  description?: string;
  control?: ReactNode;
  onClick?: () => void;
}) {
  const content = (
    <>
      {icon ? <span className="text-text-subtle">{icon}</span> : null}
      <div className="min-w-0 flex-1">
        <p className="text-[0.875rem] text-text">{label}</p>
        {description ? (
          <p className="mt-0.5 text-[0.78rem] leading-snug text-text-muted">{description}</p>
        ) : null}
      </div>
      {control ? <div className="shrink-0">{control}</div> : null}
    </>
  );
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-3 px-4 py-3 text-start transition-colors hover:bg-surface-2"
      >
        {content}
      </button>
    );
  }
  return <div className="flex items-center gap-3 px-4 py-3">{content}</div>;
}

export function SettingsGroup({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-5">
      {title ? (
        <p className="mb-1.5 px-1 text-[0.75rem] font-semibold uppercase tracking-wide text-text-subtle">
          {title}
        </p>
      ) : null}
      <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
        {children}
      </div>
    </section>
  );
}
