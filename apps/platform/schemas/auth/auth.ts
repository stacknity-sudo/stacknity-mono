/**
 * Platform Authentication Types
 * Modern TypeScript definitions for Next.js 15 + React 19
 */

import { z } from "zod";

// ===== Validation Schemas =====

export const LoginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const RegisterSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be between 2 and 50 characters")
    .max(50),
  lastName: z
    .string()
    .min(2, "Last name must be between 2 and 50 characters")
    .max(50),
  email: z.string().email("Please provide a valid email address").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&].*$/,
      "Password must contain at least one lowercase, one uppercase, one digit, and one special character"
    ),
  displayName: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  phoneNumber: z.string().max(20).optional(),
  tenantName: z.string().min(1, "Tenant name is required").max(100),
  domain: z.string().max(255).optional(),
  description: z.string().max(250).optional(),
  website: z.string().url("Please provide a valid URL").max(500).optional(),
});

// ===== Type Inference =====

export type LoginCredentials = z.infer<typeof LoginSchema>;
export type RegisterData = z.infer<typeof RegisterSchema>;

// ===== API Response Types =====

export interface AuthTokenResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: PlatformUser;
}

export interface PlatformUser {
  id: number;
  name: string;
  email: string;
  displayName?: string;
  bio?: string;
  phoneNumber?: string;
  role?: string;
  createdAt: string;
}

// AuthResponse is the same as AuthTokenResponse from backend
export type AuthResponse = AuthTokenResponse;

// ===== Refresh Token Request =====

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ===== Hook State Types =====

export interface AuthState {
  user: PlatformUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginState {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

export interface RegisterState {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

// ===== API Error Types =====

export interface ApiError {
  message: string;
  status: number;
  details?: Record<string, string[]>;
}

// ===== Auth Context Type =====

export interface AuthContextType {
  // State
  user: PlatformUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<AuthTokenResponse>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;

  // Utils
  clearError: () => void;
  error: string | null;
}

// ===== Storage Keys =====

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: "platform_access_token",
  REFRESH_TOKEN: "platform_refresh_token",
  USER: "platform_user",
  EXPIRES_AT: "platform_expires_at",
} as const;
