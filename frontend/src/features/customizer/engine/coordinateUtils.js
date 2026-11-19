export const DEFAULT_CANVAS = { width: 1000, height: 1400 };
export const round = (v, d = 1) => { const f = 10 ** d; return Math.round(v * f) / f; };

/** Canvas units -> % so the same layout scales to any screen size. */
export const nodeBoxStyle = (n, c) => ({
  left: `${(n.x / c.width) * 100}%`,
  top: `${(n.y / c.height) * 100}%`,
  width: `${(n.width / c.width) * 100}%`,
  height: `${(n.height / c.height) * 100}%`,
});

export const pointerToUnits = (dx, dy, rect, canvas) => ({
  dx: (dx * canvas.width) / rect.width,
  dy: (dy * canvas.height) / rect.height,
});

export const moveBox = (start, dx, dy) => ({ x: round(start.x + dx), y: round(start.y + dy) });

/** handle: n s e w ne nw se sw. Opposite edge/corner stays fixed (also when rotated). */
export function resizeBox(handle, start, dx, dy, min = 10) {
  const rad = ((start.rotation || 0) * Math.PI) / 180;
  const cos = Math.cos(rad), sin = Math.sin(rad);
  const ldx = dx * cos + dy * sin;
  const ldy = -dx * sin + dy * cos;
  const sx = handle.includes("e") ? 1 : handle.includes("w") ? -1 : 0;
  const sy = handle.includes("s") ? 1 : handle.includes("n") ? -1 : 0;
  const width = Math.max(min, start.width + sx * ldx);
  const height = Math.max(min, start.height + sy * ldy);
  const ox = (sx * (width - start.width)) / 2;
  const oy = (sy * (height - start.height)) / 2;
  const cx = start.x + start.width / 2 + ox * cos - oy * sin;
  const cy = start.y + start.height / 2 + ox * sin + oy * cos;
  return { x: round(cx - width / 2), y: round(cy - height / 2), width: round(width), height: round(height) };
}
