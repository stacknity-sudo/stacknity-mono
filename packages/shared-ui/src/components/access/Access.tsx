import React from "react";
import {
  MdBlock,
  MdError,
  MdLock,
  MdBuild,
  MdHourglassTop,
  MdWarning,
  MdCheckCircle,
  MdPending,
} from "react-icons/md";
import styles from "./Access.module.css";

export type AccessStatus =
  | "denied"
  | "forbidden"
  | "unauthorized"
  | "maintenance"
  | "loading"
  | "error"
  | "success"
  | "pending";

export interface AccessProps {
  /** Access status type */
  status: AccessStatus;
  /** Main title text */
  title?: string;
  /** Description text */
  description?: string;
  /** Custom icon element */
  icon?: React.ReactNode;
  /** Show default icon */
  showIcon?: boolean;
  /** Custom action button */
  action?: React.ReactNode;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

const defaultMessages: Record<
  AccessStatus,
  { title: string; description: string; icon: React.ReactNode }
> = {
  denied: {
    title: "Access Denied",
    description: "You don't have permission to access this resource.",
    icon: <MdBlock />,
  },
  forbidden: {
    title: "Forbidden",
    description: "This action is not allowed with your current permissions.",
    icon: <MdError />,
  },
  unauthorized: {
    title: "Authentication Required",
    description: "Please sign in to access this content.",
    icon: <MdLock />,
  },
  maintenance: {
    title: "Under Maintenance",
    description:
      "This feature is temporarily unavailable. Please try again later.",
    icon: <MdBuild />,
  },
  loading: {
    title: "Loading",
    description: "Checking your permissions...",
    icon: <MdHourglassTop />,
  },
  error: {
    title: "Something Went Wrong",
    description: "An error occurred while checking your permissions.",
    icon: <MdWarning />,
  },
  success: {
    title: "Access Granted",
    description: "You have successfully gained access.",
    icon: <MdCheckCircle />,
  },
  pending: {
    title: "Pending Approval",
    description: "Your access request is being reviewed.",
    icon: <MdPending />,
  },
};

export const Access: React.FC<AccessProps> = ({
  status,
  title,
  description,
  icon,
  showIcon = true,
  action,
  size = "md",
  className = "",
  style = {},
}) => {
  const defaultMessage = defaultMessages[status];
  const displayTitle = title ?? defaultMessage.title;
  const displayDescription = description ?? defaultMessage.description;
  const displayIcon = icon ?? defaultMessage.icon;

  return (
    <div
      className={`${styles.access} ${styles[status]} ${styles[size]} ${className}`}
      style={style}
      role="alert"
      aria-live="polite"
    >
      {showIcon && (
        <div className={styles.iconContainer}>
          <div className={styles.icon}>{displayIcon}</div>
        </div>
      )}

      <div className={styles.content}>
        <h3 className={styles.title}>{displayTitle}</h3>

        <p className={styles.description}>{displayDescription}</p>

        {action && <div className={styles.action}>{action}</div>}
      </div>
    </div>
  );
};

// Convenience components for common use cases
export const AccessDenied: React.FC<Omit<AccessProps, "status">> = (props) => (
  <Access {...props} status="denied" />
);

export const AccessUnauthorized: React.FC<Omit<AccessProps, "status">> = (
  props
) => <Access {...props} status="unauthorized" />;

export const AccessForbidden: React.FC<Omit<AccessProps, "status">> = (
  props
) => <Access {...props} status="forbidden" />;

export const AccessMaintenance: React.FC<Omit<AccessProps, "status">> = (
  props
) => <Access {...props} status="maintenance" />;

export const AccessLoading: React.FC<Omit<AccessProps, "status">> = (props) => (
  <Access {...props} status="loading" />
);

export const AccessError: React.FC<Omit<AccessProps, "status">> = (props) => (
  <Access {...props} status="error" />
);
