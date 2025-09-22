/**
 * Modern Theme Toggle Components
 * Using latest React patterns, accessibility best practices, and modern icons
 */

import { forwardRef, type ButtonHTMLAttributes, useId } from "react";
import { useTheme } from "./theme-provider";
import type { ThemeMode } from "./types";
import styles from "./theme-toggle.module.css";

// ===== Modern SVG Icons with Better Accessibility =====

const SunIcon = ({
  className = "",
  size,
  ...props
}: {
  className?: string;
  size?: number;
} & React.SVGProps<SVGSVGElement>) => {
  const titleId = useId();
  const iconSize = size ?? 16;

  return (
    <svg
      className={className}
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-labelledby={titleId}
      {...props}
    >
      <title id={titleId}>Light theme</title>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
};

const MoonIcon = ({
  className = "",
  size,
  ...props
}: {
  className?: string;
  size?: number;
} & React.SVGProps<SVGSVGElement>) => {
  const titleId = useId();
  const iconSize = size ?? 16;

  return (
    <svg
      className={className}
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-labelledby={titleId}
      {...props}
    >
      <title id={titleId}>Dark theme</title>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
};

const SystemIcon = ({
  className = "",
  size,
  ...props
}: {
  className?: string;
  size?: number;
} & React.SVGProps<SVGSVGElement>) => {
  const titleId = useId();
  const iconSize = size ?? 16;

  return (
    <svg
      className={className}
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-labelledby={titleId}
      {...props}
    >
      <title id={titleId}>System theme</title>
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  );
};

// ===== Theme Utilities =====

const themeConfig = {
  light: {
    label: "Light",
    icon: SunIcon,
    next: "dark" as const,
  },
  dark: {
    label: "Dark",
    icon: MoonIcon,
    next: "system" as const,
  },
  system: {
    label: "System",
    icon: SystemIcon,
    next: "light" as const,
  },
} satisfies Record<
  ThemeMode,
  { label: string; icon: typeof SunIcon; next: ThemeMode }
>;

function getThemeConfig(mode: ThemeMode) {
  return themeConfig[mode];
}

function getThemeIcon(mode: ThemeMode, size?: number) {
  const { icon: Icon } = getThemeConfig(mode);
  return size !== undefined ? <Icon size={size} /> : <Icon />;
}

function getThemeLabel(mode: ThemeMode): string {
  return getThemeConfig(mode).label;
}

// ===== Size Configuration =====

const sizeConfig = {
  sm: { class: styles.sm, iconSize: 14 },
  md: { class: styles.md, iconSize: 16 },
  lg: { class: styles.lg, iconSize: 18 },
} as const;

// ===== Modern Theme Toggle Component =====

interface ThemeToggleProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onClick" | "children"
  > {
  size?: keyof typeof sizeConfig;
  variant?: "default" | "outline" | "ghost";
}

export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ className = "", size = "md", variant = "default", ...props }, ref) => {
    const { state, setMode, resolvedTheme } = useTheme();
    const config = sizeConfig[size];
    const { next: nextMode, label: currentLabel } = getThemeConfig(state.mode);
    const nextLabel = getThemeLabel(nextMode);

    const buttonClass = [styles.themeToggleButton, config.class, className]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type="button"
        className={buttonClass}
        onClick={() => setMode(nextMode)}
        title={`Switch to ${nextLabel} theme`}
        aria-label={`Current theme: ${currentLabel}. Switch to ${nextLabel} theme`}
        data-theme={state.mode}
        data-resolved-theme={resolvedTheme}
        {...props}
      >
        {getThemeIcon(state.mode, config.iconSize)}
      </button>
    );
  }
);

ThemeToggle.displayName = "ThemeToggle";

// ===== Theme Toggle with Label Component =====

interface ThemeToggleWithLabelProps extends ThemeToggleProps {
  showLabel?: boolean;
  labelPosition?: "left" | "right" | "top" | "bottom";
}

