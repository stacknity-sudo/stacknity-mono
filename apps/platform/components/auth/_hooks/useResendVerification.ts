import { useState, useCallback } from "react";
import type { ResendResponse } from "../_types/verification";
import { VERIFICATION_MESSAGES } from "../_utils/verificationConstants";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const useResendVerification = () => {
  const [isResending, setIsResending] = useState(false);

  const resendVerificationEmail = useCallback(
    async (
      email: string,
      canResend: boolean,
      onSuccess: (message: string) => void,
      onError: (message: string) => void,
      startCooldown: () => void
    ) => {
      if (!email || isResending || !canResend) return;

      try {
        setIsResending(true);

        const response = await fetch(
          `${API_BASE_URL}/api/auth/verification/resend-verification`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          }
        );

        const data: ResendResponse = await response.json();

        if (response.ok && data.success) {
          onSuccess(data.message);
          startCooldown();
        } else {
          onError(data.message || VERIFICATION_MESSAGES.RESEND_FAILED);
        }
      } catch (error) {
        console.error("Resend error:", error);
        onError(VERIFICATION_MESSAGES.NETWORK_ERROR);
      } finally {
        setIsResending(false);
      }
    },
    [isResending]
  );

  return {
    isResending,
    resendVerificationEmail,
  };
};
