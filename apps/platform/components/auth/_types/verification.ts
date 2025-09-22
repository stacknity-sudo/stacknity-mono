export type VerificationStatus =
  | "loading"
  | "success"
  | "error"
  | "expired"
  | "invalid";

export interface VerificationState {
  status: VerificationStatus;
  message: string;
  email: string | null;
  canResend: boolean;
  resendCooldown: number;
}

export interface VerificationResponse {
  success: boolean;
  message: string;
  isVerified: boolean;
  // Optional authentication data if backend provides it
  token?: string;
  refreshToken?: string;
  expiresAt?: string;
  user?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    bio?: string;
    phoneNumber?: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ResendResponse {
  success: boolean;
  message: string;
}

export interface VerificationUrlParams {
  token: string | null;
  email: string | null;
}
