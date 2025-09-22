/**
 * TypeScript definitions for the Sidebar component
 * Modern, comprehensive type definitions with JSDoc comments
 */

import { ReactElement, ElementType } from "react";

/**
 * Represents a single navigation item in the sidebar
 */
export interface NavigationItem {
  /** Unique identifier for the navigation item */
  id: string;

  /** Display label for the navigation item */
  label: string;

  /** Icon component to display next to the label */
  icon: ElementType;

  /** URL path for navigation */
  href: string;

  /** Optional badge to display (number for count, string for text) */
  badge?: number | string;

  /** Whether this item is currently active */
  isActive?: boolean;

  /** Optional description for tooltips or accessibility */
  description?: string;

  /** Optional nested navigation items */
  children?: NavigationItem[];

  /** Whether this item should be hidden */
  hidden?: boolean;

  /** Custom CSS class names */
  className?: string;

  /** Whether this item is disabled */
  disabled?: boolean;

  /** Custom click handler (overrides navigation) */
  onClick?: () => void;
}

/**
 * Represents a section of navigation items
 */
export interface NavigationSection {
  /** Unique identifier for the section */
  id: string;

  /** Display label for the section header */
  label: string;

  /** Array of navigation items in this section */
  items: NavigationItem[];

  /** Whether this section can be collapsed/expanded */
  collapsible?: boolean;

  /** Default expanded state for collapsible sections */
  defaultExpanded?: boolean;

  /** Whether this section should be hidden */
  hidden?: boolean;

  /** Icon for the section header */
  icon?: ElementType;

  /** Custom CSS class names */
  className?: string;
}

/**
 * User information for display in the sidebar
 */
export interface SidebarUser {
  /** Full name of the user */
  name: string;

  /** Email address of the user */
  email: string;

  /** Optional avatar image URL */
  avatar?: string;

  /** User role or title */
  role?: string;

  /** User ID */
  id?: string | number;

  /** Whether the user is online */
  isOnline?: boolean;

  /** Additional user metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Configuration options for sidebar behavior
 */
export interface SidebarConfig {
  /** Whether to show the search functionality */
  showSearch?: boolean;

  /** Whether to show the user profile section */
  showUserProfile?: boolean;

  /** Whether to show the footer actions */
  showFooterActions?: boolean;

  /** Custom logo configuration */
  logo?: {
    src?: string;
    alt?: string;
    text?: string;
    href?: string;
  };

  /** Custom colors and theme overrides */
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
  };

  /** Animation settings */
  animation?: {
    duration?: number;
    easing?: string;
    disabled?: boolean;
  };
}

/**
 * Props for the Sidebar component
 */
export interface SidebarProps {
  /** Additional CSS class names */
  className?: string;

  /** Whether the sidebar should be collapsed by default */
  defaultCollapsed?: boolean;

  /** Callback when collapse state changes */
  onCollapseChange?: (collapsed: boolean) => void;

  /** User information to display */
  user?: SidebarUser;

  /** Navigation sections configuration */
  navigationSections?: NavigationSection[];

  /** Sidebar configuration options */
  config?: SidebarConfig;

  /** Whether the sidebar is in loading state */
  isLoading?: boolean;

  /** Custom header content */
  headerContent?: ReactElement;

  /** Custom footer content */
  footerContent?: ReactElement;

  /** Whether to enable keyboard shortcuts */
  enableKeyboardShortcuts?: boolean;

  /** Custom search handler */
  onSearch?: (query: string) => void;

  /** Custom logout handler */
  onLogout?: () => void;

  /** Whether the sidebar should be responsive */
  responsive?: boolean;

  /** Breakpoint for mobile behavior (in pixels) */
  mobileBreakpoint?: number;
}

/**
 * Internal state for the Sidebar component
 */
export interface SidebarState {
  /** Whether the sidebar is currently collapsed */
  isCollapsed: boolean;

