"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Field, controlClasses, useFieldIds, type FieldProps } from "./field";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    FieldProps {
  /** Rendered inside the control, before the text. */
  leading?: React.ReactNode;
  /** Rendered inside the control, after the text. */
  trailing?: React.ReactNode;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      className,
      wrapperClassName,
      label,
      hint,
      error,
      required,
      leading,
      trailing,
      id,
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
        <div className="relative flex items-center">
          {leading ? (
            <span className="pointer-events-none absolute left-3.5 flex text-muted">
              {leading}
            </span>
          ) : null}
          <input
            ref={ref}
            id={fieldId}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              controlClasses,
              leading && "pl-10",
              trailing && "pr-10",
              error && "border-danger focus:border-danger focus:ring-danger/30",
              className,
            )}
            {...props}
          />
          {trailing ? (
            <span className="absolute right-3.5 flex text-muted">{trailing}</span>
          ) : null}
        </div>
      </Field>
    );
  },
);
