"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import styles from "./StacknityLoader.module.css";

interface StacknityLoaderProps {
  /** Size of the loader (small, medium, large) */
  size?: "small" | "medium" | "large";
  /** Color variant (primary, secondary, accent) */
  variant?: "primary" | "secondary" | "accent";
  /** Show the company name */
  showName?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Animation speed in milliseconds (default: 2500) */
  speed?: number;
  /** Loader style variant */
  type?: "default" | "pulse" | "wave" | "gradient" | "typewriter" | "fill-up";
  /** Display inline instead of full-page overlay */
  inline?: boolean;
}

export const StacknityLoader: React.FC<StacknityLoaderProps> = ({
  size = "medium",
  variant = "primary",
  showName = true,
  className = "",
  speed = 2500,
  type = "default",
  inline = false,
}) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add a slight delay to trigger the entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Letters for the staggered animation
  const letters = ["S", "T", "A", "C", "K", "N", "I", "T", "Y"];

  // Render different loader types
  const renderLoader = () => {
    switch (type) {
      case "pulse":
        return (
          <>
            <div className={styles.pulseContainer}>
              {letters.map((letter, index) => (
                <span
                  key={index}
                  className={styles.pulseLetter}
                  style={
                    {
                      "--index": index,
                      "--delay": `${index * 150}ms`,
                    } as React.CSSProperties
                  }
                >
                  {letter}
                </span>
              ))}
            </div>
          </>
        );

      case "wave":
        return (
          <>
            <div className={styles.waveContainer}>
              {letters.map((letter, index) => (
                <span
                  key={index}
                  className={styles.waveLetter}
                  style={
                    {
                      "--index": index,
                      "--delay": `${index * 100}ms`,
                    } as React.CSSProperties
                  }
                >
                  {letter}
                </span>
              ))}
            </div>
          </>
        );

      case "gradient":
        return (
          <>
            <div className={styles.gradientContainer}>
              <div className={styles.gradientSpinner}></div>
              <div
                className={styles.gradientText}
                style={
                  {
                    "--animation-speed": `${speed * 1.2}ms`,
                  } as React.CSSProperties
                }
              >
                STACKNITY
              </div>
            </div>
          </>
        );

      case "typewriter":
        return (
          <>
            <div className={styles.typewriterContainer}>
              <div className={styles.typewriterText}>
                <span
                  className={styles.typewriterContent}
                  style={
                    {
                      "--char-count": letters.length,
                      "--type-speed": `${speed * 0.4}ms`,
                    } as React.CSSProperties
                  }
                >
                  STACKNITY
                </span>
                <span className={styles.typewriterCursor}>|</span>
              </div>
            </div>
          </>
        );

      case "fill-up":
        return (
          <>
            <div className={styles.fillUpContainer}>
              <div className={styles.fillUpText}>
                <div className={styles.fillUpTextContent}>STACKNITY</div>
                <div
                  className={styles.fillUpFillingText}
                  style={
                    {
                      "--animation-speed": `${speed * 2}ms`,
                      "--fill-color": "rgba(0, 162, 255, 0.9)",
                    } as React.CSSProperties
                  }
                >
                  STACKNITY
                </div>
              </div>
              <div className={styles.bubblesContainer}>
                <div
                  className={styles.bubble1}
                  style={
                    {
                      "--animation-speed": `${speed * 2}ms`,
                    } as React.CSSProperties
                  }
                ></div>
                <div
                  className={styles.bubble2}
                  style={
                    {
                      "--animation-speed": `${speed * 2}ms`,
                    } as React.CSSProperties
                  }
                ></div>
                <div
                  className={styles.bubble3}
                  style={
                    {
                      "--animation-speed": `${speed * 2}ms`,
                    } as React.CSSProperties
                  }
                ></div>
                <div
                  className={styles.bubble4}
                  style={
                    {
                      "--animation-speed": `${speed * 2}ms`,
                    } as React.CSSProperties
                  }
                ></div>
                <div
                  className={styles.bubble5}
                  style={
                    {
                      "--animation-speed": `${speed * 2}ms`,
                    } as React.CSSProperties
                  }
                ></div>
                <div
                  className={styles.bubble6}
                  style={
                    {
                      "--animation-speed": `${speed * 2}ms`,
                    } as React.CSSProperties
                  }
                ></div>
              </div>
            </div>
          </>
        );

      case "default":
      default:
        return (
          <>
            <div className={styles.spinner}>
              <div className={styles.outerRing}></div>
              <div className={styles.middleRing}></div>
              <div className={styles.innerRing}></div>
              <div className={styles.dot}></div>
            </div>

            {showName && (
              <div className={styles.nameContainer}>
                {letters.map((letter, index) => (
                  <span
                    key={index}
                    className={styles.letter}
                    style={
                      {
                        "--index": index,
                        "--delay": `${index * 120}ms`,
                      } as React.CSSProperties
                    }
                  >
                    {letter}
                  </span>
                ))}
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div
      className={`${styles.container} ${inline ? styles.inline : ""} ${
        styles[size]
      } ${styles[variant]} ${styles[`type-${type}`]} ${className} ${
        isVisible ? styles.visible : ""
      }`}
      style={{ "--animation-speed": `${speed}ms` } as React.CSSProperties}
      data-theme={theme}
    >
      {renderLoader()}
    </div>
  );
};

// Also add a default export
export default StacknityLoader;
