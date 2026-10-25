"use client";

import { useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { AppWindow } from "@/components/parch-ui/app-window";
import { AppIcon } from "@/components/parch-ui/app-icon";
import { MockStore, MockSettings, MockWelcome } from "./core-apps";
import {
  MockUpdater,
  MockFileManager,
  MockNetwork,
  MockPackageInfo,
  MockRepoBuilder,
} from "./system-apps";

export interface MockDef {
  id: string;
  title: string;
  icon?: string;
  status: "real" | "concept";
  note: string;
  Component: () => React.ReactNode;
}

/**
 * Mock application gallery. Every mock is a design reference built with the
 * same tokens and Parch UI kit as the design-system demos.
 * `real` = a first-party app that exists (mock shows its design direction);
 * `concept` = a proposed design, not a shipped application.
 */
export const MOCKS: Record<string, MockDef> = {
  store: {
    id: "store",
    title: "Parch Store, Pastor",
    icon: "pastor",
    status: "real",
    note: "Pastor (github.com/parchlinux/pastor) is the real Parch Store, written in Rust. This mock illustrates its target UX: discovery, categories, one-click install with inline progress, and update management.",
    Component: () => <MockStore />,
  },
  settings: {
    id: "settings",
    title: "Parch Settings",
    icon: "parch-config",
    status: "real",
    note: "System preferences surface. The mock focuses on the Updates pane backed by the world repository, with Persian as a first-class language choice.",
    Component: () => <MockSettings />,
  },
  welcome: {
    id: "welcome",
    title: "Parch Welcome",
    status: "real",
    note: "parch-welcome (Rust + libadwaita) greets new users. The mock shows the bilingual (فارسی/English) action grid pattern.",
    Component: () => <MockWelcome />,
  },
  updater: {
    id: "updater",
    title: "System Update Manager",
    status: "real",
    note: "Complements parch-update (interactive update notifier/applier with a systray applet). This mock shows the transaction view: package list, security flags, and cancellation.",
    Component: () => <MockUpdater />,
  },
  "file-manager": {
    id: "file-manager",
    title: "File Manager",
    status: "concept",
    note: "A design concept for a Parch file manager. On Plasma, Dolphin with Parch theming remains the default; this concept explores a native first-party alternative.",
    Component: () => <MockFileManager />,
  },
  network: {
    id: "network",
    title: "Network Configuration",
    status: "concept",
    note: "A design concept for connection management with offline-first behavior: installed functionality keeps working without a network.",
    Component: () => <MockNetwork />,
  },
  "package-info": {
    id: "package-info",
    title: "Package Information",
    status: "concept",
    note: "A design concept for a package details window in the Pastor ecosystem, metadata, dependency graph, and file list in one view.",
    Component: () => <MockPackageInfo />,
  },
  "repo-builder": {
    id: "repo-builder",
    title: "Repository & Build Utility",
    status: "concept",
    note: "A developer utility concept for managing ISO profiles and build environments: profile list with CI-style status, live build log, and artifact output.",
    Component: () => <MockRepoBuilder />,
  },
};

export function MockStage({
  id,
  frameless,
}: {
  id: string;
  frameless?: boolean;
}) {
  const mock = MOCKS[id];
  const [preview, setPreview] = useState<"site" | "light" | "dark">("site");
  if (!mock) return <p className="text-sm text-danger">Unknown mock: {id}</p>;

  const inner = (
    <div
      className={
        preview === "dark" ? "dark" : preview === "light" ? "light-preview" : ""
      }
      style={
        preview === "dark"
          ? { background: "var(--background)", color: "var(--text)" }
          : preview === "light"
            ? { background: "#fbfcfd", color: "#101c26" }
            : undefined
      }
    >
      {frameless ? (
        mock.Component()
      ) : (
        <AppWindow
          title={mock.title}
          icon={mock.icon ? <AppIcon app={mock.icon} size={20} /> : undefined}
          className="my-6"
        >
          {mock.Component()}
        </AppWindow>
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span
          role="radiogroup"
          aria-label="Preview theme"
          className="ms-auto flex items-center gap-0.5 rounded-full border border-border bg-surface p-0.5"
        >
          {(
            [
              ["site", <Monitor key="s" className="size-3.5" aria-hidden />],
              ["light", <Sun key="l" className="size-3.5" aria-hidden />],
              ["dark", <Moon key="d" className="size-3.5" aria-hidden />],
            ] as const
          ).map(([value, node]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={preview === value}
              aria-label={`Preview in ${value} theme`}
              onClick={() => setPreview(value)}
              className={`flex h-6 w-8 items-center justify-center rounded-full transition-colors ${
                preview === value ? "bg-accent-soft text-accent" : "text-text-subtle hover:text-text"
              }`}
            >
              {node}
            </button>
          ))}
        </span>
      </div>
      {inner}
      <p className="mt-3 flex items-center gap-2 text-[0.8rem] text-text-muted">
        <span
          className={`rounded-full border px-2 py-0.5 text-[0.7rem] font-semibold uppercase ${
            mock.status === "real"
              ? "border-success/40 bg-success-soft text-success"
              : "border-border bg-surface-2 text-text-subtle"
          }`}
        >
          {mock.status === "real" ? "first-party app" : "design concept"}
        </span>
        {mock.note}
      </p>
    </div>
  );
}
