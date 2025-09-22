"use client";

import React, { forwardRef } from "react";
import styles from "./Checkbox.module.css";

export interface CheckboxProps {
  id?: string;
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  indeterminate?: boolean;
  error?: string;
  label?: string;
  description?: string;
  className?: string;
  variant?: "default" | "filled" | "switch";
  size?: "small" | "medium" | "large";
  color?: "primary" | "success" | "warning" | "danger";
  onChange?: (checked: boolean) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      name,
      checked,
      defaultChecked,
      disabled = false,
      required = false,
      indeterminate = false,
      error,
      label,
      description,
      className = "",
      variant = "default",
      size = "medium",
      color = "primary",
      onChange,
      onBlur,
      onFocus,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked);
    };

    const checkboxClasses = [
      styles.checkboxContainer,
      styles[variant],
      styles[size],
      styles[color],
      error && styles.error,
      disabled && styles.disabled,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const inputId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={checkboxClasses}>
        <div className={styles.checkboxWrapper}>
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            name={name}
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            required={required}
            className={styles.checkboxInput}
            onChange={handleChange}
            onBlur={onBlur}
            onFocus={onFocus}
            {...props}
          />
          <label htmlFor={inputId} className={styles.checkboxLabel}>
            <span className={styles.checkboxIndicator}>
              {variant === "switch" ? (
                <span className={styles.switchThumb} />
              ) : (
                <>
                  <span className={styles.checkmark}>
                    {indeterminate ? "−" : "✓"}
                  </span>
                </>
              )}
            </span>
            {(label || description) && (
              <span className={styles.labelContent}>
                {label && (
                  <span className={styles.labelText}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                  </span>
                )}
                {description && (
                  <span className={styles.description}>{description}</span>
                )}
              </span>
            )}
          </label>
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
