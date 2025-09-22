"use client";

import { ThemeToggle } from "@stacknity/shared-theme/client";
import styles from "./theme-toggle-button.module.css";

export function ThemeToggleButton() {
  return (
    <div className={styles.floatingToggle}>
      <ThemeToggle size="md" className={styles.premiumButton} />
    </div>
  );
}

export default ThemeToggleButton;
