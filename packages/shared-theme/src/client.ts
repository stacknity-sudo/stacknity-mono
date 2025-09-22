"use client";
// Client Entry Point for @stacknity/shared-theme
// Import from '@stacknity/shared-theme/client' for components & hooks that require React client runtime.

export { ThemeProvider, useTheme, useThemeSafe } from "./theme-provider";
export {
  ThemeToggle,
  ThemeToggleWithLabel,
  ThemeSelect,
  ThemeStatus,
} from "./theme-toggle";

// (Re-export types if convenient for consumers using only client entry)
export type { ThemeMode, ThemeColors, ThemeConfig } from "./types";
