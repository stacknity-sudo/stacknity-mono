export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface PasswordStrengthInfo {
  score: number;
  label: string;
  color: string;
}

export type PasswordStrengthLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface AuthFormState {
  loginData: LoginFormData;
  registerData: RegisterFormData;
  loginErrors: FormErrors;
  registerErrors: FormErrors;
  showLoginPassword: boolean;
  showRegisterPassword: boolean;
  showConfirmPassword: boolean;
  isLoginLoading: boolean;
  isRegisterLoading: boolean;
}

export interface FlipCardProps {
  isFlipped: boolean;
  onFlip: () => void;
  children: React.ReactNode;
}

export interface BrandContentItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}
