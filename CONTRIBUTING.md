# Contributing to the Developer Portal

Thank you for improving developer.parchlinux.com. This guide covers the
portal itself; for contributing to Parch the distribution, start at
[/start/contribution-workflow/](https://developer.parchlinux.com/start/contribution-workflow/).

## Prerequisites

- bun (any recent version)
- Node 20+ is unnecessary on the host (bun handles the toolchain)

```bash
bun install
bun run dev
```

## Making a content change

1. Find the page under `content/`; its path is its URL.
2. Follow `CONTENT_GUIDE.md`: frontmatter, terminology, verified-facts
   rules, and the no-em-dash rule.
3. Cross-link related pages; links are validated automatically.
4. Run the checks:

```bash
bun run check:content   # frontmatter, placeholders, banned punctuation
bun run build           # full build + pagefind
bun run check:links     # every internal link resolves
```

All three must pass. `bun run build` failing usually means invalid MDX
(remember: `<https://url>` autolinks and raw imports do not work in MDX;
use `[text](url)` and the component map).

## Making a component change

Components live in `components/`. The design tokens in `app/globals.css`
are the single source of truth: never hardcode colors or sizes in
components. Anything user-visible must work in light and dark, LTR and RTL.

If you add an interactive demo for the design system, register it in
`components/parch-ui/demo-stage.tsx` and reference it with
`<DemoStage name="..." />` from MDX.

## Adding a section or page

1. Create `content/<section>/<page>.mdx` (or a new section directory).
2. Add new sections to `lib/navigation.ts`.
3. Add a `content/<section>/index.mdx` landing page (`index: true`).

## Facts and claims

- Commands, package names, repository URLs must be verified. The verified
  ground truth lives in `CONTENT_GUIDE.md`.
- Proposed workflows get `status: proposal` in frontmatter and are labeled
  in the body.
- When the source handbook and the live repositories disagree, the
  repositories win; keep a Callout noting the change.

## Review

PRs are reviewed for technical accuracy first, style second. Include
screenshots for visual changes (both themes) and note which checks you ran.
