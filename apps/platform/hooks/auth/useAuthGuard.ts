"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-context";

/**
 * Modern React 19 hook for protecting routes that require authentication
 * Uses latest patterns: useCallback for stable function references
 * Redirects to login if user is not authenticated
 */
export function useAuthGuard(redirectTo: string = "/login") {
  const { user, isAuthenticated, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  // Memoize the redirect logic to prevent unnecessary re-runs
  const handleRedirect = useCallback(() => {
    // Wait for auth to initialize before making decisions
    if (!isInitialized || isLoading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated || !user) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isInitialized, isLoading, user, router, redirectTo]);

  // Effect only runs when redirect logic dependencies change
  useEffect(() => {
    handleRedirect();
  }, [handleRedirect]);

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || !isInitialized,
    isReady: isInitialized && !isLoading && isAuthenticated && user,
  };
}

/**
 * Modern React 19 hook for protecting admin routes with role-based access
 * Uses useCallback for optimal performance and proper dependency management
 */
export function useAdminGuard(
  requiredRoles: readonly string[] = ["admin", "super_admin"] as const,
  redirectTo: string = "/dashboard"
) {
  const authGuard = useAuthGuard();
  const router = useRouter();

  // Memoize role checking logic
  const hasAdminAccess = useCallback((): boolean => {
    if (!authGuard.isReady || !authGuard.user?.role) return false;

    const userRole = authGuard.user.role.toLowerCase();
    return requiredRoles.includes(userRole);
  }, [authGuard.isReady, authGuard.user?.role, requiredRoles]);

  // Memoize admin redirect logic
  const handleAdminRedirect = useCallback(() => {
    if (!authGuard.isReady) return;

    if (!hasAdminAccess()) {
      router.push(redirectTo);
    }
  }, [authGuard.isReady, hasAdminAccess, router, redirectTo]);

  // Effect with proper dependency management
  useEffect(() => {
    handleAdminRedirect();
  }, [handleAdminRedirect]);

  return {
    ...authGuard,
    hasAdminAccess: hasAdminAccess(),
  };
}
