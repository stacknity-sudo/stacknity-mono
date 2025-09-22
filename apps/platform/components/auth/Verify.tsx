"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@stacknity/shared-ui";
import { BrandPanel } from "./_components/BrandPanel";
import { VerificationStatus } from "./_components/VerificationStatus";
import { VerificationActions } from "./_components/VerificationActions";
import { VerificationFooter } from "./_components/VerificationFooter";
import { useEmailVerification } from "./_hooks/useEmailVerification";
import { useResendVerification } from "./_hooks/useResendVerification";
import styles from "./_styles/AuthContainer.module.css";

export const Verify: React.FC = () => {
  const searchParams = useSearchParams();
  const {
    state,
    verifyEmail,
    setInvalidLink,
    startResendCooldown,
    updateMessage,
    updateCanResend,
  } = useEmailVerification();
  const { isResending, resendVerificationEmail } = useResendVerification();

  // Extract parameters from URL
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // Handle resend verification
  const handleResendClick = () => {
    if (!state.email) return;

    resendVerificationEmail(
      state.email,
      state.canResend,
      (message) => {
        updateMessage(message);
        updateCanResend(false);
        startResendCooldown();
      },
      (errorMessage) => {
        updateMessage(errorMessage);
      },
      startResendCooldown
    );
  };

  // Verify email on component mount
  useEffect(() => {
    if (!token || !email) {
      setInvalidLink();
      return;
    }

    verifyEmail(token, email);
  }, [token, email, verifyEmail, setInvalidLink]);

  return (
    <div className={styles.authContainer}>
      <div className={styles.cardContainer}>
        <Card variant="elevated" padding="large" className={styles.verifyCard}>
          <VerificationStatus state={state} />
          <VerificationActions
            state={state}
            isResending={isResending}
            onResendClick={handleResendClick}
          />
          <VerificationFooter />
        </Card>
      </div>

      {/* Brand Panel - Will be reordered on mobile via CSS */}
      <BrandPanel isFlipped={false} />
    </div>
  );
};

export default Verify;
