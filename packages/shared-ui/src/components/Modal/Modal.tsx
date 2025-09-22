"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "../button/Button";
import { createPortal } from "react-dom";
import {
  FiX,
  FiMaximize2,
  FiMinimize2,
  FiTrash2,
  FiEdit3,
  FiPlus,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
  FiAlertCircle,
} from "react-icons/fi";
import styles from "./Modal.module.css";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  variant?: "default" | "success" | "warning" | "error" | "info";
  showCloseButton?: boolean;
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  className?: string;
  headerActions?: React.ReactNode;
  footerActions?: React.ReactNode;
  icon?: React.ReactNode;
  subtitle?: string;
  resizable?: boolean;
  draggable?: boolean;
  centerContent?: boolean;
  persistent?: boolean;
  blurBackground?: boolean;
  animationDuration?: number;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  variant = "default",
  showCloseButton = true,
  closeOnEscape = true,
  closeOnBackdrop = true,
  className = "",
  headerActions,
  footerActions,
  icon,
  subtitle,
  resizable = false,
  draggable = false,
  centerContent = false,
  persistent = false,
  blurBackground = true,
  animationDuration = 300,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  // Smooth open/close animation
  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), animationDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, animationDuration]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape || persistent) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscape, onClose, persistent]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && !persistent && e.target === modalRef.current) {
      onClose();
    }
  };

  // Focus management with focus trap
  useEffect(() => {
    if (isOpen && contentRef.current) {
      const focusableElements = contentRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (firstElement) {
        firstElement.focus();
      }

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement?.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement?.focus();
            }
          }
        }
      };

      document.addEventListener("keydown", handleTabKey);
      return () => document.removeEventListener("keydown", handleTabKey);
    }
  }, [isOpen]);

  // Dragging functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!draggable || isMaximized) return;

    setIsDragging(true);
    const rect = contentRef.current?.getBoundingClientRect();
    if (rect) {
      setDragPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (contentRef.current) {
        const newX = e.clientX - dragPosition.x;
        const newY = e.clientY - dragPosition.y;

        contentRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragPosition]);

  // Maximize/minimize toggle
  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (contentRef.current) {
      contentRef.current.style.transform = "";
    }
  };

  if (!mounted || !isVisible) return null;
  const overlay = (
    <div
      ref={modalRef}
      className={`
        ${styles.overlay} 
        ${styles[`overlay-${size}`]}
        ${blurBackground ? styles.blurred : ""}
        ${isOpen ? styles.overlayVisible : styles.overlayHidden}
      `}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      style={{ animationDuration: `${animationDuration}ms` }}
    >
      <div
        ref={contentRef}
        className={`
          ${styles.modal} 
          ${styles[`modal-${size}`]} 
          ${styles[`modal-${variant}`]}
          ${isMaximized ? styles.maximized : ""}
          ${isDragging ? styles.dragging : ""}
          ${centerContent ? styles.centered : ""}
          ${isOpen ? styles.modalVisible : styles.modalHidden}
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
        style={{ animationDuration: `${animationDuration}ms` }}
      >
        {/* Header */}
        {(title ||
          subtitle ||
          icon ||
          headerActions ||
          showCloseButton ||
          resizable) && (
          <div
            className={`${styles.header} ${
              draggable ? styles.draggableHeader : ""
            }`}
            onMouseDown={handleMouseDown}
          >
            <div className={styles.headerContent}>
              {icon && <div className={styles.icon}>{icon}</div>}
              <div className={styles.titleSection}>
                {title && (
                  <h2 id="modal-title" className={styles.title}>
                    {title}
                  </h2>
                )}
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
              </div>
              {headerActions && (
                <div className={styles.headerActions}>{headerActions}</div>
              )}
            </div>

            <div className={styles.headerControls}>
              {resizable && (
                <button
                  type="button"
                  onClick={toggleMaximize}
                  className={styles.controlButton}
                  aria-label={isMaximized ? "Restore" : "Maximize"}
                >
                  {isMaximized ? (
                    <FiMinimize2 size={16} />
                  ) : (
                    <FiMaximize2 size={16} />
                  )}
                </button>
              )}
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className={styles.closeButton}
                  aria-label="Close modal"
                >
                  <FiX size={18} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className={styles.content}>{children}</div>

        {/* Footer */}
        {footerActions && (
          <div className={styles.footer}>
            <div className={styles.footerActions}>{footerActions}</div>
          </div>
        )}

        {/* Resize handles */}
        {resizable && !isMaximized && (
          <>
            <div
              className={`${styles.resizeHandle} ${styles.resizeHandleTop}`}
            />
            <div
              className={`${styles.resizeHandle} ${styles.resizeHandleRight}`}
            />
            <div
              className={`${styles.resizeHandle} ${styles.resizeHandleBottom}`}
            />
            <div
              className={`${styles.resizeHandle} ${styles.resizeHandleLeft}`}
            />
            <div
              className={`${styles.resizeHandle} ${styles.resizeHandleTopLeft}`}
            />
            <div
              className={`${styles.resizeHandle} ${styles.resizeHandleTopRight}`}
            />
            <div
              className={`${styles.resizeHandle} ${styles.resizeHandleBottomLeft}`}
            />
            <div
              className={`${styles.resizeHandle} ${styles.resizeHandleBottomRight}`}
            />
          </>
        )}
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}

// Hook with additional features (keeping backward compatibility with useModal name)
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = React.useCallback(() => setIsOpen(true), []);
  const closeModal = React.useCallback(() => setIsOpen(false), []);
  const toggleModal = React.useCallback(() => setIsOpen((prev) => !prev), []);

  const openWithLoading = React.useCallback(
    async (asyncAction?: () => Promise<void>) => {
      setIsLoading(true);
      setIsOpen(true);

      if (asyncAction) {
        try {
          await asyncAction();
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    isOpen,
    isLoading,
    openModal,
    closeModal,
    toggleModal,
    openWithLoading,
    setIsLoading,
  };
}

// Enhanced hook with additional features (for backward compatibility)
export function useEnhancedModal(initialState = false) {
  return useModal(initialState);
}

// Quick action modals
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "warning",
  isDestructive = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
  isDestructive?: boolean;
}) {
  // Map modal variant + destructive flag to ThemedButton variant tokens
  const mapVariant = (
    v: string,
    destructive: boolean
  ):
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "success"
    | "warning"
    | "info"
    | "accent"
    | "contrast"
    | "muted" => {
    if (destructive) return "danger";
    switch (v) {
      case "success":
        return "success";
      case "error":
        return "danger";
      case "info":
        return "info";
      case "warning":
        return "warning";
      default:
        return "primary";
    }
  };
  // Lazy import (at top already): use existing ThemedButton component
  // We keep simple <button> semantic replaced by ThemedButton
  // Import added near top if not present
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      variant={variant}
      centerContent
      footerActions={
        <div
          style={{
            display: "flex",
            gap: "var(--space-sm)",
            justifyContent: "flex-end",
          }}
        >
          <Button variant="secondary" size="small" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            variant={mapVariant(variant, isDestructive)}
            size="small"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            {...(isDestructive ? { "data-destructive": true } : {})}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <div style={{ padding: "var(--space-md) 0" }}>{message}</div>
    </Modal>
  );
}

// Delete Confirmation Modal
export function DeleteModal({
  isOpen,
  onClose,
  onDelete,
  title = "Delete Item",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  deleteText = "Delete",
  cancelText = "Cancel",
  itemName,
  itemDetails,
  requireConfirmation = false,
  confirmationText,
}: {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  title?: string;
  message?: React.ReactNode;
  deleteText?: string;
  cancelText?: string;
  itemName?: string;
  itemDetails?: {
    [key: string]: string | number | undefined;
  };
  requireConfirmation?: boolean;
  confirmationText?: string;
}) {
  const [confirmationInput, setConfirmationInput] = useState("");
  const expectedConfirmation = confirmationText || itemName || "DELETE";
  const isConfirmationValid =
    !requireConfirmation || confirmationInput === expectedConfirmation;

  // Reset confirmation input when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setConfirmationInput("");
    }
  }, [isOpen]);
  const renderMessage = () => {
    if (React.isValidElement(message)) {
      return message;
    }

    const messageText =
      typeof message === "string"
        ? message
        : "Are you sure you want to delete this item? This action cannot be undone.";

    return (
      <div>
        <p>
          {itemName
            ? messageText.replace("this item", `"${itemName}"`)
            : messageText}
        </p>

        {(() => {
          if (!itemDetails) return null;
          const entries = Object.entries(itemDetails).filter(
            ([, value]) =>
              !(value === undefined || value === null || value === "")
          );
          if (entries.length === 0) return null;
          return (
            <div className={styles.itemDetailsCard}>
              <strong>Details:</strong>
              {entries.map(([key, value]) => (
                <div key={key} className={styles.detailRow}>
                  <span className={styles.detailLabel}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </span>
                  <span className={styles.detailValue}>{String(value)}</span>
                </div>
              ))}
            </div>
          );
        })()}

        {requireConfirmation && (
          <div className={styles.confirmationSection}>
            <label className={styles.confirmationLabel}>
              {confirmationText
                ? `Type "${expectedConfirmation}" to confirm:`
                : itemName
                ? `Type "${expectedConfirmation}" to confirm:`
                : 'Type "DELETE" to confirm:'}
            </label>
            <input
              type="text"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              placeholder={expectedConfirmation}
              className={styles.confirmationInput}
              autoComplete="off"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      variant="error"
      centerContent
      icon={<FiTrash2 size={24} />}
      footerActions={
        <div className={styles.modalActions}>
          <button
            type="button"
            onClick={onClose}
            className={styles.buttonSecondary}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onDelete();
              onClose();
            }}
            className={styles.buttonDanger}
            disabled={!isConfirmationValid}
          >
            <FiTrash2 size={16} />
            {itemName ? `Delete ${itemName}` : deleteText}
          </button>
        </div>
      }
    >
      <div className={styles.modalContent}>
        <div className={styles.warningIcon}>
          <FiAlertTriangle size={48} />
        </div>
        <div className={styles.messageText}>{renderMessage()}</div>
      </div>
    </Modal>
  );
}

// Edit Modal
export function EditModal({
  isOpen,
  onClose,
  onSave,
  title = "Edit Item",
  children,
  saveText = "Save Changes",
  cancelText = "Cancel",
  isLoading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  title?: string;
  children: React.ReactNode;
  saveText?: string;
  cancelText?: string;
  isLoading?: boolean;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      variant="info"
      icon={<FiEdit3 size={24} />}
      footerActions={
        <div className={styles.modalActions}>
          <button
            type="button"
            onClick={onClose}
            className={styles.buttonSecondary}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onSave}
            className={styles.buttonPrimary}
            disabled={isLoading}
          >
            <FiEdit3 size={16} />
            {isLoading ? "Saving..." : saveText}
          </button>
        </div>
      }
    >
      <div className={styles.modalContent}>{children}</div>
    </Modal>
  );
}

// Create Modal
export function CreateModal({
  isOpen,
  onClose,
  onCreate,
  title = "Create New Item",
  children,
  createText = "Create",
  cancelText = "Cancel",
  isLoading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
  title?: string;
  children: React.ReactNode;
  createText?: string;
  cancelText?: string;
  isLoading?: boolean;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      variant="success"
      icon={<FiPlus size={24} />}
      footerActions={
        <div className={styles.modalActions}>
          <button
            type="button"
            onClick={onClose}
            className={styles.buttonSecondary}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onCreate}
            className={styles.buttonSuccess}
            disabled={isLoading}
          >
            <FiPlus size={16} />
            {isLoading ? "Creating..." : createText}
          </button>
        </div>
      }
    >
      <div className={styles.modalContent}>{children}</div>
    </Modal>
  );
}

// Enhanced Confirmation Modal with different types
export function EnhancedConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  isDestructive = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  type?: "success" | "warning" | "error" | "info";
  isDestructive?: boolean;
}) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <FiCheckCircle size={24} />;
      case "error":
        return <FiAlertCircle size={24} />;
      case "info":
        return <FiInfo size={24} />;
      case "warning":
      default:
        return <FiAlertTriangle size={24} />;
    }
  };

  const getButtonClass = () => {
    if (isDestructive) return styles.buttonDanger;
    switch (type) {
      case "success":
        return styles.buttonSuccess;
      case "error":
        return styles.buttonDanger;
      case "info":
        return styles.buttonPrimary;
      case "warning":
      default:
        return styles.buttonWarning;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        title || `${type.charAt(0).toUpperCase() + type.slice(1)} Confirmation`
      }
      size="sm"
      variant={type === "warning" ? "warning" : type}
      centerContent
      icon={getIcon()}
      footerActions={
        <div className={styles.modalActions}>
          <button
            type="button"
            onClick={onClose}
            className={styles.buttonSecondary}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={getButtonClass()}
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <div className={styles.modalContent}>
        <div className={styles.messageText}>{message}</div>
      </div>
    </Modal>
  );
}
