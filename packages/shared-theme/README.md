# @stacknity/shared-theme

A modern, comprehensive theme system for the Stacknity monorepo. Built with React 19, TypeScript 5.9, and modern CSS custom properties for seamless dark/light mode switching.

## Features

- 🎨 **Modern Design System**: Comprehensive color palette, spacing, typography, and component styling
- 🌓 **Dark/Light/System Modes**: Full theme switching with system preference detection
- ⚡ **React 19 Patterns**: Built with latest React patterns including useReducer and Context API
- 💾 **Persistent Storage**: Automatic localStorage persistence of theme preferences
- 🎯 **TypeScript First**: Fully typed with TypeScript 5.9 for excellent DX
- 🚀 **Performance Optimized**: CSS custom properties for instant theme switching
- ♿ **Accessibility Ready**: ARIA labels, keyboard navigation, and screen reader support
- 📱 **SSR Compatible**: Server-safe hooks and hydration handling

## Installation

```bash
npm install @stacknity/shared-theme
```

## Quick Start

### 1. Wrap your app with ThemeProvider

```tsx
import { ThemeProvider } from "@stacknity/shared-theme";

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

### 2. Use theme in components

```tsx
import { useTheme, ThemeToggle } from "@stacknity/shared-theme";

function MyComponent() {
  const { resolvedTheme, colors, state } = useTheme();

  return (
    <div>
      <p>Current theme: {resolvedTheme}</p>
      <ThemeToggle />
    </div>
  );
}
```

### 3. Use CSS custom properties

```css
.my-component {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}
```

## API Reference

### ThemeProvider

```tsx
interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode; // 'light' | 'dark' | 'system'
  config?: ThemeConfig;
  storageKey?: string;
}
```

### useTheme Hook

```tsx
const {
  state, // Full theme state
  setMode, // (mode: ThemeMode) => void
  setConfig, // (config: ThemeConfig) => void
  resolvedTheme, // 'light' | 'dark' (resolved from system)
  colors, // Current theme colors
} = useTheme();
```

### Components

#### ThemeToggle

Simple icon button that cycles through theme modes:

```tsx
<ThemeToggle size="md" />
```

#### ThemeToggleWithLabel

Toggle button with text label:

```tsx
<ThemeToggleWithLabel showLabel={true} labelPosition="right" />
```

#### ThemeSelect

Dropdown selector for theme modes:

```tsx
<ThemeSelect size="md" />
```

#### ThemeStatus

Status indicator showing current theme:

```tsx
<ThemeStatus showResolvedTheme={true} />
```

## CSS Custom Properties

The theme system automatically injects CSS custom properties:

### Colors

```css
--primary: hsl(221, 83%, 53%)
--primary-foreground: hsl(0, 0%, 98%)
--background: hsl(0, 0%, 100%)
--foreground: hsl(222, 84%, 5%)
/* ... and many more */
```

### Spacing

```css
--spacing-xs: 0.25rem
--spacing-sm: 0.5rem
--spacing-md: 1rem
--spacing-lg: 1.5rem
/* ... */
```

### Typography

```css
--font-sans: ui-sans-serif, system-ui, sans-serif
--text-base: 1rem
--text-base-line-height: 1.5rem
--font-medium: 500
/* ... */
```

### Border Radius

```css
--radius-sm: 0.125rem
--radius-md: 0.375rem
--radius-lg: 0.5rem
/* ... */
```

## Advanced Usage

### Custom Theme Configuration

```tsx
import { defaultThemeConfig } from "@stacknity/shared-theme";

const customConfig = {
  ...defaultThemeConfig,
  colors: {
    ...defaultThemeConfig.colors,
    light: {
      ...defaultThemeConfig.colors.light,
      primary: "hsl(142, 76%, 36%)", // Custom primary color
    },
  },
};

<ThemeProvider config={customConfig}>
  <App />
</ThemeProvider>;
```

### Server-Safe Usage

```tsx
import { useThemeSafe } from "@stacknity/shared-theme";

function ServerComponent() {
  const theme = useThemeSafe();

  if (!theme) {
    // Handle SSR case
    return <div>Loading...</div>;
  }

  return <div>Theme: {theme.resolvedTheme}</div>;
}
```

### Utilities

```tsx
import {
  getSystemTheme,
  resolveTheme,
  getCSSVariable,
  createThemeCSS,
} from "@stacknity/shared-theme";

// Detect system theme
const systemTheme = getSystemTheme(); // 'light' | 'dark'

// Resolve theme mode
const resolved = resolveTheme("system"); // 'light' | 'dark'

// Get CSS variable value
const primaryColor = getCSSVariable("primary");

// Generate complete CSS
const css = createThemeCSS(customConfig);
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```tsx
import type {
  ThemeMode,
  ThemeColors,
  ThemeConfig,
  ThemeSpacing,
  ThemeTypography,
} from "@stacknity/shared-theme";
```

## Framework Integration

### Next.js App Router

```tsx
// app/layout.tsx
import { ThemeProvider } from "@stacknity/shared-theme";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

### Tailwind CSS Integration

Add to your `tailwind.config.js`:

```js
module.exports = {
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // ... map all CSS variables
      },
    },
  },
};
```

## Contributing

Built with modern development practices:

- React 19 patterns and hooks
- TypeScript 5.9 with strict mode
- ESM/CJS dual package support
- Zero dependencies (peer deps only)

## License

MIT © Stacknity
