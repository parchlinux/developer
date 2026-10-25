import fs from "node:fs";
import path from "node:path";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeShiki from "@shikijs/rehype";
import matter from "gray-matter";
import type { ReactNode } from "react";
import { SECTIONS, type SectionId } from "./navigation";

export const CONTENT_DIR = path.join(process.cwd(), "content");

export interface TocEntry {
  depth: 1 | 2 | 3 | 4;
  id: string;
  text: string;
}

export interface PageMeta {
  slug: string; // "iso/build-first", empty string for site index
  section: SectionId;
  title: string;
  description: string;
  order: number;
  status?: "stable" | "draft" | "experimental" | "proposal";
  index?: boolean; // section landing page
  noTOC?: boolean;
  layout?: "doc" | "mock";
  /** Related handbook chapter numbers from parchbook-book, for traceability */
  source?: string;
}

export interface PageMetaWithHref extends PageMeta {
  href: string;
  sectionTitle: string;
}

const MDX_EXTENSION = ".mdx";

function readFrontmatter(filePath: string, slug: string): PageMeta {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  const section = (slug.split("/")[0] || "start") as SectionId;
  const meta: PageMeta = {
    slug,
    section: SECTIONS.some((s) => s.id === section) ? section : "start",
    title: String(data.title ?? "Untitled"),
    description: String(data.description ?? ""),
    order: typeof data.order === "number" ? data.order : 100,
    status: data.status,
    index: data.index === true,
    noTOC: data.noTOC === true,
    layout: data.layout,
    source: data.source,
  };
  return meta;
}

function walk(dir: string, base = ""): string[] {
  const entries: string[] = [];
  if (!fs.existsSync(dir)) return entries;
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${name.name}` : name.name;
    if (name.isDirectory()) {
      entries.push(...walk(path.join(dir, name.name), rel));
    } else if (name.name.endsWith(MDX_EXTENSION)) {
      entries.push(rel);
    }
  }
  return entries;
}

let cache: PageMeta[] | null = null;

/** All content pages, sorted per-section by frontmatter order then title. */
export function getAllPages(): PageMeta[] {
  if (cache) return cache;
  const files = walk(CONTENT_DIR);
  cache = files.map((rel) => {
    const slug = rel.slice(0, -MDX_EXTENSION.length);
    const isIndex = slug.endsWith("/index");
    return readFrontmatter(path.join(CONTENT_DIR, rel), isIndex ? slug.slice(0, -"/index".length) : slug);
  });
  return cache;
}

export function getSectionPages(section: SectionId): PageMetaWithHref[] {
  const sectionMeta = SECTIONS.find((s) => s.id === section);
  return getAllPages()
    .filter((p) => p.section === section)
    .sort((a, b) => (a.index ? -1 : b.index ? 1 : a.order - b.order || a.title.localeCompare(b.title)))
    .map((p) => ({
      ...p,
      href: `/${p.slug}/`,
      sectionTitle: sectionMeta?.title ?? section,
    }));
}

/** Flat ordered list of every page, for prev/next navigation and search. */
export function getDocFlow(): PageMetaWithHref[] {
  const flow: PageMetaWithHref[] = [];
  for (const s of SECTIONS) {
    flow.push(...getSectionPages(s.id));
  }
  return flow;
}

export function getPageMeta(slug: string): PageMetaWithHref | undefined {
  const found = getAllPages().find((p) => p.slug === slug);
  if (!found) return undefined;
  const sectionMeta = SECTIONS.find((s) => s.id === found.section);
  return { ...found, href: `/${found.slug}/`, sectionTitle: sectionMeta?.title ?? found.section };
}

/* ------------------------------------------------------------------ */
/* MDX compilation                                                     */
/* ------------------------------------------------------------------ */

export interface CompiledPage {
  content: ReactNode;
  toc: TocEntry[];
  headingsCount: number;
}

interface HeadingCollector {
  headings: TocEntry[];
}

function makeHeadingCollector(): [HeadingCollector, Parameters<typeof rehypeSlug>[0]] {
  const state: HeadingCollector = { headings: [] };
  const plugin = () => {
    return (tree: unknown) => {
      visit(tree);
    };
    function visit(node: any) {
      if (!node) return;
      if (node.type === "element" && /^h[1-4]$/.test(node.tagName)) {
        const id = node.properties?.id as string | undefined;
        const text = collectText(node);
        if (id && text) {
          state.headings.push({
            depth: Number(node.tagName[1]) as TocEntry["depth"],
            id,
            text,
          });
        }
      }
      if (node.children) node.children.forEach(visit);
    }
    function collectText(node: any): string {
      if (node.type === "text") return node.value;
      if (node.children) return node.children.map(collectText).join("");
      return "";
    }
  };
  return [state, plugin as Parameters<typeof rehypeSlug>[0]];
}

export async function compilePage(
  slug: string,
  components: Record<string, React.ComponentType<any>> = {},
): Promise<CompiledPage> {
  // Slugs without a file of their own may still have an index page
  // ("start" → content/start/index.mdx).
  const direct = path.join(CONTENT_DIR, `${slug}.mdx`);
  const asIndex = path.join(CONTENT_DIR, slug, "index.mdx");
  const filePath = fs.existsSync(direct) ? direct : asIndex;
  if (!fs.existsSync(filePath)) {
    throw new Error(`Content page not found for slug "${slug}"`);
  }
  const raw = fs.readFileSync(filePath, "utf8");
  const { content } = matter(raw);

  const [collector, headingPlugin] = makeHeadingCollector();

  const mod = await evaluate(content, {
    ...runtime,
    // Lets MDX resolve its react/jsx-runtime import in dev builds.
    baseUrl: import.meta.url,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      headingPlugin,
      [
        rehypeShiki as any,
        {
          themes: { light: "github-light", dark: "github-dark" },
          defaultColor: false,
          lazy: true,
        },
      ],
    ] as any,
  });
  const MDXContent = mod.default;

  return {
    content: <MDXContent components={components} />,
    toc: collector.headings.filter((h) => h.depth >= 2),
    headingsCount: collector.headings.length,
  };
}
