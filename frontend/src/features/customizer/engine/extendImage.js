// src/engine/extendImage.js
import { normalizeCrop, getCropBBox, isFullRect } from "./cropUtils.js";
import { resolveImageSrc } from "../storage/assetStorage.js";

// 🔧 Robust loader: data URL ke liye crossOrigin mat lagao
const loadImage = (src) =>
  new Promise((res, rej) => {
    const img = new Image();
    // Sirf http(s) URL ke liye crossOrigin lagao, data URL ke liye nahi
    if (/^https?:\/\//i.test(src)) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => res(img);
    img.onerror = () => rej(new Error("Image load failed — check the source URL or CORS"));
    img.src = src;
  });

/** Returns a canvas of the node's VISUAL cropped image at source resolution. */
export async function flattenCrop(src, crop) {
  const resolved = resolveImageSrc(src);
  if (!resolved) throw new Error("Image not found — re-upload the asset");

  const img = await loadImage(resolved);

  if (isFullRect(crop)) {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext("2d").drawImage(img, 0, 0);
    return canvas;
  }

  const c = normalizeCrop(crop);
  const bbox = getCropBBox(c);

  const sx = (bbox.x / 100) * img.naturalWidth;
  const sy = (bbox.y / 100) * img.naturalHeight;
  const sw = (bbox.w / 100) * img.naturalWidth;
  const sh = (bbox.h / 100) * img.naturalHeight;

  const outW = Math.max(1, Math.round(sw));
  const outH = Math.max(1, Math.round(sh));

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");

  if (c.type === "polygon") {
    ctx.beginPath();
    c.points.forEach(([x, y], i) => {
      const px = ((x - bbox.x) / bbox.w) * outW;
      const py = ((y - bbox.y) / bbox.h) * outH;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.clip();
  }

  if (c.feather > 0) {
    const blurPx = (c.feather / 100) * Math.max(outW, outH) * 0.15;
    ctx.filter = `blur(${blurPx}px)`;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH);
  ctx.filter = "none";
  return canvas;
}

/**
 * Extend the canvas by L/R/T/B pixels using given fill mode:
 *   "mirror" — flip edge pixels outward (natural fabric continuation)
 *   "edge"   — stretch the edge row/column (uniform)
 */
export function extendCanvas(src, { left = 0, right = 0, top = 0, bottom = 0, mode = "mirror" }) {
  const w = src.width;
  const h = src.height;
  const newW = w + left + right;
  const newH = h + top + bottom;

  const out = document.createElement("canvas");
  out.width = newW;
  out.height = newH;
  const ctx = out.getContext("2d");
  ctx.drawImage(src, left, top);

  if (left + right + top + bottom === 0) return out;

  const srcData = src.getContext("2d").getImageData(0, 0, w, h);
  const outData = ctx.getImageData(0, 0, newW, newH);

  const getPx = (x, y) => {
    const cx = Math.max(0, Math.min(w - 1, x));
    const cy = Math.max(0, Math.min(h - 1, y));
    const i = (cy * w + cx) * 4;
    return [srcData.data[i], srcData.data[i + 1], srcData.data[i + 2], srcData.data[i + 3]];
  };
  const putPx = (nx, ny, sx, sy) => {
    const [r, g, b, a] = getPx(sx, sy);
    const i = (ny * newW + nx) * 4;
    outData.data[i] = r;
    outData.data[i + 1] = g;
    outData.data[i + 2] = b;
    outData.data[i + 3] = a;
  };

  const pickSrc = (off, maxLen) => (mode === "mirror" ? Math.min(maxLen - 1, off) : 0);

  // top
  for (let ny = 0; ny < top; ny++) {
    const off = top - ny - 1;
    const sy = mode === "mirror" ? pickSrc(off, h) : 0;
    for (let nx = 0; nx < newW; nx++) {
      const sx = Math.max(0, Math.min(w - 1, nx - left));
      putPx(nx, ny, sx, sy);
    }
  }
  // bottom
  for (let ny = top + h; ny < newH; ny++) {
    const off = ny - (top + h);
    const sy = mode === "mirror" ? Math.max(0, h - 1 - off) : h - 1;
    for (let nx = 0; nx < newW; nx++) {
      const sx = Math.max(0, Math.min(w - 1, nx - left));
      putPx(nx, ny, sx, sy);
    }
  }
  // left
  for (let ny = top; ny < top + h; ny++) {
    const sy = ny - top;
    for (let nx = 0; nx < left; nx++) {
      const off = left - nx - 1;
      const sx = mode === "mirror" ? Math.min(w - 1, off) : 0;
      putPx(nx, ny, sx, sy);
    }
  }
  // right
  for (let ny = top; ny < top + h; ny++) {
    const sy = ny - top;
    for (let nx = left + w; nx < newW; nx++) {
      const off = nx - (left + w);
      const sx = mode === "mirror" ? Math.max(0, w - 1 - off) : w - 1;
      putPx(nx, ny, sx, sy);
    }
  }

  ctx.putImageData(outData, 0, 0);
  return out;
}