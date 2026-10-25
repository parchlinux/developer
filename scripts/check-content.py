#!/usr/bin/env python3
"""Content validator for the Parch Developer Portal.

Checks every content MDX file for: required frontmatter, known section
placement, em-dash ban, placeholder text, and reference-URL hygiene
(no dead infrastructure like git.parchlinux.com presented as current).
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content"

KNOWN_SECTIONS = {
    "start", "architecture", "app-dev", "packaging", "iso", "distribution",
    "testing", "localization", "security", "reference", "hig", "design",
    "mockups",
}

REQUIRED_FIELDS = ["title", "description"]

failures: list[str] = []

for f in sorted(CONTENT.rglob("*.mdx")):
    rel = f.relative_to(ROOT)
    text = f.read_text()
    section = f.relative_to(CONTENT).parts[0]
    if section not in KNOWN_SECTIONS:
        failures.append(f"{rel}: unknown section '{section}'")

    m = re.match(r"^---\n(.*?)\n---\n", text, re.DOTALL)
    if not m:
        failures.append(f"{rel}: missing frontmatter block")
        continue
    fm = m.group(1)
    for field in REQUIRED_FIELDS:
        if not re.search(rf"^{field}:\s*\S", fm, re.MULTILINE):
            failures.append(f"{rel}: frontmatter missing '{field}'")
    if "index: true" not in fm and "order:" not in fm:
        failures.append(f"{rel}: missing 'order'")

    body = text[m.end():]
    if "—" in text:
        failures.append(f"{rel}: contains em-dash (banned)")
    for marker in [r"(?<![A-Za-z-])TODO[:\s]", r"\bFIXME\b", r"lorem ipsum", r"\bTBD\b"]:
        if re.search(marker, body):
            failures.append(f"{rel}: placeholder text '{marker}'")
    # Dead infrastructure presented as current
    if "git.parchlinux.com" in body and "dead" not in body.lower():
        failures.append(f"{rel}: mentions git.parchlinux.com without dead-context")
    if re.search(r"\bppr\b", body) and "consolidat" not in body.lower() and "dead" not in body.lower() and "old" not in body.lower():
        failures.append(f"{rel}: mentions ppr without legacy context")

if failures:
    print(f"FAILED: {len(failures)} content problems")
    for f in failures:
        print(" ", f)
    sys.exit(1)
print("OK: content passes validation")
