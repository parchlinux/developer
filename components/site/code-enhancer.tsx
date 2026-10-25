"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Progressive enhancement for plain fenced code blocks: adds a copy button
 * to every <pre> in the article that is not already wrapped in a <CodeBlock>
 * (those render their own header + copy control server-side).
 */
export function CodeEnhancer() {
  const pathname = usePathname();

  useEffect(() => {
    const pres = document.querySelectorAll<HTMLElement>(".article pre");
    for (const pre of Array.from(pres)) {
      if (pre.closest(".codeblock")) continue;
      if (pre.querySelector(".code-copy-btn")) continue;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "code-copy-btn";
      btn.textContent = "Copy";
      btn.setAttribute("aria-label", "Copy code to clipboard");
      btn.addEventListener("click", () => {
        const text = (pre.textContent ?? "").replace(/\n$/, "");
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = "Copied";
          setTimeout(() => {
            btn.textContent = "Copy";
          }, 1600);
        });
      });
      pre.appendChild(btn);
    }
  }, [pathname]);

  return null;
}
