// NOTE: This entry file intentionally omits the "use client" directive so that
// server components (e.g., Next.js layouts) can safely import pure utilities
// like generatePreloadTags / defaultFontConfig at build/render time.
// Client-only components (ThemeProvider, toggles) internally declare "use client".
/**
 * Shared Theme Package - Main Entry Point
 * Modern theme system for Stacknity monorepo
 */

// ===== Core Exports =====
export type {
  ThemeMode,
  ThemeColors,
  ThemeConfig,
  ThemeSpacing,
  ThemeBorderRadius,
  ThemeTypography,
} from "./types";

export type { FontVariant, CustomFont, FontConfig } from "./fonts";

export { defaultThemeConfig, generateCSSCustomProperties } from "./config";

export {
  defaultFontConfig,
  generateFontFaceCSS,
  generateFontVariables,
  generatePreloadTags,
  loadFont,
  loadAllFonts,
  isFontLoaded,
  waitForFont,
  useFontLoader,
} from "./fonts";

// Client components (ThemeProvider, ThemeToggle, etc.) are intentionally NOT
// exported here. Import them from '@stacknity/shared-theme/client'.

// ===== Utility Exports =====
export { createThemeCSS } from "./utils";

// ===== Package Info =====
export const PACKAGE_NAME = "@stacknity/shared-theme";
export const PACKAGE_VERSION = "1.0.0";
