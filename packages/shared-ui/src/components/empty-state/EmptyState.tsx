"use client";

import React from "react";
import { ThemedButton } from "@/components/UI/button/ThemedButton";
import styles from "./EmptyState.module.css";

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "small" | "medium" | "large";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string | React.ReactNode;
  actions?: EmptyStateAction[];
  className?: string;
  size?: "small" | "medium" | "large";
}

export function EmptyState({
  icon,
  title,
  description,
  actions = [],
  className = "",
  size = "medium",
}: EmptyStateProps) {
  const sizeClass = {
    small: styles.emptyStateSmall,
    medium: styles.emptyState,
    large: styles.emptyStateLarge,
  }[size];

  const containerClasses = [sizeClass, className].filter(Boolean).join(" ");

  return (
    <div className={containerClasses}>
      <div className={styles.content}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.description}>
          {typeof description === "string" ? <p>{description}</p> : description}
        </div>
        {actions.length > 0 && (
          <div className={styles.actions}>
            {actions.map((action, index) => (
              <ThemedButton
                key={index}
                variant={action.variant || "primary"}
                size={action.size || "medium"}
                onClick={action.onClick}
                leftIcon={action.leftIcon}
                rightIcon={action.rightIcon}
              >
                {action.label}
              </ThemedButton>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
