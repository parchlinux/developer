import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-[var(--container-docs)] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-dark.svg" alt="" width={24} height={24} className="dark:hidden" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-white.svg" alt="" width={24} height={24} className="hidden dark:block" />
            <span className="font-semibold text-text">Parch GNU/Linux</span>
          </div>
          <p className="mt-3 max-w-xs text-[0.85rem] leading-relaxed text-text-muted">
            The official developer portal for Parch, an Arch-based distribution focused on
            usability and Persian-language support.
          </p>
          <p className="mt-4 text-[0.78rem] text-text-subtle">
            Documentation content available under CC BY-SA 4.0 unless noted.
          </p>
        </div>

        <FooterCol
          title="Documentation"
          links={[
            { label: "Getting Started", href: "/start/" },
            { label: "Platform Architecture", href: "/architecture/" },
            { label: "Application Development", href: "/app-dev/" },
            { label: "Packaging", href: "/packaging/" },
            { label: "ISO Building", href: "/iso/" },
          ]}
        />
        <FooterCol
          title="Design"
          links={[
            { label: "Human Interface Guidelines", href: "/hig/" },
            { label: "Design System", href: "/design/" },
            { label: "App Designs", href: "/mockups/" },
            { label: "Localization", href: "/localization/" },
          ]}
        />
        <FooterCol
          title="Community"
          links={[
            { label: "parchlinux.com", href: "https://parchlinux.com" },
            { label: "Wiki", href: "https://wiki.parchlinux.com" },
            { label: "Forum", href: "https://forum.parchlinux.com" },
            { label: "Matrix", href: "https://matrix.to/#/%23parchlinux:matrix.org" },
            { label: "GitHub", href: "https://github.com/parchlinux" },
          ]}
        />
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-[var(--container-docs)] px-4 py-4 text-[0.78rem] text-text-subtle sm:px-6">
          © 2026 Parch Linux Team. Parch GNU/Linux is not affiliated with Arch Linux.
          Arch Linux is a trademark of Levente Polyak.
        </p>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="mb-2.5 text-[0.8rem] font-semibold uppercase tracking-wide text-text-subtle">
        {title}
      </p>
      <ul className="space-y-1.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-[0.86rem] text-text-muted transition-colors hover:text-text"
              {...(l.href.startsWith("http")
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
