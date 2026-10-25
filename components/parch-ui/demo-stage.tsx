"use client";

/**
 * Registry of interactive design-system demos. MDX pages reference a demo by
 * name: <DemoStage name="button-variants" />. All stateful behavior lives here,
 * on the client, using the same Parch UI kit the mock apps are built with.
 */

import { useState } from "react";
import { Download, Trash2, RefreshCw, Inbox, WifiOff, Package, Info } from "lucide-react";
import { Button, Chip } from "@/components/parch-ui/button";
import { TextField, SearchField } from "@/components/parch-ui/field";
import { Switch, Checkbox, RadioGroup } from "@/components/parch-ui/controls";
import { Select, SegmentedTabs, Toast } from "@/components/parch-ui/overlays";
import { Dialog, ProgressBar } from "@/components/parch-ui/dialog";
import { EmptyState, SettingsRow, SettingsGroup } from "@/components/parch-ui/app-window";

function ButtonVariants() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <Button variant="accent" iconStart={<Download className="size-4" aria-hidden />}>Install</Button>
        <Button>Default</Button>
        <Button variant="flat">Flat</Button>
        <Button variant="destructive" iconStart={<Trash2 className="size-4" aria-hidden />}>Remove</Button>
        <Button disabled>Disabled</Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button
          size="lg"
          loading={loading}
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 2000);
          }}
        >
          {loading ? "Working…" : "Trigger loading"}
        </Button>
      </div>
    </div>
  );
}

function Chips() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Chip>Neutral</Chip>
      <Chip tone="accent">Installed</Chip>
      <Chip tone="info">Downloading</Chip>
      <Chip tone="success">Up to date</Chip>
      <Chip tone="warning">Update available</Chip>
      <Chip tone="danger">Failed</Chip>
    </div>
  );
}

function Fields() {
  const [mirror, setMirror] = useState("");
  const [query, setQuery] = useState("");
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <TextField
        label="Repository URL"
        placeholder="https://github.com/parchlinux/world/raw/refs/heads/main/x86_64/"
        description="Used for pacman repository configuration."
      />
      <TextField
        label="Mirror"
        placeholder="mirror.parchlinux.com"
        value={mirror}
        onChange={(e) => setMirror(e.target.value)}
        error={mirror.length > 0 && !mirror.includes(".") ? "Enter a valid host name" : undefined}
      />
      <SearchField value={query} onValueChange={setQuery} placeholder="Search packages…" />
    </div>
  );
}

function SelectionControls() {
  const [sw, setSw] = useState(true);
  const [cb, setCb] = useState([true, false, false]);
  const [radio, setRadio] = useState("plasma");
  const [select, setSelect] = useState("plasma");
  return (
    <div className="grid w-full max-w-md gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Switch
          checked={sw}
          onCheckedChange={setSw}
          label="Automatic updates"
          description="Check the world repository daily."
        />
        <div className="flex flex-col gap-2.5">
          <Checkbox checked={cb[0]} onCheckedChange={(v) => setCb([v, cb[1], cb[2]])} label="Plasma desktop" />
          <Checkbox checked={cb[1]} onCheckedChange={(v) => setCb([cb[0], v, cb[2]])} label="GNOME desktop" />
          <Checkbox checked={cb[2]} onCheckedChange={(v) => setCb([cb[0], cb[1], v])} label="XFCE desktop" indeterminate={cb[0] && cb[1] && !cb[2] ? true : undefined} />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <RadioGroup
          name="Edition"
          value={radio}
          onValueChange={setRadio}
          options={[
            { value: "plasma", label: "Plasma", description: "The flagship Parch edition" },
            { value: "gnome", label: "GNOME" },
            { value: "minimal", label: "Minimal", description: "No preinstalled desktop" },
          ]}
        />
        <Select
          label="Default desktop"
          value={select}
          onValueChange={setSelect}
          options={[
            { value: "plasma", label: "KDE Plasma" },
            { value: "gnome", label: "GNOME" },
            { value: "xfce", label: "XFCE" },
            { value: "hyprland", label: "Hyprland" },
          ]}
        />
      </div>
    </div>
  );
}

function TabsDemo() {
  const [tab, setTab] = useState("explore");
  return (
    <div className="w-full max-w-md">
      <SegmentedTabs
        active={tab}
        onChange={setTab}
        tabs={[
          { value: "explore", label: "Explore" },
          { value: "installed", label: "Installed" },
          { value: "updates", label: "Updates" },
        ]}
      />
      <p className="mt-3 px-1 text-[0.84rem] text-text-muted">
        Showing the <strong className="text-text">{tab}</strong> tab. Tab panels keep their
        own scroll position when the user switches back.
      </p>
    </div>
  );
}

function DialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="accent" onClick={() => setOpen(true)}>
        Remove package…
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Remove parch-welcome?"
        footer={
          <>
            <Button variant="flat" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => setOpen(false)}>Remove</Button>
          </>
        }
      >
        <p>
          This will remove the Parch Welcome application and its 3 dependencies.
          You can reinstall it from the Parch Store at any time.
        </p>
      </Dialog>
    </>
  );
}

function ToastDemo() {
  const [toast, setToast] = useState<null | { title: string; description?: string; tone: "neutral" | "success" | "danger" | "info" }>(null);
  return (
    <div className="relative flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={() => setToast({ title: "Update available", description: "12 packages can be upgraded.", tone: "info" })}>
          Info toast
        </Button>
        <Button onClick={() => setToast({ title: "Installation complete", description: "pastor 2.4.1 is installed.", tone: "success" })}>
          Success toast
        </Button>
        <Button onClick={() => setToast({ title: "Build failed", description: "PKGBUILD exited with code 1.", tone: "danger" })}>
          Failure toast
        </Button>
      </div>
      {toast ? (
        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center">
          <Toast {...toast} onDismiss={() => setToast(null)} />
        </div>
      ) : null}
    </div>
  );
}

function ProgressDemo() {
  const [value, setValue] = useState(64);
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <ProgressBar label="Downloading packages" value={value} />
      <ProgressBar label="Refreshing mirrors" indeterminate />
      <div className="flex gap-2">
        <Button size="sm" variant="flat" iconStart={<RefreshCw className="size-3.5" aria-hidden />} onClick={() => setValue((v) => (v + 13) % 101)}>
          Simulate progress
        </Button>
      </div>
    </div>
  );
}

function EmptyStates() {
  const [mode, setMode] = useState<"empty" | "offline">("empty");
  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-border">
      <div className="flex border-b border-border bg-surface-2">
        {(
          [
            ["empty", "No results"],
            ["offline", "Offline"],
          ] as const
        ).map(([v, l]) => (
          <button
            key={v}
            type="button"
            onClick={() => setMode(v)}
            className={`px-4 py-2 text-[0.8rem] font-medium ${mode === v ? "border-b-2 border-accent text-text" : "text-text-subtle"}`}
          >
            {l}
          </button>
        ))}
      </div>
      {mode === "empty" ? (
        <EmptyState
          icon={<Inbox className="size-6" aria-hidden />}
          title="No packages found"
          description="Nothing matches “kwrite”. Check the spelling or search a broader term."
          action={<Button variant="flat">Clear search</Button>}
        />
      ) : (
        <EmptyState
          icon={<WifiOff className="size-6" aria-hidden />}
          title="You are offline"
          description="The Parch Store needs a network connection to browse packages. Installed apps keep working."
          action={<Button variant="accent">Retry connection</Button>}
        />
      )}
    </div>
  );
}

function SettingsDemo() {
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [notices, setNotices] = useState(false);
  return (
    <div className="w-full max-w-md">
      <SettingsGroup title="Updates">
        <SettingsRow
          icon={<RefreshCw className="size-4" aria-hidden />}
          label="Check for updates automatically"
          description="Queries the world repository once a day."
          control={<Switch checked={autoUpdate} onCheckedChange={setAutoUpdate} label="" />}
        />
        <SettingsRow
          icon={<Info className="size-4" aria-hidden />}
          label="Notify about new releases"
          control={<Switch checked={notices} onCheckedChange={setNotices} label="" />}
        />
        <SettingsRow
          icon={<Package className="size-4" aria-hidden />}
          label="Repository"
          description="world, stable packages"
          control={<Chip tone="accent">Active</Chip>}
        />
      </SettingsGroup>
    </div>
  );
}

export const DEMOS: Record<string, () => React.ReactNode> = {
  "button-variants": ButtonVariants,
  chips: Chips,
  fields: Fields,
  "selection-controls": SelectionControls,
  "app-tabs": TabsDemo,
  "dialog-demo": DialogDemo,
  "toast-demo": ToastDemo,
  "progress-demo": ProgressDemo,
  "empty-states": EmptyStates,
  "settings-rows": SettingsDemo,
};

export function DemoStage({ name }: { name: string }) {
  const Demo = DEMOS[name];
  if (!Demo) {
    return <p className="text-sm text-danger">Unknown demo: {name}</p>;
  }
  return <Demo />;
}
