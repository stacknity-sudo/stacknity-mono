"use client";

import React from "react";
import { motion } from "motion/react";
import { Button, Input } from "@stacknity/shared-ui";
import Image from "next/image";
import Link from "next/link";
import { FiEye, FiEyeOff, FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import type { LoginFormData, FormErrors } from "../_types/auth";
import styles from "../_styles/AuthContainer.module.css";

interface LoginFormProps {
  loginData: LoginFormData;
  loginErrors: FormErrors;
  showPassword: boolean;
  isLoading: boolean;
  logoSrc: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTogglePassword: () => void;
  onFlip: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  loginData,
  loginErrors,
  showPassword,
  isLoading,
  logoSrc,
  onInputChange,
  onSubmit,
  onTogglePassword,
  onFlip,
}) => {
  return (
    <div className={styles.formWrapper}>
      {/* Logo */}
      <motion.div
        className={styles.logoContainer}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
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
      </motion.div>

      {/* Welcome Text */}
      <motion.div
        className={styles.welcomeSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>
          Sign in to your account to continue your journey
        </p>
      </motion.div>

      {/* Login Form */}
      <motion.form
        className={styles.form}
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <Input
              id="login-email"
              name="email"
              type="email"
              label="Email address"
              placeholder="Email"
              value={loginData.email}
              onChange={onInputChange}
              error={loginErrors.email}
              variant="outlined"
              size="medium"
              fullWidth
              leftIcon={<FiMail />}
              leftIconColor="var(--cool-teal)"
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <Input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Password"
              value={loginData.password}
              onChange={onInputChange}
              error={loginErrors.password}
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
        </div>

        <div className={styles.formOptions}>
          <label className={styles.checkbox}>
            <input type="checkbox" />
            <span className={styles.checkmark}></span>
            Remember me
          </label>
          <Link href="/forgot-password" className={styles.forgotLink}>
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="large"
          fullWidth
          loading={isLoading}
          rightIcon={!isLoading ? <FiArrowRight /> : undefined}
          className={styles.submitButton}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </motion.form>

      {/* Sign Up Link with Flip Trigger */}
      <motion.div
        className={styles.signupSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <p>
          Don&apos;t have an account?{" "}
          <button type="button" onClick={onFlip} className={styles.flipLink}>
            Create one now
          </button>
        </p>
      </motion.div>
    </div>
  );
};
