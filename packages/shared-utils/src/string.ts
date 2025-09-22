/**
 * String manipulation and text utilities
 */

export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

export const truncateText = (
  text: string,
  maxLength: number,
  suffix: string = "..."
): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length).trim() + suffix;
};

export const capitalizeFirst = (text: string): string => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const capitalizeWords = (text: string): string => {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => capitalizeFirst(word))
    .join(" ");
};

export const camelToKebab = (text: string): string => {
  return text.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
};

export const kebabToCamel = (text: string): string => {
  return text.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

export const snakeToCamel = (text: string): string => {
  return text.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

export const camelToSnake = (text: string): string => {
  return text.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1_$2").toLowerCase();
};

export const generateId = (length: number = 12): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateUUID = (): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for environments without crypto.randomUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const removeSpecialChars = (text: string): string => {
  return text.replace(/[^a-zA-Z0-9\s]/g, "");
};

export const extractInitials = (
  name: string,
  maxLength: number = 2
): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, maxLength)
    .join("");
};

export const maskEmail = (email: string): string => {
  const [username, domain] = email.split("@");
  if (!username || !domain) return email;

  if (username.length <= 2) {
    return `${username[0]}***@${domain}`;
  }

  const visibleChars = Math.max(1, Math.floor(username.length / 3));
  const maskedLength = username.length - visibleChars * 2;
  const masked = "*".repeat(maskedLength);

  return `${username.slice(0, visibleChars)}${masked}${username.slice(
    -visibleChars
  )}@${domain}`;
};

export const formatPhoneNumber = (
  phone: string,
  format: "US" | "international" = "US"
): string => {
  const digits = phone.replace(/\D/g, "");

  if (format === "US" && digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  if (format === "international" && digits.length >= 10) {
    const countryCode = digits.length > 10 ? digits.slice(0, -10) : "";
    const number = digits.slice(-10);
    return countryCode ? `+${countryCode} ${number}` : number;
  }

  return phone;
};

export const pluralize = (
  count: number,
  singular: string,
  plural?: string
): string => {
  const pluralForm = plural || `${singular}s`;
  return count === 1 ? `${count} ${singular}` : `${count} ${pluralForm}`;
};

export const escapeHtml = (text: string): string => {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };

  return text.replace(/[&<>"'/]/g, (match) => htmlEscapes[match] || match);
};

export const unescapeHtml = (text: string): string => {
  const htmlUnescapes: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#x27;": "'",
    "&#x2F;": "/",
  };

  return text.replace(
    /&(?:amp|lt|gt|quot|#x27|#x2F);/g,
    (match) => htmlUnescapes[match] || match
  );
};

export const isValidUsername = (username: string): boolean => {
  // Username must be 3-30 characters, alphanumeric plus underscores and hyphens
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  return usernameRegex.test(username);
};

export const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[<>:"/\\|?*]/g, "") // Remove invalid file name characters
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/_{2,}/g, "_") // Replace multiple underscores with single
    .replace(/^_+|_+$/g, ""); // Remove leading/trailing underscores
};
