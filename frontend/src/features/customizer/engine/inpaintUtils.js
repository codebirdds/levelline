// src/engine/inpaintUtils.js
// Local diffusion fill + optional AI inpainting.

/** Local fill: mask ke andar wale pixels ko known neighbors se diffuse karke bharo. Chhote erases ke liye best. */
export async function inpaintDiffuse(imageEl, maskCanvas) {
  const w = imageEl.naturalWidth || imageEl.width;
  const h = imageEl.naturalHeight || imageEl.height;

  const sCanvas = document.createElement("canvas");
  sCanvas.width = w;
  sCanvas.height = h;
  const sCtx = sCanvas.getContext("2d");
  sCtx.drawImage(imageEl, 0, 0, w, h);
  const src = sCtx.getImageData(0, 0, w, h);

  const mCanvas = document.createElement("canvas");
  mCanvas.width = w;
  mCanvas.height = h;
  mCanvas.getContext("2d").drawImage(maskCanvas, 0, 0, w, h);
  const m = mCanvas.getContext("2d").getImageData(0, 0, w, h);

  const N = w * h;
  const known = new Uint8Array(N);
  for (let i = 0; i < N; i++) known[i] = m.data[i * 4 + 3] > 128 ? 0 : 1;

  const out = new Uint8ClampedArray(src.data);
  let frontier = [];
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (known[i]) continue;
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < w && ny < h && known[ny * w + nx]) {
          frontier.push(i);
          break;
        }
      }
    }

  while (frontier.length) {
    const next = [];
    for (const i of frontier) {
      if (known[i]) continue;
      const x = i % w, y = (i / w) | 0;
      let r = 0, g = 0, b = 0, c = 0;
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const j = ny * w + nx;
        if (!known[j]) continue;
        const k = j * 4;
        r += out[k]; g += out[k + 1]; b += out[k + 2];
        c++;
      }
      if (!c) continue;
      out[i * 4] = r / c;
      out[i * 4 + 1] = g / c;
      out[i * 4 + 2] = b / c;
      out[i * 4 + 3] = 255;
      known[i] = 1;
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        if (!known[ny * w + nx]) next.push(ny * w + nx);
      }
    }
    frontier = next;
  }

  // Soft feather
  for (let i = 0; i < N; i++) {
    const a = m.data[i * 4 + 3];
    if (a > 0 && a < 128) {
      const t = a / 128;
      for (let k = 0; k < 3; k++) out[i * 4 + k] = out[i * 4 + k] * t + src.data[i * 4 + k] * (1 - t);
      out[i * 4 + 3] = 255;
    }
  }

  const outCanvas = document.createElement("canvas");
  outCanvas.width = w;
  outCanvas.height = h;
  outCanvas.getContext("2d").putImageData(new ImageData(out, w, h), 0, 0);
  return outCanvas;
}

/** AI inpainting via Stability API. .env me REACT_APP_STABILITY_KEY daalo aur "AI" mode select karo. */
export async function inpaintAI(imageCanvas, maskCanvas, apiKey) {
  if (!apiKey) throw new Error("AI mode ke liye REACT_APP_STABILITY_KEY .env me set karo");
  const imgBlob = await new Promise((r) => imageCanvas.toBlob(r, "image/png"));
  const maskBlob = await new Promise((r) => maskCanvas.toBlob(r, "image/png"));
  const fd = new FormData();
  fd.append("image", imgBlob, "image.png");
  fd.append("mask", maskBlob, "mask.png");
  fd.append("prompt", "seamless fabric continuation, same texture and pattern, no seams, no edges");
  fd.append("mode", "mask");
  fd.append("output_format", "png");
  const res = await fetch("https://api.stability.ai/v2beta/stable-image/edit/inpaint", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, Accept: "image/*" },
    body: fd,
  });
  if (!res.ok) throw new Error(`AI inpaint failed: ${res.status}`);
  const blob = await res.blob();
  const bmp = await createImageBitmap(blob);
  const out = document.createElement("canvas");
  out.width = bmp.width;
  out.height = bmp.height;
  out.getContext("2d").drawImage(bmp, 0, 0);
  return out;
}