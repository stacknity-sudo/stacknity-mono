/**
 * Default Theme Configuration
 * Modern design system with CSS custom properties and custom fonts
 */

import type { ThemeConfig } from "./types";

export const defaultThemeConfig: ThemeConfig = {
  colors: {
    light: {
      // Primary colors
      primary: "hsl(221, 83%, 53%)", // Blue
      "primary-foreground": "hsl(0, 0%, 98%)",
      secondary: "hsl(210, 40%, 96%)",
      "secondary-foreground": "hsl(222, 84%, 5%)",

      // Neutral colors
      background: "hsl(0, 0%, 100%)",
      foreground: "hsl(222, 84%, 5%)",
      muted: "hsl(210, 40%, 96%)",
      "muted-foreground": "hsl(215, 16%, 47%)",

      // UI colors
      card: "hsl(0, 0%, 100%)",
      "card-foreground": "hsl(222, 84%, 5%)",
      popover: "hsl(0, 0%, 100%)",
      "popover-foreground": "hsl(222, 84%, 5%)",
      border: "hsl(214, 32%, 91%)",
      input: "hsl(214, 32%, 91%)",
      ring: "hsl(221, 83%, 53%)",

      // State colors
      destructive: "hsl(0, 84%, 60%)",
      "destructive-foreground": "hsl(0, 0%, 98%)",
      warning: "hsl(38, 92%, 50%)",
      "warning-foreground": "hsl(0, 0%, 98%)",
      success: "hsl(142, 76%, 36%)",
      "success-foreground": "hsl(0, 0%, 98%)",
      info: "hsl(199, 89%, 48%)",
      "info-foreground": "hsl(0, 0%, 98%)",
    },
    dark: {
      // Primary colors
      primary: "hsl(221, 83%, 53%)",
      "primary-foreground": "hsl(0, 0%, 98%)",
      secondary: "hsl(217, 33%, 17%)",
      "secondary-foreground": "hsl(0, 0%, 98%)",

      // Neutral colors
      background: "hsl(222, 84%, 5%)",
      foreground: "hsl(0, 0%, 98%)",
      muted: "hsl(217, 33%, 17%)",
      "muted-foreground": "hsl(215, 20%, 65%)",

      // UI colors
      card: "hsl(222, 84%, 5%)",
      "card-foreground": "hsl(0, 0%, 98%)",
      popover: "hsl(222, 84%, 5%)",
      "popover-foreground": "hsl(0, 0%, 98%)",
      border: "hsl(217, 33%, 17%)",
      input: "hsl(217, 33%, 17%)",
      ring: "hsl(221, 83%, 53%)",

      // State colors
      destructive: "hsl(0, 62%, 30%)",
      "destructive-foreground": "hsl(0, 0%, 98%)",
      warning: "hsl(38, 92%, 50%)",
      "warning-foreground": "hsl(222, 84%, 5%)",
      success: "hsl(142, 76%, 36%)",
      "success-foreground": "hsl(0, 0%, 98%)",
      info: "hsl(199, 89%, 48%)",
      "info-foreground": "hsl(0, 0%, 98%)",
    },
  },
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
  },
  borderRadius: {
    none: "0",
    sm: "0.125rem", // 2px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    full: "9999px",
  },
  typography: {
    fontFamily: {
      sans: [
        "ui-sans-serif",
        "system-ui",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
      mono: [
        "ui-monospace",
        "SFMono-Regular",
        '"Menlo"',
        '"Monaco"',
        '"Consolas"',
        '"Liberation Mono"',
        '"Courier New"',
        "monospace",
      ],
    },
    fontSize: {
      xs: ["0.75rem", "1rem"], // 12px, 16px line-height
      sm: ["0.875rem", "1.25rem"], // 14px, 20px line-height
      base: ["1rem", "1.5rem"], // 16px, 24px line-height
      lg: ["1.125rem", "1.75rem"], // 18px, 28px line-height
      xl: ["1.25rem", "1.75rem"], // 20px, 28px line-height
      "2xl": ["1.5rem", "2rem"], // 24px, 32px line-height
      "3xl": ["1.875rem", "2.25rem"], // 30px, 36px line-height
      "4xl": ["2.25rem", "2.5rem"], // 36px, 40px line-height
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },
};

// ===== CSS Custom Properties Generator =====

export function generateCSSCustomProperties(
  colors: any,
  config: ThemeConfig
): string {
  const properties: string[] = [];

  // Color properties
  Object.entries(colors).forEach(([key, value]) => {
    properties.push(`  --${key}: ${value};`);
  });

  // Spacing properties
  Object.entries(config.spacing).forEach(([key, value]) => {
    properties.push(`  --spacing-${key}: ${value};`);
  });

  // Border radius properties
  Object.entries(config.borderRadius).forEach(([key, value]) => {
    properties.push(`  --radius-${key}: ${value};`);
  });

  // Typography properties
  properties.push(
    `  --font-sans: ${config.typography.fontFamily.sans.join(", ")};`
  );
  properties.push(
    `  --font-mono: ${config.typography.fontFamily.mono.join(", ")};`
  );

  Object.entries(config.typography.fontSize).forEach(
    ([key, [size, lineHeight]]) => {
      properties.push(`  --text-${key}: ${size};`);
      properties.push(`  --text-${key}-line-height: ${lineHeight};`);
    }
  );

  Object.entries(config.typography.fontWeight).forEach(([key, value]) => {
    properties.push(`  --font-${key}: ${value};`);
  });

  return properties.join("\n");
}
