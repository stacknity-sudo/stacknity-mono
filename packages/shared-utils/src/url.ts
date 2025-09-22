/**
 * URL and routing utilities
 */

export const buildUrl = (
  baseUrl: string,
  path?: string,
  params?: Record<string, string | number | boolean | undefined | null>
): string => {
  let url = baseUrl;

  if (path) {
    url = url.endsWith("/")
      ? url + path.replace(/^\//, "")
      : url + "/" + path.replace(/^\//, "");
  }

  if (params) {
    const searchParams = createQueryString(params);
    if (searchParams) {
      url += (url.includes("?") ? "&" : "?") + searchParams;
    }
  }

  return url;
};

export const parseQueryString = (
  queryString: string
): Record<string, string> => {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(queryString.replace(/^\?/, ""));

  for (const [key, value] of searchParams) {
    params[key] = value;
  }

  return params;
};

export const createQueryString = (
  params: Record<string, string | number | boolean | undefined | null>
): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const getBaseUrl = (): string => {
  if (typeof window === "undefined") {
    return "";
  }

  return `${window.location.protocol}//${window.location.host}`;
};

export const getCurrentUrl = (): string => {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.href;
};

export const getPathname = (): string => {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.pathname;
};

export const getQueryParams = (): Record<string, string> => {
  if (typeof window === "undefined") {
    return {};
  }

  return parseQueryString(window.location.search);
};

export const updateQueryParams = (
  params: Record<string, string | number | boolean | undefined | null>,
  replace: boolean = false
): void => {
  if (typeof window === "undefined") return;

  const currentParams = getQueryParams();
  const newParams = replace ? params : { ...currentParams, ...params };
  const queryString = createQueryString(newParams);

  const newUrl = `${window.location.pathname}${
    queryString ? "?" + queryString : ""
  }`;

  if (replace) {
    window.history.replaceState({}, "", newUrl);
  } else {
    window.history.pushState({}, "", newUrl);
  }
};

export const removeQueryParam = (key: string): void => {
  if (typeof window === "undefined") return;

  const params = getQueryParams();
  delete params[key];

  const queryString = createQueryString(params);
  const newUrl = `${window.location.pathname}${
    queryString ? "?" + queryString : ""
  }`;

  window.history.replaceState({}, "", newUrl);
};

export const getDomain = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
};

export const getProtocol = (url: string): string => {
  try {
    return new URL(url).protocol;
  } catch {
    return "";
  }
};

export const joinPaths = (...paths: string[]): string => {
  return paths
    .map((path, index) => {
      if (index === 0) {
        return path.replace(/\/$/, "");
      }
      return path.replace(/^\/+|\/+$/g, "");
    })
    .filter(Boolean)
    .join("/");
};

export const isExternalUrl = (url: string): boolean => {
  if (!isValidUrl(url)) return false;

  const currentHost =
    typeof window !== "undefined" ? window.location.hostname : "";
  const urlHost = getDomain(url);

  return urlHost !== "" && urlHost !== currentHost;
};

export const addTrailingSlash = (url: string): string => {
  return url.endsWith("/") ? url : url + "/";
};

export const removeTrailingSlash = (url: string): string => {
  return url.replace(/\/+$/, "");
};

export const normalizeUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    return parsed.toString();
  } catch {
    return url;
  }
};

// Next.js specific utilities
export const createNextUrl = (
  pathname: string,
  params?: Record<string, string | number>,
  query?: Record<string, string | number>
): string => {
  let url = pathname;

  // Replace dynamic segments
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`[${key}]`, String(value));
      url = url.replace(`[...${key}]`, String(value));
    });
  }

  // Add query parameters
  if (query) {
    const queryString = createQueryString(query);
    if (queryString) {
      url += "?" + queryString;
    }
  }

  return url;
};

export const parseNextDynamicRoute = (
  pattern: string,
  pathname: string
): Record<string, string> | null => {
  const patternParts = pattern.split("/");
  const pathParts = pathname.split("/");

  if (patternParts.length !== pathParts.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart?.startsWith("[") && patternPart.endsWith("]")) {
      const paramName = patternPart.slice(1, -1);
      if (paramName) {
        params[paramName] = pathPart || "";
      }
    } else if (patternPart !== pathPart) {
      return null;
    }
  }

  return params;
};
