"use client";

import React, { forwardRef } from "react";
import styles from "./Textarea.module.css";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  description?: string;
  className?: string;
  variant?: "default" | "filled" | "gradient";
  size?: "small" | "medium" | "large";
  resize?: "none" | "vertical" | "horizontal" | "both";
  autoResize?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id,
      name,
      value,
      defaultValue,
      placeholder,
      disabled = false,
      required = false,
      error,
      label,
      description,
      className = "",
      variant = "default",
      size = "medium",
      resize = "vertical",
      autoResize = false,
      maxLength,
      showCharCount = false,
      onChange,
      onBlur,
      onFocus,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
      }
      onChange?.(e);
    };

    const containerClasses = [
      styles.textareaContainer,
      error && styles.error,
      disabled && styles.disabled,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const textareaClasses = [
      styles.textarea,
      styles[variant],
      styles[size],
      styles[`resize-${resize}`],
    ]
      .filter(Boolean)
      .join(" ");

    const currentLength = value?.length || defaultValue?.length || 0;
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}

        {description && <p className={styles.description}>{description}</p>}

        <div className={styles.textareaWrapper}>
          <textarea
            ref={ref}
            id={inputId}
            name={name}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            className={textareaClasses}
            onChange={handleChange}
            onBlur={onBlur}
            onFocus={onFocus}
            {...props}
          />

          {showCharCount && maxLength && (
            <div className={styles.charCount}>
              <span
                className={currentLength > maxLength ? styles.overLimit : ""}
              >
                {currentLength}
              </span>
              <span>/{maxLength}</span>
            </div>
          )}
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
