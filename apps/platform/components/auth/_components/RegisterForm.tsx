"use client";

import React from "react";
import { motion } from "motion/react";
import { Button, Input } from "@stacknity/shared-ui";
import Image from "next/image";
import Link from "next/link";
import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock,
  FiArrowRight,
  FiUser,
  FiUserCheck,
  FiCheck,
  FiX,
} from "react-icons/fi";
import type { RegisterFormData, FormErrors } from "../_types/auth";
import { getPasswordStrengthInfo } from "../_utils/password-strength";
import styles from "../_styles/AuthContainer.module.css";

interface RegisterFormProps {
  registerData: RegisterFormData;
  registerErrors: FormErrors;
  showPassword: boolean;
  showConfirmPassword: boolean;
  isLoading: boolean;
  isPending: boolean;
  logoSrc: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  onFlip: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  registerData,
  registerErrors,
  showPassword,
  showConfirmPassword,
  isLoading,
  isPending,
  logoSrc,
  onInputChange,
  onSubmit,
  onTogglePassword,
  onToggleConfirmPassword,
  onFlip,
}) => {
  const passwordStrengthInfo = getPasswordStrengthInfo(registerData.password);

  return (
    <div className={styles.formWrapper}>
      {/* Logo */}
      <div className={styles.logoContainer}>
        <Image
          src={logoSrc}
          alt="Stacknity"
          width={240}
          height={60}
          className={styles.logo}
          priority
          style={{
            width: "clamp(160px, 30vw, 240px)",
            height: "auto",
            maxWidth: "100%",
          }}
        />
      </div>

      {/* Welcome Text */}
      <div className={styles.welcomeSection}>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>
          Join thousands of developers building the future
        </p>
      </div>

      {/* Registration Form */}
      <form className={styles.form} onSubmit={onSubmit}>
        {/* Name Fields */}
        <div className={styles.nameRow}>
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <Input
                id="register-firstName"
                name="firstName"
                type="text"
                label="First name"
                placeholder="First name"
                value={registerData.firstName}
                onChange={onInputChange}
                error={registerErrors.firstName}
                variant="outlined"
                size="medium"
                fullWidth
                leftIcon={<FiUser />}
                leftIconColor="var(--cool-teal)"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <Input
                id="register-lastName"
                name="lastName"
                type="text"
                label="Last name"
                placeholder="Last name"
                value={registerData.lastName}
                onChange={onInputChange}
                error={registerErrors.lastName}
                variant="outlined"
                size="medium"
                fullWidth
                leftIcon={<FiUserCheck />}
                leftIconColor="var(--cool-teal)"
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <Input
              id="register-email"
              name="email"
              type="email"
              label="Email address"
              placeholder="Email"
              value={registerData.email}
              onChange={onInputChange}
              error={registerErrors.email}
              variant="outlined"
              size="medium"
              fullWidth
              leftIcon={<FiMail />}
              leftIconColor="var(--cool-teal)"
            />
          </div>
        </div>

        {/* Password */}
        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <Input
              id="register-password"
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Create a strong password"
              value={registerData.password}
              onChange={onInputChange}
              error={registerErrors.password}
              variant="outlined"
              size="medium"
              fullWidth
              leftIcon={<FiLock />}
              leftIconColor="var(--cool-teal)"
              rightIcon={showPassword ? <FiEyeOff /> : <FiEye />}
              rightIconColor="var(--cool-teal)"
              onRightIconClick={onTogglePassword}
            />
          </div>

          {/* Password Strength Indicator */}
          {registerData.password && (
            <motion.div
              className={styles.passwordStrength}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className={styles.strengthBar}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`${styles.strengthSegment} ${
                      level <= passwordStrengthInfo.score ? styles.active : ""
                    }`}
                    style={{
                      backgroundColor:
                        level <= passwordStrengthInfo.score
                          ? passwordStrengthInfo.color
                          : undefined,
                    }}
                  />
                ))}
              </div>
              <span
                className={styles.strengthLabel}
                style={{ color: passwordStrengthInfo.color }}
              >
                {passwordStrengthInfo.label}
              </span>
            </motion.div>
          )}
        </div>

        {/* Confirm Password */}
        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <Input
              id="register-confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm password"
              placeholder="Confirm your password"
              value={registerData.confirmPassword}
              onChange={onInputChange}
              error={registerErrors.confirmPassword}
              variant="outlined"
              size="medium"
              fullWidth
              leftIcon={<FiLock />}
              leftIconColor="var(--cool-teal)"
              rightIcon={showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              rightIconColor="var(--cool-teal)"
              onRightIconClick={onToggleConfirmPassword}
            />
          </div>

          {/* Password Match Indicator */}
          {registerData.confirmPassword && (
            <motion.div
              className={styles.passwordMatch}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {registerData.password === registerData.confirmPassword ? (
                <span
                  className={styles.matchText}
                  style={{
                    color: "var(--success-color, #22c55e)",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <FiCheck size={14} /> Passwords match
                </span>
              ) : (
                <span
                  className={styles.mismatchText}
                  style={{
                    color: "var(--error-color, #ef4444)",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <FiX size={14} /> Passwords do not match
                </span>
              )}
            </motion.div>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className={styles.termsSection}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              name="acceptTerms"
              checked={registerData.acceptTerms}
              onChange={onInputChange}
            />
            <span className={styles.checkmark}></span>
            <span className={styles.termsText}>
              I agree to the{" "}
              <Link href="/terms" className={styles.termsLink}>
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className={styles.termsLink}>
                Privacy Policy
              </Link>
            </span>
          </label>
          {registerErrors.acceptTerms && (
            <span className={styles.errorText}>
              {registerErrors.acceptTerms}
            </span>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="large"
          fullWidth
          loading={isLoading || isPending}
          rightIcon={!isLoading && !isPending ? <FiArrowRight /> : undefined}
          className={styles.submitButton}
          disabled={isLoading || isPending}
        >
          {isLoading || isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>

      {/* Sign In Link with Flip Trigger */}
      <div className={styles.signinSection}>
        <p>
          Already have an account?{" "}
          <button type="button" onClick={onFlip} className={styles.flipLink}>
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};
