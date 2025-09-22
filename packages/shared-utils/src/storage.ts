/**
 * Storage utilities for localStorage, sessionStorage, and custom adapters
 */

export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
  key(index: number): string | null;
  get length(): number;
}

export class LocalStorageAdapter implements StorageAdapter {
  getItem(key: string): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  }

  clear(): void {
    if (typeof window === "undefined") return;
    localStorage.clear();
  }

  key(index: number): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.key(index);
  }

  get length(): number {
    if (typeof window === "undefined") return 0;
    return localStorage.length;
  }
}

export class SessionStorageAdapter implements StorageAdapter {
  getItem(key: string): string | null {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(key);
  }

  clear(): void {
    if (typeof window === "undefined") return;
    sessionStorage.clear();
  }

  key(index: number): string | null {
    if (typeof window === "undefined") return null;
    return sessionStorage.key(index);
  }

  get length(): number {
    if (typeof window === "undefined") return 0;
    return sessionStorage.length;
  }
}

export class MemoryStorageAdapter implements StorageAdapter {
  private storage = new Map<string, string>();

  getItem(key: string): string | null {
    return this.storage.get(key) || null;
  }

  setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }

  removeItem(key: string): void {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }

  key(index: number): string | null {
    const keys = Array.from(this.storage.keys());
    return keys[index] || null;
  }

  get length(): number {
    return this.storage.size;
  }
}

export interface StorageOptions {
  prefix?: string;
  serializer?: {
    stringify: (value: any) => string;
    parse: (value: string) => any;
  };
  expirationInMinutes?: number;
}

export class Storage {
  private adapter: StorageAdapter;
  private options: StorageOptions;

  constructor(adapter: StorageAdapter, options: StorageOptions = {}) {
    this.adapter = adapter;
    this.options = {
      prefix: "",
      serializer: JSON,
      ...options,
    };
  }

  private getKey(key: string): string {
    return this.options.prefix ? `${this.options.prefix}:${key}` : key;
  }

  private isExpired(item: StorageItem): boolean {
    if (!item.expiresAt) return false;
    return Date.now() > item.expiresAt;
  }

  get<T = any>(key: string): T | null {
    try {
      const storageKey = this.getKey(key);
      const value = this.adapter.getItem(storageKey);

      if (!value) return null;

      const item: StorageItem = this.options.serializer!.parse(value);

      if (this.isExpired(item)) {
        this.remove(key);
        return null;
      }

      return item.value;
    } catch {
      return null;
    }
  }

  set<T = any>(key: string, value: T): void {
    try {
      const storageKey = this.getKey(key);
      const expiresAt = this.options.expirationInMinutes
        ? Date.now() + this.options.expirationInMinutes * 60 * 1000
        : undefined;

      const item: StorageItem = {
        value,
        createdAt: Date.now(),
        expiresAt,
      };

      const serializedItem = this.options.serializer!.stringify(item);
      this.adapter.setItem(storageKey, serializedItem);
    } catch (error) {
      console.error("Failed to set storage item:", error);
    }
  }

  remove(key: string): void {
    const storageKey = this.getKey(key);
    this.adapter.removeItem(storageKey);
  }

  clear(): void {
    if (this.options.prefix) {
      // Only clear items with the prefix
      for (let i = this.adapter.length - 1; i >= 0; i--) {
        const key = this.adapter.key(i);
        if (key?.startsWith(this.options.prefix)) {
          this.adapter.removeItem(key);
        }
      }
    } else {
      this.adapter.clear();
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  keys(): string[] {
    const keys: string[] = [];
    const prefix = this.options.prefix;

    for (let i = 0; i < this.adapter.length; i++) {
      const key = this.adapter.key(i);
      if (key) {
        if (prefix && key.startsWith(prefix)) {
          keys.push(key.substring(prefix.length + 1));
        } else if (!prefix) {
          keys.push(key);
        }
      }
    }

    return keys;
  }

  getAll(): Record<string, any> {
    const items: Record<string, any> = {};
    const keys = this.keys();

    keys.forEach((key) => {
      const value = this.get(key);
      if (value !== null) {
        items[key] = value;
      }
    });

    return items;
  }

  size(): number {
    return this.keys().length;
  }
}

interface StorageItem {
  value: any;
  createdAt: number;
  expiresAt?: number;
}

// Factory functions
export const createStorage = (
  adapter?: StorageAdapter,
  options?: StorageOptions
): Storage => {
  const defaultAdapter =
    typeof window !== "undefined"
      ? new LocalStorageAdapter()
      : new MemoryStorageAdapter();

  return new Storage(adapter || defaultAdapter, options);
};

export const createLocalStorage = (options?: StorageOptions): Storage => {
  return createStorage(new LocalStorageAdapter(), options);
};

export const createSessionStorage = (options?: StorageOptions): Storage => {
  return createStorage(new SessionStorageAdapter(), options);
};

export const createMemoryStorage = (options?: StorageOptions): Storage => {
  return createStorage(new MemoryStorageAdapter(), options);
};

// Utility functions
export const isStorageAvailable = (
  type: "localStorage" | "sessionStorage"
): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const storage = window[type];
    const test = "__storage_test__";
    storage.setItem(test, test);
    storage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

export const getStorageSize = (adapter: StorageAdapter): number => {
  let total = 0;

  for (let i = 0; i < adapter.length; i++) {
    const key = adapter.key(i);
    if (key) {
      const value = adapter.getItem(key);
      if (value) {
        total += key.length + value.length;
      }
    }
  }

  return total;
};

export const clearExpiredItems = (storage: Storage): void => {
  const keys = storage.keys();

  keys.forEach((key) => {
    storage.get(key); // This will automatically remove expired items
  });
};
