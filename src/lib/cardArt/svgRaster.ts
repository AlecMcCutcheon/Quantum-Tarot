const THUMB_WIDTH = 88;
const THUMB_HEIGHT = 132;
const DETAIL_WIDTH = 220;
const DETAIL_HEIGHT = 330;

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("SVG raster load failed"));
    img.src = url;
  });
}

/** Rasterize SVG string to a compact WebP data URL. */
export async function svgToWebpDataUrl(
  svg: string,
  width: number,
  height: number,
  quality = 0.8,
): Promise<string> {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  try {
    const img = await loadImage(objectUrl);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Canvas unsupported");
    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL("image/webp", quality);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export const LIBRARY_THUMB_SIZE = { width: THUMB_WIDTH, height: THUMB_HEIGHT };
export const LIBRARY_DETAIL_SIZE = { width: DETAIL_WIDTH, height: DETAIL_HEIGHT };
