import { useState, useCallback } from "react";
import { tokenStorage } from "../../../client/api";
import type {
  VerificationState,
  VerificationResponse,
  VerificationStatus,
} from "../_types/verification";
import {
  VERIFICATION_CONSTANTS,
  VERIFICATION_MESSAGES,
} from "../_utils/verificationConstants";

// Storage keys - should match auth context
const STORAGE_KEYS = {
  ACCESS_TOKEN: "platform_access_token",
  REFRESH_TOKEN: "platform_refresh_token",
  USER: "platform_user",
  EXPIRES_AT: "platform_expires_at",
} as const;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const useEmailVerification = () => {
  const [state, setState] = useState<VerificationState>({
    status: "loading",
    message: VERIFICATION_MESSAGES.LOADING,
    email: null,
    canResend: false,
    resendCooldown: 0,
  });
  const startResendCooldown = useCallback(() => {
    let cooldownTime = VERIFICATION_CONSTANTS.RESEND_COOLDOWN_SECONDS;
    setState((prev) => ({
      ...prev,
      resendCooldown: cooldownTime,
      canResend: false,
    }));

    const interval = setInterval(() => {
      cooldownTime -= 1;
      setState((prev) => ({ ...prev, resendCooldown: cooldownTime }));

      if (cooldownTime <= 0) {
        setState((prev) => ({ ...prev, canResend: true, resendCooldown: 0 }));
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const verifyEmail = useCallback(
    async (token: string, email: string) => {
      try {
        setState((prev) => ({
          ...prev,
          status: "loading" as VerificationStatus,
          message: VERIFICATION_MESSAGES.LOADING,
        }));

        const response = await fetch(
          `${API_BASE_URL}/api/auth/verification/verify-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, email }),
          }
        );

        const data: VerificationResponse = await response.json();

        if (response.ok && data.success) {
          setState((prev) => ({
            ...prev,
            status: "success" as VerificationStatus,
            message: data.message,
            email,
          }));

          // If verification response includes auth tokens, authenticate the user automatically
          if (data.token && data.refreshToken && data.user) {
            try {
              // Store tokens and user data
              const expiresAt = new Date(
                data.expiresAt || Date.now() + 3600000
              ).getTime();

              tokenStorage.set(STORAGE_KEYS.ACCESS_TOKEN, data.token);
              tokenStorage.set(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
              tokenStorage.set(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());
              tokenStorage.set(STORAGE_KEYS.USER, JSON.stringify(data.user));

              // Update auth context (if it has a method to set authenticated state)
              // The AuthNavigationHandler will automatically redirect to dashboard
              console.log(
                "User automatically authenticated after verification"
              );
            } catch (error) {
              console.error(
                "Failed to authenticate after verification:",
                error
              );
            }
          } else {
            // No auth tokens returned - verification successful but user needs to login manually
            console.log("Email verified but no authentication tokens provided");
          }
        } else {
          // Handle different error types
          const isExpired = data.message.toLowerCase().includes("expired");
          setState((prev) => ({
            ...prev,
            status: (isExpired ? "expired" : "error") as VerificationStatus,
            message: data.message,
            email,
            canResend: true,
          }));
          startResendCooldown();
        }
      } catch (error) {
        console.error("Verification error:", error);
        setState((prev) => ({
          ...prev,
          status: "error" as VerificationStatus,
          message: VERIFICATION_MESSAGES.NETWORK_ERROR,
          email,
          canResend: true,
        }));
        startResendCooldown();
      }
    },
    [startResendCooldown]
  );

  const setInvalidLink = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: "invalid" as VerificationStatus,
      message: VERIFICATION_MESSAGES.INVALID_LINK,
    }));
  }, []);

  const updateMessage = useCallback((message: string) => {
    setState((prev) => ({ ...prev, message }));
  }, []);

  const updateCanResend = useCallback((canResend: boolean) => {
    setState((prev) => ({ ...prev, canResend }));
  }, []);

  return {
    state,
    verifyEmail,
    setInvalidLink,
    startResendCooldown,
    updateMessage,
    updateCanResend,
  };
};
