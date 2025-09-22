"use client";

import React, { forwardRef } from "react";
import styles from "./Input.module.css";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "outlined" | "minimal";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  leftIconColor?: string;
  rightIcon?: React.ReactNode;
  rightIconColor?: string;
  onRightIconClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      variant = "default",
      size = "medium",
      fullWidth = true,
      className = "",
      disabled,
      leftIcon,
      leftIconColor,
      rightIcon,
      rightIconColor,
      onRightIconClick,
      ...props
    },
    ref
  ) => {
    const inputClasses = [
      styles.input,
      styles[variant],
      styles[size],
      fullWidth && styles.fullWidth,
      disabled && styles.disabled,
      error && styles.error,
      leftIcon && styles.withLeftIcon,
      rightIcon && styles.withRightIcon,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const containerClasses = [styles.container, fullWidth && styles.fullWidth]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={containerClasses}>
        {label && (
          <label className={styles.label} htmlFor={props.id}>
            {label}
          </label>
        )}
        <div className={styles.inputWrapper}>
          {leftIcon && (
            <div
              className={styles.leftIcon}
              style={leftIconColor ? { color: leftIconColor } : undefined}
            >
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={inputClasses}
            disabled={disabled}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error
                ? `${props.id}-error`
                : helperText
                ? `${props.id}-helper`
                : undefined
            }
            {...props}
          />
          {rightIcon && (
            <button
              type="button"
              className={styles.rightIcon}
              onClick={onRightIconClick}
              style={rightIconColor ? { color: rightIconColor } : undefined}
              disabled={disabled}
            >
              {rightIcon}
            </button>
          )}
        </div>
        {error && (
          <span className={styles.errorText} id={`${props.id}-error`}>
            {error}
          </span>
        )}
        {helperText && !error && (
          <span className={styles.helperText} id={`${props.id}-helper`}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
