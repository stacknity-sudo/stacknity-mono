"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@stacknity/shared-ui";
import {
  FiHome,
  FiUsers,
  FiFolder,
  FiSettings,
  FiBarChart,
  FiMail,
  FiCalendar,
  FiFileText,
  FiHelpCircle,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiUser,
  FiShield,
  FiDatabase,
  FiGlobe,
  FiActivity,
  FiTrendingUp,
  FiTarget,
  FiZap,
  FiLayers,
} from "react-icons/fi";
import { useTheme } from "@stacknity/shared-theme/client";
import styles from "./Sidebar.module.css";

// Types
interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  href: string;
  badge?: number | string;
  isActive?: boolean;
  description?: string;
  children?: NavigationItem[];
}

interface NavigationSection {
  id: string;
  label: string;
  items: NavigationItem[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

interface SidebarProps {
  className?: string;
  defaultCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
}

// Navigation configuration
const navigationSections: NavigationSection[] = [
  {
    id: "main",
    label: "Main",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: FiHome,
        href: "/dashboard",
        description: "Overview and analytics",
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: FiBarChart,
        href: "/dashboard/analytics",
        badge: "Pro",
        description: "Advanced analytics and reports",
      },
      {
        id: "projects",
        label: "Projects",
        icon: FiFolder,
        href: "/dashboard/projects",
        badge: 12,
        description: "Manage your projects",
      },
      {
        id: "team",
        label: "Team",
        icon: FiUsers,
        href: "/dashboard/team",
        description: "Team management",
      },
    ],
  },
  {
    id: "workspace",
    label: "Workspace",
    items: [
      {
        id: "calendar",
        label: "Calendar",
        icon: FiCalendar,
        href: "/dashboard/calendar",
        description: "Schedule and events",
      },
      {
        id: "messages",
        label: "Messages",
        icon: FiMail,
        href: "/dashboard/messages",
        badge: 3,
        description: "Team communication",
      },
      {
        id: "documents",
        label: "Documents",
        icon: FiFileText,
        href: "/dashboard/documents",
        description: "File management",
      },
      {
        id: "activity",
        label: "Activity",
        icon: FiActivity,
        href: "/dashboard/activity",
        description: "Recent activity feed",
      },
    ],
  },
  {
    id: "tools",
    label: "Tools & Features",
    collapsible: true,
    defaultExpanded: false,
    items: [
      {
        id: "integrations",
        label: "Integrations",
        icon: FiZap,
        href: "/dashboard/integrations",
        description: "Connect external services",
      },
      {
        id: "workflows",
        label: "Workflows",
        icon: FiLayers,
        href: "/dashboard/workflows",
        badge: "Beta",
        description: "Automation workflows",
      },
      {
        id: "performance",
        label: "Performance",
        icon: FiTrendingUp,
        href: "/dashboard/performance",
        description: "Performance metrics",
      },
      {
        id: "goals",
        label: "Goals",
        icon: FiTarget,
        href: "/dashboard/goals",
        description: "Track objectives",
      },
    ],
  },
  {
    id: "admin",
    label: "Administration",
    collapsible: true,
    defaultExpanded: false,
    items: [
      {
        id: "users",
        label: "User Management",
        icon: FiUser,
        href: "/dashboard/admin/users",
        description: "Manage user accounts",
      },
      {
        id: "permissions",
        label: "Permissions",
        icon: FiShield,
        href: "/dashboard/admin/permissions",
        description: "Role and permission management",
      },
      {
        id: "database",
        label: "Database",
        icon: FiDatabase,
        href: "/dashboard/admin/database",
        description: "Database administration",
      },
      {
        id: "system",
        label: "System Settings",
        icon: FiGlobe,
        href: "/dashboard/admin/system",
        description: "System configuration",
      },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  className = "",
  defaultCollapsed = false,
  onCollapseChange,
  user,
}) => {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  // State management
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () =>
      new Set(
        navigationSections
          .filter((section) => section.defaultExpanded !== false)
          .map((s) => s.id)
      )
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Responsive behavior
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Handle collapse toggle
  const toggleCollapse = useCallback(() => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapseChange?.(newCollapsed);

    // Clear search when collapsing
    if (newCollapsed) {
      setSearchQuery("");
      setIsSearchFocused(false);
    }
  }, [isCollapsed, onCollapseChange]);

