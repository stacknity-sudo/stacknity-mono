/**
 * Custom Font System
 * Modern font loading and management for Platform and Tenant apps
 */

// ===== Font Configuration Types =====

export interface FontVariant {
  weight: number | string;
  style?: "normal" | "italic";
  stretch?: string;
  src: string | string[];
  unicodeRange?: string;
  display?: "auto" | "block" | "swap" | "fallback" | "optional";
}

export interface CustomFont {
  family: string;
  fallbacks: string[];
  variants: FontVariant[];
  preload?: boolean;
  variable?: string; // CSS variable name
}

export interface FontConfig {
  primary: CustomFont;
  secondary?: CustomFont;
  mono?: CustomFont;
  display?: CustomFont;
}

// ===== Default Font Configuration =====

export const defaultFontConfig: FontConfig = {
  // Primary font (Outfit)
  primary: {
    family: "Outfit",
    fallbacks: ["Roboto", "sans-serif"],
    preload: true,
    variable: "--font-primary",
    variants: [
      {
        weight: 300,
        style: "normal",
        src: "/fonts/outfit/Outfit-Light.woff2",
        display: "swap",
      },
      {
        weight: 400,
        style: "normal",
        src: "/fonts/outfit/Outfit-Regular.woff2",
        display: "swap",
      },
      {
        weight: 500,
        style: "normal",
        src: "/fonts/outfit/Outfit-Medium.woff2",
        display: "swap",
      },
      {
        weight: 600,
        style: "normal",
        src: "/fonts/outfit/Outfit-SemiBold.woff2",
        display: "swap",
      },
      {
        weight: 700,
        style: "normal",
        src: "/fonts/outfit/Outfit-Bold.woff2",
        display: "swap",
      },
    ],
  },
};

// ===== Font Loading Utilities =====

/**
 * Generate @font-face CSS rules
 */
export function generateFontFaceCSS(fontConfig: FontConfig): string {
  const cssRules: string[] = [];

  Object.values(fontConfig).forEach((font) => {
    if (!font) return;

    font.variants.forEach((variant: FontVariant) => {
      const srcArray = Array.isArray(variant.src) ? variant.src : [variant.src];
      const srcString = srcArray
        .map((src: string) => {
          const format = getFontFormat(src);
          return `url('${src}') format('${format}')`;
        })
        .join(", ");

      const fontFaceRule = `
@font-face {
  font-family: '${font.family}';
  font-weight: ${variant.weight};
  font-style: ${variant.style || "normal"};
  font-display: ${variant.display || "swap"};
  src: ${srcString};${
        variant.unicodeRange
          ? `\n  unicode-range: ${variant.unicodeRange};`
          : ""
      }
}`.trim();

      cssRules.push(fontFaceRule);
    });
  });

  return cssRules.join("\n\n");
}

/**
 * Generate CSS custom properties for font families
 */
export function generateFontVariables(fontConfig: FontConfig): string {
  const variables: string[] = [];

  Object.entries(fontConfig).forEach(([key, font]) => {
    if (!font) return;

    const fullFontStack = [`"${font.family}"`, ...font.fallbacks].join(", ");

    const variableName = font.variable || `--font-${key}`;
    variables.push(`  ${variableName}: ${fullFontStack};`);
  });

  return variables.join("\n");
}

/**
 * Generate preload link tags for critical fonts
 */
/**
 * Generate <link rel="preload"> tags for critical font resources.
 * By default only the regular (400) weight is preloaded to balance performance.
 * Pass allVariants=true to preload every declared variant (may increase bandwidth usage).
 */
