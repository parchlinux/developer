import type { ComponentType, ReactNode } from "react";
import { CodeBlock } from "./code-block";
import { Callout } from "./callout";
import { Card, CardGrid } from "./card";
import { Tabs, Tab } from "./tabs";
import { Steps, Step, Checklist } from "./steps";
import { Button, Chip } from "@/components/parch-ui/button";
import { TextField, SearchField } from "@/components/parch-ui/field";
import { Switch, Checkbox, RadioGroup } from "@/components/parch-ui/controls";
import { Select, SegmentedTabs, Toast, useToastDemo } from "@/components/parch-ui/overlays";
import { Dialog, ProgressBar } from "@/components/parch-ui/dialog";
import {
  AppWindow,
  EmptyState,
  SettingsRow,
  SettingsGroup,
} from "@/components/parch-ui/app-window";
import { AppIcon } from "@/components/parch-ui/app-icon";
import { Demo, DoDont, Swatch, SpecTable } from "@/components/parch-ui/demo";
import { DemoStage } from "@/components/parch-ui/demo-stage";
import { MockStage } from "@/components/mocks";

/** Components available inside every MDX article. */
export const mdxComponents: Record<string, ComponentType<any>> = {
  // Docs primitives
  CodeBlock,
  Callout,
  Card,
  CardGrid,
  Tabs,
  Tab,
  Steps,
  Step,
  Checklist,
  // Design-system documentation helpers
  Demo,
  DoDont,
  Swatch,
  SpecTable,
  DemoStage,
  MockStage,
  // Parch UI kit
  Button,
  Chip,
  TextField,
  SearchField,
  Switch,
  Checkbox,
  RadioGroup,
  Select,
  SegmentedTabs,
  Toast,
  Dialog,
  ProgressBar,
  AppWindow,
  EmptyState,
  SettingsRow,
  SettingsGroup,
  AppIcon,
  Code: (props: { children?: ReactNode }) => <code {...props} />,
};
