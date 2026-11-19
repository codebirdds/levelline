import { UPDATE_TYPES, touchesImage, touchesLayout } from "./patchMerger.js";
import { defaultSelections, getRuleViolations, resolveGarment, optionName } from "./configurationResolver.js";

const ID_RE = /^[a-z0-9][a-z0-9_-]*$/i;
const isNum = (v) => typeof v === "number" && Number.isFinite(v);
const LAYOUT_KEYS = ["geometry", "visible", "zIndex"];

/** Returns { valid, errors, warnings, issues }. Publishing is blocked while errors exist. */
export function validateTemplate(t, { assetExists = () => true, assetMeta = () => null } = {}) {
  const issues = [];
  const err = (code, message, extra = {}) => issues.push({ level: "error", code, message, ...extra });
  const seen = new Set();
  const warn = (code, message, extra = {}) => { if (seen.has(message)) return; seen.add(message); issues.push({ level: "warning", code, message, ...extra }); };

  if (!t?.canvas || !isNum(t.canvas.width) || !isNum(t.canvas.height) || t.canvas.width <= 0 || t.canvas.height <= 0) {
    err("canvas", "Canvas width/height must be positive numbers.");
  }
  if (!t?.nodes?.length) err("nodes", "The garment needs at least one node.");

  const imageOk = (ref, where, extra) => {
    if (!ref) return false;
    if (!assetExists(ref)) { err("asset-missing", `${where}: image asset was not found.`, extra); return false; }
    const m = assetMeta(ref);
    if (m && !(m.width > 0 && m.height > 0)) err("asset-size", `${where}: image has invalid dimensions.`, extra);
    return true;
  };
  const geoOk = (g, where, extra, partial) => {
    for (const k of ["x", "y", "width", "height", "rotation"]) {
      if (g[k] === undefined && partial) continue;
      if (!isNum(g[k])) err("geometry", `${where}: "${k}" must be a number.`, extra);
    }
    for (const k of ["width", "height"]) if (isNum(g[k]) && g[k] <= 0) err("geometry", `${where}: ${k} must be greater than 0.`, extra);
  };

  // ---- nodes
  const nodeIds = new Set();
  for (const n of t.nodes ?? []) {
    const where = `Node "${n.name || n.id}"`;
    if (!n.id || !ID_RE.test(n.id)) err("node-id", `${where}: invalid id.`, { nodeId: n.id });
    else if (nodeIds.has(n.id)) err("node-id-dup", `${where}: duplicate node id "${n.id}".`, { nodeId: n.id });
    nodeIds.add(n.id);
    if (!n.name?.trim()) err("node-name", `Node "${n.id}" needs a name.`, { nodeId: n.id });
    geoOk({ rotation: 0, ...n }, where, { nodeId: n.id }, false);
    if (!isNum(n.zIndex)) err("node-z", `${where}: zIndex must be a number.`, { nodeId: n.id });
    if (!n.image) { if (n.visible) err("asset-required", `${where}: visible node has no base image.`, { nodeId: n.id }); }
    else imageOk(n.image, where, { nodeId: n.id });
  }

  // ---- groups & options
  const groupIds = new Set();
  const optionIds = new Set();
  for (const g of t.groups ?? []) {
    if (!g.id || !ID_RE.test(g.id)) err("group-id", `Group "${g.name}": invalid id.`);
    else if (groupIds.has(g.id)) err("group-id-dup", `Duplicate group id "${g.id}".`);
    groupIds.add(g.id);
    if (!g.name?.trim()) err("group-name", `Group "${g.id}" needs a name.`);
    if (!g.options?.length) err("group-empty", `Group "${g.name}" has no options.`);
    else if (!g.options.some((o) => o.id === g.defaultOptionId)) err("group-default", `Group "${g.name}" has no valid default option.`);

    for (const o of g.options ?? []) {
      const where = `Option "${o.name}" (${g.name})`;
      const extra = { optionId: o.id };
      if (!o.id || !ID_RE.test(o.id)) err("option-id", `${where}: invalid id.`, extra);
      else if (optionIds.has(o.id)) err("option-id-dup", `${where}: duplicate option id "${o.id}".`, extra);
      optionIds.add(o.id);
      if (o.groupId !== g.id) err("option-group", `${where}: groupId does not match its group.`, extra);
      if (!o.name?.trim()) err("option-name", `Option "${o.id}" needs a name.`, extra);

      for (const [nodeId, u] of Object.entries(o.updates ?? {})) {
        const w = `${where} → node "${nodeId}"`;
        const ex = { optionId: o.id, nodeId };
        if (!nodeIds.has(nodeId)) { err("update-node", `${w}: node does not exist.`, ex); continue; }
        if (!UPDATE_TYPES.includes(u?.type)) { err("update-type", `${w}: unknown update type "${u?.type}".`, ex); continue; }
        const hasImage = "image" in u && u.image !== undefined;
        const hasLayout = LAYOUT_KEYS.some((k) => u[k] !== undefined);
        if (u.type === "none" && (hasImage || hasLayout)) err("update-mismatch", `${w}: type NONE must not carry changes.`, ex);
        if (u.type === "image" && hasLayout) err("update-mismatch", `${w}: type IMAGE must not change geometry/visibility/layer.`, ex);
        if (u.type === "position" && hasImage) err("update-mismatch", `${w}: type POSITION must not replace the image.`, ex);
        if (touchesImage(u.type)) {
          if (!hasImage) err("update-image", `${w}: ${u.type.toUpperCase()} needs an image (use null only to clear it on purpose).`, ex);
          else if (u.image === null) warn("update-clear", `${w}: image is explicitly cleared.`, ex);
          else imageOk(u.image, w, ex);
        }
        if (touchesLayout(u.type)) {
          if (!hasLayout) warn("update-empty", `${w}: POSITION without any layout change.`, ex);
          if (u.geometry) geoOk(u.geometry, w, ex, true);
        }
      }
    }
  }

  // ---- fabrics (second dimension) & sections
  const HEX = /^#[0-9a-f]{6}$/i;
  const fabricIds = new Set();
  for (const f of t.fabrics ?? []) {
    if (!f.id || !ID_RE.test(f.id)) err("fabric-id", `Fabric "${f.name}": invalid id.`);
    else if (fabricIds.has(f.id)) err("fabric-id-dup", `Duplicate fabric id "${f.id}".`);
    fabricIds.add(f.id);
    if (!f.name?.trim()) err("fabric-name", `Fabric "${f.id}" needs a name.`);
    if (!HEX.test(f.color || "")) err("fabric-color", `Fabric "${f.name}": colour must look like #rrggbb.`);
    if (f.texture && !assetExists(f.texture)) err("asset-missing", `Fabric "${f.name}": texture asset was not found.`);
  }
  if ((t.fabrics?.length ?? 0) && !fabricIds.has(t.defaultFabricId)) err("fabric-default", "defaultFabricId must reference an existing fabric.");
  if (t.fabrics?.length && !(t.nodes ?? []).some((n) => n.fabric)) warn("fabric-nodes", "Fabrics exist but no node has a fabric region, so fabric selection changes nothing.");
  const shown = new Set();
  const sectionIds = new Set();
  for (const sec of t.sections ?? []) {
    if (!sec.id || sectionIds.has(sec.id)) err("section-id", `Section id "${sec.id}" is missing or duplicated.`);
    sectionIds.add(sec.id);
    for (const gid of sec.groupIds ?? []) {
      if (!groupIds.has(gid)) err("section-ref", `Section "${sec.title}": group "${gid}" does not exist.`);
      shown.add(gid);
    }
  }
  if (t.sections?.length) for (const g of t.groups ?? []) if (!shown.has(g.id)) warn("section-missing", `Group "${g.name}" is not in any section, so customers can't change it.`);

  // ---- rules
  const ruleIds = new Set();
  for (const r of t.rules ?? []) {
    if (!r.id || ruleIds.has(r.id)) err("rule-id", `Rule id "${r.id}" is missing or duplicated.`);
    ruleIds.add(r.id);
    if (!["requires", "excludes"].includes(r.type)) err("rule-type", `Rule "${r.id}": unknown type.`);
    if (!optionIds.has(r.optionId)) err("rule-ref", `Rule "${r.id}": option "${r.optionId}" does not exist.`);
    if (!r.targetOptionIds?.length) err("rule-targets", `Rule "${r.id}": needs at least one target option.`);
    for (const id of r.targetOptionIds ?? []) {
      if (!optionIds.has(id)) err("rule-ref", `Rule "${r.id}": target option "${id}" does not exist.`);
      if (id === r.optionId) err("rule-self", `Rule "${r.id}": an option cannot depend on itself.`);
    }
  }

  // ---- semantic checks (only when the structure above is sound)
  if (!issues.some((i) => i.level === "error" && ["group-id", "group-id-dup", "option-id", "option-id-dup", "group-empty", "group-default", "rule-ref"].includes(i.code))) {
    const defaults = defaultSelections(t);
    for (const v of getRuleViolations(t, defaults)) {
      err("rule-default", `Default selections break rule "${v.rule.id}" (${optionName(t, v.rule.optionId)}). Change the defaults or the rule.`);
    }
    for (const g of t.groups) {
      for (const o of g.options) {
        const r = resolveGarment(t, { ...defaults, [g.id]: o.id });
        const bad = r.nodes.find((n) => !(n.width > 0 && n.height > 0) || ![n.x, n.y].every(isNum));
        if (bad) err("resolve-invalid", `Option "${o.name}" produces invalid geometry for node "${bad.name}".`, { optionId: o.id, nodeId: bad.id });
        for (const c of r.conflicts) {
          warn("conflict", `"${optionName(t, c.winnerOptionId)}" overrides "${optionName(t, c.overriddenOptionId)}" on ${c.nodeId}.${c.prop} (later group wins).`, { optionId: c.winnerOptionId, nodeId: c.nodeId });
        }
      }
    }
  }
  const errors = issues.filter((i) => i.level === "error");
  const warnings = issues.filter((i) => i.level === "warning");
  return { valid: errors.length === 0, errors, warnings, issues };
}
