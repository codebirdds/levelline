import { applyNodeUpdate } from "./patchMerger.js";

export const getGroup = (t, id) => t.groups.find((g) => g.id === id);
export function findOption(t, optionId) {
  for (const group of t.groups) {
    const option = group.options.find((o) => o.id === optionId);
    if (option) return { group, option };
  }
  return null;
}
export const optionName = (t, id) => findOption(t, id)?.option.name ?? id;

export function defaultSelections(t) {
  const s = {};
  for (const g of t.groups) {
    const d = g.options.find((o) => o.id === g.defaultOptionId) ?? g.options[0];
    if (d) s[g.id] = d.id;
  }
  return s;
}

export function normalizeSelections(t, sel = {}) {
  const out = defaultSelections(t);
  for (const node of t.nodes) {
    if (sel?.[node.id] !== undefined) out[node.id] = sel[node.id];
  }
  for (const g of t.groups) {
    const id = sel?.[g.id];
    if (id && g.options.some((o) => o.id === id)) out[g.id] = id;
  }
  return out;
}

export const getFabric = (t, id) => (t.fabrics ?? []).find((f) => f.id === id) ?? null;
export const defaultFabricId = (t) => getFabric(t, t.defaultFabricId)?.id ?? t.fabrics?.[0]?.id ?? null;
export const normalizeFabricId = (t, id) => getFabric(t, id)?.id ?? defaultFabricId(t);

function withTint(node, fabric) {
  if (!node.fabric || !fabric) return node;
  return {
    ...node,
    tint: {
      color: fabric.color,
      texture: fabric.texture ?? null,
      tile: fabric.tile ?? 0.9,
      blend: fabric.blend ?? "multiply",
      mask: node.fabricMask ?? null,
    },
  };
}

export function resolveGarment(t, selections, { skipGroupId, fabricId } = {}) {
  const sel = normalizeSelections(t, selections);
  const fabric = getFabric(t, normalizeFabricId(t, fabricId));
  let priceDelta = Number(fabric?.priceDelta) || 0;
  const state = new Map(t.nodes.map((n) => [n.id, n]));
  const order = t.nodes.map((n) => n.id);
  const owner = new Map();
  const conflicts = [];
  const missing = [];

  for (const group of t.groups) {
    const option = group.options.find((o) => o.id === sel[group.id]);
    if (!option) continue;
    if (group.id !== skipGroupId) priceDelta += Number(option.priceDelta) || 0;
    if (group.id === skipGroupId || !option.updates) continue;
    const ids = Object.keys(option.updates).sort((a, b) => order.indexOf(a) - order.indexOf(b));
    for (const nodeId of ids) {
      const node = state.get(nodeId);
      if (!node) { missing.push({ optionId: option.id, nodeId }); continue; }
      const { node: next, touched } = applyNodeUpdate(node, option.updates[nodeId]);
      for (const prop of touched) {
        const key = `${nodeId}.${prop}`;
        if (owner.has(key) && owner.get(key) !== option.id) {
          conflicts.push({ nodeId, prop, overriddenOptionId: owner.get(key), winnerOptionId: option.id });
        }
        owner.set(key, option.id);
      }
      state.set(nodeId, next);
    }
  }

  const overriddenNodes = new Set();
  for (const [nodeId, node] of state) {
    if (!node.useVariants) continue;
    const variantId = sel[nodeId];
    if (!variantId || !node.imageVariants?.length) continue;
    const variant = node.imageVariants.find((v) => v.id === variantId);
    if (!variant) continue;
    
    // FIX: Force maskImage to be the original collar so the new image/texture is clipped to the collar shape
    state.set(nodeId, { ...node, image: variant.image, maskImage: node.image });
    overriddenNodes.add(nodeId);
  }

  return {
    nodes: order.map((id) => overriddenNodes.has(id) ? state.get(id) : withTint(state.get(id), fabric)),
    selections: sel,
    fabric,
    priceDelta,
    conflicts,
    missing,
  };
}

export function getRuleViolations(t, selections) {
  const picked = new Set(Object.values(normalizeSelections(t, selections)));
  const out = [];
  for (const rule of t.rules ?? []) {
    if (!picked.has(rule.optionId)) continue;
    const targets = rule.targetOptionIds ?? [];
    if (rule.type === "requires" && !targets.some((id) => picked.has(id))) out.push({ rule, kind: "requires", conflicting: [] });
    if (rule.type === "excludes") {
      const hit = targets.filter((id) => picked.has(id));
      if (hit.length) out.push({ rule, kind: "excludes", conflicting: hit });
    }
  }
  return out;
}

const involves = (v, optionId) => v.rule.optionId === optionId || v.conflicting.includes(optionId);

function resetGroup(t, next, groupId, notices, because) {
  const group = getGroup(t, groupId);
  const candidates = [group.defaultOptionId, ...group.options.map((o) => o.id)];
  for (const cand of candidates) {
    const trial = { ...next, [groupId]: cand };
    if (!getRuleViolations(t, trial).some((v) => involves(v, cand))) {
      notices.push(`${optionName(t, next[groupId])} was reset to ${optionName(t, cand)} ${because}.`);
      next[groupId] = cand;
      return;
    }
  }
}

export function selectOption(t, selections, groupId, optionId) {
  const start = normalizeSelections(t, selections);
  const group = getGroup(t, groupId);
  if (!group?.options.some((o) => o.id === optionId)) return { selections: start, notices: [], blocked: { message: "Unknown option." } };
  const next = { ...start, [groupId]: optionId };
  const notices = [];
  const blocked = (message) => ({ selections: start, notices: [], blocked: { message } });

  for (let guard = 0; guard < 12; guard++) {
    const v = getRuleViolations(t, next)[0];
    if (!v) break;
    const { rule } = v;
    if (v.kind === "excludes") {
      if (involves(v, optionId)) return blocked(rule.message || `${optionName(t, optionId)} can't be combined with ${v.conflicting.map((id) => optionName(t, id)).join(" / ")}.`);
      resetGroup(t, next, findOption(t, rule.optionId).group.id, notices, "because of a compatibility rule");
    } else if (rule.optionId === optionId) {
      let satisfied = false;
      for (const targetId of rule.targetOptionIds) {
        const hit = findOption(t, targetId);
        if (!hit) continue;
        const trial = { ...next, [hit.group.id]: targetId };
        if (getRuleViolations(t, trial).some((x) => x.kind === "excludes" && involves(x, targetId))) continue;
        next[hit.group.id] = targetId;
        notices.push(`${optionName(t, optionId)} requires ${hit.option.name} - selected automatically.`);
        satisfied = true;
        break;
      }
      if (!satisfied) return blocked(rule.message || `${optionName(t, optionId)} requires: ${rule.targetOptionIds.map((id) => optionName(t, id)).join(" / ")}.`);
    } else {
      resetGroup(t, next, findOption(t, rule.optionId).group.id, notices, `because it requires ${rule.targetOptionIds.map((id) => optionName(t, id)).join(" / ")}`);
    }
  }
  return { selections: next, notices, blocked: null };
}

export function getOptionState(t, selections, groupId, optionId) {
  const r = selectOption(t, selections, groupId, optionId);
  return { disabled: !!r.blocked, reason: r.blocked?.message ?? "", hint: r.notices[0] ?? "" };
}