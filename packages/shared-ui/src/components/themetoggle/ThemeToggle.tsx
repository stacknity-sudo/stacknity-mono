"use client";

import React from "react";
import { useTheme } from "@/providers/theme-provider";
import { FiMoon, FiSun } from "react-icons/fi";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle(): React.ReactElement {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={styles.themeToggle}
    >
      {resolvedTheme === "dark" ? (
        <FiSun className={styles.icon} />
      ) : (
        <FiMoon className={styles.icon} />
      )}
      <span className={styles.label}>
        {resolvedTheme === "dark" ? "Light" : "Dark"}
      </span>
    </button>
  );
}
