import { round } from "./coordinateUtils.js";

export const UPDATE_TYPES = ["none", "image", "position", "both"];
export const GEO_KEYS = ["x", "y", "width", "height", "rotation"];
export const touchesImage = (t) => t === "image" || t === "both";
export const touchesLayout = (t) => t === "position" || t === "both";
const isNum = (v) => typeof v === "number" && Number.isFinite(v);

/**
 * Pure. Applies ONE node update on top of a node.
 *  none      -> node returned untouched (same reference)
 *  image     -> only `image` (undefined = keep, null = explicit clear). Geometry never touched.
 *  position  -> only geometry/visible/zIndex fields that are present. Image never touched.
 *  both      -> both of the above.
 * Omitted fields always keep their current value.
 */
export function applyNodeUpdate(node, update) {
  const type = update?.type ?? "none";
  if (type === "none") return { node, touched: [] };
  const next = { ...node };
  const touched = [];
  if (touchesImage(type) && update.image !== undefined) {
    next.image = update.image;
    touched.push("image");
  }
  if (touchesLayout(type)) {
    const g = update.geometry || {};
    for (const k of GEO_KEYS) if (isNum(g[k])) { next[k] = g[k]; touched.push(k); }
    if (typeof update.visible === "boolean") { next.visible = update.visible; touched.push("visible"); }
    if (isNum(update.zIndex)) { next.zIndex = update.zIndex; touched.push("zIndex"); }
     if (update.crop) { next.crop = { ...(node.crop || {}), ...update.crop }; touched.push("crop"); }
    if (typeof update.flipX === "boolean") { next.flipX = update.flipX; touched.push("flipX"); }
    if (typeof update.flipY === "boolean") { next.flipY = update.flipY; touched.push("flipY"); }
  }
  return { node: touched.length ? next : node, touched };
}

/** Only the fields that differ from the baseline (so patches stay tiny). */
export function buildLayoutPatch(baseline, edited, eps = 0.05) {
  const geometry = {};
  for (const k of GEO_KEYS) {
    if (isNum(edited[k]) && Math.abs((baseline[k] ?? 0) - edited[k]) > eps) geometry[k] = round(edited[k], 2);
  }
  const out = {};
  if (Object.keys(geometry).length) out.geometry = geometry;
  if (edited.visible !== baseline.visible) out.visible = !!edited.visible;
  if (isNum(edited.zIndex) && edited.zIndex !== baseline.zIndex) out.zIndex = edited.zIndex;
  return out;
}

/** Re-type an update: keep only what the new type owns. */
export function retypeUpdate(update, type) {
  if (type === "none") return null;
  const out = { type };
  if (touchesImage(type) && update && "image" in update) out.image = update.image;
  if (touchesLayout(type) && update) {
    if (update.geometry) out.geometry = update.geometry;
    if (update.visible !== undefined) out.visible = update.visible;
    if (update.zIndex !== undefined) out.zIndex = update.zIndex;
  }
  return out;
}
