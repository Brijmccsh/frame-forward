"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { CategoryPicker } from "./category-picker";
import { createPhoto } from "@/lib/photos/actions";
import type { UploadResult } from "@/lib/storage";
import type { Category } from "@/lib/types";

export function UploadForm({
  userId,
  categories,
}: {
  userId: string;
  categories: Category[];
}) {
  const router = useRouter();
  const { success } = useToast();

  const [upload, setUpload] = React.useState<UploadResult | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [categoryId, setCategoryId] = React.useState<number | null>(null);
  const [title, setTitle] = React.useState("");
  const [caption, setCaption] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [errorField, setErrorField] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();

  const fieldError = (field: string) =>
    errorField === field ? (error ?? undefined) : undefined;

  const submit = (isPublished: boolean) => {
    setError(null);
    setErrorField(null);

    startTransition(async () => {
      const result = await createPhoto({
        image_path: upload?.path ?? "",
        category_id: categoryId,
        title,
        caption: caption || null,
        is_published: isPublished,
      });

      if (!result.ok) {
        setError(result.error);
        setErrorField(result.field ?? null);
        return;
      }

      success(
        isPublished ? "Photo published 🎉" : "Saved as a draft",
        isPublished
          ? "It's live in the library for nonprofits to find."
          : "Publish it whenever you're ready.",
      );
      router.push("/app");
      router.refresh();
    });
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit(true);
      }}
      noValidate
      className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-start"
    >
      <Card className="p-5 sm:p-6">
        <ImageUploader
          label="Your photo"
          hint="JPG, PNG, WebP or AVIF up to 8 MB."
          bucket="photos"
          userId={userId}
          shape="photo"
          value={previewUrl}
          onChange={(url, result) => {
            setPreviewUrl(url);
            setUpload(result ?? null);
            if (errorField === "image") setError(null);
          }}
          disabled={pending}
        />
        {fieldError("image") ? (
          <p className="mt-2 text-xs font-medium text-danger">
            {fieldError("image")}
          </p>
        ) : null}
      </Card>

      <div className="flex flex-col gap-6">
        <Card className="flex flex-col gap-6 p-5 sm:p-6">
          <CategoryPicker
            categories={categories}
            value={categoryId}
            onChange={(id) => {
              setCategoryId(id);
              if (errorField === "category") setError(null);
            }}
            disabled={pending}
            error={fieldError("category")}
          />

          <Input
            label="Title"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Sunrise at the community garden"
            maxLength={100}
            error={fieldError("title")}
            disabled={pending}
          />

          <Textarea
            label="Caption"
            hint="Where it was taken, what's happening, anything a nonprofit should know."
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="Volunteers wrapping up the spring planting day."
            maxLength={500}
            showCount
            rows={4}
            disabled={pending}
          />
        </Card>

        {error && !errorField ? (
          <p role="alert" className="text-sm font-medium text-danger">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="lg" loading={pending}>
            Publish photo
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            disabled={pending}
            onClick={() => submit(false)}
          >
            Save as draft
          </Button>
        </div>
        <p className="text-xs text-muted">
          Published photos appear in Browse for every nonprofit on Frame
          Forward. Drafts stay private to you.
        </p>
      </div>
    </form>
  );
}
