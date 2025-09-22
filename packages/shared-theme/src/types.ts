/**
 * Modern Theme System Types
 * Using latest TypeScript 5.9 features
 */

// ===== Theme Configuration =====

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeColors {
  // Primary colors
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;

  // Neutral colors
  background: string;
  foreground: string;
  muted: string;
  "muted-foreground": string;

  // UI colors
  card: string;
  "card-foreground": string;
  popover: string;
  "popover-foreground": string;
  border: string;
  input: string;
  ring: string;

  // State colors
  destructive: string;
  "destructive-foreground": string;
  warning: string;
  "warning-foreground": string;
  success: string;
  "success-foreground": string;
  info: string;
  "info-foreground": string;
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  "3xl": string;
}

export interface ThemeBorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface ThemeTypography {
  fontFamily: {
    sans: string[];
    mono: string[];
  };
  fontSize: {
    xs: [string, string];
    sm: [string, string];
    base: [string, string];
    lg: [string, string];
    xl: [string, string];
    "2xl": [string, string];
    "3xl": [string, string];
    "4xl": [string, string];
  };
  fontWeight: {
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
}

export interface ThemeConfig {
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  typography: ThemeTypography;
}

// ===== Theme Context Types =====

export interface ThemeContextValue {
  mode: ThemeMode;
  actualMode: "light" | "dark"; // Resolved mode (system -> light/dark)
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  colors: ThemeColors;
  config: ThemeConfig;
}

// ===== Component Props =====

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
  storageKey?: string;
  config?: Partial<ThemeConfig>;
}

export interface ThemeToggleProps {
  variant?: "icon" | "button" | "select";
  size?: "sm" | "md" | "lg";
  className?: string;
}

// ===== CSS Custom Properties =====

export type CSSCustomProperties = {
  [K in keyof ThemeColors as `--${K}`]: string;
} & {
  [K in keyof ThemeSpacing as `--spacing-${K}`]: string;
} & {
  [K in keyof ThemeBorderRadius as `--radius-${K}`]: string;
};

// ===== Utility Types =====

export type ThemeColorKey = keyof ThemeColors;
export type ThemeSpacingKey = keyof ThemeSpacing;
export type ThemeBorderRadiusKey = keyof ThemeBorderRadius;
