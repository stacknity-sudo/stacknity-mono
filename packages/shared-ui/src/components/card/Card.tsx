"use client";

import React from "react";
import styles from "./Card.module.css";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "bordered" | "glass";
  padding?: "none" | "small" | "medium" | "large";
  clickable?: boolean;
  onClick?: () => void;
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right" | "between";
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  padding = "medium",
  clickable = false,
  onClick,
}) => {
  const cardClasses = [
    styles.card,
    styles[variant],
    styles[`padding-${padding}`],
    clickable && styles.clickable,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const cardProps = {
    className: cardClasses,
    ...(clickable && onClick && { onClick, role: "button", tabIndex: 0 }),
  };

  return <div {...cardProps}>{children}</div>;
};

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = "",
  actions,
}) => {
  return (
    <div className={`${styles.cardHeader} ${className}`}>
      <div className={styles.cardHeaderContent}>{children}</div>
      {actions && <div className={styles.cardHeaderActions}>{actions}</div>}
    </div>
  );
};

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = "",
}) => {
  return <div className={`${styles.cardContent} ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = "",
  align = "left",
}) => {
  return (
    <div
      className={`${styles.cardFooter} ${
        styles[`align-${align}`]
      } ${className}`}
    >
      {children}
    </div>
  );
};
