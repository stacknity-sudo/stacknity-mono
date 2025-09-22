/**
 * Theme Utilities
 * Helper functions for theme management
 */

import type { ThemeMode, ThemeConfig } from "./types";

// ===== CSS Generation Utilities =====

/**
 * Create complete CSS for a theme configuration
 */
export function createThemeCSS(
  config: ThemeConfig,
  options: {
    includeBase?: boolean;
    prefix?: string;
    mode?: "light" | "dark";
  } = {}
): string {
  const { includeBase = true, prefix = "", mode } = options;

  const css: string[] = [];

  if (includeBase) {
    css.push(createBaseCSSReset());
  }

  // Generate CSS custom properties for both themes
  if (mode) {
    // Single mode
    css.push(createThemeModeCSS(config, mode, prefix));
  } else {
    // Both modes
    css.push(createThemeModeCSS(config, "light", prefix));
    css.push(createThemeModeCSS(config, "dark", prefix, '[data-theme="dark"]'));
  }

  return css.join("\n\n");
}

/**
 * Create CSS for a specific theme mode
 */
function createThemeModeCSS(
  config: ThemeConfig,
  mode: "light" | "dark",
  prefix: string = "",
  selector: string = ":root"
): string {
  const colors = config.colors[mode];
  const properties: string[] = [];

  // Color properties
  Object.entries(colors).forEach(([key, value]) => {
    properties.push(`  --${prefix}${key}: ${value};`);
  });

  // Spacing properties
  Object.entries(config.spacing).forEach(([key, value]) => {
    properties.push(`  --${prefix}spacing-${key}: ${value};`);
  });

  // Border radius properties
  Object.entries(config.borderRadius).forEach(([key, value]) => {
    properties.push(`  --${prefix}radius-${key}: ${value};`);
  });

  // Typography properties
  const { fontFamily, fontSize, fontWeight } = config.typography;

  properties.push(`  --${prefix}font-sans: ${fontFamily.sans.join(", ")};`);
  properties.push(`  --${prefix}font-mono: ${fontFamily.mono.join(", ")};`);

  Object.entries(fontSize).forEach(([key, [size, lineHeight]]) => {
    properties.push(`  --${prefix}text-${key}: ${size};`);
    properties.push(`  --${prefix}text-${key}-line-height: ${lineHeight};`);
  });

  Object.entries(fontWeight).forEach(([key, value]) => {
    properties.push(`  --${prefix}font-${key}: ${value};`);
  });

  return `${selector} {\n${properties.join("\n")}\n}`;
}

/**
 * Create base CSS reset
 */
function createBaseCSSReset(): string {
  return `
/* Base CSS Reset for Theme System */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  font-family: var(--font-sans);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  font-feature-settings: "rlig" 1, "calt" 1;
}

/* Theme transition for smooth switching */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}`.trim();
}

// ===== Theme Detection Utilities =====

/**
 * Detect system theme preference
 */
export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Resolve theme mode to actual theme
 */
export function resolveTheme(
  mode: ThemeMode,
  systemTheme: "light" | "dark" = getSystemTheme()
): "light" | "dark" {
  return mode === "system" ? systemTheme : mode;
}

// ===== CSS Variable Utilities =====

/**
 * Get CSS custom property value
 */
export function getCSSVariable(name: string): string {
  if (typeof document === "undefined") return "";

  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${name}`)
    .trim();
}

/**
 * Set CSS custom property value
 */
export function setCSSVariable(name: string, value: string): void {
  if (typeof document === "undefined") return;

  document.documentElement.style.setProperty(`--${name}`, value);
}

// ===== Color Utilities =====

/**
 * Convert HSL color string to RGB values
 */
export function hslToRgb(
  hsl: string
): { r: number; g: number; b: number } | null {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match || !match[1] || !match[2] || !match[3]) return null;

  const hValue = parseInt(match[1], 10);
  const sValue = parseInt(match[2], 10);
  const lValue = parseInt(match[3], 10);

  // Validate parsed values
  if (isNaN(hValue) || isNaN(sValue) || isNaN(lValue)) return null;

  const h = hValue / 360;
  const s = sValue / 100;
  const l = lValue / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 1 / 6) {
    r = c;
    g = x;
    b = 0;
  } else if (1 / 6 <= h && h < 1 / 3) {
    r = x;
    g = c;
    b = 0;
  } else if (1 / 3 <= h && h < 1 / 2) {
    r = 0;
    g = c;
    b = x;
  } else if (1 / 2 <= h && h < 2 / 3) {
    r = 0;
    g = x;
    b = c;
  } else if (2 / 3 <= h && h < 5 / 6) {
    r = x;
    g = 0;
    b = c;
  } else if (5 / 6 <= h && h < 1) {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * Get contrasting color (black or white) for a given color
 */
export function getContrastColor(color: string): string {
  const rgb = hslToRgb(color);
  if (!rgb) return "#000000";

  // Calculate luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  return luminance > 0.5 ? "#000000" : "#ffffff";
}

// ===== Validation Utilities =====

/**
 * Validate theme mode
 */
export function isValidThemeMode(mode: string): mode is ThemeMode {
  return ["light", "dark", "system"].includes(mode);
}

/**
 * Validate theme configuration
 */
export function validateThemeConfig(config: any): config is ThemeConfig {
  return (
    config &&
    typeof config === "object" &&
    config.colors &&
    config.colors.light &&
    config.colors.dark &&
    config.spacing &&
    config.borderRadius &&
    config.typography
  );
}