export function generatePreloadTags(
  fontConfig: FontConfig,
  allVariants = false
): string[] {
  const preloadTags: string[] = [];

  Object.values(fontConfig).forEach((font) => {
    if (!font || !font.preload) return;
    const variantsToPreload: FontVariant[] = allVariants
      ? font.variants
      : [
          font.variants.find(
            (v: FontVariant) => v.weight === 400 || v.weight === "normal"
          ) || font.variants[0],
        ];

    variantsToPreload.forEach((variant) => {
      if (!variant) return;
      const src = Array.isArray(variant.src) ? variant.src[0] : variant.src;
      // Assume woff2 for now (most of the provided files). If needed, could infer type.
      preloadTags.push(
        `<link rel="preload" href="${src}" as="font" type="font/woff2" crossorigin="anonymous" />`
      );
    });
  });

  return preloadTags;
}

/**
 * Load fonts dynamically with FontFace API
 */
export async function loadFont(
  font: CustomFont,
  variant: FontVariant
): Promise<FontFace | null> {
  if (!("FontFace" in window)) {
    console.warn("FontFace API not supported");
    return null;
  }

  try {
    const src = Array.isArray(variant.src) ? variant.src[0] : variant.src;

    const fontFace = new FontFace(font.family, `url(${src})`, {
      weight: variant.weight.toString(),
      style: variant.style || "normal",
      display: variant.display || "swap",
    });

    await fontFace.load();
    document.fonts.add(fontFace);

    return fontFace;
  } catch (error) {
    console.error(`Failed to load font ${font.family}:`, error);
    return null;
  }
}

/**
 * Load all fonts from configuration
 */
export async function loadAllFonts(fontConfig: FontConfig): Promise<void> {
  const loadPromises: Promise<FontFace | null>[] = [];

  Object.values(fontConfig).forEach((font) => {
    if (!font) return;

    font.variants.forEach((variant: FontVariant) => {
      loadPromises.push(loadFont(font, variant));
    });
  });

  try {
    await Promise.allSettled(loadPromises);
    console.log("All fonts loaded successfully");
  } catch (error) {
    console.error("Some fonts failed to load:", error);
  }
}

// ===== Font Utilities =====

/**
 * Get font format from file extension
 */
function getFontFormat(src: string): string {
  const extension = src.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "woff2":
      return "woff2";
    case "woff":
      return "woff";
    case "ttf":
      return "truetype";
    case "otf":
      return "opentype";
    case "eot":
      return "embedded-opentype";
    default:
      return "woff2";
  }
}

/**
 * Check if font is loaded
 */
export function isFontLoaded(fontFamily: string, weight = "400"): boolean {
  if (!document.fonts.check) return false;

  return document.fonts.check(`${weight} 12px "${fontFamily}"`);
}

/**
 * Wait for font to be ready
 */
export function waitForFont(
  fontFamily: string,
  timeout = 3000,
  weight = "400"
): Promise<boolean> {
  return new Promise((resolve) => {
    const startTime = Date.now();

    function checkFont() {
      if (isFontLoaded(fontFamily, weight)) {
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        resolve(false);
      } else {
        requestAnimationFrame(checkFont);
      }
    }

    checkFont();
  });
}

// ===== React Hook for Font Loading =====

export function useFontLoader(fontConfig: FontConfig) {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  const [loadingProgress, setLoadingProgress] = React.useState(0);

  React.useEffect(() => {
    let mounted = true;

    async function loadFonts() {
      const fonts = Object.values(fontConfig).filter(Boolean);
      const totalVariants = fonts.reduce(
        (sum, font) => sum + font.variants.length,
        0
      );
      let loadedCount = 0;

      for (const font of fonts) {
        for (const variant of font.variants) {
          if (!mounted) return;

          await loadFont(font, variant);
          loadedCount++;

          if (mounted) {
            setLoadingProgress((loadedCount / totalVariants) * 100);
          }
        }
      }

      if (mounted) {
        setFontsLoaded(true);
      }
    }

    loadFonts();

    return () => {
      mounted = false;
    };
  }, [fontConfig]);

  return { fontsLoaded, loadingProgress };
}

// Import React for the hook
import React from "react";
