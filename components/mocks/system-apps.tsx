"use client";

import { useState } from "react";
import {
  RefreshCw, Check, HardDrive, Home, Folder, FileText, Image as ImageIcon,
  Music, Video, Wifi, WifiOff, ShieldCheck, ArrowLeft, ArrowRight,
  Download, Package, Terminal, ListTree, Play, Globe, Lock, Server, GitBranch, Trash2,
} from "lucide-react";
import { Button, Chip } from "@/components/parch-ui/button";
import { Checkbox, Switch } from "@/components/parch-ui/controls";
import { ProgressBar } from "@/components/parch-ui/dialog";
import { EmptyState } from "@/components/parch-ui/app-window";
import { SearchField } from "@/components/parch-ui/field";

/* ------------------------------------------------------------------ */
/* System Update Manager                                               */
/* ------------------------------------------------------------------ */

const UPDATES = [
  { pkg: "plasma-desktop", from: "6.5.2", to: "6.5.3", size: "24.1 MB", repo: "extra", sec: false },
  { pkg: "linux-parch", from: "6.19.3", to: "6.19.4", size: "128 MB", repo: "core", sec: true },
  { pkg: "plasma-workspace", from: "6.5.1", to: "6.5.3", size: "18.7 MB", repo: "extra", sec: false },
  { pkg: "pastor", from: "2.4.0", to: "2.4.1", size: "9.2 MB", repo: "world", sec: false },
  { pkg: "firefox", from: "146.0", to: "147.0", size: "67.8 MB", repo: "extra", sec: true },
];

