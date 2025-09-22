import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { Button } from "@stacknity/shared-ui";
import { FiCheckCircle, FiLoader, FiRefreshCw } from "react-icons/fi";
import type { VerificationState } from "../_types/verification";
import styles from "../_styles/AuthContainer.module.css";

interface VerificationActionsProps {
  state: VerificationState;
  isResending: boolean;
  onResendClick: () => void;
}

export const VerificationActions: React.FC<VerificationActionsProps> = ({
  state,
  isResending,
  onResendClick,
}) => {
  const router = useRouter();

  return (
    <AnimatePresence>
      <motion.div
        className={styles.verifyActions}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {state.status === "success" && (
          <Button
            variant="primary"
            size="large"
            fullWidth
            onClick={() => router.push("/dashboard")}
            leftIcon={<FiCheckCircle />}
          >
            Continue to Dashboard
          </Button>
        )}

        {(state.status === "expired" || state.status === "error") &&
          state.canResend && (
            <Button
              variant="secondary"
              size="medium"
              fullWidth
              onClick={onResendClick}
              disabled={
                isResending || !state.canResend || state.resendCooldown > 0
              }
              leftIcon={
                isResending ? (
                  <FiLoader className={styles.spinning} />
                ) : (
                  <FiRefreshCw />
                )
              }
            >
              {isResending
                ? "Sending..."
                : state.resendCooldown > 0
                ? `Resend in ${state.resendCooldown}s`
                : "Resend Verification Email"}
            </Button>
          )}

        {state.status !== "success" && (
          <Button
            variant="ghost"
            size="medium"
            fullWidth
            onClick={() => router.push("/auth")}
          >
            Back to Login
          </Button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
