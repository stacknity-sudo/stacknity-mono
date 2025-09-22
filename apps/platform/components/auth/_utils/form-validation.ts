import type {
  LoginFormData,
  RegisterFormData,
  FormErrors,
} from "../_types/auth";

/**
 * Validates email format
 * @param email - Email string to validate
 * @returns true if valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validates login form data
 * @param loginData - The login form data to validate
 * @returns Object containing validation errors (empty if valid)
 */
export const validateLoginForm = (loginData: LoginFormData): FormErrors => {
  const errors: FormErrors = {};

  if (!loginData.email) {
    errors.email = "Email is required";
  } else if (!isValidEmail(loginData.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!loginData.password) {
    errors.password = "Password is required";
  } else if (loginData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};

/**
 * Validates register form data
 * @param registerData - The register form data to validate
 * @returns Object containing validation errors (empty if valid)
 */
export const validateRegisterForm = (
  registerData: RegisterFormData
): FormErrors => {
  const errors: FormErrors = {};

  // First name validation
  if (!registerData.firstName.trim()) {
    errors.firstName = "First name is required";
  } else if (registerData.firstName.length < 2) {
    errors.firstName = "First name must be at least 2 characters";
  }

  // Last name validation
  if (!registerData.lastName.trim()) {
    errors.lastName = "Last name is required";
  } else if (registerData.lastName.length < 2) {
    errors.lastName = "Last name must be at least 2 characters";
  }

  // Email validation
  if (!registerData.email) {
    errors.email = "Email is required";
  } else if (!isValidEmail(registerData.email)) {
    errors.email = "Please enter a valid email address";
  }

  // Password validation
  if (!registerData.password) {
    errors.password = "Password is required";
  } else if (registerData.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(registerData.password)) {
    errors.password = "Password must contain uppercase, lowercase, and number";
  }

  // Confirm password validation
  if (!registerData.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (registerData.password !== registerData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  // Terms acceptance validation
  if (!registerData.acceptTerms) {
    errors.acceptTerms = "You must accept the terms and conditions";
  }

  return errors;
};

/**
 * Checks if validation errors object is empty (form is valid)
 * @param errors - The errors object to check
 * @returns true if no errors, false otherwise
 */
export const isFormValid = (errors: FormErrors): boolean => {
  return Object.keys(errors).length === 0;
};
