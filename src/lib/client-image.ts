/** Compress a gallery photo for storage when Cloudinary is unavailable. */
export async function fileToCompressedDataUrl(
  file: File,
  opts?: { maxEdge?: number; maxBytes?: number },
): Promise<string> {
  const maxEdge = opts?.maxEdge ?? 1600;
  const maxBytes = opts?.maxBytes ?? 900_000;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("canvas_unavailable");
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  let quality = 0.82;
  let dataUrl = canvas.toDataURL("image/jpeg", quality);
  while (dataUrl.length > maxBytes && quality > 0.4) {
    quality -= 0.1;
    dataUrl = canvas.toDataURL("image/jpeg", quality);
  }
  if (dataUrl.length > maxBytes) {
    throw new Error("image_too_large");
  }
  return dataUrl;
}
