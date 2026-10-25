"use client";

import {
  Compass,
  Layers,
  Code,
  Palette,
  Component,
  Layout,
  Package,
  Disc,
  Server,
  TestTube,
  Globe,
  Shield,
  BookOpen,
} from "lucide-react";

const ICONS: Record<string, typeof Compass> = {
  compass: Compass,
  layers: Layers,
  code: Code,
  palette: Palette,
  component: Component,
  layout: Layout,
  package: Package,
  disc: Disc,
  server: Server,
  "test-tube": TestTube,
  globe: Globe,
  shield: Shield,
  "book-open": BookOpen,
};

export function SectionIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? Compass;
  return <Icon className={className} aria-hidden />;
}
