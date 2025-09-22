"use client";

import React, {
  useEffect,
  useRef,
  ReactNode,
  useState,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { IoClose, IoChevronDown } from "react-icons/io5";
import styles from "./SlidePanel.module.css";

// Type definitions for control descriptors
export interface ButtonControl {
  type: "button";
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

export interface InputControl {
  type: "input";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  inputType?: "text" | "email" | "password" | "number" | "date";
}

export interface CheckboxControl {
  type: "checkbox";
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export interface TextareaControl {
  type: "textarea";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  rows?: number;
}

export interface SelectControl {
  type: "select";
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}

export interface RowControl {
  type: "row";
  controls: ControlDescriptor[];
}

export type ControlDescriptor =
  | ButtonControl
  | InputControl
  | CheckboxControl
  | TextareaControl
  | SelectControl
  | RowControl;

// Main component props
export interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  width?: string;
  title?: string | ReactNode;
  footer?: ReactNode;
  className?: string;
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
  controls?: ControlDescriptor[];
  children?: ReactNode;
}

export const SlidePanel: React.FC<SlidePanelProps> = ({
  isOpen,
  onClose,
  width = "400px",
  title,
  footer,
  className = "",
  closeOnBackdropClick = true,
  showCloseButton = true,
  controls = [],
  children,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = React.useState(false);

  // State for custom dropdown management
  const [openDropdowns, setOpenDropdowns] = useState<Set<number>>(new Set());

  // Toggle dropdown open/close
  const toggleDropdown = useCallback((controlIndex: number) => {
    setOpenDropdowns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(controlIndex)) {
        newSet.delete(controlIndex);
      } else {
        newSet.clear(); // Close other dropdowns
        newSet.add(controlIndex);
      }
      return newSet;
    });
  }, []);

  // Close all dropdowns
  const closeAllDropdowns = useCallback(() => {
    setOpenDropdowns(new Set());
  }, []);

  // Ensure component is mounted before rendering portal
  useEffect(() => {
    setMounted(true);

    // Inject global styles for hiding scrollbars when panel is active
    const globalStyles = document.createElement("style");
    globalStyles.id = "slide-panel-global-styles";
    globalStyles.textContent = `
      body.slide-panel-active *::-webkit-scrollbar,
      body.slide-panel-active::-webkit-scrollbar {
        display: none !important; /* Chrome, Safari, Opera */
      }
      
      body.slide-panel-active {
        overflow: hidden !important;
      }
      
      html.slide-panel-active {
        overflow: hidden !important;
      }
    `;

    if (!document.getElementById("slide-panel-global-styles")) {
      document.head.appendChild(globalStyles);
    }

    return () => {
      const existingStyles = document.getElementById(
        "slide-panel-global-styles"
      );
      if (existingStyles) {
        existingStyles.remove();
      }
    };
  }, []);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previouslyFocusedElement.current = document.activeElement as HTMLElement;

      // Prevent body scroll and hide all scrollbars
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      // Add class to hide all scrollbars globally
      document.body.classList.add("slide-panel-active");
      document.documentElement.classList.add("slide-panel-active");

      // Focus the panel
      if (panelRef.current) {
        panelRef.current.focus();
      }
    } else {
      // Restore body scroll and scrollbars
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";

      // Remove global scrollbar hiding class
      document.body.classList.remove("slide-panel-active");
      document.documentElement.classList.remove("slide-panel-active");

      // Return focus to previously focused element
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    }

    // Cleanup function to restore scroll if component unmounts while open
    return () => {
      if (isOpen) {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        document.body.classList.remove("slide-panel-active");
        document.documentElement.classList.remove("slide-panel-active");
      }
    };
  }, [isOpen]); // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdowns.size > 0) {
        const target = event.target as Element;
        if (!target.closest(`.${styles.customSelect}`)) {
          closeAllDropdowns();
        }
      }
    };

    if (openDropdowns.size > 0) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openDropdowns.size, closeAllDropdowns]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      closeAllDropdowns(); // Close dropdowns when clicking backdrop
      onClose();
    }
  };

  // Render control based on type
  const renderControl = (control: ControlDescriptor, index: number) => {
    const key = `control-${index}`;

    switch (control.type) {
      case "button":
        return (
          <div key={key} className={styles.controlGroup}>
            <button
              className={`${styles.button} ${
                styles[`button--${control.variant || "primary"}`]
              }`}
              onClick={control.onClick}
              disabled={control.disabled}
            >
              {control.label}
            </button>
          </div>
        );

      case "input":
        return (
          <div key={key} className={styles.controlGroup}>
            {control.label && (
              <label className={styles.label}>{control.label}</label>
            )}
            <input
              type={control.inputType || "text"}
              className={styles.input}
              placeholder={control.placeholder}
              value={control.value}
              onChange={(e) => control.onChange(e.target.value)}
              disabled={control.disabled}
            />
          </div>
        );

      case "checkbox":
        return (
          <div key={key} className={styles.controlGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={control.checked}
                onChange={(e) => control.onChange(e.target.checked)}
                disabled={control.disabled}
              />
              <span className={styles.checkboxText}>{control.label}</span>
            </label>
          </div>
        );

      case "textarea":
        return (
          <div key={key} className={styles.controlGroup}>
            {control.label && (
              <label className={styles.label}>{control.label}</label>
            )}
            <textarea
              className={styles.textarea}
              placeholder={control.placeholder}
              value={control.value}
              onChange={(e) => control.onChange(e.target.value)}
              disabled={control.disabled}
              rows={control.rows || 4}
            />
          </div>
        );

      case "select":
        const isDropdownOpen = openDropdowns.has(index);
        const selectedOption = control.options.find(
          (opt) => opt.value === control.value
        );

        return (
          <div key={key} className={styles.controlGroup}>
            {control.label && (
              <label className={styles.label}>{control.label}</label>
            )}
            <div className={styles.customSelect}>
              <button
                type="button"
                className={`${styles.selectTrigger} ${
                  isDropdownOpen ? styles.selectTriggerOpen : ""
                } ${control.disabled ? styles.selectTriggerDisabled : ""}`}
                onClick={() => !control.disabled && toggleDropdown(index)}
                disabled={control.disabled}
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
              >
                <span
                  className={
                    selectedOption ? styles.selectedValue : styles.placeholder
                  }
                >
                  {selectedOption
                    ? selectedOption.label
                    : "Select an option..."}
                </span>
                <IoChevronDown
                  className={`${styles.selectArrow} ${
                    isDropdownOpen ? styles.selectArrowOpen : ""
                  }`}
                />
              </button>

              {isDropdownOpen && !control.disabled && (
                <div className={styles.selectDropdown}>
                  <div className={styles.selectOptions}>
                    {control.options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`${styles.selectOption} ${
                          option.value === control.value
                            ? styles.selectOptionSelected
                            : ""
                        }`}
                        onClick={() => {
                          control.onChange(option.value);
                          closeAllDropdowns();
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "row":
        return (
          <div key={key} className={styles.rowGroup}>
            {control.controls.map((rowControl, rowIndex) => (
              <div key={`${key}-${rowIndex}`} className={styles.rowItem}>
                {renderControl(rowControl, index * 1000 + rowIndex)}
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen || !mounted) return null;

  const slidePanel = (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div
        ref={panelRef}
        className={`${styles.panel} ${className}`}
        style={{ width }}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "slide-panel-title" : undefined}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className={styles.header}>
            {title && (
              <div className={styles.title} id="slide-panel-title">
                {title}
              </div>
            )}
            {showCloseButton && (
              <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close panel"
              >
                <IoClose />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={styles.content}>
          {children}

          {/* Controls */}
          {controls.length > 0 && (
            <div className={styles.controls}>
              {controls.map((control, index) => renderControl(control, index))}
            </div>
          )}
        </div>

        {/* Footer */}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );

  // Render using portal to ensure it's positioned relative to the document body
  // Check if we're in the browser environment
  if (typeof window === "undefined") {
    return null;
  }

  return createPortal(slidePanel, document.body);
};

export default SlidePanel;
