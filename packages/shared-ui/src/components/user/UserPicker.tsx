"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./UserPicker.module.css";
import type { OrganizationMember } from "@/lib/types/organization";
import { IoClose, IoCheckmark } from "react-icons/io5";

export type UserRef = {
  id: string;
  label: string;
  sub?: string | null;
  avatarUrl?: string | null;
};

export type UserPickerProps = {
  members: OrganizationMember[];
  value: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
  ariaLabel?: string;
};

export function UserPicker({
  members,
  value,
  onChange,
  placeholder = "Search members…",
  ariaLabel = "User picker",
}: UserPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const options: UserRef[] = useMemo(
    () =>
      members.map((m) => ({
        id: m.userId,
        label: m.user.account?.displayName || m.user.name || m.user.email,
        sub: m.user.email,
        avatarUrl: m.user.account?.avatarUrl || null,
      })),
    [members]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.sub || "").toLowerCase().includes(q)
    );
  }, [options, query]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const add = (id: string) => {
    if (value.includes(id)) return;
    onChange([...value, id]);
    setQuery("");
    inputRef.current?.focus();
  };
  const remove = (id: string) => onChange(value.filter((v) => v !== id));

  const selectedMap = useMemo(() => new Set(value), [value]);

  return (
    <div className={styles.picker} ref={containerRef} aria-label={ariaLabel}>
      <div className={styles.control} onClick={() => inputRef.current?.focus()}>
        {value
          .map((id) => options.find((o) => o.id === id))
          .filter(Boolean)
          .map((o) => (
            <span key={o!.id} className={styles.chip}>
              {o!.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={o!.avatarUrl!}
                  alt={o!.label}
                  className={styles.chipAvatar}
                />
              ) : (
                <span className={styles.chipAvatar} />
              )}
              <span>{o!.label}</span>
              <button
                type="button"
                className={styles.chipRemove}
                aria-label={`Remove ${o!.label}`}
                onClick={(e) => {
                  e.stopPropagation();
                  remove(o!.id);
                }}
              >
                <IoClose />
              </button>
            </span>
          ))}
        <input
          ref={inputRef}
          className={styles.input}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
        />
      </div>
      {open && (
        <div className={styles.dropdown} role="listbox">
          <div className={styles.searchRow}>
            <input
              className={styles.searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
            />
          </div>
          <div className={styles.list}>
            {filtered.length === 0 ? (
              <div className={styles.item} aria-disabled>
                No members
              </div>
            ) : (
              filtered.map((o) => (
                <div
                  key={o.id}
                  className={styles.item}
                  role="option"
                  aria-selected={selectedMap.has(o.id)}
                  onClick={() => add(o.id)}
                >
                  {o.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={o.avatarUrl}
                      alt={o.label}
                      className={styles.itemAvatar}
                    />
                  ) : (
                    <span className={styles.itemAvatar} />
                  )}
                  <span className={styles.itemText}>
                    <span className={styles.itemLabel}>{o.label}</span>
                    {o.sub && <span className={styles.itemSub}>{o.sub}</span>}
                  </span>
                  {selectedMap.has(o.id) && (
                    <span className={styles.check}>
                      <IoCheckmark />
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserPicker;
