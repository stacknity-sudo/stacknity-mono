"use client";

import React from "react";
import cls from "./Badge.module.css";

type BadgeSize = "sm" | "md";

export type RoleBadgeProps = {
  label: string;
  color?: string | null; // hex or CSS color from DB (GlobalRoleDefinition.color)
  icon?: React.ReactNode | string | null; // DB may store an icon name; string will render as emoji/text
  size?: BadgeSize;
  maxWidth?: number | string; // to keep from affecting layout pacing
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  // When true, show a small colored dot instead of an icon
  dot?: boolean;
  // When label might be long, we can truncate it to avoid layout shifts
  truncate?: boolean;
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.replace(/^#/, "");
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16);
    const g = parseInt(h[1] + h[1], 16);
    const b = parseInt(h[2] + h[2], 16);
    return { r, g, b };
  }
  if (h.length === 6) {
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

function computeCssVars(color?: string | null): React.CSSProperties {
  // Accept hex/rgb/hsl/custom CSS vars; provide sensible contrast.
  if (!color) return {};
  const vars: Record<string, string> = { "--badge-fg": color };
  // try hex → rgba for bg/border transparency; else fallback to outline-only
  if (color.startsWith("#")) {
    const rgb = hexToRgb(color);
    if (rgb) {
      vars["--badge-bg"] = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`;
      vars["--badge-border"] = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`;
    }
  } else if (color.startsWith("rgb")) {
    // rgb/rgba: reuse as fg, use color-mix for bg if supported, otherwise keep transparent bg
    vars["--badge-bg"] = `color-mix(in srgb, ${color} 12%, transparent)`;
    vars["--badge-border"] = `color-mix(in srgb, ${color} 20%, transparent)`;
  } else if (color.startsWith("hsl")) {
    vars["--badge-bg"] = `color-mix(in oklab, ${color} 15%, transparent)`;
    vars["--badge-border"] = `color-mix(in oklab, ${color} 25%, transparent)`;
  }
  return vars as React.CSSProperties;
}

export default function Badge({
  label,
  color,
  icon,
  size = "sm",
  maxWidth,
  title,
  className,
  style,
  dot = false,
  truncate = true,
}: RoleBadgeProps) {
  const cssVars = computeCssVars(color);
  const mergedStyle: React.CSSProperties = {
    ...cssVars,
    ...(maxWidth != null ? { maxWidth } : null),
    ...style,
  };

  return (
    <span
      className={[cls.badge, cls[size], className].filter(Boolean).join(" ")}
      style={mergedStyle}
      title={title || label}
      aria-label={label}
    >
      {dot ? (
        <span className={cls.dot} aria-hidden />
      ) : icon ? (
        <span className={cls.icon} aria-hidden>
          {typeof icon === "string" ? icon : icon}
        </span>
      ) : null}
      <span className={[cls.label, truncate ? cls.truncate : ""].join(" ")}>
        {label}
      </span>
    </span>
  );
}
