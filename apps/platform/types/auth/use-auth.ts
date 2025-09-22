/**
 * Platform Authentication Hooks
 * Modern React 19 hooks with React Query integration
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../hooks/auth/auth-context";
import { LoginSchema, RegisterSchema } from "../../schemas/auth/auth";
import type { LoginCredentials, RegisterData } from "../../schemas/auth/auth";

// ===== Query Keys =====

export const AUTH_QUERY_KEYS = {
  user: ["auth", "user"] as const,
  session: ["auth", "session"] as const,
} as const;

// ===== useLogin Hook =====

export function useLogin() {
  const { login, error, clearError } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // Validate input
      const validated = LoginSchema.parse(credentials);
      await login(validated);
    },
    onSuccess: () => {
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.session });
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  return {
    login: mutation.mutate,
    loginAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error?.message || error,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    reset: () => {
      mutation.reset();
      clearError();
    },
  };
}

// ===== useRegister Hook =====

export function useRegister() {
  const { register, error, clearError } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      // Validate input
      const validated = RegisterSchema.parse(data);
      await register(validated);
    },
    onSuccess: () => {
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.session });
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });

  return {
    register: mutation.mutate,
    registerAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error?.message || error,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    reset: () => {
      mutation.reset();
      clearError();
    },
  };
}

// ===== useLogout Hook =====

export function useLogout() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });

  return {
    logout: mutation.mutate,
    logoutAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}

// ===== useAuthState Hook (Optimized) =====

/**
 * Lightweight hook that only subscribes to auth state changes
 * Use this when you only need to read auth state without actions
 */
export function useAuthState() {
  const { user, isAuthenticated, isLoading, error } = useAuth();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
  };
}

// ===== useRequireAuth Hook =====

/**
 * Hook that redirects to login if user is not authenticated
 * Use this in protected components/pages
 */
export function useRequireAuth(redirectTo = "/auth/login") {
  const { isAuthenticated, isLoading } = useAuth();

  // In a real app, you'd use Next.js router here
  // This is a placeholder for the redirect logic
  const shouldRedirect = !isLoading && !isAuthenticated;

  return {
    isAuthenticated,
    isLoading,
    shouldRedirect,
    redirectTo,
  };
}

// ===== useTokenRefresh Hook =====

/**
 * Hook for manual token refresh
 * Useful for long-running operations
 */
export function useTokenRefresh() {
  const { refreshToken } = useAuth();

  const mutation = useMutation({
    mutationFn: refreshToken,
    onError: (error) => {
      console.error("Token refresh failed:", error);
    },
  });

  return {
    refresh: mutation.mutate,
    refreshAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
}
