/**
 * Platform Authentication Context
 * Modern React 19 Context with optimized patterns
 */

"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { platformApi, tokenStorage, getErrorMessage } from "../../client/api";
import type {
  AuthContextType,
  PlatformUser,
  LoginCredentials,
  RegisterData,
} from "../../schemas/auth/auth";

// ===== Storage Keys =====

const STORAGE_KEYS = {
  ACCESS_TOKEN: "platform_access_token",
  REFRESH_TOKEN: "platform_refresh_token",
  USER: "platform_user",
  EXPIRES_AT: "platform_expires_at",
} as const;

// ===== State Types =====

interface AuthState {
  user: PlatformUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | {
      type: "LOGIN_SUCCESS";
      payload: {
        user: PlatformUser;
        tokens: {
          accessToken: string;
          refreshToken: string;
          expiresIn: number;
        };
      };
    }
  | { type: "LOGOUT" }
  | { type: "SET_USER"; payload: PlatformUser | null }
  | { type: "SET_INITIALIZED"; payload: boolean };

// ===== Reducer =====

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
      };

    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };

    case "SET_INITIALIZED":
      return { ...state, isInitialized: action.payload };

    default:
      return state;
  }
}

// ===== Context Creation =====

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ===== Provider Component =====

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ===== Token Management =====

  const storeTokens = useCallback(
    (accessToken: string, refreshToken: string, expiresIn: number) => {
      tokenStorage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      tokenStorage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

      const expiresAt = Date.now() + expiresIn * 1000;
      tokenStorage.set(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());
    },
    []
  );

  const clearTokens = useCallback(() => {
    tokenStorage.remove(STORAGE_KEYS.ACCESS_TOKEN);
    tokenStorage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    tokenStorage.remove(STORAGE_KEYS.USER);
    tokenStorage.remove(STORAGE_KEYS.EXPIRES_AT);
  }, []);

  const storeUser = useCallback((user: PlatformUser) => {
    tokenStorage.set(STORAGE_KEYS.USER, JSON.stringify(user));
  }, []);

  // ===== Authentication Actions =====

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        const response = await platformApi.login(credentials);

        // Store tokens and user - using new backend response format
        const expiresAt = new Date(response.expiresAt).getTime();
        const expiresIn = Math.floor((expiresAt - Date.now()) / 1000);

        storeTokens(response.token, response.refreshToken, expiresIn);
        storeUser(response.user);

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: response.user,
            tokens: {
              accessToken: response.token,
              refreshToken: response.refreshToken,
              expiresIn,
            },
          },
        });
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        throw error;
      }
    },
    [storeTokens, storeUser]
  );

  const register = useCallback(async (data: RegisterData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const response = await platformApi.register(data);

      // For email verification flow, we don't automatically log the user in
      // Instead, we just return success to show the verification notice
      // The user will be logged in after email verification

      // Note: The backend still returns tokens, but we're not storing them
      // until email verification is complete
      return response;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const logout = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const refreshToken = tokenStorage.get(STORAGE_KEYS.REFRESH_TOKEN);
      if (refreshToken) {
        await platformApi.logout(refreshToken);
      }
    } catch (error) {
      console.warn("Logout request failed:", error);
    } finally {
      clearTokens();
      dispatch({ type: "LOGOUT" });
    }
  }, [clearTokens]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshTokenValue = tokenStorage.get(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshTokenValue) {
        return false;
      }

      const response = await platformApi.refreshToken(refreshTokenValue);

      // Handle new backend response format
      const expiresAt = new Date(response.expiresAt).getTime();
      const expiresIn = Math.floor((expiresAt - Date.now()) / 1000);

      storeTokens(response.token, response.refreshToken, expiresIn);

      return true;
    } catch (error) {
      console.warn("Token refresh failed:", error);
      clearTokens();
      dispatch({ type: "LOGOUT" });
      return false;
    }
  }, [storeTokens, clearTokens]);

  const clearError = useCallback(() => {
    dispatch({ type: "SET_ERROR", payload: null });
  }, []);

  // ===== Initialization =====

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = tokenStorage.get(STORAGE_KEYS.ACCESS_TOKEN);
        const userStr = tokenStorage.get(STORAGE_KEYS.USER);
        const expiresAtStr = tokenStorage.get(STORAGE_KEYS.EXPIRES_AT);

        if (accessToken && userStr && expiresAtStr) {
          const expiresAt = parseInt(expiresAtStr, 10);
          const now = Date.now();

          if (now < expiresAt) {
            // Token is still valid
            const user = JSON.parse(userStr) as PlatformUser;
            dispatch({ type: "SET_USER", payload: user });
          } else {
            // Token expired, try to refresh
            const refreshed = await refreshToken();
            if (refreshed && userStr) {
              const user = JSON.parse(userStr) as PlatformUser;
              dispatch({ type: "SET_USER", payload: user });
            }
          }
        }
      } catch (error) {
        console.warn("Auth initialization failed:", error);
        clearTokens();
      } finally {
        dispatch({ type: "SET_INITIALIZED", payload: true });
      }
    };

    initializeAuth();
  }, [refreshToken, clearTokens]);

  // ===== Context Value =====

  const contextValue = useMemo<AuthContextType>(
    () => ({
      // State
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      isInitialized: state.isInitialized,
      error: state.error,

      // Actions
      login,
      register,
      logout,
      refreshToken,
      clearError,
    }),
    [
      state.user,
      state.isAuthenticated,
      state.isLoading,
      state.isInitialized,
      state.error,
      login,
      register,
      logout,
      refreshToken,
      clearError,
    ]
  );

  // Don't render children until auth is initialized
  if (!state.isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// ===== Hook =====

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
