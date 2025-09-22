"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./PinInput.module.css";

interface PinInputProps {
  length?: number;
  onComplete: (pin: string) => void;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export function PinInput({
  length = 6,
  onComplete,
  disabled = false,
  error = false,
  className = "",
}: PinInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const [submittedPin, setSubmittedPin] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-submit when all boxes are filled
  useEffect(() => {
    const pin = values.join("");
    const ready =
      pin.length === length && pin.split("").every((char) => /\d/.test(char));
    if (!disabled && ready && pin && pin !== submittedPin) {
      setSubmittedPin(pin);
      onComplete(pin);
    }
  }, [values, length, onComplete, disabled, submittedPin]);

  const handleChange = (index: number, value: string) => {
    if (disabled) return;

    // Only allow numeric input
    const numericValue = value.replace(/\D/g, "");

    // Only take the last character if multiple are entered
    const singleDigit = numericValue.slice(-1);

    const newValues = [...values];
    newValues[index] = singleDigit;
    setValues(newValues);
    // Any edit clears submission marker so user can re-enter PIN
    if (submittedPin) setSubmittedPin(null);

    // Auto-focus next input
    if (singleDigit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (disabled) return;

    if (e.key === "Backspace") {
      e.preventDefault();
      const newValues = [...values];

      if (values[index]) {
        // Clear current box if it has a value
        newValues[index] = "";
        setValues(newValues);
        if (submittedPin) setSubmittedPin(null);
      } else if (index > 0) {
        // Move to previous box and clear it if current is empty
        newValues[index - 1] = "";
        setValues(newValues);
        if (submittedPin) setSubmittedPin(null);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pin = values.join("");
      if (pin.length === length) {
        onComplete(pin);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const numericData = pastedData.replace(/\D/g, "");

    if (numericData.length <= length) {
      const newValues = Array(length).fill("");
      for (let i = 0; i < numericData.length; i++) {
        newValues[i] = numericData[i];
      }
      setValues(newValues);
      if (submittedPin) setSubmittedPin(null);

      // Focus the next empty input or the last one
      const nextIndex = Math.min(numericData.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    // Select all text when focusing
    inputRefs.current[index]?.select();
  };

  return (
    <div
      className={`${styles.pinContainer} ${
        error ? styles.error : ""
      } ${className}`}
    >
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={values[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          disabled={disabled}
          className={`${styles.pinBox} ${values[index] ? styles.filled : ""} ${
            disabled ? styles.disabled : ""
          }`}
          aria-label={`PIN digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
