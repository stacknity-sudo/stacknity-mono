"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import styles from "./Select.module.css";
import { ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
}

export interface SelectProps {
  id?: string;
  name?: string;
  value?: string | string[];
  defaultValue?: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  description?: string;
  className?: string;
  variant?: "default" | "filled" | "gradient";
  size?: "xsmall" | "small" | "medium" | "large";
  fullWidth?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  portal?: boolean;
  onChange?: (value: string | string[]) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

export const Select: React.FC<SelectProps> = ({
  id,
  name,
  value,
  defaultValue,
  options,
  placeholder = "Select an option...",
  disabled = false,
  required = false,
  error,
  label,
  description,
  className = "",
  variant = "default",
  size = "medium",
  fullWidth = true,
  searchable = false,
  multiple = false,
  portal = true,
  onChange,
  onBlur,
  onFocus,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(() => {
    if (multiple) {
      if (Array.isArray(value)) {
        return value;
      } else if (typeof value === "string") {
        return [value];
      } else {
        return [];
      }
    } else {
      if (typeof value === "string") {
        return [value];
      } else if (typeof defaultValue === "string") {
        return [defaultValue];
      } else {
        return [];
      }
    }
  });
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  // Sync internal state when external value prop changes
  useEffect(() => {
    if (multiple) {
      if (Array.isArray(value)) {
        setSelectedValues(value);
      } else if (typeof value === "string") {
        setSelectedValues(value ? [value] : []);
      }
    } else {
      if (typeof value === "string") {
        setSelectedValues(value ? [value] : []);
      }
    }
  }, [value, multiple]);

  const filteredOptions = useMemo(() => {
    return searchable
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;
  }, [options, searchable, searchTerm]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        onFocus?.();
      } else {
        onBlur?.();
      }
    }
  };

  const handleOptionSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      setSelectedValues(newValues);
      onChange?.(newValues);
    } else {
      setSelectedValues([optionValue]);
      onChange?.(optionValue);
      setIsOpen(false);
      onBlur?.();
    }
  };

  const updateDropdownPosition = () => {
    const el = selectRef.current;
    if (!el) return;
    const trigger = el.querySelector(
      `.${styles.selectTrigger}`
    ) as HTMLElement | null;
    const rect = (trigger ?? el).getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  };

  // Update position on open/resize/scroll
  useEffect(() => {
    if (!isOpen) return;
    updateDropdownPosition();
    const onScroll = () => updateDropdownPosition();
    const onResize = () => updateDropdownPosition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const root = selectRef.current;
      if (!root) return;
      const target = e.target as Node;
      if (!root.contains(target)) {
        setIsOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isOpen, onBlur]);

  const getDisplayValue = () => {
    if (selectedValues.length === 0) return placeholder;

    if (multiple) {
      if (selectedValues.length === 1) {
        const option = options.find((opt) => opt.value === selectedValues[0]);
        return option?.label || selectedValues[0];
      }
      return `${selectedValues.length} selected`;
    }

    const option = options.find((opt) => opt.value === selectedValues[0]);
    return option?.label || selectedValues[0];
  };

  const selectClasses = [
    styles.selectContainer,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    error && styles.error,
    disabled && styles.disabled,
    isOpen && styles.open,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  const dropdownContent = (
    <>
      {searchable && (
        <div className={styles.searchWrapper}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search options..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
      )}

      <ul
        className={styles.optionsList}
        role="listbox"
        id={`${inputId}-listbox`}
      >
        {filteredOptions.length === 0 ? (
          <li className={styles.noOptions}>No options found</li>
        ) : (
          filteredOptions.map((option: SelectOption) => {
            return (
              <li
                key={option.value}
                className={`${styles.option} ${
                  selectedValues.includes(option.value) ? styles.selected : ""
                } ${option.disabled ? styles.optionDisabled : ""}`}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  if (!option.disabled) {
                    handleOptionSelect(option.value);
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                role="option"
                aria-selected={selectedValues.includes(option.value)}
              >
                <div className={styles.optionContent}>
                  <span className={styles.optionLabel}>{option.label}</span>
                  {option.description && (
                    <span className={styles.optionDescription}>
                      {option.description}
                    </span>
                  )}
                </div>
                {multiple && selectedValues.includes(option.value) && (
                  <span className={styles.checkmark}>✓</span>
                )}
              </li>
            );
          })
        )}
      </ul>
    </>
  );

  return (
    <div className={selectClasses}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      {description && <p className={styles.description}>{description}</p>}

      <div className={styles.selectWrapper} ref={selectRef}>
        <div
          className={styles.selectTrigger}
          onClick={handleToggle}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={`${inputId}-listbox`}
          tabIndex={disabled ? -1 : 0}
        >
          <span className={styles.selectValue}>{getDisplayValue()}</span>
          <span
            className={`${styles.selectIcon} ${isOpen ? styles.rotated : ""}`}
            aria-hidden="true"
          >
            <ChevronDown />
          </span>
        </div>
        {isOpen &&
          (portal && dropdownPos ? (
            createPortal(
              <div
                className={styles.selectDropdown}
                style={{
                  position: "fixed",
                  top: dropdownPos.top,
                  left: dropdownPos.left,
                  width: dropdownPos.width,
                  zIndex: 10000,
                }}
              >
                {dropdownContent}
              </div>,
              document.body
            )
          ) : (
            <div className={styles.selectDropdown}>{dropdownContent}</div>
          ))}
      </div>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        id={inputId}
        name={name}
        value={multiple ? selectedValues.join(",") : selectedValues[0] || ""}
      />
    </div>
  );
};
