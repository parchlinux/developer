import { Info, AlertTriangle, CircleAlert, Lightbulb, Zap } from "lucide-react";
import type { ReactNode } from "react";

type CalloutKind = "note" | "warning" | "danger" | "tip" | "important";

const STYLES: Record<
  CalloutKind,
  { icon: typeof Info; label: string; color: string; soft: string }
> = {
  note: { icon: Info, label: "Note", color: "var(--info)", soft: "var(--info-soft)" },
  important: { icon: Zap, label: "Important", color: "var(--info)", soft: "var(--info-soft)" },
  tip: { icon: Lightbulb, label: "Tip", color: "var(--success)", soft: "var(--success-soft)" },
  warning: { icon: AlertTriangle, label: "Warning", color: "var(--warning-strong)", soft: "var(--warning-soft)" },
  danger: { icon: CircleAlert, label: "Caution", color: "var(--danger-strong)", soft: "var(--danger-soft)" },
};

export function Callout({
  kind = "note",
  title,
  children,
}: {
  kind?: CalloutKind;
  title?: string;
  children: ReactNode;
}) {
  const { icon: Icon, label, color, soft } = STYLES[kind];
  return (
    <aside
      className="callout my-5 flex gap-3 rounded-lg border p-4 text-[0.94rem] leading-relaxed"
      style={{ borderColor: `color-mix(in oklab, ${color} 30%, var(--border))`, background: soft }}
    >
      <Icon className="mt-0.5 size-[18px] shrink-0" style={{ color }} aria-hidden />
      <div className="min-w-0">
        <p className="m-0 font-semibold" style={{ color }}>
          {title ?? label}
        </p>
        <div className="mt-1 text-text-muted [&>p]:my-1.5 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
          {children}
        </div>
      </div>
    </aside>
  );
}
