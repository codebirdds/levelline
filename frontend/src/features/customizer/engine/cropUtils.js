// src/engine/cropUtils.js
// Crop shape = rect | polygon, in % of source image (0-100).

export function normalizeCrop(c) {
  if (!c) return { type: "rect", x: 0, y: 0, w: 100, h: 100, feather: 0 };

  if (c.type === "polygon" && Array.isArray(c.points) && c.points.length >= 3) {
    return {
      type: "polygon",
      points: c.points.map(([x, y]) => [
        Math.max(0, Math.min(100, Number(x) || 0)),
        Math.max(0, Math.min(100, Number(y) || 0)),
      ]),
      feather: Math.max(0, Math.min(50, Number(c.feather) || 0)),
    };
  }

  // legacy { top, right, bottom, left }
  if ("top" in c && !("x" in c)) {
    const t = c.top || 0, r = c.right || 0, b = c.bottom || 0, l = c.left || 0;
    return { type: "rect", x: l, y: t, w: 100 - l - r, h: 100 - t - b, feather: 0 };
  }

  const x = Math.max(0, Math.min(99, Number(c.x) || 0));
  const y = Math.max(0, Math.min(99, Number(c.y) || 0));
  return {
    type: "rect",
    x,
    y,
    w: Math.max(1, Math.min(100 - x, Number(c.w) || 100)),
    h: Math.max(1, Math.min(100 - y, Number(c.h) || 100)),
    feather: Math.max(0, Math.min(50, Number(c.feather) || 0)),
  };
}

export function getCropBBox(c) {
  const n = normalizeCrop(c);
  if (n.type === "polygon") {
    const xs = n.points.map((p) => p[0]);
    const ys = n.points.map((p) => p[1]);
    const minX = Math.min(...xs), minY = Math.min(...ys);
    return { x: minX, y: minY, w: Math.max(...xs) - minX, h: Math.max(...ys) - minY };
  }
  return { x: n.x, y: n.y, w: n.w, h: n.h };
}

export function isFullRect(c) {
  const n = normalizeCrop(c);
  return n.type === "rect" && n.x === 0 && n.y === 0 && n.w === 100 && n.h === 100 && !n.feather;
}