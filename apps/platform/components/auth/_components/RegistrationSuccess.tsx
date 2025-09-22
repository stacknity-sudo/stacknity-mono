"use client";

import React from "react";
import { motion } from "motion/react";
import { Button, Card } from "@stacknity/shared-ui";
import { FiMail, FiCheckCircle, FiRefreshCw } from "react-icons/fi";
import styles from "../_styles/AuthContainer.module.css";

interface RegistrationSuccessProps {
  email: string;
  onBackToLogin: () => void;
  onResendEmail?: () => void;
  isResending?: boolean;
}

export const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
  email,
  onBackToLogin,
  onResendEmail,
  isResending = false,
}) => {
  return (
    <Card variant="elevated" padding="large" className={styles.verifyCard}>
      {/* Success Icon */}
      <motion.div
        className={styles.statusContainer}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ color: "var(--success-color, #22c55e)" }}
      >
        <FiCheckCircle className={`${styles.statusIcon} ${styles.success}`} />
      </motion.div>

      {/* Success Title */}
      <motion.h1
        className={styles.verifyTitle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{ color: "var(--success-color, #22c55e)" }}
      >
        Registration Successful!
      </motion.h1>

      {/* Success Message */}
      <motion.p
        className={styles.verifyMessage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Welcome to Stacknity! We&apos;ve sent a verification email to confirm
        your account.
      </motion.p>

      {/* Email Display */}
      <motion.div
        className={styles.emailDisplay}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <FiMail className={styles.emailIcon} />
        <span className={styles.emailText}>{email}</span>
      </motion.div>

      {/* Instructions */}
      <motion.div
        className={styles.verifyMessage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <p style={{ marginBottom: "1rem" }}>
          <strong>Next steps:</strong>
        </p>
        <ol
          style={{ textAlign: "left", paddingLeft: "1.5rem", lineHeight: 1.8 }}
        >
          <li>Check your email inbox (and spam folder)</li>
          <li>Click the verification link in the email</li>
          <li>Return here to log in to your account</li>
        </ol>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className={styles.verifyActions}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Button
          variant="primary"
          size="large"
          fullWidth
          onClick={onBackToLogin}
        >
          Continue to Login
        </Button>

        {onResendEmail && (
          <Button
            variant="secondary"
            size="large"
            fullWidth
            onClick={onResendEmail}
            disabled={isResending}
            leftIcon={
              isResending ? (
                <FiRefreshCw className={styles.spinning} />
              ) : (
                <FiMail />
              )
            }
          >
            {isResending ? "Sending..." : "Resend Verification Email"}
          </Button>
        )}
      </motion.div>

      {/* Footer */}
      <motion.div
        className={styles.verifyFooter}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <p className={styles.footerText}>
          Didn&apos;t receive the email? Check your spam folder or{" "}
          <a href="mailto:support@stacknity.com" className={styles.supportLink}>
            contact support
          </a>
        </p>
      </motion.div>
    </Card>
  );
};