  // Handle section expansion
  const toggleSection = useCallback(
    (sectionId: string) => {
      if (isCollapsed) return;

      setExpandedSections((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(sectionId)) {
          newSet.delete(sectionId);
        } else {
          newSet.add(sectionId);
        }
        return newSet;
      });
    },
    [isCollapsed]
  );

  // Filter navigation items based on search
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return navigationSections;

    const query = searchQuery.toLowerCase();
    return navigationSections
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            item.label.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query)
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [searchQuery]);

  // Determine if an item is active
  const isItemActive = useCallback(
    (href: string) => {
      return (
        pathname === href ||
        (href !== "/dashboard" && pathname.startsWith(href))
      );
    },
    [pathname]
  );

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector(`.${styles.sidebar}`);
      if (sidebar && !sidebar.contains(event.target as Node)) {
        setIsMobileOpen(false);
      }
    };

    if (isMobileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isMobileOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "b":
            e.preventDefault();
            if (!isMobile) toggleCollapse();
            break;
          case "k":
            e.preventDefault();
            if (!isCollapsed) {
              const searchInput = document.querySelector(
                `.${styles.searchInput}`
              ) as HTMLInputElement;
              searchInput?.focus();
            }
            break;
        }
      }

      if (e.key === "Escape") {
        if (isMobile && isMobileOpen) {
          setIsMobileOpen(false);
        } else if (isSearchFocused) {
          setIsSearchFocused(false);
          setSearchQuery("");
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggleCollapse, isCollapsed, isMobile, isMobileOpen, isSearchFocused]);

  const sidebarClasses = [
    styles.sidebar,
    className,
    isCollapsed && styles.collapsed,
    isMobile && styles.mobile,
    isMobile && isMobileOpen && styles.mobileOpen,
    resolvedTheme === "dark" && styles.dark,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Toggle Button */}
      {isMobile && (
        <Button
          variant="outline"
          size="small"
          className={styles.mobileToggle}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle navigation menu"
        >
          <FiChevronRight />
        </Button>
      )}

      {/* Sidebar */}
      <motion.aside
        className={sidebarClasses}
        initial={false}
        animate={{
          width: isMobile ? (isMobileOpen ? 280 : 0) : isCollapsed ? 80 : 280,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        <div className={styles.sidebarContent}>
          {/* Header */}
          <div className={styles.header}>
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  className={styles.logo}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={styles.logoIcon}>
                    <FiLayers />
                  </div>
                  <span className={styles.logoText}>Stacknity</span>
                </motion.div>
              )}
            </AnimatePresence>

            {!isMobile && (
              <Button
                variant="ghost"
                size="small"
                className={styles.collapseToggle}
                onClick={toggleCollapse}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
              </Button>
            )}
          </div>

          {/* Search */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                className={styles.searchContainer}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.searchWrapper}>
                  <FiSearch className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search... (⌘K)"
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                  {searchQuery && (
                    <button
                      className={styles.searchClear}
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <nav className={styles.navigation}>
            <AnimatePresence mode="wait">
              {filteredSections.map((section) => (
                <motion.div
                  key={section.id}
                  className={styles.navigationSection}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Section Header */}
                  {!isCollapsed && (
                    <div
                      className={`${styles.sectionHeader} ${
                        section.collapsible ? styles.collapsible : ""
                      }`}
                      onClick={() =>
                        section.collapsible && toggleSection(section.id)
                      }
                    >
                      <span className={styles.sectionLabel}>
                        {section.label}
                      </span>
                      {section.collapsible && (
                        <motion.div
                          animate={{
                            rotate: expandedSections.has(section.id) ? 90 : 0,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <FiChevronRight className={styles.sectionToggle} />
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Section Items */}
                  <AnimatePresence>
                    {(!section.collapsible ||
                      expandedSections.has(section.id) ||
                      isCollapsed) && (
                      <motion.div
                        className={styles.sectionItems}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {section.items.map((item) => (
                          <Link
                            key={item.id}
                            href={item.href}
                            className={`${styles.navItem} ${
                              isItemActive(item.href) ? styles.active : ""
                            }`}
                            onClick={() => isMobile && setIsMobileOpen(false)}
                            title={isCollapsed ? item.label : item.description}
                          >
                            <div className={styles.navItemIcon}>
                              <item.icon size={20} />
                            </div>

                            <AnimatePresence>
                              {!isCollapsed && (
                                <motion.div
                                  className={styles.navItemContent}
                                  initial={{ opacity: 0, width: 0 }}
                                  animate={{ opacity: 1, width: "auto" }}
                                  exit={{ opacity: 0, width: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <span className={styles.navItemLabel}>
                                    {item.label}
                                  </span>
                                  {item.badge && (
                                    <span
                                      className={`${styles.navItemBadge} ${
                                        typeof item.badge === "string"
                                          ? styles.badgeText
                                          : styles.badgeNumber
                                      }`}
                                    >
                                      {item.badge}
                                    </span>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </nav>

          {/* Footer */}
          <div className={styles.footer}>
            {/* User Profile */}
            <AnimatePresence>
              {!isCollapsed && user && (
                <motion.div
                  className={styles.userProfile}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={styles.userAvatar}>
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={32}
                        height={32}
                        className={styles.avatarImage}
                      />
                    ) : (
                      <FiUser className={styles.avatarIcon} />
                    )}
                  </div>
                  <div className={styles.userInfo}>
                    <div className={styles.userName}>{user.name}</div>
                    <div className={styles.userRole}>{user.role || "User"}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer Actions */}
            <div className={styles.footerActions}>
              <Link
                href="/dashboard/settings"
                className={`${styles.footerAction} ${
                  isItemActive("/dashboard/settings") ? styles.active : ""
                }`}
                title="Settings"
              >
                <FiSettings />
                {!isCollapsed && <span>Settings</span>}
              </Link>

              <Link
                href="/dashboard/help"
                className={`${styles.footerAction} ${
                  isItemActive("/dashboard/help") ? styles.active : ""
                }`}
                title="Help & Support"
              >
                <FiHelpCircle />
                {!isCollapsed && <span>Help</span>}
              </Link>

              <button
                className={styles.footerAction}
                onClick={() => {
                  // Handle logout
                  console.log("Logout clicked");
                }}
                title="Sign Out"
              >
                <FiLogOut />
                {!isCollapsed && <span>Sign Out</span>}
              </button>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
