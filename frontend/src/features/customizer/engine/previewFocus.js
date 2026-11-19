import { resolveGarment } from "./configurationResolver.js";

/**
 * The area of the garment a group changes, as a canvas-unit box covering EVERY option of the group
 * (so all thumbnails of a group share one stable crop). Returns null for groups with no visual effect (e.g. Size).
 */
export function groupFocusBox(t, group, selections, fabricId, pad = 0.18) {
  const affected = new Set(), imaged = new Set();
  for (const o of group.options) {
    for (const [id, u] of Object.entries(o.updates || {})) {
      if (!u?.type || u.type === "none") continue;
      affected.add(id);
      if (u.type === "image" || u.type === "both") imaged.add(id);
    }
  }
  if (!affected.size) return null;
  // Focus on what visibly changes: nodes whose IMAGE changes, ignoring huge ones (body) when smaller ones exist.
  const area = (id) => { const n = t.nodes.find((x) => x.id === id); return n ? (n.width * n.height) / (t.canvas.width * t.canvas.height) : 0; };
  let ids = imaged.size ? imaged : affected;
  const small = new Set([...ids].filter((id) => area(id) < 0.25));
  if (small.size) ids = small;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const o of group.options) {
    const r = resolveGarment(t, { ...selections, [group.id]: o.id }, { fabricId });
    for (const n of r.nodes) {
      if (!ids.has(n.id)) continue;
      x0 = Math.min(x0, n.x); y0 = Math.min(y0, n.y);
      x1 = Math.max(x1, n.x + n.width); y1 = Math.max(y1, n.y + n.height);
    }
  }
  if (!Number.isFinite(x0)) return null;
  const w = x1 - x0, h = y1 - y0;
  const px = w * pad, py = h * pad;
  // clamp to the canvas and keep a sensible aspect ratio for a thumbnail
  let box = { x: Math.max(0, x0 - px), y: Math.max(0, y0 - py) };
  box.width = Math.min(t.canvas.width - box.x, w + 2 * px);
  box.height = Math.min(t.canvas.height - box.y, h + 2 * py);
  const ratio = box.width / box.height;
  if (ratio > 1.6) { const nh = box.width / 1.6; box.y = Math.max(0, box.y - (nh - box.height) / 2); box.height = Math.min(t.canvas.height - box.y, nh); }
  if (ratio < 0.7) { const nw = box.height * 0.7; box.x = Math.max(0, box.x - (nw - box.width) / 2); box.width = Math.min(t.canvas.width - box.x, nw); }
  return box;
}

/** Sections shown to the customer. Falls back to: Fabric (if any) + one section per group. */
export function getSections(t) {
  if (t.sections?.length) return t.sections;
  return [
    ...(t.fabrics?.length ? [{ id: "fabric", title: "Fabric", kind: "fabric" }] : []),
    ...t.groups.map((g) => ({ id: g.id, title: g.name, groupIds: [g.id] })),
  ];
}
