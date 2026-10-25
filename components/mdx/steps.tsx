import { isValidElement, type ReactNode } from "react";
import { Check } from "lucide-react";

/** Flatten MDX children; a markdown list inside <Checklist> arrives as a
    <ul> whose items are <li> elements. Unwrap both layers. */
function flattenItems(children: ReactNode): ReactNode[] {
  const items: ReactNode[] = [];
  const queue: ReactNode[] = Array.isArray(children) ? children : [children];
  for (const child of queue) {
    if (!isValidElement(child)) {
      items.push(child);
      continue;
    }
    const type = (child as any).type;
    if (type === "ul" || type === "ol") {
      const inner = (child as any).props.children;
      queue.push(...(Array.isArray(inner) ? inner : [inner]));
    } else if (type === "li") {
      const inner = (child as any).props.children;
      items.push(Array.isArray(inner) ? inner : [inner]);
    } else {
      items.push(child);
    }
  }
  // Drop whitespace-only text nodes between markdown list items.
  return items.filter(
    (c) => !(Array.isArray(c) && c.every((x) => typeof x === "string" && !x.trim())),
  ).filter(
    (c) => typeof c !== "string" || c.trim().length > 0,
  );
}

/** Numbered step list for tutorials: wraps each <Step> child. */
export function Steps({ children }: { children: ReactNode }) {
  const steps = Array.isArray(children) ? children : [children];
  let n = 0;
  return (
    <ol className="my-6 space-y-6 border-s-2 border-border ps-6 [&>li]:relative">
      {steps.map((child, i) => {
        const { title } = (child as any)?.props ?? {};
        return (
          <li key={i} className="relative -ms-[1.9rem] ps-8">
            <span
              aria-hidden
              className="absolute -start-[0.05rem] top-0 flex size-6 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-surface font-mono text-xs font-semibold text-text-muted"
              style={{ transform: "translateX(-50%)" }}
            >
              {i + 1}
            </span>
            {title ? (
              <h4 className="mb-1 pt-0.5 text-[1rem] font-semibold text-text">{title}</h4>
            ) : null}
            <div className="[&>p:first-child]:mt-0">{child}</div>
          </li>
        );
      })}
    </ol>
  );
}

export function Step({ title, children }: { title?: string; children: ReactNode }) {
  return <>{children}</>;
}

export function Checklist({ children }: { children: ReactNode }) {
  const items = flattenItems(children);
  return (
    <ul className="my-4 space-y-2">
      {items.map((child, i) => (
        <li key={i} className="checklist-item flex gap-2.5 text-[0.95rem] text-text-muted">
          <Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden />
          <div className="[&>p]:my-0">{child}</div>
        </li>
      ))}
    </ul>
  );
}
