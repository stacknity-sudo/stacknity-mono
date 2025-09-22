"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { OrganizationMember } from "@/lib/types/organization";

type MentionInputProps = {
  value: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
  placeholder?: string;
  members: OrganizationMember[];
  inputStyle?: React.CSSProperties;
};

export function MentionInput({
  value,
  onChange,
  onEnter,
  placeholder,
  members,
  inputStyle,
}: MentionInputProps) {
  const ref = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [triggerPos, setTriggerPos] = useState<number | null>(null);
  const [cursor, setCursor] = useState<number>(0);

  const options = useMemo(
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
    if (!q) return options.slice(0, 8);
    return options
      .filter(
        (o) =>
          o.label.toLowerCase().includes(q) ||
          (o.sub || "").toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [options, query]);

  // Track cursor for mention detection
  const updateCursor = () => {
    const el = ref.current;
    if (!el) return;
    setCursor(el.selectionStart || 0);
  };

  // Detect mention trigger on value/query change
  useEffect(() => {
    const i = cursor;
    const text = value;
    // Find last '@' before cursor not separated by whitespace
    let start = -1;
    for (let p = i - 1; p >= 0; p--) {
      const ch = text[p];
      if (ch === "@") {
        start = p;
        break;
      }
      if (/[\s\n\t]/.test(ch)) break;
    }
    if (start >= 0) {
      const q = text.slice(start + 1, i);
      // Only letters/numbers/_ in query
      if (/^[A-Za-z0-9_]*$/.test(q)) {
        setTriggerPos(start);
        setQuery(q);
        setOpen(true);
        return;
      }
    }
    setOpen(false);
    setTriggerPos(null);
    setQuery("");
  }, [cursor, value]);

  const insertMention = (opt: { id: string; label: string }) => {
    if (triggerPos === null) return;
    const before = value.slice(0, triggerPos);
    const after = value.slice(cursor);
    // Insert as @Label; optionally include hidden id markup later
    const mentionText = `@${opt.label} `;
    const next = before + mentionText + after;
    onChange(next);
    setOpen(false);
    setTriggerPos(null);
    setQuery("");
    // Move caret to just after the inserted mention
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const newPos = (before + mentionText).length;
      el.setSelectionRange(newPos, newPos);
      el.focus();
      setCursor(newPos);
    });
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        ref={ref}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (open) {
              // When menu open, pick the first option with Enter
              e.preventDefault();
              const first = filtered[0];
              if (first) insertMention(first);
              return;
            }
            onEnter?.();
          }
        }}
        onClick={updateCursor}
        onKeyUp={updateCursor}
        onFocus={updateCursor}
        style={inputStyle}
      />
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "var(--surface-primary)",
            border: "1px solid var(--border-primary)",
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            zIndex: 30,
            maxHeight: 220,
            overflowY: "auto",
          }}
          role="listbox"
        >
          {filtered.length === 0 ? (
            <div style={{ padding: 8, fontSize: 13, opacity: 0.8 }}>
              No matches
            </div>
          ) : (
            filtered.map((o) => (
              <div
                key={o.id}
                role="option"
                aria-selected={false}
                onMouseDown={(e) => {
                  e.preventDefault();
                  insertMention(o);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  cursor: "pointer",
                }}
              >
                {o.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={o.avatarUrl}
                    alt={o.label}
                    style={{ width: 22, height: 22, borderRadius: 999 }}
                  />
                ) : (
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 999,
                      background: "var(--surface-secondary)",
                    }}
                  />
                )}
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 14 }}>{o.label}</span>
                  {o.sub && (
                    <span style={{ fontSize: 12, opacity: 0.8 }}>{o.sub}</span>
                  )}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default MentionInput;
