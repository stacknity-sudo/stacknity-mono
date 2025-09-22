import React from "react";
import styles from "./Skeleton.module.css";

export interface SkeletonProps {
  /** Width of the skeleton */
  width?: string | number;
  /** Height of the skeleton */
  height?: string | number;
  /** Border radius */
  radius?: "sm" | "md" | "lg" | "xl" | "full";
  /** Animation type */
  animation?: "pulse" | "wave" | "none";
  /** Background color intensity */
  intensity?: "light" | "medium" | "dark";
  /** Show border */
  bordered?: boolean;
  /** Border style */
  borderStyle?: "solid" | "dashed" | "dotted";
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "1rem",
  radius = "md",
  animation = "wave",
  intensity = "medium",
  bordered = false,
  borderStyle = "solid",
  className = "",
  style = {},
}) => {
  const skeletonStyle: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    border: bordered ? `1px ${borderStyle} var(--border-primary)` : undefined,
    ...style,
  };

  return (
    <div
      className={`${styles.skeleton} ${styles[`radius-${radius}`]} ${
        styles[`animation-${animation}`]
      } ${styles[`intensity-${intensity}`]} ${className}`}
      style={skeletonStyle}
      aria-hidden="true"
    />
  );
};

// Compound components for common skeleton patterns
export const SkeletonText: React.FC<{
  lines?: number;
  width?: string;
  intensity?: "light" | "medium" | "dark";
  animation?: "pulse" | "wave" | "none";
  radius?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}> = ({
  lines = 3,
  width = "100%",
  intensity = "medium",
  animation = "wave",
  radius = "md",
  className = "",
}) => (
  <div className={`${styles.textContainer} ${className}`}>
    {Array.from({ length: lines }, (_, i) => (
      <Skeleton
        key={i}
        height="1rem"
        width={i === lines - 1 ? "75%" : width}
        intensity={intensity}
        animation={animation}
        radius={radius}
        className={styles.textLine}
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{
  showAvatar?: boolean;
  lines?: number;
  intensity?: "light" | "medium" | "dark";
  animation?: "pulse" | "wave" | "none";
  radius?: "sm" | "md" | "lg" | "xl" | "full";
  bordered?: boolean;
  className?: string;
}> = ({
  showAvatar = false,
  lines = 3,
  intensity = "medium",
  animation = "wave",
  radius = "md",
  bordered = true,
  className = "",
}) => (
  <div
    className={`${styles.cardContainer} ${className}`}
    style={{
      border: bordered ? "1px solid var(--border-primary)" : "none",
      backgroundColor: bordered ? "var(--card-background)" : "transparent",
    }}
  >
    {showAvatar && (
      <div className={styles.avatarContainer}>
        <Skeleton
          width={40}
          height={40}
          radius="full"
          intensity={intensity}
          animation={animation}
        />
        <div className={styles.avatarContent}>
          <Skeleton
            height="1rem"
            width="60%"
            intensity={intensity}
            animation={animation}
            radius={radius}
          />
          <Skeleton
            height="0.875rem"
            width="40%"
            intensity={intensity}
            animation={animation}
            radius={radius}
          />
        </div>
      </div>
    )}
    <SkeletonText
      lines={lines}
      intensity={intensity}
      animation={animation}
      radius={radius}
    />
  </div>
);

export const SkeletonButton: React.FC<{
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
  intensity?: "light" | "medium" | "dark";
  animation?: "pulse" | "wave" | "none";
  radius?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}> = ({
  size = "md",
  intensity = "medium",
  animation = "wave",
  radius = "md",
  className = "",
}) => {
  const heights = { sm: "2rem", md: "2.5rem", lg: "3rem" };
  const widths = { sm: "5rem", md: "7rem", lg: "9rem" };

  return (
    <Skeleton
      height={heights[size]}
      width={widths[size]}
      radius={radius}
      intensity={intensity}
      animation={animation}
      className={className}
    />
  );
};
