"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Field, controlClasses, useFieldIds, type FieldProps } from "./field";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    FieldProps {
  options?: SelectOption[];
  /** Rendered as a disabled first option when no value is selected. */
  placeholder?: string;
  wrapperClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      className,
      wrapperClassName,
      label,
      hint,
      error,
      required,
      options,
      placeholder,
      id,
      children,
      defaultValue,
      value,
      ...props
    },
    ref,
  ) {
    const { fieldId, hintId, errorId, describedBy } = useFieldIds(
      id,
      Boolean(hint),
      Boolean(error),
    );

    return (
      <Field
        label={label}
        hint={hint}
        error={error}
        required={required}
        className={wrapperClassName}
        fieldId={fieldId}
        hintId={hintId}
        errorId={errorId}
      >
        <div className="relative">
          <select
            ref={ref}
            id={fieldId}
            required={required}
            value={value}
            defaultValue={defaultValue ?? (placeholder ? "" : undefined)}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              controlClasses,
              "cursor-pointer appearance-none pr-10",
              error && "border-danger focus:border-danger focus:ring-danger/30",
              className,
            )}
            {...props}
          >
            {placeholder ? (
              <option value="" disabled>
                {placeholder}
              </option>
            ) : null}
            {options?.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
            {children}
          </select>
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          >
            <path
              d="M6 8l4 4 4-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Field>
    );
  },
);
