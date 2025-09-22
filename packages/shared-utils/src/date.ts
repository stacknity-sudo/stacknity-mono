/**
 * Date and time utility functions using modern JavaScript Date API
 */

export const formatDate = (
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {}
): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  try {
    const parsedDate = new Date(date);
    if (!isValidDate(parsedDate)) {
      throw new Error("Invalid date");
    }

    return new Intl.DateTimeFormat("en-US", {
      ...defaultOptions,
      ...options,
    }).format(parsedDate);
  } catch {
    return "Invalid Date";
  }
};

export const parseDate = (dateString: string): Date | null => {
  try {
    const date = new Date(dateString);
    return isValidDate(date) ? date : null;
  } catch {
    return null;
  }
};

export const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const getDaysDifference = (
  date1: Date | string,
  date2: Date | string
): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  if (!isValidDate(d1) || !isValidDate(d2)) {
    throw new Error("Invalid date(s) provided");
  }

  const timeDiff = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

export const addDays = (date: Date | string, days: number): Date => {
  const baseDate = new Date(date);
  if (!isValidDate(baseDate)) {
    throw new Error("Invalid date provided");
  }

  const result = new Date(baseDate);
  result.setDate(result.getDate() + days);
  return result;
};

export const formatRelativeTime = (
  date: Date | string,
  locale: string = "en-US"
): string => {
  try {
    const targetDate = new Date(date);
    if (!isValidDate(targetDate)) {
      throw new Error("Invalid date");
    }

    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - targetDate.getTime()) / 1000
    );

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

    if (Math.abs(diffInSeconds) < 60) {
      return rtf.format(-diffInSeconds, "second");
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (Math.abs(diffInMinutes) < 60) {
      return rtf.format(-diffInMinutes, "minute");
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (Math.abs(diffInHours) < 24) {
      return rtf.format(-diffInHours, "hour");
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (Math.abs(diffInDays) < 30) {
      return rtf.format(-diffInDays, "day");
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (Math.abs(diffInMonths) < 12) {
      return rtf.format(-diffInMonths, "month");
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return rtf.format(-diffInYears, "year");
  } catch {
    return "Invalid date";
  }
};

export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
};

export const getWeekRange = (
  date: Date | string
): { start: Date; end: Date } => {
  const baseDate = new Date(date);
  if (!isValidDate(baseDate)) {
    throw new Error("Invalid date provided");
  }

  const start = new Date(baseDate);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

export const getMonthRange = (
  date: Date | string
): { start: Date; end: Date } => {
  const baseDate = new Date(date);
  if (!isValidDate(baseDate)) {
    throw new Error("Invalid date provided");
  }

  const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const end = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  return { start, end };
};
