import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, FileText, Github, Sparkles } from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { DocsShell } from "@/components/site/docs-shell";
import { TableOfContents } from "@/components/site/toc";
import { Breadcrumbs, PagePager } from "@/components/site/article-chrome";
import { SectionIcon } from "@/components/site/section-icon";
import {
  compilePage,
  getAllPages,
  getDocFlow,
  getPageMeta,
  getSectionPages,
  type PageMetaWithHref,
} from "@/lib/content";
import { SECTIONS, type SectionId } from "@/lib/navigation";
import { mdxComponents } from "@/components/mdx";

export function generateStaticParams() {
  const params: { slug?: string[] }[] = [
    { slug: [] }, // site landing
  ];
  for (const section of SECTIONS) {
    params.push({ slug: [section.id] });
  }
  for (const page of getAllPages()) {
    params.push({ slug: page.slug.split("/") });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const key = slug?.join("/") ?? "";
  const page = key ? getPageMeta(key) : undefined;
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/${page.slug}/` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const key = slug?.join("/") ?? "";

  if (key === "") {
    return <LandingPage />;
  }

  // Section landing with no index.mdx content yet → still render the overview.
  if (slug?.length === 1 && SECTIONS.some((s) => s.id === slug[0])) {
    const sectionId = slug[0] as SectionId;
    const sectionPages = getSectionPages(sectionId);
    const indexPage = sectionPages.find((p) => p.index);
    const nav = buildNav();

    if (!indexPage) {
      return (
        <>
          <Header />
          <DocsShell nav={nav}>
            <SectionOverview sectionId={sectionId} pages={sectionPages} />
          </DocsShell>
          <Footer />
        </>
      );
    }

    const compiled = await compilePage(indexPage.slug, mdxComponents);
    const meta = getPageMeta(indexPage.slug)!;

    return (
      <>
        <Header />
        <DocsShell nav={nav} toc={<TableOfContents entries={compiled.toc} />}>
          <article className="mx-auto max-w-[var(--container-content)]">
            <Breadcrumbs page={meta} />
            <StatusBadge meta={meta} />
            <div className="article">{compiled.content}</div>
            <SectionGrid sectionId={sectionId} pages={sectionPages.filter((p) => !p.index)} />
          </article>
        </DocsShell>
        <Footer />
      </>
    );
  }

  const page = getPageMeta(key);
  if (!page) notFound();

  const compiled = await compilePage(page.slug, mdxComponents);
  const flow = getDocFlow();
  const idx = flow.findIndex((p) => p.slug === page.slug);
  const prev = idx > 0 ? flow[idx - 1] : undefined;
  const next = idx >= 0 && idx < flow.length - 1 ? flow[idx + 1] : undefined;

  return (
    <>
      <Header />
      <DocsShell
        nav={buildNav()}
        toc={
          <>
            <TableOfContents entries={compiled.toc} />
            <PageMetaPanel meta={page} />
          </>
        }
      >
        <article className="mx-auto max-w-[var(--container-content)]">
          <Breadcrumbs page={page} />
          <div className="flex items-start justify-between gap-4">
            <StatusBadge meta={page} />
            {page.source ? (
              <p className="mt-1 shrink-0 font-mono text-[0.7rem] text-text-subtle">
                source: handbook {page.source}
              </p>
            ) : null}
          </div>
          <div className="article">{compiled.content}</div>
          <PagePager
            prev={prev ? { title: prev.title, href: prev.href } : undefined}
            next={next ? { title: next.title, href: next.href } : undefined}
          />
        </article>
      </DocsShell>
      <Footer />
    </>
  );
}

function StatusBadge({ meta }: { meta: PageMetaWithHref }) {
  if (!meta.status || meta.status === "stable") return null;
  const styles: Record<string, string> = {
    draft: "border-warning/40 bg-warning-soft text-warning-strong",
    experimental: "border-info/40 bg-info-soft text-info",
    proposal: "border-border bg-surface-2 text-text-muted",
  };
  return (
    <p className="mb-3">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.72rem] font-semibold uppercase tracking-wide ${styles[meta.status] ?? styles.proposal}`}
      >
        <Sparkles className="size-3" aria-hidden />
        {meta.status} documentation
      </span>
    </p>
  );
}

function PageMetaPanel({ meta }: { meta: PageMetaWithHref }) {
  return (
    <div className="mt-8 space-y-3 border-t border-border pt-4 text-[0.8rem]">
      <p className="font-semibold uppercase tracking-wide text-text-subtle">Page actions</p>
      <a
        href="https://github.com/parchlinux"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1.5 text-text-muted transition-colors hover:text-text"
      >
        <Github className="size-3.5" aria-hidden />
        Parch on GitHub
      </a>
      <Link
        href="/reference/faq/"
        className="flex items-center gap-1.5 text-text-muted transition-colors hover:text-text"
      >
        <FileText className="size-3.5" aria-hidden />
        Found an issue? See FAQ
      </Link>
    </div>
  );
}

function buildNav() {
  return SECTIONS.map((s) => ({
    id: s.id,
    title: s.title,
    shortTitle: s.shortTitle,
    pages: getSectionPages(s.id).map((p) => ({
      title: p.title,
      href: p.href,
      status: p.status,
    })),
  }));
}

