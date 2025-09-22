/**
 * Platform API Client
 * Modern fetch-based client for Next.js 15 + React 19
 */

import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  PlatformUser,
  AuthTokenResponse,
} from "../schemas/auth/auth";

// ===== Configuration =====

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5275"; // Backend URL
const API_ENDPOINTS = {
  login: "/api/auth/login",
  register: "/api/auth/register",
  refresh: "/api/auth/refresh",
  logout: "/api/auth/logout",
  me: "/api/auth/me",
} as const;

// ===== Custom Error Class =====

export class ApiException extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiException";
  }
}

// ===== HTTP Client =====

class PlatformApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      mode: "cors", // Enable CORS
      credentials: "omit", // Don't send cookies for security
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      const isJson = contentType?.includes("application/json");

      if (!response.ok) {
        let errorData: {
          message?: string;
          details?: Record<string, string[]>;
        } = {};

        if (isJson) {
          errorData = await response.json();
        } else {
          errorData = { message: response.statusText };
        }

        throw new ApiException(
          errorData.message || "An error occurred",
          response.status,
          errorData.details
        );
      }

      // Handle successful responses
      if (isJson) {
        return (await response.json()) as T;
      }

      // Handle non-JSON success responses (like 204 No Content)
      return {} as T;
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }

      // Network or other errors
      throw new ApiException(
        error instanceof Error ? error.message : "Network error occurred",
        0
      );
    }
  }

  private async requestWithAuth<T>(
    endpoint: string,
    accessToken: string,
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      },
    });
  }

  // ===== Authentication Methods =====

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>(API_ENDPOINTS.login, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>(API_ENDPOINTS.register, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async refreshToken(refreshToken: string): Promise<AuthTokenResponse> {
    return this.request<AuthTokenResponse>(API_ENDPOINTS.refresh, {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  }

  async logout(refreshToken: string): Promise<void> {
    await this.request<void>(API_ENDPOINTS.logout, {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  }

  async getMe(accessToken: string): Promise<PlatformUser> {
    return this.requestWithAuth<PlatformUser>(API_ENDPOINTS.me, accessToken);
  }
}

// ===== Singleton Instance =====

export const platformApi = new PlatformApiClient();

// ===== Error Helper =====

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiException) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}

// ===== Token Storage Utilities =====

export const tokenStorage = {
  get: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  },

  set: (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, value);
  },

  remove: (key: string): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  },

  clear: (): void => {
    if (typeof window === "undefined") return;
    localStorage.clear();
  },
};
