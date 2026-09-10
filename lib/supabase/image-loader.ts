import type { ImageLoaderProps } from "next/image";

/**
 * Global next/image loader, wired up in next.config.mjs.
 *
 * Serves images from Supabase's CDN so the app server never proxies photo
 * bytes. The built-in optimizer fetched, resized and re-encoded every photo on
 * this small instance, and crawlers walking the image-heavy public pages were
 * enough to push it over its limits with almost no real users.
 *
 * On Supabase Pro, flip TRANSFORM to true for on-the-fly resizing through the
 * render endpoint. On Free, the object URL passes through untouched — still
 * CDN-served, just at its stored size, which is why uploads are downscaled in
 * the browser first (downscaleForUpload in lib/storage.ts).
 *
 * While TRANSFORM is off, `next dev` warns that this loader "does not
 * implement width". That's expected: there is only one size to serve.
 */
const TRANSFORM = false; // set true only on Supabase Pro

export default function supabaseImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  // Local assets, like the pre-optimised marketing images in /public.
  if (!src.includes("/storage/v1/object/public/")) return src;
  if (!TRANSFORM) return src;
  const url = src.replace("/object/public/", "/render/image/public/");
  return `${url}?width=${width}&quality=${quality ?? 75}&resize=contain`;
}
