"use client";

import { Chip } from "@/components/ui/chip";
import type { Category } from "@/lib/types";

/** Emoji chips for choosing a photo's category. */
export function CategoryPicker({
  categories,
  value,
  onChange,
  disabled = false,
  error,
}: {
  categories: Category[];
  value: number | null;
  onChange: (id: number) => void;
  disabled?: boolean;
  error?: string | null;
}) {
  return (
    <fieldset disabled={disabled}>
      <legend className="mb-2 text-sm font-medium text-text">
        Category <span className="text-primary-ink">*</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Chip
            key={category.id}
            emoji={category.emoji}
            selected={value === category.id}
            onClick={() => onChange(category.id)}
          >
            {category.name}
          </Chip>
        ))}
      </div>
      {error ? (
        <p className="mt-2 text-xs font-medium text-danger">{error}</p>
      ) : null}
    </fieldset>
  );
}
