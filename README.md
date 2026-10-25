# Parch Developer Portal

The official developer documentation, design guidelines, and engineering
handbook for Parch GNU/Linux: **developer.parchlinux.com**.

Built with Next.js 16 (static export), Tailwind CSS 4, MDX, Shiki, and
Pagefind. Deployed as a static site in an nginx container.

## Quick start

```bash
bun install
bun run dev          # development server at localhost:3000
```

## Production build

```bash
bun run build        # next build (static export to out/) + pagefind index
bun run check:links  # validate every internal link against out/
bun run check:content  # validate frontmatter, em-dash ban, placeholders
```

The build output in `out/` is fully static: any static file server works.
For local preview of the production build:

```bash
bunx serve out
```

## Docker

```bash
docker build -t developer-portal .
docker run -p 8080:80 developer-portal
```

Multi-stage: bun builds the site, nginx serves `out/` with clean trailing
slash routing, immutable asset caching, and the static 404 page. Configure
at `deploy/nginx.conf`.

### Docker Compose

```bash
docker compose up -d          # run the published GHCR image
docker compose up -d --build  # or build locally
```

Available at `http://localhost:8080`. Edit the `image:` line in
`docker-compose.yml` if your fork publishes under a different name.

## CI/CD

Two GitHub Actions workflows ship with the repository:

- **`.github/workflows/ci.yml`** — on every push/PR: install, content
  validation, full build (including the Pagefind index), and link checking.
- **`.github/workflows/docker-publish.yml`** — on pushes to `main`, on
  `v*` tags, and via manual dispatch: builds the `linux/amd64` image and
  publishes it to GHCR under
  `ghcr.io/<owner>/<repo>` with `latest` (default branch), semver tags
  from `v*` releases, and a short-SHA tag. Uses the built-in
  `GITHUB_TOKEN`; no extra secrets needed.

Pull the published image:

```bash
docker pull ghcr.io/parchlinux/developer:latest
```

## Project structure

```text
app/                    Next.js App Router (single [[...slug]] renderer)
components/
  site/                 Header, sidebar, TOC, search, footer, theme
  mdx/                  Docs primitives (CodeBlock, Callout, Card, Tabs, Steps)
  parch-ui/             The Parch UI kit (buttons, fields, controls, dialogs...)
  mocks/                Mock application gallery (Store, Settings, Welcome...)
content/                All documentation, MDX, one directory per section
lib/                    Content pipeline (MDX compile, navigation, TOC)
public/                 Fonts (Saira, Estedad, JetBrains Mono), logo, icons, favicon set
scripts/                check-links.py, check-content.py
deploy/                 nginx config for the Docker image
.github/workflows/      CI (build + checks) and GHCR image publishing
```

## Content model

Each `content/<section>/<page>.mdx` becomes `/section/page/`. Frontmatter:

```yaml
---
title: "Page title"        # required
description: "One line"    # required, used in cards and meta
order: 2                   # position inside the section
status: stable             # optional: draft | experimental | proposal
index: true                # section landing pages only
---
```

Sections: `start architecture app-dev packaging iso distribution testing
localization security reference hig design mockups`.

Interactive demos in MDX must go through `<DemoStage name="..." />` or
`<MockStage id="..." />`; the registries live in
`components/parch-ui/demo-stage.tsx` and `components/mocks/index.tsx`.

**Read `CONTENT_GUIDE.md` before writing content** (terminology, verified
facts, and rules such as: no em-dashes, no invented commands).

## Search

Pagefind indexes the built HTML (`out/`) after each build; the header
search dialog (`Ctrl+K`) loads `/_pagefind/` at runtime. If search returns
"no index", you are serving a `build:next`-only output; run the full
`bun run build`.

## Themes

Light and dark are driven by semantic CSS tokens in `app/globals.css`
(`:root` and `.dark`). The site honors the system theme and stores the
manual choice in `localStorage` (`parch-dev-theme`).

## Contributing

See `CONTRIBUTING.md`. In short: content lives in `content/`, components in
`components/`, and both pass `check:content`, `check:links`, and a clean
`bun run build` before merge.

## License

Portal code: GPL-3.0 (matching the Parch websites). Documentation content:
CC BY-SA 4.0 (matching the source handbook). Parch logos and artwork
remain under their own licenses in the Parch Arts repositories.
