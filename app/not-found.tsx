import Link from "next/link";
import { SearchX, Compass } from "lucide-react";
import { Header } from "@/components/site/header";
import { SECTIONS } from "@/lib/navigation";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
          <SearchX className="size-7" aria-hidden />
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-3 leading-relaxed text-text-muted">
          This documentation page does not exist, it may have moved. Try searching, or
          start from one of the main sections below.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {SECTIONS.slice(0, 6).map((s) => (
            <Link
              key={s.id}
              href={`/${s.id}/`}
              className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-[0.85rem] font-medium text-text-muted transition-colors hover:border-accent/50 hover:text-text"
            >
              {s.shortTitle ?? s.title}
            </Link>
          ))}
        </div>
        <Link
          href="/"
          className="mt-8 flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
        >
          <Compass className="size-4" aria-hidden />
          Back to the developer portal home
        </Link>
      </main>
    </>
  );
}
