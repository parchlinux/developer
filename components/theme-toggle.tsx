"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

type Choice = "light" | "dark" | "system";

const STORAGE_KEY = "parch-dev-theme";

export function ThemeToggle() {
  const [choice, setChoice] = useState<Choice>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Choice) || "system";
    setChoice(stored);
    setMounted(true);
  }, []);

  const apply = (next: Choice) => {
    setChoice(next);
    localStorage.setItem(STORAGE_KEY, next);
    const dark =
      next === "dark" ||
      (next === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  };

  // Follow system changes while in "system" mode.
  useEffect(() => {
    if (!mounted || choice !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle("dark", e.matches);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mounted, choice]);

  const options: { value: Choice; label: string; icon: ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun className="size-4" aria-hidden /> },
    { value: "dark", label: "Dark", icon: <Moon className="size-4" aria-hidden /> },
    { value: "system", label: "System", icon: <Monitor className="size-4" aria-hidden /> },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className="flex items-center gap-0.5 rounded-full border border-border bg-surface p-0.5"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={mounted && choice === o.value}
          aria-label={`${o.label} theme`}
          title={`${o.label} theme`}
          onClick={() => apply(o.value)}
          className={`flex size-7 items-center justify-center rounded-full transition-colors ${
            mounted && choice === o.value
              ? "bg-accent-soft text-accent"
              : "text-text-subtle hover:text-text"
          }`}
        >
          {o.icon}
        </button>
      ))}
    </div>
  );
}
