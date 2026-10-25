# Content Guide, Parch Developer Portal

Internal conventions for everyone (human or AI) writing `content/**/*.mdx`.
The build compiles every `.mdx` file under `content/` into a static page.

## Frontmatter (required)

```yaml
---
title: "Build your first Parch ISO"     # page title, used in nav/SEO
description: "One sentence summary."    # used in cards, meta description
order: 3                                # position within its section
status: stable                          # stable | draft | experimental | proposal (omit for stable)
index: true                             # only on section landing pages
source: "ch. 8–19"                      # optional traceability to parchbook-book chapters
---
```

## File & URL conventions

- Path = URL. `content/iso/build-first-iso.mdx` → `/iso/build-first-iso/`.
- Section landing page: `content/<section>/index.mdx` (has `index: true`).
- Slugs: lowercase, hyphens, no dates.
- Section ids: `start architecture app-dev packaging iso distribution testing
  localization security reference hig design mockups`.

## Article structure (implementation guides)

1. What it is, 1–2 sentences.
2. When/why to use it.
3. Prerequisites (bulleted, concrete).
4. Step-by-step tutorial (use `<Steps>`).
5. Expected results.
6. Validation & testing.
7. Troubleshooting (common failures + fixes).
8. Related pages.

Not every page needs all eight; no implementation guide may stop at concepts.

## MDX components available

`<Callout kind="note|tip|warning|danger|important" title?>`,
`<CodeBlock title?>` (wraps a fenced block), `<CardGrid>`/`<Card title href>`,
`<Tabs>/<Tab label>`, `<Steps>/<Step title?>`, `<Checklist>`,
`<Demo>`/`<DemoStage name>` (design system), `<DoDont do_={{...}} dont={{...}}>`,
`<Swatch name cssVar>`/`<SpecTable rows>`, and the Parch UI kit
(`Button TextField SearchField Switch Checkbox RadioGroup Select
SegmentedTabs Toast Dialog ProgressBar AppWindow EmptyState SettingsRow
SettingsGroup AppIcon Chip`).

Interactive demos **must** go through `<DemoStage name="…">` (registered in
`components/parch-ui/demo-stage.tsx`) because MDX bodies render on the server.

## Fenced code blocks

Always tag the language (`bash`, `python`, `ini`, `yaml`, `sh`, `text`…).
Shell snippets start with `$ `; root-required commands use `# `.
State the working directory and privilege level in prose before the block.

Plain fenced blocks are styled as full code blocks (background, border,
rounded corners, hover copy button) automatically by the site, so the
default choice is a plain fenced block. Use the `<CodeBlock title="…">`
wrapper only when the block needs a titled header (for example a file path).
Never wrap a fenced block in a custom `<pre>` or `<code>` element.

## Terminology (use exactly)

- **Never use em-dashes (—).** Use commas, colons, parentheses, or separate
  sentences. This applies to all site copy, content, and code comments.
- The distribution: **Parch GNU/Linux** (or “Parch”), never “Parch Linux” in
  running text is fine too but be consistent within a page.
- Package repo: **world** (stable), **Void** (testing). The old **ppr/pcp** and
  **git.parchlinux.com** are dead, never present them as current.
- ISO profiles live in per-edition repos: `parch-iso-plasma`,
  `Parch-iso-gnome`, `parch-iso-hyprland`, `parch-iso-xfce`,
  `parch-iso-mini`, `parch-iso-lite`, `parch-iso-base`, `parch-iso-template`, …
- Build command: `mkarchiso -v iso/` run as root from the profile repo root.
- Installer: **Calamares** (parch flavor). First-party apps: **Pastor**
  (Parch Store), **parch-welcome**, **parch-update**, **parchdroid**,
  **PKM / parch-kernel-manager**, **mirrorman**, **gamehub**, **pordle**.

## Verified ground truth (do not contradict)

- `[world]` repo in pacman.conf:
  `Server = https://github.com/parchlinux/world/raw/refs/heads/main/x86_64/`,
  `SigLevel = Never`, listed **before** `[core]`/`[extra]`.
- ISO profile repo layout: `iso/{airootfs,efiboot,grub,syslinux,packages.x86_64,
  bootstrap_packages.x86_64,pacman.conf,profiledef.sh,public.key}`.
- `profiledef.sh` keys: `iso_name`, `iso_label`, `iso_publisher`, `iso_application`,
  `iso_version`, `install_dir`, `buildmodes=('iso')`,
  `bootmodes=('bios.syslinux.mbr' 'bios.syslinux.eltorito'
  'uefi-x64.systemd-boot.esp' 'uefi-x64.systemd-boot.eltorito')`,
  `arch="x86_64"`, `pacman_conf`, `airootfs_image_type="squashfs"`,
  `airootfs_image_tool_options`, `file_permissions`.
- Profile `build.sh` (plasma flavor): requires root; installs
  `git wget github-cli p7zip reflector rsync`; downloads custom
  `archiso-99-1` package; runs `mkarchiso -v iso/`. Template flavor installs
  plain `archiso` and also produces 7z split volumes + `md5sums.txt`.
- CI: GitHub Actions `build.yaml`, triggers on release; pre-releases upload
  `Parchlinux-test-latest.iso` to `mirror.parchlinux.com:/srv/http/test/`
  (test channel); stable releases upload 7z split archive + md5sums to the
  GitHub release.
- Live media: SDDM autologin (`airootfs/etc/sddm.conf.d/autologin.conf`),
  getty autologin on tty1, `SigLevel = Never` in ISO pacman.conf, pacman hooks
  `40-locale-gen` and `uncomment-mirrors`.
- Known-wrong handbook facts to AVOID (from parchbook-book/issues.md):
  `kf5-coreutils`/`kf5-i18n` (→ `kf5-coreaddons`/`ki18n`), makepkg `-b`
  “build only” (no such flag), `-o`/`-e` descriptions inverted,
  `SOURCEPKG` (→ `SRCDEST`), `asp` (removed; use `pkgctl repo clone`),
  aurploader (dead; AUR is git-push), `md5sums` as default (→ `sha256sums`),
  `SKIP` checksums for non-VCS sources, `softprops/action-gh-action`
  (→ `softprops/action-gh-release`), “archiso-action” (unverified, don’t use),
  the “Parch SDK” (does not exist, present only as a proposal, or drop),
  chapter-49 INI `settings.conf` and invented Calamares keys
  (Calamares config is YAML; validate keys against calamares-parch),
  `community` repo (merged into extra upstream), python2 prefixes,
  `/usr/share/pixmaps/parch-logo.svg` (unverified).
- Persian/locale: Parch defaults target `fa_IR.UTF-8` and `Asia/Tehran`;
  Calamares locale default in the flavor configs is fa_IR.

## Truthfulness rules

1. Never invent commands, flags, package names, URLs, or repo names.
2. If a workflow is proposed but not real, mark the page `status: proposal`
   and say so in the body.
3. Upstream Arch behavior must be labeled as upstream; Parch-specific
   behavior must be labeled as Parch.
4. When the handbook and the live repos disagree, the live repos win, but
   keep a `<Callout kind="important">` noting the change.
5. Code examples must be syntactically valid and consistent with the
   documented environment.
