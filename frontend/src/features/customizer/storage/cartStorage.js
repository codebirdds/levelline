import { read, write, uid, stableStringify } from "./storageCore.js";
import { resolveGarment, normalizeSelections, normalizeFabricId, getGroup } from "../engine/configurationResolver.js";

export const getCart = () => read("cart", []);
export const cartCount = () => getCart().reduce((n, i) => n + i.quantity, 0);

export function buildCartItem(product, version, selections, fabricId) {
  const t = version.template;
  const fid = normalizeFabricId(t, fabricId);
  const r = resolveGarment(t, selections, { fabricId: fid });
  const sel = normalizeSelections(t, selections);
  return {
    productId: product.id,
    productName: product.name,
    versionId: version.id,
    selections: sel,
    fabricId: fid,
    summary: [...(r.fabric ? [{ group: "Fabric", option: r.fabric.name }] : []), ...t.groups.map((g) => ({ group: g.name, option: getGroup(t, g.id).options.find((o) => o.id === sel[g.id])?.name ?? "" }))],
    resolvedNodes: r.nodes,
    canvas: t.canvas,
    price: product.basePrice + r.priceDelta,
    quantity: 1,
    signature: `${product.id}|${version.id}|${fid}|${stableStringify(sel)}`,
  };
}
export function addToCart(item) {
  const cart = getCart();
  const existing = cart.find((i) => i.signature === item.signature);
  const next = existing
    ? cart.map((i) => (i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i))
    : [...cart, { ...item, id: uid("cart"), addedAt: new Date().toISOString() }];
  write("cart", next);
  return next;
}
export const updateQuantity = (id, qty) =>
  write("cart", getCart().map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)));
export const removeFromCart = (id) => write("cart", getCart().filter((i) => i.id !== id));
export const clearCart = () => write("cart", []);
