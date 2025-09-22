import type {
  PasswordStrengthInfo,
  PasswordStrengthLevel,
} from "../_types/auth";

/**
 * Calculates password strength score based on various criteria
 * @param password - The password to analyze
 * @returns A score from 0-5 representing password strength
 */
export const calculatePasswordStrength = (
  password: string
): PasswordStrengthLevel => {
  let strength = 0;

  // Length check (8+ characters)
  if (password.length >= 8) strength++;

  // Uppercase letter check
  if (/[A-Z]/.test(password)) strength++;

  // Lowercase letter check
  if (/[a-z]/.test(password)) strength++;

  // Number check
  if (/\d/.test(password)) strength++;

  // Special character check
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  return strength as PasswordStrengthLevel;
};

/**
 * Gets password strength information including label and color
 * @param password - The password to analyze
 * @returns An object with score, label, and color
 */
export const getPasswordStrengthInfo = (
  password: string
): PasswordStrengthInfo => {
  const score = calculatePasswordStrength(password);

  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColors = [
    "",
    "#ef4444", // red-500
    "#f97316", // orange-500
    "#eab308", // yellow-500
    "#22c55e", // green-500
    "#16a34a", // green-600
  ];

  return {
    score,
    label: strengthLabels[score],
    color: strengthColors[score],
  };
};

/**
 * Validates password requirements
 * @param password - The password to validate
 * @returns An array of validation messages
 */
export const validatePasswordRequirements = (password: string): string[] => {
  const requirements = [];

  if (password.length < 8) {
    requirements.push("At least 8 characters");
  }

  if (!/[A-Z]/.test(password)) {
    requirements.push("One uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    requirements.push("One lowercase letter");
  }

  if (!/\d/.test(password)) {
    requirements.push("One number");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    requirements.push("One special character");
  }

  return requirements;
};
