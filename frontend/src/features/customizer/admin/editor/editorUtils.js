import { PRESETS } from "../../storage/seedData.js";
import { retypeUpdate } from "../../engine/patchMerger.js";

const slug = (s) => String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "item";
export const uniqueId = (name, taken) => {
  const base = slug(name);
  let id = base, i = 2;
  while (taken.includes(id)) id = `${base}-${i++}`;
  return id;
};
const allOptionIds = (d) => d.groups.flatMap((g) => g.options.map((o) => o.id));
const mapGroup = (d, groupId, fn) => ({ ...d, groups: d.groups.map((g) => (g.id === groupId ? fn(g) : g)) });
const move = (arr, index, dir) => {
  const j = index + dir;
  if (j < 0 || j >= arr.length) return arr;
  const copy = [...arr];
  [copy[index], copy[j]] = [copy[j], copy[index]];
  return copy;
};

export function addNode(d, { name, image, width, height, x, y, view = "front" }) {
  const id = uniqueId(name, d.nodes.map((n) => n.id));
  const zIndex = Math.max(0, ...d.nodes.map((n) => n.zIndex)) + 1;
  const node = {
    id, name: name.trim(), image, width: Math.round(width), height: Math.round(height),
    x: Math.round(x ?? (d.canvas.width - width) / 2), y: Math.round(y ?? (d.canvas.height - height) / 2),
    rotation: 0, visible: true, zIndex, locked: false, imageVariants: [], view,
  };
  return { draft: { ...d, nodes: [...d.nodes, node] }, id };
}
export const updateNode = (d, id, patch) => ({ ...d, nodes: d.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)) });

export function deleteNode(d, id) {
  const groups = d.groups.map((g) => ({
    ...g,
    options: g.options.map((o) => {
      if (!o.updates?.[id]) return o;
      const { [id]: _gone, ...updates } = o.updates;
      return { ...o, updates };
    }),
  }));
  return { ...d, nodes: d.nodes.filter((n) => n.id !== id), groups };
}

export function addNodeVariant(d, nodeId, variant) {
  return {
    ...d,
    nodes: d.nodes.map(n => n.id === nodeId ? {
      ...n,
      imageVariants: [...(n.imageVariants || []), { id: uniqueId(variant.name, (n.imageVariants || []).map(v => v.id)), ...variant }]
    } : n)
  };
}
export function updateNodeVariant(d, nodeId, variantId, patch) {
  return {
    ...d,
    nodes: d.nodes.map(n => n.id === nodeId ? {
      ...n,
      imageVariants: (n.imageVariants || []).map(v => v.id === variantId ? { ...v, ...patch } : v)
    } : n)
  };
}
export function deleteNodeVariant(d, nodeId, variantId) {
  return {
    ...d,
    nodes: d.nodes.map(n => n.id === nodeId ? {
      ...n,
      imageVariants: (n.imageVariants || []).filter(v => v.id !== variantId)
    } : n)
  };
}

export function moveLayer(d, id, dir) {
  const sorted = [...d.nodes].sort((a, b) => a.zIndex - b.zIndex || d.nodes.indexOf(a) - d.nodes.indexOf(b));
  const i = sorted.findIndex((n) => n.id === id);
  const j = i + dir;
  if (j < 0 || j >= sorted.length) return d;
  const a = sorted[i], b = sorted[j];
  const za = a.zIndex === b.zIndex ? a.zIndex + dir : b.zIndex;
  return { ...d, nodes: d.nodes.map((n) => (n.id === a.id ? { ...n, zIndex: za } : n.id === b.id ? { ...n, zIndex: a.zIndex } : n)) };
}

export function addGroup(d, name) {
  const id = uniqueId(name, d.groups.map((g) => g.id));
  const optId = uniqueId(`${name} default`, allOptionIds(d));
  const g = { id, name: name.trim(), defaultOptionId: optId, options: [{ id: optId, groupId: id, name: "Default", priceDelta: 0, updates: {} }] };
  return { draft: { ...d, groups: [...d.groups, g] }, groupId: id, optionId: optId };
}
export const renameGroup = (d, id, name) => mapGroup(d, id, (g) => ({ ...g, name }));
export function deleteGroup(d, id) {
  const gone = d.groups.find((g) => g.id === id)?.options.map((o) => o.id) ?? [];
  return { ...d, groups: d.groups.filter((g) => g.id !== id), rules: pruneRules(d.rules, gone) };
}
export const moveGroup = (d, id, dir) => ({ ...d, groups: move(d.groups, d.groups.findIndex((g) => g.id === id), dir) });

