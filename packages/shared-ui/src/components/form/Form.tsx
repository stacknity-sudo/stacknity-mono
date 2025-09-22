"use client";

import React, { ReactNode } from "react";
import styles from "./Form.module.css";

export interface FormFieldProps {
  children: ReactNode;
  className?: string;
}

export interface FormProps {
  children: ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
  variant?: "default" | "elevated" | "minimal";
}

export interface FormHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
}

export interface FormActionsProps {
  children: ReactNode;
  align?: "left" | "center" | "right" | "space-between";
  className?: string;
}

export interface FormAlertProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  className?: string;
}

export function Form({
  children,
  onSubmit,
  className = "",
  variant = "default",
}: FormProps) {
  return (
    <div className={`${styles.formWrapper} ${styles[variant]} ${className}`}>
      <form className={styles.form} onSubmit={onSubmit}>
        {children}
      </form>
    </div>
  );
}

export function FormHeader({
  title,
  subtitle,
  icon,
  className = "",
}: FormHeaderProps) {
  return (
    <header className={`${styles.header} ${className}`}>
      {icon && <div className={styles.headerIcon}>{icon}</div>}
      <div className={styles.headerContent}>
        <h3 className={styles.title}>{title}</h3>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </header>
  );
}

export function FormField({ children, className = "" }: FormFieldProps) {
  return <div className={`${styles.fieldGroup} ${className}`}>{children}</div>;
}

export function FormLabel({
  htmlFor,
  children,
  required = false,
  className = "",
}: {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={`${styles.label} ${className}`}>
      {children}
      {required && <span className={styles.required}>*</span>}
    </label>
  );
}

export function FormHelpText({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`${styles.helpText} ${className}`}>{children}</p>;
}

export function FormActions({
  children,
  align = "right",
  className = "",
}: FormActionsProps) {
  return (
    <div
      className={`${styles.actions} ${styles[`align-${align}`]} ${className}`}
    >
      {children}
    </div>
  );
}

export function FormAlert({ type, message, className = "" }: FormAlertProps) {
  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`${styles.alert} ${styles[`alert-${type}`]} ${className}`}
    >
      {message}
    </div>
  );
}