export function MockUpdater() {
  const [selected, setSelected] = useState<string[]>(UPDATES.map((u) => u.pkg));
  const [applying, setApplying] = useState(false);
  const [done, setDone] = useState(false);

  const chosen = UPDATES.filter((u) => selected.includes(u.pkg));
  const totalMb = Math.round(
    chosen.reduce((s, u) => s + parseFloat(u.size), 0),
  );

  const apply = () => {
    setApplying(true);
    setTimeout(() => {
      setApplying(false);
      setDone(true);
    }, 2600);
  };

  return (
    <div className="flex h-full min-h-[420px] flex-col">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <RefreshCw className="size-4 text-accent" aria-hidden />
        <p className="text-[0.92rem] font-semibold text-text">System Update</p>
        <Chip tone={done ? "success" : "info"} className="ms-auto">
          {done ? "Up to date" : `${chosen.length} selected · ~${totalMb} MB`}
        </Chip>
      </div>
      {applying ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
          <div className="w-full max-w-sm">
            <ProgressBar label="Applying updates, linux-parch 6.19.4" value={72} />
          </div>
          <p className="font-mono text-[0.75rem] text-text-subtle">
            (34/52) upgrading linux-parch…
          </p>
          <Button variant="flat" size="sm" onClick={() => setApplying(false)}>Cancel</Button>
        </div>
      ) : done ? (
        <EmptyState
          icon={<Check className="size-6 text-success" aria-hidden />}
          title="All packages are up to date"
          description="Your system was last updated just now. Automatic checks run daily."
        />
      ) : (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            <div className="mb-2 flex items-center gap-2 px-1">
              <Checkbox
                checked={selected.length === UPDATES.length}
                indeterminate={selected.length > 0 && selected.length < UPDATES.length}
                onCheckedChange={(v) => setSelected(v ? UPDATES.map((u) => u.pkg) : [])}
                label={<span className="text-[0.82rem] font-medium text-text">Select all</span>}
              />
            </div>
            {UPDATES.map((u) => (
              <div key={u.pkg} className="mb-1.5 flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5">
                <Checkbox
                  checked={selected.includes(u.pkg)}
                  onCheckedChange={(v) =>
                    setSelected(v ? [...selected, u.pkg] : selected.filter((p) => p !== u.pkg))
                  }
                  label=""
                />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 font-mono text-[0.82rem] text-text">
                    {u.pkg}
                    {u.sec ? <Chip tone="warning">security</Chip> : null}
                  </p>
                  <p className="text-[0.74rem] text-text-subtle">
                    {u.from} → {u.to} · {u.repo}
                  </p>
                </div>
                <span className="font-mono text-[0.74rem] text-text-subtle">{u.size}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-border bg-surface-2 px-4 py-3">
            <label className="flex items-center gap-2 text-[0.8rem] text-text-muted">
              <Lock className="size-3.5" aria-hidden /> Signed packages verified
            </label>
            <Button variant="accent" iconStart={<Download className="size-4" aria-hidden />} onClick={apply}>
              Apply {chosen.length} update{chosen.length === 1 ? "" : "s"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* File Manager                                                        */
/* ------------------------------------------------------------------ */

const FILES = [
  { name: "Documents", kind: "dir", size: "," },
  { name: "Downloads", kind: "dir", size: "," },
  { name: "Pictures", kind: "dir", size: "," },
  { name: "Music", kind: "dir", size: "," },
  { name: "Videos", kind: "dir", size: "," },
  { name: "parch-handbook.pdf", kind: "pdf", size: "8.4 MB" },
  { name: "wallpaper-mountain.png", kind: "img", size: "3.1 MB" },
  { name: "podcast-ep12.ogg", kind: "audio", size: "22.9 MB" },
  { name: "demo-capture.mkv", kind: "video", size: "412 MB" },
];

const KIND_ICON: Record<string, typeof Folder> = {
  dir: Folder,
  pdf: FileText,
  img: ImageIcon,
  audio: Music,
  video: Video,
};

export function MockFileManager() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="flex h-full min-h-[420px]">
      <nav className="w-44 shrink-0 border-e border-border bg-surface-2 p-2.5">
        <p className="mb-1.5 px-2 text-[0.7rem] font-semibold uppercase tracking-wide text-text-subtle">Places</p>
        {(
          [
            [Home, "Home", true],
            [Folder, "Documents", false],
            [Download, "Downloads", false],
            [ImageIcon, "Pictures", false],
            [HardDrive, "Filesystem", false],
          ] as const
        ).map(([Icon, label, active]) => (
          <button
            key={label}
            type="button"
            className={`mb-0.5 flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[0.84rem] transition-colors ${
              active ? "bg-accent-soft font-medium text-accent" : "text-text-muted hover:bg-surface-3 hover:text-text"
            }`}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </button>
        ))}
      </nav>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <Button size="sm" variant="flat" aria-label="Back"><ArrowLeft className="size-4" aria-hidden /></Button>
          <Button size="sm" variant="flat" aria-label="Forward"><ArrowRight className="size-4" aria-hidden /></Button>
          <nav aria-label="Path" className="flex flex-1 items-center gap-1 rounded-lg border border-border bg-surface-2 px-3 py-1 text-[0.8rem] text-text-muted">
            <Home className="size-3.5" aria-hidden />
            <span>/</span><span>sohi</span>
            {selected ? <><span>/</span><span className="font-medium text-text">{selected}</span></> : null}
          </nav>
          <SearchField value="" onValueChange={() => {}} label="Search files" placeholder="Find…" />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-1">
            {FILES.map((f) => {
              const Icon = KIND_ICON[f.kind] ?? FileText;
              const active = selected === f.name;
              return (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => setSelected(active ? null : f.name)}
                  className={`flex flex-col items-center gap-1.5 rounded-lg p-2.5 text-center transition-colors ${
                    active ? "bg-accent-soft" : "hover:bg-surface-2"
                  }`}
                >
                  <Icon className={`size-9 ${f.kind === "dir" ? "fill-accent/20 text-accent" : "text-text-subtle"}`} aria-hidden />
                  <span className="line-clamp-2 text-[0.74rem] leading-tight text-text">{f.name}</span>
                  <span className="font-mono text-[0.66rem] text-text-subtle">{f.size}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-border bg-surface-2 px-3 py-1.5 text-[0.75rem] text-text-subtle">
          <span>{FILES.length} items</span>
          {selected ? <span>“{selected}” selected</span> : null}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Network configuration                                               */
/* ------------------------------------------------------------------ */

const NETWORKS = [
  { ssid: "NubarCloud-5G", strength: 3, secure: true, connected: true },
  { ssid: "HomeNet", strength: 3, secure: true, connected: false },
  { ssid: "CafePad", strength: 2, secure: false, connected: false },
  { ssid: "EDU-WPA", strength: 1, secure: true, connected: false },
  { ssid: "parch-hotspot", strength: 2, secure: true, connected: false },
];

export function MockNetwork() {
  const [wifi, setWifi] = useState(true);
  const [offline, setOffline] = useState(false);
  return (
    <div className="flex h-full min-h-[420px] flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        {offline ? <WifiOff className="size-4 text-danger" aria-hidden /> : <Wifi className="size-4 text-accent" aria-hidden />}
        <p className="text-[0.92rem] font-semibold text-text">Network</p>
        <Chip tone={offline ? "danger" : "success"} className="ms-auto">
          {offline ? "Offline" : "Connected"}
        </Chip>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {offline ? (
          <EmptyState
            icon={<WifiOff className="size-6" aria-hidden />}
            title="No network connection"
            description="Wi-Fi is off and no cable is attached. Turn Wi-Fi back on to see available networks."
            action={<Button variant="accent" onClick={() => { setOffline(false); setWifi(true); }}>Turn on Wi-Fi</Button>}
          />
        ) : (
          <>
            <div className="mb-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
              <div className="flex items-center justify-between px-4 py-3">
                <p className="text-[0.86rem] text-text">Wi-Fi</p>
                <Switch checked={wifi} onCheckedChange={(v) => { setWifi(v); setOffline(!v); }} label="" />
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-[0.86rem] text-text">Wired</p>
                  <p className="text-[0.74rem] text-text-muted">Cable unplugged</p>
                </div>
                <Chip>Unavailable</Chip>
              </div>
            </div>
            <p className="mb-1.5 px-1 text-[0.75rem] font-semibold uppercase tracking-wide text-text-subtle">
              Available networks
            </p>
            <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
              {NETWORKS.map((n) => (
                <div key={n.ssid} className="flex items-center gap-3 px-4 py-2.5">
                  <Wifi className={`size-4 ${n.strength === 3 ? "text-text" : "text-text-subtle"}`} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-[0.86rem] text-text">
                      {n.ssid}
                      {n.connected ? <Chip tone="accent">Connected</Chip> : null}
                    </p>
                    {n.secure ? (
                      <p className="flex items-center gap-1 text-[0.72rem] text-text-subtle">
                        <ShieldCheck className="size-3" aria-hidden /> WPA3
                      </p>
                    ) : (
                      <p className="text-[0.72rem] text-text-subtle">Open network</p>
                    )}
                  </div>
                  {n.connected ? (
                    <Button size="sm" variant="flat">Details</Button>
                  ) : (
                    <Button size="sm" variant="default">Connect</Button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Package information window                                          */
/* ------------------------------------------------------------------ */

export function MockPackageInfo() {
  return (
    <div className="h-full min-h-[420px] overflow-y-auto p-5">
      <div className="flex items-start gap-4">
        <Package className="size-12 text-accent" aria-hidden />
        <div className="flex-1">
          <h3 className="font-mono text-[1.25rem] font-bold text-text">parch-welcome</h3>
          <p className="mt-0.5 text-[0.86rem] text-text-muted">
            Parch Linux Welcome Program written in Rust and libadwaita
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <Chip tone="accent">Installed 2.4.1-1</Chip>
            <Chip>world</Chip>
            <Chip>GPL-3.0</Chip>
            <Chip>x86_64</Chip>
          </div>
        </div>
        <Button variant="destructive" size="sm" iconStart={<Trash2 className="size-3.5" aria-hidden />}>Remove</Button>
      </div>

      <div className="mt-5 grid gap-x-8 gap-y-2 rounded-xl border border-border bg-surface p-4 text-[0.84rem] sm:grid-cols-[10rem_1fr]">
        {(
          [
            ["Repository", "world"],
            ["Upstream URL", "github.com/parchlinux/parch-welcome"],
            ["License(s)", "GPL-3.0-only"],
            ["Maintainer", "Parch Linux Team"],
            ["Install size", "2.4 MB"],
            ["Depends on", "gtk4 libadwaita gtksourceview-5 rust-runtime"],
            ["Required by", "parch-desktop-meta"],
            ["Build date", "2026-10-16"],
          ] as const
        ).map(([k, v]) => (
          <div key={k} className="contents">
            <p className="font-medium text-text-subtle">{k}</p>
            <p className="font-mono text-[0.8rem] text-text">{v}</p>
          </div>
        ))}
      </div>

      <h4 className="mt-5 text-[0.95rem] font-semibold text-text">Files</h4>
      <div className="mt-2 rounded-xl border border-border bg-surface p-3 font-mono text-[0.76rem] leading-relaxed text-text-muted">
        <p>/usr/bin/parch-welcome</p>
        <p>/usr/share/applications/parch-welcome.desktop</p>
        <p>/usr/share/icons/hicolor/scalable/apps/parch-welcome.svg</p>
        <p>/usr/share/locale/fa/LC_MESSAGES/parch-welcome.mo</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Repository & build environment utility                              */
/* ------------------------------------------------------------------ */

const PROFILES = [
  { name: "parch-iso-plasma", edition: "Plasma", lastBuild: "2h ago", status: "passed" },
  { name: "parch-iso-gnome", edition: "GNOME", lastBuild: "6h ago", status: "passed" },
  { name: "parch-iso-mini", edition: "Minimal", lastBuild: "yesterday", status: "failed" },
  { name: "my-custom-spin", edition: "Custom", lastBuild: "building…", status: "running" },
];

export function MockRepoBuilder() {
  const [profile, setProfile] = useState("my-custom-spin");
  const current = PROFILES.find((p) => p.name === profile)!;
  return (
    <div className="flex h-full min-h-[420px]">
      <div className="w-60 shrink-0 border-e border-border bg-surface-2 p-2.5">
        <p className="mb-1.5 px-1.5 text-[0.7rem] font-semibold uppercase tracking-wide text-text-subtle">
          Profiles
        </p>
        {PROFILES.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => setProfile(p.name)}
            className={`mb-0.5 flex w-full flex-col rounded-lg px-2.5 py-1.5 text-start transition-colors ${
              profile === p.name ? "bg-accent-soft" : "hover:bg-surface-3"
            }`}
          >
            <span className="flex items-center gap-1.5 font-mono text-[0.78rem] text-text">
              <GitBranch className="size-3 text-text-subtle" aria-hidden />
              {p.name}
            </span>
            <span className="mt-0.5 flex items-center gap-1.5 text-[0.7rem] text-text-subtle">
              {p.edition} · {p.lastBuild}
              {p.status === "passed" ? (
                <Check className="size-3 text-success" aria-hidden />
              ) : p.status === "failed" ? (
                <span className="text-danger" aria-hidden>✕</span>
              ) : (
                <span className="size-2 animate-pulse rounded-full bg-accent" aria-hidden />
              )}
            </span>
          </button>
        ))}
        <Button size="sm" variant="flat" className="mt-2 w-full">+ New profile from template</Button>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
          <Terminal className="size-4 text-accent" aria-hidden />
          <p className="font-mono text-[0.84rem] font-semibold text-text">{current.name}</p>
          <div className="ms-auto flex gap-2">
            <Button size="sm" iconStart={<ListTree className="size-3.5" aria-hidden />}>Inspect</Button>
            <Button size="sm" variant="accent" iconStart={<Play className="size-3.5" aria-hidden />}>
              {current.status === "running" ? "Building…" : "Build ISO"}
            </Button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto bg-code-bg p-3 font-mono text-[0.74rem] leading-relaxed">
          <p className="text-text-subtle">$ sudo mkarchiso -v iso/</p>
          <p className="text-success">[OK] profiledef.sh parsed: iso_name=Parchlinux-Custom</p>
          <p className="text-text-muted">[INFO] installing 847 packages into airootfs…</p>
          <p className="text-text-muted">[INFO] world repository: 156 packages cached</p>
          <p className="text-warning">[WARN] broadcom-wl-dkms requires linux-parch headers</p>
          <p className="text-success">[OK] squashfs created: 1.42 GiB (xz, 1M dict)</p>
          <p className="text-text-muted">[INFO] generating ISO with 4 bootmodes…</p>
          {current.status === "failed" ? (
            <p className="text-danger">[ERROR] package 'kf5-coreaddons' not found, did you mean 'kcoreaddons'?</p>
          ) : null}
          {current.status === "running" ? (
            <p className="text-accent">[....] running: erofs/squashfs packing, 68%</p>
          ) : null}
        </div>
        <div className="flex items-center gap-3 border-t border-border bg-surface-2 px-4 py-2 text-[0.75rem] text-text-subtle">
          <Server className="size-3.5" aria-hidden /> out/ · parchlinux-custom-2026.10.25-x86_64.iso
          {current.status !== "running" ? <Chip tone="success" className="ms-auto">1.42 GiB</Chip> : null}
        </div>
      </div>
    </div>
  );
}
