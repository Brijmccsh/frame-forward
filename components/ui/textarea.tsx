"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Field, controlClasses, useFieldIds, type FieldProps } from "./field";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    FieldProps {
  /** Shows a live "n / maxLength" counter. Requires `maxLength`. */
  showCount?: boolean;
  wrapperClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      className,
      wrapperClassName,
      label,
      hint,
      error,
      required,
      showCount,
      maxLength,
      id,
      value,
      defaultValue,
      onChange,
      rows = 4,
      ...props
    },
    ref,
  ) {
    const { fieldId, hintId, errorId, describedBy } = useFieldIds(
      id,
      Boolean(hint),
      Boolean(error),
    );
    const [count, setCount] = React.useState(
      String(value ?? defaultValue ?? "").length,
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
          <textarea
            ref={ref}
            id={fieldId}
            rows={rows}
            required={required}
            maxLength={maxLength}
            value={value}
            defaultValue={defaultValue}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            onChange={(event) => {
              setCount(event.target.value.length);
              onChange?.(event);
            }}
            className={cn(
              controlClasses,
              "min-h-[96px] resize-y leading-relaxed",
              showCount && maxLength ? "pb-7" : undefined,
              error && "border-danger focus:border-danger focus:ring-danger/30",
              className,
            )}
            {...props}
          />
          {showCount && maxLength ? (
            <span className="pointer-events-none absolute bottom-2.5 right-3.5 text-2xs tabular-nums text-muted">
              {count} / {maxLength}
            </span>
          ) : null}
        </div>
      </Field>
    );
  },
);
