export const VERIFICATION_CONSTANTS = {
  RESEND_COOLDOWN_SECONDS: 60,
  SUCCESS_REDIRECT_DELAY_MS: 3000,
} as const;

export const VERIFICATION_MESSAGES = {
  LOADING: "Verifying your email...",
  INVALID_LINK:
    "Invalid verification link. Please check your email for the correct link.",
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  RESEND_FAILED: "Failed to resend verification email. Please try again.",
} as const;

export const STATUS_COLORS = {
  success: "var(--success-color, #22c55e)",
  warning: "var(--warning-color, #f59e0b)",
  error: "var(--error-color, #ef4444)",
  primary: "var(--primary-color, #3b82f6)",
} as const;
