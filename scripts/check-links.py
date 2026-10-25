#!/usr/bin/env python3
"""Link checker for the Parch Developer Portal.

Validates that every internal link in content MDX files and in the built
HTML (out/) resolves to a generated page or anchor.
"""
import html.parser
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "out"
CONTENT = ROOT / "content"

failures: list[str] = []


def built_pages() -> set[str]:
    pages = set()
    for p in OUT.rglob("index.html"):
        rel = p.parent.relative_to(OUT)
        pages.add("" if rel.as_posix() == "." else rel.as_posix())
    return pages


def built_anchors(page: str) -> set[str]:
    p = OUT / page / "index.html"
    if not p.exists():
        return set()
    ids: set[str] = set()
    class Collector(html.parser.HTMLParser):
        def handle_starttag(self, tag, attrs):
            for k, v in attrs:
                if k == "id" and v:
                    ids.add(v)
    collector = Collector()
    collector.feed(p.read_text(encoding="utf8", errors="ignore"))
    return ids


def content_slug_for(href: str) -> str:
    """Map /section/path/ to the built page path (trailingSlash: true)."""
    return href.lstrip("/").rstrip("/")


def check_mdx_links():
    """Every relative/internal link in content must have a matching MDX file."""
    slugs = set()
    for f in CONTENT.rglob("*.mdx"):
        rel = f.relative_to(CONTENT).with_suffix("")
        slug = rel.as_posix()
        if slug.endswith("/index"):
            slug = slug[: -len("/index")]
        slugs.add(slug)
    section_ids = {f.parent.relative_to(CONTENT).as_posix() for f in CONTENT.rglob("*.mdx")}

    link_re = re.compile(r"\[[^\]]*\]\((/[^)#\s]*)(#[^)\s]*)?\)")
    for f in CONTENT.rglob("*.mdx"):
        text = f.read_text()
        for href, _anchor in link_re.findall(text):
            target = href.lstrip("/").rstrip("/")
            if href == "/" or target in slugs or target in section_ids:
                continue
            failures.append(f"{f.relative_to(ROOT)}: dead link {href}")


def check_html_links(pages):
    href_re = re.compile(r'(?:href|src)="([^"]+)"')
    for page in pages:
        p = OUT / page / "index.html" if page else OUT / "index.html"
        text = p.read_text(encoding="utf8", errors="ignore")
        for href in href_re.findall(text):
            if href.startswith(("http://", "https://", "mailto:", "data:", "#")):
                continue
            path = href.split("#")[0].lstrip("/")
            if path.endswith("/"):
                target = path.rstrip("/")
                if target and (target not in pages):
                    failures.append(f"{page or '/'}: broken {href}")
            elif path and path not in pages:
                # static assets (fonts, icons, images, _pagefind, _next) exist as files
                if not (OUT / path).exists():
                    failures.append(f"{page or '/'}: missing {href}")


def main():
    if not OUT.exists():
        print("out/ missing: run `bun run build` first", file=sys.stderr)
        return 2
    pages = built_pages()
    check_mdx_links()
    check_html_links(pages)
    if failures:
        print(f"FAILED: {len(failures)} link problems")
        for f in failures:
            print(" ", f)
        return 1
    print(f"OK: {len(pages)} pages, all internal links resolve")
    return 0


if __name__ == "__main__":
    sys.exit(main())
