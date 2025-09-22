# Custom Font Setup Guide

This guide explains how to implement custom fonts globally across Platform and Tenant apps using the shared theme system.

## 🎯 **Best Approach for Global Custom Fonts**

### 1. **Shared Font Assets**

✅ **Your Current Setup**: You already have Outfit fonts in the correct location:

```
platform/
├── public/
│   └── fonts/
│       └── outfit/
│           ├── Outfit-Light.woff2     (300)
│           ├── Outfit-Regular.woff2   (400)
│           ├── Outfit-Medium.woff2    (500)
│           ├── Outfit-SemiBold.woff2  (600)
│           └── Outfit-Bold.woff2      (700)
```

Perfect! The theme system has been configured to use your existing Outfit font family.

### 2. **Configure Font System**

#### Option A: Use Your Outfit Fonts (Recommended)

The theme system is already configured to use your existing Outfit font family:

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
        <ThemeProvider loadFonts={true}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

This will automatically load:

- Outfit Light (300)
- Outfit Regular (400)
- Outfit Medium (500)
- Outfit SemiBold (600)
- Outfit Bold (700)

#### Option B: Custom Font Configuration

```tsx
// lib/fonts.ts
import { type FontConfig } from "@stacknity/shared-theme";

export const customFontConfig: FontConfig = {
  primary: {
    family: "Geist",
    fallbacks: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
    preload: true,
    variable: "--font-primary",
    variants: [
      {
        weight: 400,
        src: "/fonts/geist/Geist-Regular.woff2",
        display: "swap",
      },
      {
        weight: 500,
        src: "/fonts/geist/Geist-Medium.woff2",
        display: "swap",
      },
      {
        weight: 600,
        src: "/fonts/geist/Geist-SemiBold.woff2",
        display: "swap",
      },
    ],
  },
  mono: {
    family: "Geist Mono",
    fallbacks: ["JetBrains Mono", "ui-monospace", "monospace"],
    preload: false,
    variable: "--font-mono",
    variants: [
      {
        weight: 400,
        src: "/fonts/geist-mono/GeistMono-Regular.woff2",
        display: "swap",
      },
    ],
  },
};

// app/layout.tsx
import { ThemeProvider } from "@stacknity/shared-theme";
import { customFontConfig } from "@/lib/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider fontConfig={customFontConfig}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

### 3. **Font Preloading for Performance**

The theme system automatically generates preload tags. Add them to your Next.js layout:

```tsx
// app/layout.tsx
import { generatePreloadTags } from "@stacknity/shared-theme";
import { customFontConfig } from "@/lib/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const preloadTags = generatePreloadTags(customFontConfig);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {preloadTags.map((tag, index) => (
          <link
            key={index}
            rel="preload"
            href={tag.match(/href="([^"]*)"/)![1]}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ))}
      </head>
      <body>
        <ThemeProvider fontConfig={customFontConfig}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

### 4. **Using Fonts in CSS**

The theme system automatically generates CSS custom properties:

```css
/* Automatically available CSS variables */
.component {
  font-family: var(--font-primary); /* Your primary font */
  font-family: var(--font-mono); /* Your monospace font */
}

/* Or use specific families */
.heading {
  font-family: var(--font-sans); /* Fallback to system */
}
```

### 5. **Using Fonts in Components**

```tsx
// components/ui/text.tsx
import { useTheme } from "@stacknity/shared-theme";

export function Text({ children, variant = "body" }: TextProps) {
  const { state } = useTheme();

  return (
    <p
      className={cn(
        // Use CSS custom properties
        "font-[var(--font-primary)]",
        variant === "code" && "font-[var(--font-mono)]"
      )}
    >
      {children}
    </p>
  );
}
```

### 6. **Tailwind CSS Integration**

Add to your `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-primary)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
};
```

Now you can use: `<div className="font-sans">` or `<div className="font-mono">`

## 🔧 **Advanced Features**

### Font Loading with Progress

```tsx
import { useFontLoader } from "@stacknity/shared-theme";

function App() {
  const { fontsLoaded, loadingProgress } = useFontLoader(customFontConfig);

  if (!fontsLoaded) {
    return <div>Loading fonts... {loadingProgress.toFixed(0)}%</div>;
  }

  return <YourApp />;
}
```

### Dynamic Font Loading

```tsx
import { loadFont, waitForFont } from "@stacknity/shared-theme";

async function loadCustomFont() {
  const success = await waitForFont("Inter", 3000);
  if (success) {
    console.log("Font is ready!");
  }
}
```

### Font Validation

```tsx
import { isFontLoaded } from "@stacknity/shared-theme";

function FontStatus() {
  const isReady = isFontLoaded("Inter", "400");
  return <div>Font ready: {isReady ? "✅" : "⏳"}</div>;
}
```

## 🏗️ **Tenant App Implementation**

For tenant apps, simply import and use the same theme system:

```tsx
// tenant-app/app/layout.tsx
import { ThemeProvider } from "@stacknity/shared-theme";
import { customFontConfig } from "@stacknity/shared-theme"; // Or your own config

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider fontConfig={customFontConfig}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

## 📱 **Key Benefits**

1. **Consistent Typography**: Same fonts across Platform and Tenant apps
2. **Performance Optimized**: Automatic preloading, WOFF2 format, font-display: swap
3. **Modern Loading**: FontFace API with fallback support
4. **CSS Variables**: Dynamic theme-aware font loading
5. **TypeScript Safe**: Full type safety for font configurations
6. **Framework Agnostic**: Works with Next.js, Vite, or any React setup

## 🎨 **Recommended Font Stack**

```typescript
// Modern, professional font stack
export const recommendedFonts: FontConfig = {
  primary: {
    family: "Inter", // Clean, readable sans-serif
    fallbacks: ["system-ui", "sans-serif"],
  },
  mono: {
    family: "JetBrains Mono", // Developer-friendly monospace
    fallbacks: ["ui-monospace", "monospace"],
  },
  display: {
    family: "Cal Sans", // For headings/marketing
    fallbacks: ["Inter", "sans-serif"],
  },
};
```

This approach provides a robust, scalable font system that works seamlessly across your entire monorepo! 🚀
