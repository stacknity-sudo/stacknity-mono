/**
 * Theme Context Provider using React 19 patterns
 * Provides theme state management with localStorage persistence and font loading
 */

"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
  type Dispatch,
} from "react";

import type { ThemeMode, ThemeConfig, ThemeColors } from "./types";
import { defaultThemeConfig, generateCSSCustomProperties } from "./config";
import {
  type FontConfig,
  defaultFontConfig,
  generateFontVariables,
  generateFontFaceCSS,
  loadAllFonts,
} from "./fonts";

// ===== Theme State =====

interface ThemeState {
  mode: ThemeMode;
  config: ThemeConfig;
  fontConfig: FontConfig;
  systemPreference: "light" | "dark";
  isHydrated: boolean;
  fontsLoaded: boolean;
}

type ThemeAction =
  | { type: "SET_MODE"; mode: ThemeMode }
  | { type: "SET_CONFIG"; config: ThemeConfig }
  | { type: "SET_FONT_CONFIG"; fontConfig: FontConfig }
  | { type: "SET_SYSTEM_PREFERENCE"; preference: "light" | "dark" }
  | { type: "SET_FONTS_LOADED"; loaded: boolean }
  | { type: "HYDRATE" };

// ===== Theme Reducer =====

function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.mode };

    case "SET_CONFIG":
      return { ...state, config: action.config };

    case "SET_FONT_CONFIG":
      return { ...state, fontConfig: action.fontConfig };

    case "SET_SYSTEM_PREFERENCE":
      return { ...state, systemPreference: action.preference };

    case "SET_FONTS_LOADED":
      return { ...state, fontsLoaded: action.loaded };

    case "HYDRATE":
      return { ...state, isHydrated: true };

    default:
      return state;
  }
}

// ===== Theme Context =====

interface ThemeContextValue {
  state: ThemeState;
  dispatch: Dispatch<ThemeAction>;
  setMode: (mode: ThemeMode) => void;
  setConfig: (config: ThemeConfig) => void;
  setFontConfig: (fontConfig: FontConfig) => void;
  resolvedTheme: "light" | "dark";
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ===== Theme Provider =====

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
  config?: ThemeConfig;
  fontConfig?: FontConfig;
  storageKey?: string;
  loadFonts?: boolean;
}

export function ThemeProvider({
  children,
  defaultMode = "system",
  config = defaultThemeConfig,
  fontConfig = defaultFontConfig,
  storageKey = "stacknity-theme",
  loadFonts = true,
}: ThemeProviderProps) {
  // Initialize state
  const [state, dispatch] = useReducer(themeReducer, {
    mode: defaultMode,
    config,
    fontConfig,
    systemPreference: "light",
    isHydrated: false,
    fontsLoaded: false,
  });

  // ===== System Preference Detection =====

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemPreference = () => {
      dispatch({
        type: "SET_SYSTEM_PREFERENCE",
        preference: mediaQuery.matches ? "dark" : "light",
      });
    };

    updateSystemPreference();
    mediaQuery.addEventListener("change", updateSystemPreference);

    return () =>
      mediaQuery.removeEventListener("change", updateSystemPreference);
  }, []);

  // ===== LocalStorage Persistence =====

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsedTheme = JSON.parse(stored) as { mode: ThemeMode };
        dispatch({ type: "SET_MODE", mode: parsedTheme.mode });
      }
    } catch (error) {
      console.warn("Failed to load theme from localStorage:", error);
    } finally {
      dispatch({ type: "HYDRATE" });
    }
  }, [storageKey]);

  useEffect(() => {
    if (state.isHydrated) {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ mode: state.mode }));
      } catch (error) {
        console.warn("Failed to save theme to localStorage:", error);
      }
    }
  }, [state.mode, state.isHydrated, storageKey]);

  // ===== Font Loading =====

  useEffect(() => {
    if (!state.isHydrated || !loadFonts) {
      if (!loadFonts) {
        dispatch({ type: "SET_FONTS_LOADED", loaded: true });
      }
      return;
    }

    let mounted = true;

    async function loadFontsAsync() {
      try {
        await loadAllFonts(state.fontConfig);
        if (mounted) {
          dispatch({ type: "SET_FONTS_LOADED", loaded: true });
        }
      } catch (error) {
        console.error("Failed to load fonts:", error);
        if (mounted) {
          dispatch({ type: "SET_FONTS_LOADED", loaded: true }); // Continue anyway
        }
      }
    }

    loadFontsAsync();

    return () => {
      mounted = false;
    };
  }, [state.isHydrated, state.fontConfig, loadFonts]);

  // ===== Resolved Theme Calculation =====

  const resolvedTheme = useMemo<"light" | "dark">(() => {
    if (state.mode === "system") {
      return state.systemPreference;
    }
    return state.mode;
  }, [state.mode, state.systemPreference]);

  // ===== CSS Custom Properties Injection =====

  useEffect(() => {
    if (!state.isHydrated) return;

    const colors = state.config.colors[resolvedTheme];
    const cssProperties = generateCSSCustomProperties(colors, state.config);
    const fontVariables = generateFontVariables(state.fontConfig);
    const fontFaces = generateFontFaceCSS(state.fontConfig);

    // Create or update style elements
    let themeStyleElement = document.getElementById(
      "theme-variables"
    ) as HTMLStyleElement;
    let fontStyleElement = document.getElementById(
      "font-faces"
    ) as HTMLStyleElement;

    if (!themeStyleElement) {
      themeStyleElement = document.createElement("style");
      themeStyleElement.id = "theme-variables";
      document.head.appendChild(themeStyleElement);
    }

    if (!fontStyleElement) {
      fontStyleElement = document.createElement("style");
      fontStyleElement.id = "font-faces";
      document.head.appendChild(fontStyleElement);
    }

    // Update content
    themeStyleElement.textContent = `:root {\n${cssProperties}\n${fontVariables}\n}`;
    fontStyleElement.textContent = fontFaces;

    // Update document class for theme-specific styles
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(resolvedTheme);
    document.documentElement.setAttribute("data-theme", resolvedTheme);

    return () => {
      // Cleanup on unmount
      const themeElement = document.getElementById("theme-variables");
      const fontElement = document.getElementById("font-faces");
      if (themeElement) themeElement.remove();
      if (fontElement) fontElement.remove();
    };
  }, [state.config, state.fontConfig, resolvedTheme, state.isHydrated]);

  // ===== Action Creators =====

  const setMode = useCallback((mode: ThemeMode) => {
    dispatch({ type: "SET_MODE", mode });
  }, []);

  const setConfig = useCallback((config: ThemeConfig) => {
    dispatch({ type: "SET_CONFIG", config });
  }, []);

  const setFontConfig = useCallback((fontConfig: FontConfig) => {
    dispatch({ type: "SET_FONT_CONFIG", fontConfig });
  }, []);

  // ===== Context Value =====

  const value = useMemo<ThemeContextValue>(
    () => ({
      state,
      dispatch,
      setMode,
      setConfig,
      setFontConfig,
      resolvedTheme,
      colors: state.config.colors[resolvedTheme],
    }),
    [state, setMode, setConfig, setFontConfig, resolvedTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// ===== Theme Hook =====

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

// ===== Server-Safe Theme Hook =====

export function useThemeSafe(): ThemeContextValue | null {
  try {
    return useTheme();
  } catch {
    return null;
  }
}
