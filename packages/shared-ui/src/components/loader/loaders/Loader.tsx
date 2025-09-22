"use client";

import React, { forwardRef } from "react";
import { useTheme } from "@/providers/theme-provider";
import styles from "./Loader.module.css";

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Size of the loader */
  size?: "small" | "medium" | "large" | number;
  /** Primary color of the spinner */
  primaryColor?: string;
  /** Secondary color of the spinner */
  secondaryColor?: string;
  /** Animation speed in seconds */
  speed?: number;
  /** Show blur effect */
  showBlur?: boolean;
  /** Show glow effect */
  showGlow?: boolean;
  /** Variant using theme colors */
  variant?: "primary" | "secondary" | "accent" | "custom";
  /** Loader type */
  type?: "spinner" | "jelly-triangle";
}

export const Loader = forwardRef<HTMLDivElement, LoaderProps>(
  (
    {
      size = "medium",
      primaryColor,
      secondaryColor,
      speed = 3,
      showBlur = true,
      showGlow = true,
      variant = "primary",
      type = "spinner",
      className = "",
      style,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();

    // Size mapping
    const getSizeValue = (size: LoaderProps["size"]) => {
      if (typeof size === "number") return `${size}px`;

      switch (size) {
        case "small":
          return "60px";
        case "medium":
          return "100px";
        case "large":
          return "140px";
        default:
          return "100px";
      }
    };

    // Get inner ring size based on container size
    const getInnerSize = (containerSize: string) => {
      const numValue = parseInt(containerSize);
      return `${Math.floor(numValue * 0.3)}px`;
    };

    // Color variants
    const getColors = () => {
      if (primaryColor && secondaryColor) {
        return { primary: primaryColor, secondary: secondaryColor };
      }

      switch (variant) {
        case "primary":
          return {
            primary: "var(--color-primary, #1d6fe0)",
            secondary: "var(--vibrant-coral, #ff6b6b)",
          };
        case "secondary":
          return {
            primary: "var(--color-accent, #00b3a4)",
            secondary: "var(--golden-yellow, #ffce45)",
          };
        case "accent":
          return {
            primary: "var(--vibrant-coral, #ff6b6b)",
            secondary: "var(--bright-lime-green, #3ad29f)",
          };
        default:
          return {
            primary: "var(--color-primary, #1d6fe0)",
            secondary: "var(--vibrant-coral, #ff6b6b)",
          };
      }
    };

    const colors = getColors();
    const sizeValue = getSizeValue(size);
    const innerSize = getInnerSize(sizeValue);

    const loaderClasses = [
      type === "spinner" ? styles.spinner : styles.jellyTriangle,
      type === "spinner" && showBlur && styles.withBlur,
      type === "spinner" && showGlow && styles.withGlow,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const customStyle = {
      "--loader-size": sizeValue,
      "--inner-size": innerSize,
      "--first-color": colors.primary,
      "--second-color": colors.secondary,
      "--animation-speed": `${speed}s`,
      "--ring-speed": `${speed * 0.5}s`,
      "--uib-size": sizeValue,
      "--uib-speed": `${speed * 0.42}s`, // Adjusted for jelly animation
      "--uib-color": colors.primary,
      ...style,
    } as React.CSSProperties;

    const renderLoader = () => {
      if (type === "jelly-triangle") {
        return (
          <>
            <div className={styles.jellyTriangleDot}></div>
            <div className={styles.jellyTriangleTraveler}></div>
            <svg width="0" height="0" className={styles.jellyMaker}>
              <defs>
                <filter id="uib-jelly-triangle-ooze">
                  <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="7.3"
                    result="blur"
                  ></feGaussianBlur>
                  <feColorMatrix
                    in="blur"
                    mode="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                    result="ooze"
                  ></feColorMatrix>
                  <feBlend in="SourceGraphic" in2="ooze"></feBlend>
                </filter>
              </defs>
            </svg>
          </>
        );
      }

      // Default spinner
      return null;
    };

    return (
      <div
        ref={ref}
        className={loaderClasses}
        style={customStyle}
        data-theme={theme}
        {...props}
      >
        {renderLoader()}
      </div>
    );
  }
);

Loader.displayName = "Loader";

export default Loader;
