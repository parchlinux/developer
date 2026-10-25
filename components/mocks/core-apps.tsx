"use client";

import { useState } from "react";
import {
  Search, Download, Package, RefreshCw, Check, HardDrive, Home, Folder,
  FileText, Image as ImageIcon, Music, Video, Wifi, WifiOff, ShieldCheck,
  ArrowLeft, ArrowRight, Star, Play, Trash2, Info, Rocket, BookOpen,
  Users, Palette, Monitor, Terminal, Globe, ArrowUp,
} from "lucide-react";
import { Button, Chip } from "@/components/parch-ui/button";
import { SearchField } from "@/components/parch-ui/field";
import { Switch, Checkbox } from "@/components/parch-ui/controls";
import { ProgressBar } from "@/components/parch-ui/dialog";
import { EmptyState, SettingsRow, SettingsGroup } from "@/components/parch-ui/app-window";
import { AppIcon } from "@/components/parch-ui/app-icon";

/* ------------------------------------------------------------------ */
/* Parch Store (Pastor)                                                */
/* ------------------------------------------------------------------ */

const STORE_APPS = [
  { id: "gamehub", name: "GameHub", category: "Games", rating: 4.6, size: "18 MB", desc: "Gaming toolkit: launchers, overlays, and performance profiles." },
  { id: "pordle", name: "Pordle", category: "Games", rating: 4.9, size: "4 MB", desc: "Persian word-guessing game." },
  { id: "mirrorman", name: "MirrorMan", category: "System", rating: 4.5, size: "6 MB", desc: "Rank and switch pacman mirrors with one click." },
  { id: "kernel-manager", name: "Kernel Manager", category: "System", rating: 4.7, size: "2 MB", desc: "Browse, install, and remove Linux kernels." },
  { id: "parchdroid", name: "Parchdroid", category: "System", rating: 4.2, size: "45 MB", desc: "Run Android apps with Waydroid integration." },
  { id: "simple-reflector", name: "Simple Reflector", category: "System", rating: 4.1, size: "1 MB", desc: "Simple mirrorlist refresher." },
];

const CATEGORIES = ["All", "Games", "System", "Development", "Internet", "Graphics"];

