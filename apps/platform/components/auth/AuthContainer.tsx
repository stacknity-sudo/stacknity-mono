"use client";

import React from "react";
import { useTheme } from "@stacknity/shared-theme/client";
import { FlipCard, useFlipCard } from "./_components/FlipCard";
import { LoginForm } from "./_components/LoginForm";
import { RegisterForm } from "./_components/RegisterForm";
import { RegistrationSuccess } from "./_components/RegistrationSuccess";
import { BrandPanel } from "./_components/BrandPanel";
import { useAuthForm } from "./_hooks/useAuthForm";
import styles from "./_styles/AuthContainer.module.css";

export default function AuthContainer() {
  const { resolvedTheme } = useTheme();
  const { isFlipped, handleFlip } = useFlipCard();

  const {
    // Login state & handlers
    loginData,
    loginErrors,
    showLoginPassword,
    isLoginLoading,
    handleLoginInputChange,
    handleLoginSubmit,
    toggleLoginPasswordVisibility,

    // Register state & handlers
    registerData,
    registerErrors,
    showRegisterPassword,
    showConfirmPassword,
    isRegisterLoading,
    isPending,
    handleRegisterInputChange,
    handleRegisterSubmit,
    toggleRegisterPasswordVisibility,
    toggleConfirmPasswordVisibility,

    // Registration success state & handlers
    registrationSuccess,
    handleBackToLogin,
    handleResendVerificationEmail,
  } = useAuthForm();

  const isDarkMode = resolvedTheme === "dark";
  const logoSrc = isDarkMode
    ? "/logo/stacknitydarktheme.png"
    : "/logo/stacknitylighttheme.png";

  // Show registration success screen if registration was successful
  if (registrationSuccess) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <div className={styles.cardFront}>
              <RegistrationSuccess
                email={registrationSuccess.email}
                onBackToLogin={handleBackToLogin}
                onResendEmail={handleResendVerificationEmail}
              />
            </div>
          </div>
        </div>
        <BrandPanel isFlipped={false} />
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      {/* Flip Card Container - Main form area */}
      <div className={styles.cardContainer}>
        <FlipCard
          isFlipped={isFlipped}
          onFlip={handleFlip}
          frontContent={
            <LoginForm
              loginData={loginData}
              loginErrors={loginErrors}
              showPassword={showLoginPassword}
              isLoading={isLoginLoading}
              logoSrc={logoSrc}
              onInputChange={handleLoginInputChange}
              onSubmit={handleLoginSubmit}
              onTogglePassword={toggleLoginPasswordVisibility}
              onFlip={handleFlip}
            />
          }
          backContent={
            <RegisterForm
              registerData={registerData}
              registerErrors={registerErrors}
              showPassword={showRegisterPassword}
              showConfirmPassword={showConfirmPassword}
              isLoading={isRegisterLoading}
              isPending={isPending}
              logoSrc={logoSrc}
              onInputChange={handleRegisterInputChange}
              onSubmit={handleRegisterSubmit}
              onTogglePassword={toggleRegisterPasswordVisibility}
              onToggleConfirmPassword={toggleConfirmPasswordVisibility}
              onFlip={handleFlip}
            />
          }
        />
      </div>

      {/* Brand Panel - Will be reordered on mobile via CSS */}
      <BrandPanel isFlipped={isFlipped} />
    </div>
  );
}
