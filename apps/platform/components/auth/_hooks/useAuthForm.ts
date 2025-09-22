"use client";

import { useState, useTransition, useCallback } from "react";
import { useAuth } from "../../../hooks/auth/auth-context";
import { LoginSchema, RegisterSchema } from "../../../schemas/auth/auth";
import type { RegisterData } from "../../../schemas/auth/auth";
import type {
  LoginFormData,
  RegisterFormData,
  FormErrors,
} from "../_types/auth";
import {
  validateLoginForm,
  validateRegisterForm,
  isFormValid,
} from "../_utils/form-validation";

const initialLoginData: LoginFormData = {
  email: "",
  password: "",
};

const initialRegisterData: RegisterFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};

export const useAuthForm = () => {
  const { login, register, isLoading, error } = useAuth();
  const [isPending, startTransition] = useTransition();

  // Login form state
  const [loginData, setLoginData] = useState<LoginFormData>(initialLoginData);
  const [loginErrors, setLoginErrors] = useState<FormErrors>({});
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [registerData, setRegisterData] =
    useState<RegisterFormData>(initialRegisterData);
  const [registerErrors, setRegisterErrors] = useState<FormErrors>({});
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Registration success state
  const [registrationSuccess, setRegistrationSuccess] = useState<{
    email: string;
  } | null>(null);

  // Login handlers
  const handleLoginInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setLoginData((prev) => ({ ...prev, [name]: value }));

      // Clear error when user starts typing
      if (loginErrors[name]) {
        setLoginErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [loginErrors]
  );

  const handleLoginSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const errors = validateLoginForm(loginData);
      setLoginErrors(errors);

      if (!isFormValid(errors)) return;

      startTransition(async () => {
        try {
          // Validate with Zod schema for additional type safety
          const validatedData = LoginSchema.parse(loginData);
          await login(validatedData);
        } catch (error) {
          console.error("Login error:", error);
          // Error is handled by auth context
        }
      });
    },
    [loginData, login]
  );

  // Register handlers
  const handleRegisterInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;

      setRegisterData((prev) => ({ ...prev, [name]: newValue }));

      // Clear error when user starts typing
      if (registerErrors[name]) {
        setRegisterErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [registerErrors]
  );

  const handleRegisterSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const errors = validateRegisterForm(registerData);
      setRegisterErrors(errors);

      if (!isFormValid(errors)) return;

      startTransition(async () => {
        try {
          // Transform form data to API format
          const apiData: RegisterData = {
            firstName: registerData.firstName,
            lastName: registerData.lastName,
            email: registerData.email,
            password: registerData.password,
            // Add required tenant information - you may want to collect this from user
            tenantName: `${registerData.firstName} ${registerData.lastName}'s Organization`,
            // Optional fields
            displayName: `${registerData.firstName} ${registerData.lastName}`,
            bio: undefined,
            phoneNumber: undefined,
            domain: undefined,
            description: undefined,
            website: undefined,
          };

          // Validate with Zod schema for additional type safety
          const validatedData = RegisterSchema.parse(apiData);
          await register(validatedData);

          // Set registration success state instead of immediate login
          setRegistrationSuccess({ email: registerData.email });
        } catch (error) {
          console.error("Registration error:", error);
          // Error is handled by auth context
        }
      });
    },
    [registerData, register]
  );

  // Password visibility toggles
  const toggleLoginPasswordVisibility = useCallback(() => {
    setShowLoginPassword((prev) => !prev);
  }, []);

  const toggleRegisterPasswordVisibility = useCallback(() => {
    setShowRegisterPassword((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  // Reset forms
  const resetLoginForm = useCallback(() => {
    setLoginData(initialLoginData);
    setLoginErrors({});
    setShowLoginPassword(false);
  }, []);

  const resetRegisterForm = useCallback(() => {
    setRegisterData(initialRegisterData);
    setRegisterErrors({});
    setShowRegisterPassword(false);
    setShowConfirmPassword(false);
  }, []);

  // Registration success handlers
  const handleBackToLogin = useCallback(() => {
    setRegistrationSuccess(null);
    resetRegisterForm();
  }, [resetRegisterForm]);

  const handleResendVerificationEmail = useCallback(async () => {
    if (!registrationSuccess?.email) return;

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/auth/verification/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: registrationSuccess.email }),
        }
      );

      if (response.ok) {
        // Show success message (you could add a toast here)
        console.log("Verification email resent successfully");
      }
    } catch (error) {
      console.error("Failed to resend verification email:", error);
    }
  }, [registrationSuccess?.email]);

  return {
    // Login state & handlers
    loginData,
    loginErrors,
    showLoginPassword,
    isLoginLoading: isLoading || isPending,
    handleLoginInputChange,
    handleLoginSubmit,
    toggleLoginPasswordVisibility,
    resetLoginForm,

    // Register state & handlers
    registerData,
    registerErrors,
    showRegisterPassword,
    showConfirmPassword,
    isRegisterLoading: isLoading || isPending,
    isPending,
    handleRegisterInputChange,
    handleRegisterSubmit,
    toggleRegisterPasswordVisibility,
    toggleConfirmPasswordVisibility,
    resetRegisterForm,

    // Global auth state
    authError: error,

    // Registration success state & handlers
    registrationSuccess,
    handleBackToLogin,
    handleResendVerificationEmail,
  };
};