export function MockStore() {
  const [tab, setTab] = useState<"explore" | "installed" | "updates">("explore");
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [installing, setInstalling] = useState<string | null>(null);
  const [installed, setInstalled] = useState<string[]>(["mirrorman", "kernel-manager"]);

  const apps = STORE_APPS.filter(
    (a) =>
      (category === "All" || a.category === category) &&
      (query === "" || a.name.toLowerCase().includes(query.toLowerCase())),
  );

  const install = (id: string) => {
    setInstalling(id);
    setTimeout(() => {
      setInstalling(null);
      setInstalled((p) => [...p, id]);
    }, 2200);
  };

  return (
    <div className="flex h-full min-h-[430px]">
      <nav className="w-44 shrink-0 border-e border-border bg-surface-2 p-2.5">
        <div className="mb-3 flex items-center gap-2 px-1.5 pt-1">
          <AppIcon app="pastor" size={28} />
          <span className="text-[0.85rem] font-semibold text-text">Parch Store</span>
        </div>
        {(
          [
            ["explore", "Explore", Search],
            ["installed", `Installed (${installed.length})`, Check],
            ["updates", "Updates", ArrowUp],
          ] as const
        ).map(([value, label, Icon]) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={`mb-0.5 flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[0.84rem] transition-colors ${
              tab === value ? "bg-accent-soft font-medium text-accent" : "text-text-muted hover:bg-surface-3 hover:text-text"
            }`}
          >
            <Icon className="size-4" aria-hidden />
            {label}
            {value === "updates" ? (
              <span className="ms-auto rounded-full bg-accent px-1.5 text-[0.68rem] font-semibold text-white">3</span>
            ) : null}
          </button>
        ))}
      </nav>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-border px-3.5 py-2.5">
          <SearchField value={query} onValueChange={setQuery} placeholder="Search 1,284 packages…" />
        </div>

        {tab === "explore" ? (
          <div className="min-h-0 flex-1 overflow-y-auto p-3.5">
            <div className="mb-3 flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`rounded-full border px-3 py-1 text-[0.78rem] transition-colors ${
                    category === c
                      ? "border-accent bg-accent-soft font-medium text-accent"
                      : "border-border bg-surface text-text-muted hover:border-accent/40"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {apps.map((a) => {
                const isInstalled = installed.includes(a.id);
                return (
                  <div
                    key={a.id}
                    className="flex items-start gap-3 rounded-xl border border-border bg-surface p-3 transition-colors hover:border-accent/40"
                  >
                    <AppIcon app={a.id} size={44} />
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 text-[0.88rem] font-semibold text-text">
                        {a.name}
                        <span className="flex items-center gap-0.5 text-[0.72rem] font-normal text-text-subtle">
                          <Star className="size-3 fill-current" aria-hidden /> {a.rating}
                        </span>
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-[0.78rem] leading-snug text-text-muted">{a.desc}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="font-mono text-[0.7rem] text-text-subtle">{a.size}</span>
                        {isInstalled ? (
                          <Chip tone="success">
                            <Check className="size-3" aria-hidden /> Installed
                          </Chip>
                        ) : installing === a.id ? (
                          <span className="w-28">
                            <ProgressBar value={68} label="" />
                          </span>
                        ) : (
                          <Button size="sm" variant="accent" iconStart={<Download className="size-3.5" aria-hidden />} onClick={() => install(a.id)}>
                            Install
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {apps.length === 0 ? (
              <EmptyState
                icon={<Search className="size-6" aria-hidden />}
                title="No packages found"
                description={`Nothing matches “${query}”. Try a broader term.`}
              />
            ) : null}
          </div>
        ) : tab === "installed" ? (
          <div className="min-h-0 flex-1 overflow-y-auto p-3.5">
            {installed.map((id) => {
              const a = STORE_APPS.find((x) => x.id === id)!;
              return (
                <div key={id} className="mb-2 flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
                  <AppIcon app={id} size={36} />
                  <div className="flex-1">
                    <p className="text-[0.86rem] font-medium text-text">{a.name}</p>
                    <p className="text-[0.74rem] text-text-subtle">Installed · {a.size}</p>
                  </div>
                  <Button size="sm" variant="flat" iconStart={<Trash2 className="size-3.5" aria-hidden />}>Remove</Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto p-3.5">
            <div className="mb-3 flex items-center justify-between rounded-xl border border-accent/30 bg-accent-soft px-3.5 py-3">
              <p className="text-[0.85rem] text-text">
                <strong className="font-semibold">3 updates</strong> are ready, 214 MB total
              </p>
              <Button size="sm" variant="accent" iconStart={<RefreshCw className="size-3.5" aria-hidden />}>Update all</Button>
            </div>
            {["plasma-desktop 6.5.2 → 6.5.3", "linux-parch 6.19.3 → 6.19.4", "pastor 2.4.0 → 2.4.1"].map((u) => (
              <div key={u} className="mb-2 flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
                <Package className="size-4 text-text-subtle" aria-hidden />
                <p className="flex-1 font-mono text-[0.8rem] text-text">{u}</p>
                <Checkbox checked label="" onCheckedChange={() => {}} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Parch Settings                                                      */
/* ------------------------------------------------------------------ */

export function MockSettings() {
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [nightLight, setNightLight] = useState(false);
  const [lang, setLang] = useState("fa");
  return (
    <div className="flex h-full min-h-[430px]">
      <nav className="w-48 shrink-0 border-e border-border bg-surface-2 p-2.5">
        {(
          [
            ["Display", Monitor],
            ["Network", Wifi],
            ["Language", Globe],
            ["Appearance", Palette],
            ["Updates", RefreshCw],
            ["About", Info],
          ] as const
        ).map(([label, Icon], i) => (
          <button
            key={label}
            type="button"
            className={`mb-0.5 flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[0.84rem] transition-colors ${
              i === 4 ? "bg-accent-soft font-medium text-accent" : "text-text-muted hover:bg-surface-3 hover:text-text"
            }`}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </button>
        ))}
      </nav>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <h3 className="mb-3 text-[1.05rem] font-semibold text-text">Updates</h3>
        <SettingsGroup title="Repository">
          <SettingsRow
            icon={<ShieldCheck className="size-4" aria-hidden />}
            label="world (stable)"
            description="github.com/parchlinux/world · SigLevel: Never"
            control={<Chip tone="accent">Active</Chip>}
          />
          <SettingsRow
            icon={<HardDrive className="size-4" aria-hidden />}
            label="Mirrors"
            description="3 mirrors configured, fastest: mirror.parchlinux.com"
          />
        </SettingsGroup>
        <SettingsGroup title="Behavior">
          <SettingsRow
            label="Check for updates automatically"
            description="Once per day, in the background."
            control={<Switch checked={autoUpdate} onCheckedChange={setAutoUpdate} label="" />}
          />
          <SettingsRow
            label="Night Light"
            description="Shift colors after sunset."
            control={<Switch checked={nightLight} onCheckedChange={setNightLight} label="" />}
          />
          <SettingsRow
            label="System language"
            control={
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                aria-label="System language"
                className="h-8 rounded-lg border border-border-strong bg-surface px-2.5 text-[0.82rem] text-text"
              >
                <option value="fa">فارسی</option>
                <option value="en">English</option>
              </select>
            }
          />
        </SettingsGroup>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Parch Welcome                                                       */
/* ------------------------------------------------------------------ */

export function MockWelcome() {
  const cards = [
    { icon: Rocket, title: "Update your system", desc: "Refresh the world repository and apply updates." },
    { icon: Monitor, title: "Install drivers", desc: "Detect and set up graphics and hardware." },
    { icon: BookOpen, title: "Read the docs", desc: "Guides for new Parch users, in فارسی and English." },
    { icon: Users, title: "Join the community", desc: "Forum, Matrix, and contribution paths." },
    { icon: Terminal, title: "Developer portal", desc: "Build apps, packages, and ISOs." },
    { icon: Palette, title: "Personalize", desc: "Wallpapers, themes, and accents." },
  ];
  return (
    <div className="flex h-full min-h-[400px] flex-col items-center justify-center bg-surface p-8">
      <div className="mb-1 flex items-center gap-3">
        <AppIcon app="pastor" size={0} className="hidden" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-dark.svg" alt="" width={44} height={44} className="dark:hidden" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-white.svg" alt="" width={44} height={44} className="hidden dark:block" />
        <div>
          <p className="text-[1.3rem] font-bold text-text">به پارچ خوش آمدید</p>
          <p className="text-[0.85rem] text-text-muted">Welcome to Parch GNU/Linux</p>
        </div>
      </div>
      <div className="mt-6 grid w-full max-w-xl grid-cols-2 gap-2.5 sm:grid-cols-3">
        {cards.map((c) => (
          <button
            key={c.title}
            type="button"
            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-4 text-center transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-card"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <c.icon className="size-[18px]" aria-hidden />
            </span>
            <span className="text-[0.84rem] font-semibold text-text">{c.title}</span>
            <span className="text-[0.74rem] leading-snug text-text-muted">{c.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
