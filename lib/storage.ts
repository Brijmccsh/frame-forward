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

/** Longest edge, in px, that we store — well above anything the site renders. */
const MAX_STORED_EDGE = 2000;
/** Files at or under this size, within the edge limit, upload untouched. */
const DOWNSCALE_ABOVE_BYTES = 1024 * 1024;

/**
 * Shrinks an image in the browser before it's uploaded.
 *
 * Images are served straight from Supabase's CDN at their stored size — there
 * is no optimizer resizing them on the way out (lib/supabase/image-loader.ts) —
 * so a multi-megabyte original is a multi-megabyte download for every visitor,
 * on every grid it appears in.
 *
 * GIFs pass through (a canvas keeps only the first frame), as does anything
 * already within MAX_STORED_EDGE and under ~1 MB. The rest is redrawn with its
 * longest edge at MAX_STORED_EDGE and re-encoded as WebP. A canvas that can't
 * encode WebP silently hands back PNG instead — usually bigger than what we
 * started with — so the output type is checked. JPEG sources then fall back to
 * JPEG; anything else is left alone, since it may carry transparency that JPEG
 * would turn black.
 *
 * Browsers apply EXIF orientation when drawing an <img>, so rotated phone
 * photos stay upright even though re-encoding drops the metadata (GPS
 * included).
 *
 * Never throws. If the file won't decode, or the result isn't smaller, the
 * original is returned and the upload goes ahead exactly as before.
 */
export async function downscaleForUpload(file: File): Promise<File> {
  if (file.type === "image/gif") return file;

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = objectUrl;
    await image.decode();

    const { naturalWidth: width, naturalHeight: height } = image;
    const longest = Math.max(width, height);
    if (longest <= MAX_STORED_EDGE && file.size <= DOWNSCALE_ABOVE_BYTES) {
      return file;
    }

    const scale = Math.min(1, MAX_STORED_EDGE / longest);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    let blob = await canvasToBlob(canvas, "image/webp", 0.82);
    if (blob?.type !== "image/webp") {
      blob =
        file.type === "image/jpeg"
          ? await canvasToBlob(canvas, "image/jpeg", 0.85)
          : null;
    }
    if (!blob || blob.size >= file.size) return file;

    // The storage path is built from the name, so the extension must follow
    // the new format or a .jpg path would hold WebP bytes.
    const extension = blob.type === "image/webp" ? "webp" : "jpg";
    const base = file.name.replace(/\.[^.]*$/, "") || "image";
    return new File([blob], `${base}.${extension}`, {
      type: blob.type,
      lastModified: file.lastModified,
    });
  } catch {
    // Undecodable here (say, an AVIF this browser can't read) — send it as-is.
    return file;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
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
