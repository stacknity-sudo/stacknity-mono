/**
 * Modern API client utilities with TypeScript support
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  interceptors?: {
    request?: (config: RequestInit) => RequestInit | Promise<RequestInit>;
    response?: (response: Response) => Response | Promise<Response>;
    error?: (error: Error) => void;
  };
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export class ApiClient {
  private config: Required<Omit<ApiClientConfig, "interceptors">> &
    Pick<ApiClientConfig, "interceptors">;

  constructor(config: ApiClientConfig) {
    this.config = {
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
      interceptors: config.interceptors,
    };
  }

  private async request<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseURL}${endpoint}`;

    let requestConfig: RequestInit = {
      ...options,
      headers: {
        ...this.config.headers,
        ...options.headers,
      },
    };

    // Apply request interceptor
    if (this.config.interceptors?.request) {
      requestConfig = await this.config.interceptors.request(requestConfig);
    }

    // Set up abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...requestConfig,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Apply response interceptor
      const processedResponse = this.config.interceptors?.response
        ? await this.config.interceptors.response(response.clone())
        : response;

      if (!processedResponse.ok) {
        const errorData = (await this.parseResponseData(
          processedResponse.clone()
        )) as any;
        const error = new ApiError(
          errorData?.message ||
            processedResponse.statusText ||
            "Request failed",
          processedResponse.status,
          errorData?.code,
          errorData
        );

        this.config.interceptors?.error?.(error);
        throw error;
      }

      const data = await this.parseResponseData<T>(processedResponse);

      return {
        data,
        status: processedResponse.status,
        statusText: processedResponse.statusText,
        headers: processedResponse.headers,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === "AbortError") {
        const timeoutError = new ApiError("Request timeout", 408, "TIMEOUT");
        this.config.interceptors?.error?.(timeoutError);
        throw timeoutError;
      }

      const networkError = new ApiError(
        "Network error occurred",
        0,
        "NETWORK_ERROR",
        error
      );
      this.config.interceptors?.error?.(networkError);
      throw networkError;
    }
  }

  private async parseResponseData<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return response.json();
    }

    if (contentType?.includes("text/")) {
      return response.text() as unknown as T;
    }

    return response.blob() as unknown as T;
  }

  async get<T = unknown>(
    endpoint: string,
    params?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    const url = params
      ? `${endpoint}?${new URLSearchParams(params as Record<string, string>)}`
      : endpoint;
    return this.request<T>(url, { method: "GET" });
  }

  async post<T = unknown>(
    endpoint: string,
    data?: unknown
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = unknown>(
    endpoint: string,
    data?: unknown
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T = unknown>(
    endpoint: string,
    data?: unknown
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = unknown>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  async upload<T = unknown>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const headers = { ...this.config.headers };
    delete headers["Content-Type"]; // Let the browser set it for FormData

    return this.request<T>(endpoint, {
      method: "POST",
      body: formData,
      headers,
    });
  }

  setHeader(key: string, value: string): void {
    this.config.headers[key] = value;
  }

  removeHeader(key: string): void {
    delete this.config.headers[key];
  }

  setAuthToken(token: string): void {
    this.setHeader("Authorization", `Bearer ${token}`);
  }

  removeAuthToken(): void {
    this.removeHeader("Authorization");
  }
}

export const createApiClient = (config: ApiClientConfig): ApiClient => {
  return new ApiClient(config);
};

// Utility functions for common API patterns
export const createAuthInterceptor = (getToken: () => string | null) => {
  return {
    request: (config: RequestInit) => {
      const token = getToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return config;
    },
  };
};

export const createRetryInterceptor = (
  maxRetries: number = 3,
  retryDelay: number = 1000
) => {
  return {
    error: async (error: Error) => {
      if (
        error instanceof ApiError &&
        error.statusCode >= 500 &&
        maxRetries > 0
      ) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        // Note: Actual retry logic would need to be implemented at the request level
      }
    },
  };
};

export const createTenantInterceptor = (
  getTenantId: () => string | null,
  headerName: string = "X-Tenant-ID"
) => {
  return {
    request: (config: RequestInit) => {
      const tenantId = getTenantId();
      if (tenantId) {
        config.headers = {
          ...config.headers,
          [headerName]: tenantId,
        };
      }
      return config;
    },
  };
};
