/**
 * Information architecture for the Parch Developer Portal.
 * Sections mirror the handbook's coverage: each has an ordered page list
 * assembled from content/<dir> frontmatter (order field, then filename).
 */

export type SectionId =
  | "start"
  | "architecture"
  | "app-dev"
  | "packaging"
  | "iso"
  | "distribution"
  | "testing"
  | "localization"
  | "security"
  | "reference"
  | "hig"
  | "design"
  | "mockups";

export interface SectionMeta {
  id: SectionId;
  title: string;
  shortTitle?: string;
  description: string;
  icon: string; // lucide icon name, resolved in components
  accent?: "teal" | "blue" | "purple";
  /** primary header navigation ordering; 0 = not in header */
  headerOrder: number;
}

export const SECTIONS: SectionMeta[] = [
  {
    id: "start",
    title: "Getting Started",
    description:
      "Set up a Parch development workstation and ship your first app, package, and ISO.",
    icon: "compass",
    accent: "teal",
    headerOrder: 1,
  },
  {
    id: "architecture",
    title: "Platform Architecture",
    description:
      "How Parch is assembled: Arch foundations, package management, desktop stack, repositories, and ISO composition.",
    icon: "layers",
    accent: "blue",
    headerOrder: 2,
  },
  {
    id: "app-dev",
    title: "Application Development",
    description:
      "Build applications for Parch with Rust, Python, GTK4/libadwaita, and Qt/KDE Frameworks.",
    icon: "code",
    accent: "teal",
    headerOrder: 3,
  },
  {
    id: "hig",
    title: "Human Interface Guidelines",
    shortTitle: "HIG",
    description:
      "The Parch HIG: design foundations, application structure, interaction patterns, and platform integration.",
    icon: "palette",
    accent: "purple",
    headerOrder: 4,
  },
  {
    id: "design",
    title: "Design System",
    description:
      "Interactive, documented UI components sharing one token source, the reference implementation of the Parch HIG.",
    icon: "component",
    accent: "purple",
    headerOrder: 5,
  },
  {
    id: "mockups",
    title: "App Designs",
    description:
      "Full-window mock application designs: Parch Store, Settings, Welcome, Updater, and more.",
    icon: "layout",
    accent: "blue",
    headerOrder: 0,
  },
  {
    id: "packaging",
    title: "Packaging",
    description:
      "The packaging handbook: PKGBUILDs, the world repository, submission, review, and maintenance.",
    icon: "package",
    accent: "teal",
    headerOrder: 6,
  },
  {
    id: "iso",
    title: "ISO Building",
    description:
      "Build, customize, test, and release Parch ISO images with the real archiso-based build system.",
    icon: "disc",
    accent: "blue",
    headerOrder: 7,
  },
  {
    id: "distribution",
    title: "Distribution Development",
    description:
      "Contribute to Parch itself: installer, system components, repository infrastructure, and release management.",
    icon: "server",
    accent: "blue",
    headerOrder: 0,
  },
  {
    id: "testing",
    title: "Testing & QA",
    description: "Test plans and methods for applications, packages, and ISO releases.",
    icon: "test-tube",
    accent: "teal",
    headerOrder: 0,
  },
  {
    id: "localization",
    title: "Localization & Accessibility",
    description:
      "Persian-first i18n: translation workflow, RTL layouts, fonts, and accessible design.",
    icon: "globe",
    accent: "purple",
    headerOrder: 0,
  },
  {
    id: "security",
    title: "Security",
    description:
      "Supply-chain trust, signing, build isolation, vulnerability handling, and release engineering.",
    icon: "shield",
    accent: "blue",
    headerOrder: 0,
  },
  {
    id: "reference",
    title: "Reference",
    description:
      "Searchable reference: commands, configuration files, ISO profile options, glossary, and FAQ.",
    icon: "book-open",
    accent: "teal",
    headerOrder: 0,
  },
];

export function getSection(id: string): SectionMeta | undefined {
  return SECTIONS.find((s) => s.id === id);
}

/** Sections shown in the top header navigation, in order. */
export const HEADER_SECTIONS = SECTIONS.filter((s) => s.headerOrder > 0).sort(
  (a, b) => a.headerOrder - b.headerOrder,
);
