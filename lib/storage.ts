import { env } from "@/lib/env";

export type StorageBucket = "photos" | "avatars" | "covers" | "logos";

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];
export const ACCEPT_ATTRIBUTE = ACCEPTED_IMAGE_TYPES.join(",");

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Returns an error message, or null when the file is acceptable. */
export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "That file type isn't supported. Use JPG, PNG, WebP, AVIF or GIF.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `That image is ${formatBytes(file.size)} — the limit is ${formatBytes(
      MAX_IMAGE_BYTES,
    )}.`;
  }
  return null;
}

/** `${userId}/${uuid}-${safe-name}` — keeps every user in their own folder. */
export function buildObjectPath(userId: string, file: File) {
  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(-60);
  return `${userId}/${crypto.randomUUID()}-${safeName || "image"}`;
}

/** Public URL for an object — same shape Supabase's getPublicUrl returns. */
export function publicUrlFor(bucket: StorageBucket, path: string) {
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  return `${env.supabaseUrl}/storage/v1/object/public/${bucket}/${encoded}`;
}

/** Extracts the object path back out of a public URL (null if it isn't one). */
export function objectPathFromPublicUrl(
  bucket: StorageBucket,
  url: string | null | undefined,
): string | null {
  if (!url) return null;
  const prefix = `${env.supabaseUrl}/storage/v1/object/public/${bucket}/`;
  if (!url.startsWith(prefix)) return null;
  return decodeURIComponent(url.slice(prefix.length));
}

export interface UploadResult {
  path: string;
  publicUrl: string;
}

/**
 * Uploads a file straight from the browser to Supabase Storage.
 *
 * Uses XHR rather than the JS client so we get real upload progress events.
 * The request is authenticated with the user's own access token, so the
 * owner-only write policy on the bucket still applies.
 */
export function uploadImage({
  bucket,
  file,
  userId,
  accessToken,
  onProgress,
  signal,
}: {
  bucket: StorageBucket;
  file: File;
  userId: string;
  accessToken: string;
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}): Promise<UploadResult> {
  const path = buildObjectPath(userId, file);
  const encoded = path.split("/").map(encodeURIComponent).join("/");

  return new Promise<UploadResult>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open(
      "POST",
      `${env.supabaseUrl}/storage/v1/object/${bucket}/${encoded}`,
      true,
    );
    request.setRequestHeader("authorization", `Bearer ${accessToken}`);
    request.setRequestHeader("apikey", env.supabaseAnonKey);
    request.setRequestHeader("x-upsert", "true");
    request.setRequestHeader("cache-control", "3600");
    if (file.type) request.setRequestHeader("content-type", file.type);

    request.upload.addEventListener("progress", (event) => {
      if (!event.lengthComputable) return;
      onProgress?.(Math.round((event.loaded / event.total) * 100));
    });

    request.addEventListener("load", () => {
      if (request.status >= 200 && request.status < 300) {
        onProgress?.(100);
        resolve({ path, publicUrl: publicUrlFor(bucket, path) });
        return;
      }
      let message = `Upload failed (${request.status}).`;
      try {
        const body = JSON.parse(request.responseText);
        if (body?.message) message = body.message;
      } catch {
        // Non-JSON error body — keep the generic message.
      }
      reject(new Error(message));
    });

    request.addEventListener("error", () =>
      reject(new Error("Upload failed. Check your connection and try again.")),
    );
    request.addEventListener("abort", () =>
      reject(new DOMException("Upload cancelled", "AbortError")),
    );

    signal?.addEventListener("abort", () => request.abort(), { once: true });
    request.send(file);
  });
}