export function addOption(d, groupId, name) {
  const id = uniqueId(name, allOptionIds(d));
  return { draft: mapGroup(d, groupId, (g) => ({ ...g, options: [...g.options, { id, groupId, name: name.trim(), priceDelta: 0, updates: {} }] })), optionId: id };
}
export const updateOption = (d, groupId, optionId, patch) =>
  mapGroup(d, groupId, (g) => ({ ...g, options: g.options.map((o) => (o.id === optionId ? { ...o, ...patch } : o)) }));
export function deleteOption(d, groupId, optionId) {
  const g = d.groups.find((x) => x.id === groupId);
  if (!g || g.options.length <= 1) return d;
  const options = g.options.filter((o) => o.id !== optionId);
  return { ...mapGroup(d, groupId, (grp) => ({ ...grp, options, defaultOptionId: grp.defaultOptionId === optionId ? options[0].id : grp.defaultOptionId })), rules: pruneRules(d.rules, [optionId]) };
}
export const setDefaultOption = (d, groupId, optionId) => mapGroup(d, groupId, (g) => ({ ...g, defaultOptionId: optionId }));
export const moveOption = (d, groupId, optionId, dir) =>
  mapGroup(d, groupId, (g) => ({ ...g, options: move(g.options, g.options.findIndex((o) => o.id === optionId), dir) }));

export function setNodeUpdate(d, groupId, optionId, nodeId, update) {
  return mapGroup(d, groupId, (g) => ({
    ...g,
    options: g.options.map((o) => {
      if (o.id !== optionId) return o;
      const { [nodeId]: _old, ...rest } = o.updates || {};
      return { ...o, updates: update ? { ...rest, [nodeId]: update } : rest };
    }),
  }));
}
export const setUpdateType = (d, groupId, optionId, nodeId, type) => {
  const cur = d.groups.find((g) => g.id === groupId)?.options.find((o) => o.id === optionId)?.updates?.[nodeId];
  return setNodeUpdate(d, groupId, optionId, nodeId, type === "none" ? null : retypeUpdate(cur, type));
};

const pruneRules = (rules = [], removedOptionIds) =>
  rules
    .filter((r) => !removedOptionIds.includes(r.optionId))
    .map((r) => ({ ...r, targetOptionIds: r.targetOptionIds.filter((id) => !removedOptionIds.includes(id)) }))
    .filter((r) => r.targetOptionIds.length);
export const addRule = (d, rule) => ({ ...d, rules: [...d.rules, { message: "", ...rule, id: uniqueId(`rule-${rule.optionId}`, d.rules.map((r) => r.id)) }] });
export const updateRule = (d, id, patch) => ({ ...d, rules: d.rules.map((r) => (r.id === id ? { ...r, ...patch } : r)) });
export const deleteRule = (d, id) => ({ ...d, rules: d.rules.filter((r) => r.id !== id) });

export function replaceFullGarment(d, { preset, fromTemplate, baseImage }) {
  const source = fromTemplate ?? PRESETS[preset ?? "blank"].build(d.productId);
  const copy = JSON.parse(JSON.stringify(source));
  return { ...d, canvas: copy.canvas, baseImage: baseImage || copy.baseImage, nodes: copy.nodes, groups: copy.groups, rules: copy.rules, fabrics: copy.fabrics ?? [], defaultFabricId: copy.defaultFabricId ?? null, sections: copy.sections ?? [] };
}

export const bringToFront = (d, id) => {
  const maxZ = Math.max(0, ...d.nodes.map((n) => n.zIndex));
  return { ...d, nodes: d.nodes.map((n) => (n.id === id ? { ...n, zIndex: maxZ + 1 } : n)) };
};
export const sendToBack = (d, id) => {
  const minZ = Math.min(0, ...d.nodes.map((n) => n.zIndex));
  return { ...d, nodes: d.nodes.map((n) => (n.id === id ? { ...n, zIndex: minZ - 1 } : n)) };
};
export const flipNode = (d, id, axis) => {
  return { ...d, nodes: d.nodes.map((n) => n.id === id ? { ...n, [axis === "x" ? "flipX" : "flipY"]: !n[axis === "x" ? "flipX" : "flipY"] } : n) };
};

export function normalizeCrop(c) {
  const x = Math.max(0, Math.min(99, Number(c?.x) || 0));
  const y = Math.max(0, Math.min(99, Number(c?.y) || 0));
  const w = Math.max(1, Math.min(100 - x, Number(c?.w) || 100));
  const h = Math.max(1, Math.min(100 - y, Number(c?.h) || 100));
  return { x, y, w, h };
}
export function setCropShape(d, id, crop) {
  return { ...d, nodes: d.nodes.map((n) => n.id === id ? { ...n, crop: normalizeCrop(crop) } : n) };
}
export function resetCrop(d, id) {
  return { ...d, nodes: d.nodes.map((n) => n.id === id ? { ...n, crop: { type: "rect", x: 0, y: 0, w: 100, h: 100, feather: 0 } } : n) };
}
