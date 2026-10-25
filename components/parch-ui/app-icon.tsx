import type { ReactNode } from "react";

/**
 * First-party Parch application icon. `app` maps to files in /public/icons.
 * Unknown names fall back to a neutral generic icon tile.
 */
const APP_ICONS: Record<string, { src: string; name: string }> = {
  pastor: { src: "/icons/pastor.svg", name: "Pastor (Parch Store)" },
  pacu: { src: "/icons/pacu.svg", name: "Pacu" },
  pdm: { src: "/icons/pdm.svg", name: "PDM" },
  pordle: { src: "/icons/pordle.svg", name: "Pordle" },
  gamehub: { src: "/icons/gamehub.svg", name: "GameHub" },
  mirrorman: { src: "/icons/mirrorman.svg", name: "MirrorMan" },
  "parch-config": { src: "/icons/parch-config.svg", name: "Parch Config" },
  "parchdroid": { src: "/icons/parchdroid.svg", name: "Parchdroid" },
  "kernel-manager": { src: "/icons/parch-kernel-manager.svg", name: "Kernel Manager" },
  "iso-writer": { src: "/icons/parch-iso-writer.png", name: "ISO Writer" },
  "simple-reflector": { src: "/icons/simple-reflector.svg", name: "Simple Reflector" },
};

export function AppIcon({
  app,
  size = 40,
  className = "",
}: {
  app: keyof typeof APP_ICONS | string;
  size?: number;
  className?: string;
}) {
  const icon = APP_ICONS[app];
  if (!icon) {
    return (
      <span
        aria-hidden
        style={{ width: size, height: size }}
        className={`inline-flex items-center justify-center rounded-[22%] bg-surface-3 text-text-subtle ${className}`}
      >
        ?
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={icon.src}
      alt={icon.name}
      width={size}
      height={size}
      className={`select-none rounded-[22%] ${className}`}
      loading="lazy"
    />
  );
}

export function ParchLogo({ size = 28 }: { size?: number }): ReactNode {
  return (
    <span className="relative inline-flex" style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-dark.svg" alt="" width={size} height={size} className="dark:hidden" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-white.svg" alt="" width={size} height={size} className="hidden dark:block" />
    </span>
  );
}
