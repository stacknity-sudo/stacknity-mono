"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
  children?: NavItem[];
}

export interface NavbarProps {
  brand?: React.ReactNode;
  items?: NavItem[];
  actions?: React.ReactNode;
  className?: string;
  variant?: "default" | "glass" | "solid";
  sticky?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  brand,
  items = [],
  actions,
  className = "",
  variant = "default",
  sticky = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    if (sticky) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [sticky]);

  const navbarClasses = [
    styles.navbar,
    styles[variant],
    sticky && styles.sticky,
    isScrolled && styles.scrolled,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className={navbarClasses}>
      <div className={styles.container}>
        {/* Brand */}
        {brand && (
          <div className={styles.brand} onClick={closeMobileMenu}>
            {brand}
          </div>
        )}

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          {items.length > 0 && (
            <ul className={styles.navList}>
              {items.map((item, index) => (
                <li key={index} className={styles.navItem}>
                  <Link href={item.href} className={styles.navLink}>
                    {item.icon && (
                      <span className={styles.navIcon}>{item.icon}</span>
                    )}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={styles.badge}>{item.badge}</span>
                    )}
                  </Link>
                  {item.children && (
                    <ul className={styles.dropdown}>
                      {item.children.map((child, childIndex) => (
                        <li key={childIndex}>
                          <Link
                            href={child.href}
                            className={styles.dropdownLink}
                          >
                            {child.icon && (
                              <span className={styles.navIcon}>
                                {child.icon}
                              </span>
                            )}
                            {child.label}
                            {child.badge && (
                              <span className={styles.badge}>
                                {child.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Actions */}
        {actions && <div className={styles.actions}>{actions}</div>}

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={isOpen}
        >
          <span className={`${styles.hamburger} ${isOpen ? styles.open : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`${styles.mobileNav} ${isOpen ? styles.open : ""}`}>
        <div className={styles.mobileNavContent}>
          {items.length > 0 && (
            <ul className={styles.mobileNavList}>
              {items.map((item, index) => (
                <li key={index} className={styles.mobileNavItem}>
                  <Link
                    href={item.href}
                    className={styles.mobileNavLink}
                    onClick={closeMobileMenu}
                  >
                    {item.icon && (
                      <span className={styles.navIcon}>{item.icon}</span>
                    )}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={styles.badge}>{item.badge}</span>
                    )}
                  </Link>
                  {item.children && (
                    <ul className={styles.mobileDropdown}>
                      {item.children.map((child, childIndex) => (
                        <li key={childIndex}>
                          <Link
                            href={child.href}
                            className={styles.mobileDropdownLink}
                            onClick={closeMobileMenu}
                          >
                            {child.icon && (
                              <span className={styles.navIcon}>
                                {child.icon}
                              </span>
                            )}
                            {child.label}
                            {child.badge && (
                              <span className={styles.badge}>
                                {child.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
          {actions && <div className={styles.mobileActions}>{actions}</div>}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && <div className={styles.overlay} onClick={closeMobileMenu} />}
    </nav>
  );
};