function SectionOverview({
  sectionId,
  pages,
}: {
  sectionId: string;
  pages: PageMetaWithHref[];
}) {
  const section = SECTIONS.find((s) => s.id === sectionId)!;
  return (
    <div className="mx-auto max-w-[var(--container-content)]">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <SectionIcon name={section.icon} className="size-5" />
        </span>
        <h1 className="text-3xl font-bold tracking-tight">{section.title}</h1>
      </div>
      <p className="mt-3 text-lg text-text-muted">{section.description}</p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {pages.map((p) => (
          <li key={p.href}>
            <Link
              href={p.href}
              className="group flex h-full flex-col rounded-lg border border-border bg-surface p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-raised"
            >
              <span className="text-[0.95rem] font-semibold text-text group-hover:text-accent">
                {p.title}
              </span>
              <span className="mt-1 text-[0.84rem] leading-relaxed text-text-muted">
                {p.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionGrid({ sectionId, pages }: { sectionId: string; pages: PageMetaWithHref[] }) {
  if (pages.length === 0) return null;
  const section = SECTIONS.find((s) => s.id === sectionId)!;
  return (
    <section aria-label={`More in ${section.title}`} className="mt-14 border-t border-border pt-8">
      <h2 className="text-xl font-bold tracking-tight">Continue in {section.title}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {pages.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="group rounded-lg border border-border bg-surface p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-raised"
          >
            <span className="flex items-center gap-2 text-[0.95rem] font-semibold text-text group-hover:text-accent">
              {p.title}
              <ArrowRight className="size-4 text-text-subtle transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
            <span className="mt-1 block text-[0.84rem] leading-relaxed text-text-muted">
              {p.description}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Site landing                                                        */
/* ------------------------------------------------------------------ */

const PATHS = [
  {
    title: "Application Developer",
    description: "Build apps that feel native to Parch with Rust, Python, GTK4, or Qt.",
    href: "/app-dev/",
    icon: "code",
  },
  {
    title: "Package Maintainer",
    description: "Write PKGBUILDs, submit to the world repository, and keep packages healthy.",
    href: "/packaging/",
    icon: "package",
  },
  {
    title: "ISO Builder",
    description: "Assemble custom Parch editions from the real archiso-based profiles.",
    href: "/iso/",
    icon: "disc",
  },
  {
    title: "Distribution Contributor",
    description: "Work on the installer, system components, and repository infrastructure.",
    href: "/distribution/",
    icon: "server",
  },
  {
    title: "Designer",
    description: "Follow the HIG and reuse the design system to design Parch-native interfaces.",
    href: "/hig/",
    icon: "palette",
  },
] as const;

function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden border-b border-border">
          <div className="grid-texture absolute inset-0" aria-hidden />
          <div className="relative mx-auto max-w-3xl px-4 pb-16 pt-20 text-center sm:px-6">
            <p className="text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-accent">
              Parch GNU/Linux
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Build for <span className="brand-gradient-text">Parch</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-text-muted">
              The official engineering handbook for the Parch ecosystem, application
              development, design guidelines, packaging, and ISO building, grounded in the
              real build system.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/start/"
                className="brand-gradient flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-card transition-transform hover:-translate-y-0.5"
              >
                Get started <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="/iso/build-first-iso/"
                className="rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-text shadow-card transition-colors hover:border-accent/50"
              >
                Build your first ISO
              </Link>
            </div>
            <p className="mt-6 text-[0.8rem] text-text-subtle">
              Press <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.7rem]">Ctrl K</kbd> to search everything
            </p>
          </div>
        </section>

        <section aria-labelledby="paths-heading" className="mx-auto max-w-[var(--container-docs)] px-4 py-14 sm:px-6">
          <h2 id="paths-heading" className="text-2xl font-bold tracking-tight">
            Choose your development path
          </h2>
          <p className="mt-2 max-w-2xl text-text-muted">
            Each path is a curated sequence through the documentation, from zero to a
            working result.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PATHS.map((p) => (
              <Link
                key={p.title}
                href={p.href}
                className="group flex flex-col rounded-xl border border-border bg-surface p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-raised"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <SectionIcon name={p.icon} className="size-[18px]" />
                </span>
                <span className="mt-3 flex items-center gap-1.5 font-semibold text-text">
                  {p.title}
                  <ArrowRight className="size-4 text-text-subtle opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
                </span>
                <span className="mt-1 text-[0.88rem] leading-relaxed text-text-muted">
                  {p.description}
                </span>
              </Link>
            ))}
            <div className="flex flex-col justify-center rounded-xl border border-dashed border-border p-5">
              <p className="font-semibold text-text">Everything else</p>
              <p className="mt-1 text-[0.88rem] text-text-muted">
                Testing, localization, security, and the full reference live in the
                complete section index below.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="sections-heading" className="border-t border-border bg-surface">
          <div className="mx-auto max-w-[var(--container-docs)] px-4 py-14 sm:px-6">
            <h2 id="sections-heading" className="text-2xl font-bold tracking-tight">
              All sections
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SECTIONS.map((s) => {
                const count = getSectionPages(s.id).length;
                return (
                  <Link
                    key={s.id}
                    href={`/${s.id}/`}
                    className="group rounded-xl border border-border bg-background p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-raised"
                  >
                    <div className="flex items-center gap-2.5">
                      <SectionIcon name={s.icon} className="size-[18px] text-accent" />
                      <span className="font-semibold text-text">{s.shortTitle ?? s.title}</span>
                      {count > 0 && (
                        <span className="ms-auto rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[0.7rem] text-text-subtle">
                          {count}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-[0.85rem] leading-relaxed text-text-muted">
                      {s.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
