import React from "react";
import {
  FiMail,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiLoader,
} from "react-icons/fi";
import type { VerificationStatus } from "../_types/verification";
import { STATUS_COLORS } from "./verificationConstants";

export const getStatusIcon = (
  status: VerificationStatus,
  styles: Record<string, string>
): React.ReactElement => {
  switch (status) {
    case "loading":
      return React.createElement(FiLoader, {
        className: `${styles.statusIcon} ${styles.spinning}`,
      });
    case "success":
      return React.createElement(FiCheckCircle, {
        className: `${styles.statusIcon} ${styles.success}`,
      });
    case "expired":
      return React.createElement(FiAlertCircle, {
        className: `${styles.statusIcon} ${styles.warning}`,
      });
    case "error":
    case "invalid":
      return React.createElement(FiXCircle, {
        className: `${styles.statusIcon} ${styles.error}`,
      });
    default:
      return React.createElement(FiMail, {
        className: `${styles.statusIcon} ${styles.neutral}`,
      });
  }
};

export const getStatusTitle = (status: VerificationStatus): string => {
  switch (status) {
    case "loading":
      return "Verifying Email";
    case "success":
      return "Email Verified!";
    case "expired":
      return "Link Expired";
    case "error":
      return "Verification Failed";
    case "invalid":
      return "Invalid Link";
    default:
      return "Email Verification";
  }
};

export const getStatusColor = (status: VerificationStatus): string => {
  switch (status) {
    case "success":
      return STATUS_COLORS.success;
    case "expired":
      return STATUS_COLORS.warning;
    case "error":
    case "invalid":
      return STATUS_COLORS.error;
    default:
      return STATUS_COLORS.primary;
  }
};
