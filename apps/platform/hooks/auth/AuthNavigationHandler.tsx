"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./auth-context";

/**
 * Component that handles navigation after authentication state changes
 */
export function AuthNavigationHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized } = useAuth();

  useEffect(() => {
    // Only proceed if auth is initialized
    if (!isInitialized) return;

    // If user just authenticated and is on auth pages, redirect to dashboard
    if (isAuthenticated && isOnAuthPage(pathname)) {
      console.log("User authenticated, redirecting to dashboard...");
      router.push("/dashboard");
    }

    // If user is not authenticated and trying to access protected pages, redirect to auth
    if (!isAuthenticated && isProtectedPage(pathname)) {
      console.log("User not authenticated, redirecting to login...");
      router.push("/auth");
    }
  }, [isAuthenticated, isInitialized, pathname, router]);

  return null; // This component doesn't render anything
}

/**
 * Check if current path is an authentication page
 */
function isOnAuthPage(pathname: string): boolean {
  const authPaths = ["/auth", "/login", "/signup", "/verify"];
  return authPaths.some((path) => pathname.startsWith(path));
}

/**
 * Check if current path requires authentication
 */
function isProtectedPage(pathname: string): boolean {
  const protectedPaths = ["/dashboard"];
  const publicPaths = ["/", "/auth", "/login", "/signup", "/verify"];

  // If it's a known public path, it's not protected
  if (
    publicPaths.some((path) => pathname === path || pathname.startsWith(path))
  ) {
    return false;
  }

  // If it's a known protected path, it's protected
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    return true;
  }

  // Default to protected for unknown paths
  return true;
}
