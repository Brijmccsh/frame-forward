"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { CategoryPicker } from "./category-picker";
import {
  deletePhoto,
  setPhotoPublished,
  updatePhoto,
} from "@/lib/photos/actions";
import { publicUrlFor } from "@/lib/storage";
import type { PhotoWithRelations } from "@/lib/queries/photos";
import type { Category } from "@/lib/types";

export function PhotoManageCard({
  photo,
  categories,
}: {
  photo: PhotoWithRelations;
  categories: Category[];
}) {
  const router = useRouter();
  const { success, error: toastError } = useToast();

  const [editing, setEditing] = React.useState(false);
  const [confirmingDelete, setConfirmingDelete] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  const [title, setTitle] = React.useState(photo.title ?? "");
  const [caption, setCaption] = React.useState(photo.caption ?? "");
  const [categoryId, setCategoryId] = React.useState<number | null>(
    photo.category_id,
  );
  const [formError, setFormError] = React.useState<string | null>(null);

  // Optimistic publish state so the toggle feels instant.
  const [published, setPublished] = React.useState(photo.is_published);
  React.useEffect(() => setPublished(photo.is_published), [photo.is_published]);

  const resetForm = () => {
    setTitle(photo.title ?? "");
    setCaption(photo.caption ?? "");
    setCategoryId(photo.category_id);
    setFormError(null);
  };

  const togglePublished = () => {
    const next = !published;
    setPublished(next);
    startTransition(async () => {
      const result = await setPhotoPublished(photo.id, next);
      if (!result.ok) {
        setPublished(!next);
        toastError("Couldn't update", result.error);
        return;
      }
      success(next ? "Published" : "Unpublished", photo.title ?? undefined);
      router.refresh();
    });
  };

  const saveEdits = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    startTransition(async () => {
      const result = await updatePhoto({
        id: photo.id,
        title,
        caption: caption || null,
        category_id: categoryId,
      });
      if (!result.ok) {
        setFormError(result.error);
        return;
      }
      setEditing(false);
      success("Photo updated");
      router.refresh();
    });
  };

  const confirmDelete = () => {
    startTransition(async () => {
      const result = await deletePhoto(photo.id);
      if (!result.ok) {
        toastError("Couldn't delete", result.error);
        return;
      }
      setConfirmingDelete(false);
      success("Photo deleted");
      router.refresh();
    });
  };

  return (
    <>
      <figure className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-sm transition-all duration-300 ease-soft hover:-translate-y-1 hover:shadow-md">
        <div className="relative aspect-square bg-surface-2">
          <Image
            src={publicUrlFor("photos", photo.image_path)}
            alt={photo.title ?? "Untitled photo"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-soft group-hover:scale-105"
          />
          {!published ? (
            <span className="absolute left-2 top-2">
              <Badge tone="warning" dot>
                Draft
              </Badge>
            </span>
          ) : null}
        </div>

        <figcaption className="flex flex-1 flex-col gap-3 p-4">
          <div className="min-w-0">
            <h3 className="truncate font-head text-base font-semibold text-text">
              {photo.title ?? "Untitled"}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
              {photo.category ? (
                <>
                  <span aria-hidden>{photo.category.emoji}</span>
                  {photo.category.name}
                </>
              ) : (
                "No category"
              )}
            </p>
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-1.5">
            <Button
              size="mini"
              variant="secondary"
              onClick={() => {
                resetForm();
                setEditing(true);
              }}
              disabled={pending}
            >
              Edit
            </Button>
            <Button
              size="mini"
              variant="ghost"
              onClick={togglePublished}
              disabled={pending}
            >
              {published ? "Unpublish" : "Publish"}
            </Button>
            <Button
              size="mini"
              variant="ghost"
              onClick={() => setConfirmingDelete(true)}
              disabled={pending}
              className="ml-auto hover:text-danger"
              aria-label={`Delete ${photo.title ?? "photo"}`}
            >
              Delete
            </Button>
          </div>
        </figcaption>
      </figure>

      <Modal
        open={editing}
        onClose={() => setEditing(false)}
        title="Edit photo"
        description="Update the details nonprofits see."
      >
        <form onSubmit={saveEdits} noValidate className="flex flex-col gap-5">
          <Input
            label="Title"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={100}
            disabled={pending}
            data-autofocus
          />
          <Textarea
            label="Caption"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            maxLength={500}
            showCount
            rows={3}
            disabled={pending}
          />
          <CategoryPicker
            categories={categories}
            value={categoryId}
            onChange={setCategoryId}
            disabled={pending}
          />
          {formError ? (
            <p role="alert" className="text-sm font-medium text-danger">
              {formError}
            </p>
          ) : null}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEditing(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" loading={pending}>
              Save changes
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={confirmingDelete}
        onClose={() => setConfirmingDelete(false)}
        size="sm"
        title="Delete this photo?"
        description={`"${photo.title ?? "Untitled"}" will be removed from your library and from Browse. This can't be undone.`}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setConfirmingDelete(false)}
              disabled={pending}
            >
              Keep it
            </Button>
            <Button variant="danger" onClick={confirmDelete} loading={pending}>
              Delete photo
            </Button>
          </>
        }
      />
    </>
  );
}
