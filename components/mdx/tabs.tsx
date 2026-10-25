"use client";

import { useId, useState, type ReactNode } from "react";

export function Tabs({ children }: { children: ReactNode }) {
  const tabs = Array.isArray(children) ? children : [children];
  const [active, setActive] = useState(0);
  const id = useId();
  return (
    <div className="my-5">
      <div role="tablist" className="flex gap-1 border-b border-border">
        {tabs.map((tab, i) => {
          if (!tab) return null;
          const { label } = (tab as any).props;
          const selected = i === active;
          return (
            <button
              key={i}
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${id}-panel-${i}`}
              onClick={() => setActive(i)}
              className={`-mb-px rounded-t-md border-b-2 px-3.5 py-1.5 text-sm transition-colors ${
                selected
                  ? "border-accent font-medium text-text"
                  : "border-transparent text-text-subtle hover:text-text"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab, i) => {
        if (!tab) return null;
        const selected = i === active;
        return (
          <div
            key={i}
            role="tabpanel"
            id={`${id}-panel-${i}`}
            aria-labelledby={`${id}-tab-${i}`}
            hidden={!selected}
            className="pt-1"
          >
            {(tab as any).props.children}
          </div>
        );
      })}
    </div>
  );
}

export function Tab({ label, children }: { label: string; children: ReactNode }) {
  return <>{children}</>;
}
