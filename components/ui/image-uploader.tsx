"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/browser";
import {
  ACCEPT_ATTRIBUTE,
  uploadImage,
  validateImageFile,
  type StorageBucket,
  type UploadResult,
} from "@/lib/storage";
import { Spinner } from "./spinner";

export interface ImageUploaderProps {
  /** Current public URL, or null. */
  value: string | null;
  /**
   * Called with the public URL (null when cleared). The second argument
   * carries the storage object path too, for callers that persist the path
   * rather than the URL (e.g. `photos.image_path`).
   */
  onChange: (url: string | null, result?: UploadResult | null) => void;
  bucket: StorageBucket;
  userId: string;
  label: string;
  hint?: string;
  /**
   * `avatar` is a small square/circle, `cover` a wide banner, `photo` a large
   * drop area that shows the whole uncropped image.
   */
  shape?: "avatar" | "square" | "cover" | "photo";
  rounded?: "full" | "md";
  disabled?: boolean;
  className?: string;
}

const shapes = {
  avatar: "h-28 w-28",
  square: "aspect-square w-full max-w-[16rem]",
  cover: "aspect-[3/1] w-full",
  photo: "aspect-[4/3] w-full",
};

export function ImageUploader({
  value,
  onChange,
  bucket,
  userId,
  label,
  hint,
  shape = "avatar",
  rounded = "md",
  disabled = false,
  className,
}: ImageUploaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const abortRef = React.useRef<AbortController | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const [progress, setProgress] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const labelId = React.useId();
  const busy = progress !== null;

  React.useEffect(() => () => abortRef.current?.abort(), []);

  const handleFile = async (file: File | undefined) => {
    if (!file || disabled) return;

    const invalid = validateImageFile(file);
    if (invalid) {
      setError(invalid);
      return;
    }

    setError(null);
    setProgress(0);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Your session expired — sign in again.");

      const result = await uploadImage({
        bucket,
        file,
        userId,
        accessToken: session.access_token,
        onProgress: setProgress,
        signal: controller.signal,
      });
      onChange(result.publicUrl, result);
    } catch (uploadError) {
      if ((uploadError as DOMException)?.name === "AbortError") return;
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Something went wrong uploading that image.",
      );
    } finally {
      abortRef.current = null;
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const openPicker = () => {
    if (!disabled && !busy) inputRef.current?.click();
  };

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <span id={labelId} className="text-sm font-medium text-text">
        {label}
      </span>

      <div
        className={cn(
          shape === "cover" || shape === "photo"
            ? "w-full"
            : "flex flex-wrap items-center gap-4 sm:flex-nowrap",
        )}
      >
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-labelledby={labelId}
          aria-disabled={disabled || undefined}
          onClick={openPicker}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openPicker();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            if (!disabled && !busy) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            void handleFile(event.dataTransfer.files?.[0]);
          }}
          className={cn(
            "group relative flex shrink-0 items-center justify-center overflow-hidden border-2 border-dashed bg-surface-2/60 text-center transition-all duration-200 ease-soft",
            shapes[shape],
            rounded === "full" ? "rounded-pill" : "rounded-lg",
            disabled
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer hover:border-primary/60 hover:bg-primary/5",
            dragging ? "border-primary bg-primary/10" : "border-border",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          )}
        >
          {value ? (
            <Image
              src={value}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              className={shape === "photo" ? "object-contain p-2" : "object-cover"}
            />
          ) : (
            <div className="flex flex-col items-center gap-1.5 px-3 py-4 text-muted">
              <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
                <path
                  d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xs font-medium">
                {shape === "cover"
                  ? "Drop a banner or click"
                  : shape === "photo"
                    ? "Drop your photo here, or click to pick one"
                    : "Add image"}
              </span>
            </div>
          )}

          {busy ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-brand-navy/60 text-white backdrop-blur-sm">
              <Spinner size="md" />
              <span className="text-xs font-semibold tabular-nums">
                {progress}%
              </span>
              <span className="h-1 w-2/3 max-w-[8rem] overflow-hidden rounded-pill bg-white/25">
                <span
                  className="block h-full rounded-pill bg-white transition-[width] duration-200"
                  style={{ width: `${progress}%` }}
                />
              </span>
            </div>
          ) : null}
        </div>

        <div
          className={cn(
            "flex flex-col gap-1.5",
            (shape === "cover" || shape === "photo") &&
              "mt-2 flex-row items-center",
          )}
        >
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={openPicker}
              disabled={disabled || busy}
              className="rounded-pill border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text transition-colors hover:border-primary/50 hover:text-primary-ink disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {value ? "Replace" : "Upload"}
            </button>
            {value ? (
              <button
                type="button"
                onClick={() => {
                  onChange(null, null);
                  setError(null);
                }}
                disabled={disabled || busy}
                className="rounded-pill px-2.5 py-1.5 text-xs font-semibold text-muted transition-colors hover:text-danger disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Remove
              </button>
            ) : null}
          </div>
          {hint && !error ? (
            <p className="text-xs text-muted">{hint}</p>
          ) : null}
        </div>
      </div>

      <div aria-live="polite">
        {error ? (
          <p className="text-xs font-medium text-danger">{error}</p>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTRIBUTE}
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />
    </div>
  );
}
