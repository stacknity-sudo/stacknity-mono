"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./Notification.module.css";
import {
  FiInfo,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiX,
} from "react-icons/fi";

export type NotificationVariant =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error";

export type NotifyOptions = {
  title?: string;
  message?: string;
  variant?: NotificationVariant;
  duration?: number; // ms, 0 = persistent until closed
  id?: string; // optional custom id for dedupe
  actions?: Array<{
    id?: string;
    label: string;
    onClick?: () => void;
  }>; // optional action buttons
};

type NotificationItem = Required<
  Pick<NotifyOptions, "title" | "message" | "variant">
> & {
  id: string;
  expiresAt: number | null;
  isExiting?: boolean;
  actions?: Array<{
    id?: string;
    label: string;
    onClick?: () => void;
  }>;
};

type NotificationContextValue = {
  notify: (opts: NotifyOptions) => string; // returns id
  close: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

function pickIcon(variant: NotificationVariant) {
  switch (variant) {
    case "success":
      return <FiCheckCircle size={16} />;
    case "warning":
      return <FiAlertTriangle size={16} />;
    case "error":
      return <FiXCircle size={16} />;
    case "info":
      return <FiInfo size={16} />;
    default:
      return <FiInfo size={16} />;
  }
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const timersRef = useRef<Record<string, number>>({});

  const close = useCallback((id: string) => {
    // First mark as exiting to trigger fade-out animation
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isExiting: true } : item))
    );

    // Remove after animation completes (match CSS animation duration)
    setTimeout(() => {
      setItems((prev) => prev.filter((n) => n.id !== id));
      const t = timersRef.current[id];
      if (t) {
        clearTimeout(t);
        delete timersRef.current[id];
      }
    }, 950); // 900ms animation + small buffer
  }, []);

  const notify = useCallback(
    (opts: NotifyOptions) => {
      const id = opts.id ?? Math.random().toString(36).slice(2);
      const variant: NotificationVariant = opts.variant ?? "neutral";
      const title = opts.title ?? variant[0].toUpperCase() + variant.slice(1);
      const message = opts.message ?? "";
      const duration = typeof opts.duration === "number" ? opts.duration : 4500;
      const expiresAt = duration > 0 ? Date.now() + duration : null;
      setItems((prev) => [
        {
          id,
          title,
          message,
          variant,
          expiresAt,
          isExiting: false,
          actions: opts.actions,
        },
        ...prev.filter((n) => n.id !== id),
      ]);
      if (duration > 0) {
        const t = window.setTimeout(() => close(id), duration);
        timersRef.current[id] = t as unknown as number;
      }
      return id;
    },
    [close]
  );

  const value = useMemo<NotificationContextValue>(
    () => ({ notify, close }),
    [notify, close]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className={styles.container} aria-live="polite" aria-atomic="true">
        {items.map((item) => (
          <div
            key={item.id}
            className={`${styles.card} ${styles[item.variant]} ${
              item.isExiting ? styles.exiting : ""
            }`}
            role="status"
          >
            <div className={styles.iconWrap} aria-hidden>
              {pickIcon(item.variant)}
            </div>
            <div className={styles.content}>
              <div className={styles.title}>{item.title}</div>
              {item.message ? (
                <div className={styles.message}>{item.message}</div>
              ) : null}
            </div>
            <div className={styles.actions}>
              {item.actions?.map((a, idx) => (
                <button
                  key={a.id ?? String(idx)}
                  className={styles.actionBtn}
                  onClick={() => {
                    try {
                      a.onClick?.();
                    } finally {
                      close(item.id);
                    }
                  }}
                >
                  {a.label}
                </button>
              ))}
              <button
                className={styles.closeBtn}
                onClick={() => close(item.id)}
                aria-label="Close notification"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
}

// Convenience helpers
export const notify = {
  neutral(ctx: NotificationContextValue, message: string, title = "Notice") {
    return ctx.notify({ variant: "neutral", title, message });
  },
  info(ctx: NotificationContextValue, message: string, title = "Info") {
    return ctx.notify({ variant: "info", title, message });
  },
  success(ctx: NotificationContextValue, message: string, title = "Success") {
    return ctx.notify({ variant: "success", title, message });
  },
  warning(ctx: NotificationContextValue, message: string, title = "Warning") {
    return ctx.notify({ variant: "warning", title, message });
  },
  error(ctx: NotificationContextValue, message: string, title = "Error") {
    return ctx.notify({ variant: "error", title, message });
  },
};

export default NotificationProvider;