const layoutConfig = {
  left: styles.left,
  right: styles.right,
  top: styles.top,
  bottom: styles.bottom,
} as const;

export const ThemeToggleWithLabel = forwardRef<
  HTMLButtonElement,
  ThemeToggleWithLabelProps
>(
  (
    {
      className = "",
      size = "md",
      showLabel = true,
      labelPosition = "right",
      ...props
    },
    ref
  ) => {
    const { state, setMode, resolvedTheme } = useTheme();
    const config = sizeConfig[size];
    const layoutClass = layoutConfig[labelPosition];
    const { next: nextMode, label: currentLabel } = getThemeConfig(state.mode);
    const nextLabel = getThemeLabel(nextMode);

    const buttonClass = [
      styles.themeToggleButton,
      layoutClass,
      config.class,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type="button"
        className={buttonClass}
        onClick={() => setMode(nextMode)}
        title={`Switch to ${nextLabel} theme`}
        aria-label={`Current theme: ${currentLabel}. Switch to ${nextLabel} theme`}
        data-theme={state.mode}
        data-resolved-theme={resolvedTheme}
        {...props}
      >
        {getThemeIcon(state.mode, config.iconSize)}
        {showLabel && <span className={styles.label}>{currentLabel}</span>}
      </button>
    );
  }
);

ThemeToggleWithLabel.displayName = "ThemeToggleWithLabel";

// ===== Modern Theme Select Dropdown =====

interface ThemeSelectProps {
  className?: string;
  size?: keyof typeof sizeConfig;
}

export const ThemeSelect = forwardRef<HTMLSelectElement, ThemeSelectProps>(
  ({ className = "", size = "md" }, ref) => {
    const { state, setMode } = useTheme();
    const config = sizeConfig[size];
    const selectId = useId();

    const modes: ThemeMode[] = ["light", "dark", "system"];

    const selectClass = [
      styles.themeToggleButton,
      styles.select,
      config.class,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div>
        <label htmlFor={selectId} className="sr-only">
          Choose theme
        </label>
        <select
          ref={ref}
          id={selectId}
          className={selectClass}
          value={state.mode}
          onChange={(e) => setMode(e.target.value as ThemeMode)}
          aria-label="Select theme preference"
        >
          {modes.map((mode) => {
            const { label } = getThemeConfig(mode);
            return (
              <option key={mode} value={mode}>
                {label}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
);

ThemeSelect.displayName = "ThemeSelect";

// ===== Enhanced Theme Status Component =====

interface ThemeStatusProps {
  className?: string;
  showResolvedTheme?: boolean;
  showIcon?: boolean;
}

export function ThemeStatus({
  className = "",
  showResolvedTheme = false,
  showIcon = true,
}: ThemeStatusProps) {
  const { state, resolvedTheme } = useTheme();
  const statusId = useId();

  if (!state.isHydrated) {
    const loadingClass = [styles.themeStatus, styles.loading, className]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        className={loadingClass}
        aria-live="polite"
        aria-describedby={statusId}
      >
        <div className={styles.loadingIndicator} />
        <span id={statusId}>Loading theme...</span>
      </div>
    );
  }

  const { label: currentLabel } = getThemeConfig(state.mode);
  const statusClass = [styles.themeStatus, className].filter(Boolean).join(" ");

  return (
    <div
      className={statusClass}
      role="status"
      aria-live="polite"
      aria-describedby={statusId}
    >
      <div className={styles.activeIndicator} />
      {showIcon && getThemeIcon(state.mode, 14)}
      <span id={statusId}>
        {currentLabel}
        {showResolvedTheme && state.mode === "system" && resolvedTheme && (
          <span className={styles.resolvedTheme}>
            {" "}
            → {getThemeLabel(resolvedTheme as ThemeMode)}
          </span>
        )}
      </span>
    </div>
  );
}
