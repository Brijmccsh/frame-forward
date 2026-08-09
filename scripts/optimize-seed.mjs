/**
 * Pre-optimises the marketing photography at build time.
 *
 * Why: these images never change, so paying Next's runtime image optimizer to
 * re-derive them on every cold start is pure waste — and on a 512 MB instance
 * a burst of concurrent optimizations is enough to OOM the process. Generating
 * them ahead of time means the server does zero image work for the landing
 * page; it just serves static files.
 *
 * Source of truth: assets/seed/*.jpg (not served).
 * Output:          public/seed/*.webp (served, referenced by lib/images.ts).
 *
 * Run with `npm run optimize:seed` after changing a source image.
 */
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "assets/seed";
const OUT = "public/seed";
const QUALITY = 78;

/**
 * Widest each image is ever displayed, at 2x DPR. Anything above this is
 * bytes the browser downloads and throws away.
 */
const WIDTHS = {
  "hero-01-photographer": 1200, // hero tile + "For photographers" card header
  "hero-02-portrait": 700, // hero tile only
  "hero-03-volunteers": 1200, // hero tile + nonprofit card + onboarding card
  "hero-04-landscape": 1400, // hero tile + closing CTA background
  "impact-community": 1200, // impact section
};
const CATEGORY_WIDTH = 560; // 5-up grid tile at 2x
const DEFAULT_WIDTH = 1200;

const widthFor = (name) =>
  WIDTHS[name] ?? (name.startsWith("cat-") ? CATEGORY_WIDTH : DEFAULT_WIDTH);

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

async function main() {
  await mkdir(OUT, { recursive: true });

  const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f));
  if (!files.length) throw new Error(`No source images in ${SRC}`);

  let sourceTotal = 0;
  let outputTotal = 0;

  for (const file of files.sort()) {
    const name = path.parse(file).name;
    const width = widthFor(name);
    const from = path.join(SRC, file);
    const to = path.join(OUT, `${name}.webp`);

    const buffer = await sharp(from)
      .rotate() // honour EXIF orientation before resizing
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer();

    await writeFile(to, buffer);

    const before = (await stat(from)).size;
    sourceTotal += before;
    outputTotal += buffer.length;

    console.log(
      `  ${name.padEnd(34)} ${String(width).padStart(4)}w  ${kb(before).padStart(7)} -> ${kb(buffer.length).padStart(7)}`,
    );
  }

  console.log(
    `\n  ${files.length} images: ${kb(sourceTotal)} -> ${kb(outputTotal)} ` +
      `(${Math.round((1 - outputTotal / sourceTotal) * 100)}% smaller)`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
