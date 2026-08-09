"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { OTP_LENGTH } from "@/lib/auth/otp";

export interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  /** Fired when the last digit is filled (typed or pasted). */
  onComplete?: (value: string) => void;
  length?: number;
  disabled?: boolean;
  invalid?: boolean;
  label?: string;
  autoFocus?: boolean;
}

/** Segmented one-time-code field with paste, arrow-key and backspace support. */
export function OtpInput({
  value,
  onChange,
  onComplete,
  length = OTP_LENGTH,
  disabled = false,
  invalid = false,
  label = "One-time code",
  autoFocus = true,
}: OtpInputProps) {
  const refs = React.useRef<Array<HTMLInputElement | null>>([]);
  const digits = React.useMemo(
    () => Array.from({ length }, (_, index) => value[index] ?? ""),
    [value, length],
  );

  const commit = (next: string) => {
    const clean = next.replace(/\D/g, "").slice(0, length);
    onChange(clean);
    if (clean.length === length) onComplete?.(clean);
    return clean;
  };

  const focusAt = (index: number) => {
    const target = refs.current[Math.max(0, Math.min(index, length - 1))];
    target?.focus();
    target?.select();
  };

  const handleChange = (index: number, raw: string) => {
    const typed = raw.replace(/\D/g, "");
    if (!typed) return;

    // Typing over a filled box replaces it; pasting into one spreads forward.
    const chars = value.split("");
    typed.split("").forEach((char, offset) => {
      chars[index + offset] = char;
    });
    const next = commit(chars.join("").slice(0, length));
    focusAt(Math.min(index + typed.length, length - 1));
    return next;
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const chars = value.split("");
      if (chars[index]) {
        chars[index] = "";
        commit(chars.join(""));
      } else if (index > 0) {
        chars[index - 1] = "";
        commit(chars.join(""));
        focusAt(index - 1);
      }
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusAt(index - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusAt(index + 1);
    }
  };

  return (
    <div
      role="group"
      aria-label={label}
      className="flex w-full items-center justify-center gap-1.5 sm:gap-2"
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus && index === 0}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of ${length}`}
          aria-invalid={invalid || undefined}
          value={digit}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => {
            event.preventDefault();
            const pasted = event.clipboardData.getData("text");
            const clean = commit(pasted);
            focusAt(clean.length);
          }}
          onFocus={(event) => event.currentTarget.select()}
          className={cn(
            // Widths flex so 6, 8 or 10 boxes all fit the card.
            "h-12 w-full min-w-0 max-w-[3rem] rounded-md border bg-surface text-center font-head text-xl font-semibold text-text shadow-xs transition-all duration-200 ease-soft sm:h-14 sm:text-2xl",
            "focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40",
            "disabled:cursor-not-allowed disabled:opacity-60",
            invalid
              ? "border-danger focus:border-danger focus:ring-danger/30"
              : digit
                ? "border-primary/50"
                : "border-border",
          )}
        />
      ))}
    </div>
  );
}