  /** Set of expanded section IDs */
  expandedSections: Set<string>;

  /** Current search query */
  searchQuery: string;

  /** Whether search input is focused */
  isSearchFocused: boolean;

  /** Whether the mobile sidebar is open */
  isMobileOpen: boolean;

  /** Whether the current device is mobile */
  isMobile: boolean;
}

/**
 * Context value for sidebar state management
 */
export interface SidebarContextValue {
  /** Current sidebar state */
  state: SidebarState;

  /** Function to update sidebar state */
  setState: React.Dispatch<React.SetStateAction<SidebarState>>;

  /** Toggle sidebar collapse state */
  toggleCollapse: () => void;

  /** Toggle section expansion */
  toggleSection: (sectionId: string) => void;

  /** Update search query */
  setSearchQuery: (query: string) => void;

  /** Check if navigation item is active */
  isItemActive: (href: string) => boolean;
}

/**
 * Footer action item definition
 */
export interface FooterAction {
  /** Unique identifier */
  id: string;

  /** Display label */
  label: string;

  /** Icon component */
  icon: ElementType;

  /** URL or click handler */
  href?: string;
  onClick?: () => void;

  /** Whether this action is active */
  isActive?: boolean;

  /** Custom styling */
  className?: string;

  /** Whether this action is disabled */
  disabled?: boolean;
}

/**
 * Search result item
 */
export interface SearchResult {
  /** Navigation item that matches the search */
  item: NavigationItem;

  /** Section containing the item */
  section: NavigationSection;

  /** Search relevance score */
  score?: number;
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  /** Duration in milliseconds */
  duration: number;

  /** Easing function */
  easing: string;

  /** Whether animations are enabled */
  enabled: boolean;
}

/**
 * Theme configuration
 */
export interface ThemeConfig {
  /** Primary accent color */
  primaryColor: string;

  /** Background color */
  backgroundColor: string;

  /** Text color */
  textColor: string;

  /** Secondary text color */
  secondaryTextColor: string;

  /** Border color */
  borderColor: string;

  /** Hover background color */
  hoverColor: string;

  /** Active item background color */
  activeColor: string;

  /** Shadow configuration */
  shadow: string;
}

/**
 * Responsive breakpoints
 */
export interface ResponsiveBreakpoints {
  /** Mobile breakpoint */
  mobile: number;

  /** Tablet breakpoint */
  tablet: number;

  /** Desktop breakpoint */
  desktop: number;
}

/**
 * Accessibility configuration
 */
export interface AccessibilityConfig {
  /** Whether to announce navigation changes */
  announceNavigation?: boolean;

  /** Custom ARIA labels */
  ariaLabels?: Record<string, string>;

  /** Whether to support high contrast mode */
  highContrastMode?: boolean;

  /** Whether to respect reduced motion preferences */
  respectReducedMotion?: boolean;
}

/**
 * Default configuration values
 */
export const defaultSidebarConfig: Required<SidebarConfig> = {
  showSearch: true,
  showUserProfile: true,
  showFooterActions: true,
  logo: {
    text: "Stacknity",
    href: "/dashboard",
  },
  theme: {
    primaryColor: "#3b82f6",
    backgroundColor: "#ffffff",
    textColor: "#111827",
    borderColor: "#e5e7eb",
  },
  animation: {
    duration: 300,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    disabled: false,
  },
};

/**
 * Default responsive breakpoints
 */
export const defaultBreakpoints: ResponsiveBreakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
};

/**
 * Default accessibility configuration
 */
export const defaultAccessibilityConfig: Required<AccessibilityConfig> = {
  announceNavigation: true,
  ariaLabels: {
    sidebar: "Main navigation",
    toggle: "Toggle sidebar",
    search: "Search navigation",
    userMenu: "User menu",
    logout: "Sign out",
  },
  highContrastMode: true,
  respectReducedMotion: true,
};
