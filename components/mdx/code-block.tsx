"use client";

import { useCallback, useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";

interface CodeBlockProps {
  children: React.ReactNode;
  title?: string;
  language?: string;
  /** Show as a shell snippet with a $ prompt and copy full command */
  prompt?: boolean;
}

/**
 * Wrapper for shiki-highlighted <pre>. Adds a header with the code title,
 * a copy button, and handles shell prompt decoration.
 */
export function CodeBlock({ children, title, prompt }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const text = extractText(children);

  const copy = useCallback(() => {
    const value = prompt ? stripPrompts(text) : text;
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }, [text, prompt]);

  return (
    <figure className="codeblock my-5 overflow-hidden rounded-lg border border-code-border bg-code-bg shadow-card">
      <div className="flex items-center gap-2 border-b border-code-border bg-surface-2/70 px-3 py-1.5">
        <Terminal aria-hidden className="size-3.5 text-text-subtle" />
        <figcaption className="flex-1 truncate font-mono text-xs text-text-subtle">
          {title ?? promptText(text) ?? "code"}
        </figcaption>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-text-subtle transition-colors hover:bg-surface-3 hover:text-text"
          aria-label={copied ? "Copied" : "Copy code to clipboard"}
        >
          {copied ? <Check className="size-3.5 text-accent" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
          <span aria-hidden>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <div className="overflow-x-auto px-4 py-3.5">{children}</div>
    </figure>
  );
}

function promptText(text: string): string | null {
  if (text.includes("$ ")) return null;
  return null;
}

function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return extractText((node as any).props.children);
  }
  return "";
}

/** Remove leading "$ " or "# " prompts, keeping continuation lines. */
function stripPrompts(text: string): string {
  return text
    .split("\n")
    .map((line) => line.replace(/^(\$\s|#\s)/, ""))
    .join("\n");
}
