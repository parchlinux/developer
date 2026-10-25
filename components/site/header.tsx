import Link from "next/link";
import { Github, Menu, Search } from "lucide-react";
import { HEADER_SECTIONS } from "@/lib/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchDialog } from "@/components/site/search-dialog";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[var(--container-docs)] items-center gap-3 px-4 sm:px-6">
        {/* Mobile menu button lives in sidebar; a11y skip link */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Parch Developer Portal home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-dark.svg"
            alt=""
            width={26}
            height={26}
            className="dark:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-white.svg"
            alt=""
            width={26}
            height={26}
            className="hidden dark:block"
          />
          <span className="text-[1.02rem] font-semibold tracking-tight text-text">
            Parch <span className="hidden text-text-subtle sm:inline">Developer</span>
          </span>
        </Link>

        <nav aria-label="Documentation" className="ms-2 hidden items-center lg:flex">
          {HEADER_SECTIONS.map((s) => (
            <Link
              key={s.id}
              href={`/${s.id}/`}
              className="rounded-md px-2.5 py-1.5 text-[0.88rem] font-medium text-text-muted transition-colors hover:bg-surface-2 hover:text-text"
            >
              {s.shortTitle ?? s.title}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <SearchDialog />
          <ThemeToggle />
          <a
            href="https://github.com/parchlinux"
            target="_blank"
            rel="noreferrer"
            className="flex size-8 items-center justify-center rounded-full text-text-subtle transition-colors hover:bg-surface-2 hover:text-text"
            aria-label="Parch Linux on GitHub"
          >
            <Github className="size-[17px]" aria-hidden />
          </a>
        </div>
      </div>
    </header>
  );
}

export { Menu };
