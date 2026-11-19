// Run:  node src/features/customizer/__tests__/engine.test.mjs
import assert from "node:assert/strict";

const mem = new Map();
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k),
  get length() { return mem.size; },
  key: (i) => [...mem.keys()][i] ?? null,
};

const { resolveGarment, selectOption, defaultSelections, getOptionState } = await import("../engine/configurationResolver.js");
const { groupFocusBox, getSections } = await import("../engine/previewFocus.js");
const { applyNodeUpdate } = await import("../engine/patchMerger.js");
const { validateTemplate } = await import("../engine/configurationValidator.js");
const { shirtTemplate } = await import("../storage/seedData.js");
const store = await import("../storage/productStorage.js");
const cart = await import("../storage/cartStorage.js");
const { assetExists, assetMeta } = await import("../storage/assetStorage.js");
const { resizeBox } = await import("../engine/coordinateUtils.js");
const { replaceFullGarment } = await import("../admin/editor/editorUtils.js");

let passed = 0;
const test = (name, fn) => { try { fn(); passed++; console.log("  ✓", name); } catch (e) { console.error("  ✗", name, "\n   ", e.message); process.exitCode = 1; } };
const T = shirtTemplate("t", "white-poplin");
const n = (r, id) => r.nodes.find((x) => x.id === id);
const base = (id) => T.nodes.find((x) => x.id === id);
const strip = ({ tint, ...rest }) => rest; // fabric tint is a separate dimension
const sel = (o) => ({ ...defaultSelections(T), ...o });

console.log("patch merger");
test("omitted image preserved / explicit null clears / position never touches image", () => {
  const node = { id: "a", image: "x", x: 1, y: 2, width: 3, height: 4, rotation: 0, visible: true, zIndex: 1 };
  assert.equal(applyNodeUpdate(node, { type: "position", geometry: { x: 9 } }).node.image, "x");
  assert.equal(applyNodeUpdate(node, { type: "image", image: "y" }).node.x, 1);
  assert.equal(applyNodeUpdate(node, { type: "image" }).node, node);
  assert.equal(applyNodeUpdate(node, { type: "image", image: null }).node.image, null);
  assert.equal(applyNodeUpdate(node, { type: "none", image: "z", geometry: { x: 5 } }).node, node);
  assert.equal(applyNodeUpdate(node, { type: "position", image: "z", geometry: { x: 5 } }).node.image, "x");
});

console.log("critical scenarios");
test("T1 IMAGE only: collar image changes, geometry unchanged", () => {
  const c = n(resolveGarment(T, sel({ "collar-style": "button-down-collar" })), "collar");
  assert.notEqual(c.image, base("collar").image);
  for (const k of ["x", "y", "width", "height", "rotation"]) assert.equal(c[k], base("collar")[k]);
});
test("T2 POSITION only: sleeve moves, image identical", () => {
  const s = n(resolveGarment(T, sel({ "collar-style": "modern-collar" })), "left-sleeve");
  assert.equal(s.y, 244); assert.equal(s.x, 70); assert.equal(s.image, base("left-sleeve").image); assert.equal(s.width, 170);
});
test("T3 BOTH: collar image + geometry", () => {
  const c = n(resolveGarment(T, sel({ "collar-style": "modern-collar" })), "collar");
  assert.notEqual(c.image, base("collar").image); assert.equal(c.width, 270); assert.equal(c.x, 365);
  assert.equal(c.height, 125);
});
test("T4 NONE: cuff untouched (same reference)", () => {
  const r = resolveGarment(T, sel({ "collar-style": "modern-collar" }));
  assert.deepEqual(strip(n(r, "left-cuff")), base("left-cuff"));
  assert.deepEqual(strip(n(r, "right-cuff")), base("right-cuff"));
  assert.equal(n(resolveGarment(T, sel({ "collar-style": "modern-collar" })), "buttons").x, base("buttons").x);
});
test("T5 multiple options don't undo each other", () => {
  const r = resolveGarment(T, sel({ "collar-style": "modern-collar", "cuff-style": "french-cuff" }));
  assert.equal(n(r, "collar").width, 270);
  assert.equal(n(r, "left-cuff").height, 130);
  assert.equal(n(r, "body").image, "seed:body-modern?c=ffffff");
});
test("T6 switching back restores the exact base state (no leftovers)", () => {
  const picked = selectOption(T, defaultSelections(T), "collar-style", "modern-collar").selections;
  const back = selectOption(T, picked, "collar-style", "classic-collar").selections;
  assert.deepEqual(resolveGarment(T, back).nodes, resolveGarment(T, defaultSelections(T)).nodes);
  assert.deepEqual(resolveGarment(T, back).nodes.map(strip), T.nodes);
});
test("resolver is idempotent (patches never accumulate)", () => {
  const s = sel({ "collar-style": "spread-collar", "cuff-style": "double-cuff" });
  assert.deepEqual(resolveGarment(T, s), resolveGarment(T, s));
  assert.equal(n(resolveGarment(T, s), "buttons").y, 336);
});
test("T7a requires: concealed placket auto-selects a compatible collar", () => {
  const r = selectOption(T, defaultSelections(T), "placket-style", "concealed-placket");
  assert.equal(r.blocked, null); assert.equal(r.selections["collar-style"], "modern-collar"); assert.ok(r.notices.length);
});
test("T7b excludes: incompatible option is blocked both ways", () => {
  const withConcealed = selectOption(T, defaultSelections(T), "placket-style", "concealed-placket").selections;
  const r1 = selectOption(T, withConcealed, "pocket-style", "double-pocket");
  assert.ok(r1.blocked); assert.deepEqual(r1.selections, withConcealed);
  const withDouble = selectOption(T, defaultSelections(T), "pocket-style", "double-pocket").selections;
  assert.ok(selectOption(T, withDouble, "placket-style", "concealed-placket").blocked);
  assert.equal(getOptionState(T, withDouble, "placket-style", "concealed-placket").disabled, true);
});
test("T7c removing a required option resets the dependent one", () => {
  const s = selectOption(T, defaultSelections(T), "placket-style", "concealed-placket").selections;
  const r = selectOption(T, s, "collar-style", "classic-collar");
  assert.equal(r.selections["placket-style"], "standard-placket"); assert.ok(r.notices.length);
});
test("conflicts are reported deterministically (later group wins)", () => {
  const r = resolveGarment(T, sel({ "collar-style": "modern-collar", "placket-style": "concealed-placket" }));
  assert.equal(n(r, "buttons").y, 345);
  assert.ok(r.conflicts.some((c) => c.nodeId === "buttons" && c.prop === "y"));
});

console.log("fabric dimension (independent of components)");
const F = (fabricId, o = {}) => resolveGarment(T, sel(o), { fabricId });
test("F1 changing fabric changes only tint — never images, geometry or selections", () => {
  const a = F("white-poplin"), b = F("pink-oxford");
  assert.deepEqual(a.nodes.map(strip), b.nodes.map(strip));
  assert.notEqual(n(a, "body").tint.color, n(b, "body").tint.color);
  assert.deepEqual(a.selections, b.selections);
});
test("F2 changing a component keeps the chosen fabric (and vice versa)", () => {
  const r = F("pink-oxford", { "collar-style": "spread-collar", "cuff-style": "french-cuff" });
  assert.equal(n(r, "collar").tint.color, "#f2c4cf"); // no contrast override -> collar falls back to the main fabric
  assert.equal(n(r, "collar").tint.color, n(r, "body").tint.color);
  assert.equal(n(r, "collar").image, "seed:collar-spread?c=ffffff"); assert.equal(n(r, "left-cuff").height, 130);
});
test("F3 per-region rules: contrast region (collar+cuffs) can differ from the body; buttons are never tinted", () => {
  const r = F("pink-white-collar");
  assert.equal(n(r, "body").tint.color, "#f2c4cf");
  assert.equal(n(r, "collar").tint.color, "#ffffff"); assert.equal(n(r, "collar").tint.texture, null);
  assert.equal(n(r, "left-cuff").tint.color, "#ffffff");
  assert.equal(n(r, "buttons").tint, undefined);
  assert.ok(n(r, "body").tint.texture);
});
test("F4 fabric price is part of the total and of the cart snapshot", () => {
  assert.equal(F("navy-twill").priceDelta, 250);
  const product = store.getProduct("classic-formal-shirt"), v = store.getPublished(product.id);
  const item = cart.buildCartItem(product, v, { "cuff-style": "double-cuff" }, "mint-linen");
  assert.equal(item.fabricId, "mint-linen"); assert.equal(item.price, 4200 + 300 + 200);
  assert.equal(item.summary[0].option, "Mint Linen");
  assert.equal(item.resolvedNodes.find((x) => x.id === "body").tint.color, "#cfe6d8");
  assert.notEqual(item.signature, cart.buildCartItem(product, v, { "cuff-style": "double-cuff" }, "navy-twill").signature);
});
test("slim fit + modern collar combine without conflict (different properties)", () => {
  const r = resolveGarment(T, sel({ "collar-style": "modern-collar", "fit-style": "slim-fit" }));
  assert.equal(n(r, "left-sleeve").x, 95); assert.equal(n(r, "left-sleeve").y, 244);
  assert.equal(r.conflicts.filter((c) => c.nodeId.includes("sleeve")).length, 0);
});

console.log("customer UI helpers");
test("sections are data-driven; thumbnails crop to the area a group changes", () => {
  assert.deepEqual(getSections(T).map((s) => s.title), ["Fabric", "Collar", "Cuff", "Pocket", "Placket", "Fit & Size"]);
  const collar = T.groups.find((g) => g.id === "collar-style");
  const box = groupFocusBox(T, collar, defaultSelections(T), "white-poplin");
  assert.ok(box.y < 200 && box.height < 500 && box.x > 100, JSON.stringify(box));
  assert.equal(groupFocusBox(T, T.groups.find((g) => g.id === "size"), defaultSelections(T)), null);
});

console.log("validation");
const ctx = { assetExists, assetMeta };
test("seed templates are valid", () => assert.equal(validateTemplate(T, ctx).valid, true, JSON.stringify(validateTemplate(T, ctx).errors)));
test("update type/property mismatches are errors", () => {
  const bad = JSON.parse(JSON.stringify(T));
  bad.groups[0].options[1].updates["left-sleeve"] = { type: "position", image: "seed:body", geometry: { x: 1 } };
  bad.groups[0].options[1].updates["ghost"] = { type: "none" };
  bad.groups[0].options[2].updates.collar = { type: "both", image: "seed:collar-spread" };
  bad.rules.push({ id: "r3", type: "requires", optionId: "nope", targetOptionIds: ["modern-collar"] });
  bad.fabrics[0].color = "red"; bad.sections[1].groupIds = ["ghost"];
  const codes = validateTemplate(bad, ctx).errors.map((e) => e.code);
  for (const c of ["update-mismatch", "update-node", "rule-ref", "fabric-color", "section-ref"]) assert.ok(codes.includes(c), `missing ${c}: ${codes}`);
});

console.log("storage, versions, cart");
test("T9 seeded products persist; create + nodes + options survive re-read", () => {
  assert.equal(store.listProducts().length, 5);
  const p = store.createProduct({ name: "Test Shirt", basePrice: 1000 }, "shirt");
  const d = store.getDraft(p.id);
  d.nodes.push({ id: "extra", name: "Extra", image: "seed:pocket-single", x: 1, y: 1, width: 10, height: 10, rotation: 0, visible: true, zIndex: 9 });
  store.saveDraft(p.id, d);
  assert.equal(store.getDraft(p.id).nodes.at(-1).id, "extra");
  assert.equal(store.getProduct(p.id).status, "draft");
  assert.equal(store.listPublishedProducts().some((x) => x.id === p.id), false);
});
test("T10 publish snapshot + cart item stay unchanged after editing the draft", () => {
  const id = "presidential-oxford-shirt";
  const product = store.getProduct(id), v1 = store.getPublished(id);
  const item = cart.buildCartItem(product, v1, { "collar-style": "modern-collar" });
  cart.addToCart(item);
  const frozen = JSON.stringify(cart.getCart()[0]);
  const draft = store.getDraft(id);
  draft.groups[0].options[1].updates.collar.geometry.width = 999;
  draft.nodes[0].x = 5;
  store.saveDraft(id, draft);
  assert.equal(store.isDraftDirty(id), true);
  assert.equal(JSON.stringify(cart.getCart()[0]), frozen);
  assert.equal(store.getVersion(v1.id).template.groups[0].options[1].updates.collar.geometry.width, 270);
  const res = store.publish(id);
  assert.equal(res.ok, true); assert.notEqual(res.versionId, v1.id);
  assert.equal(JSON.stringify(cart.getCart()[0]), frozen);
});
test("cart: same config merges, different config is a separate line", () => {
  const product = store.getProduct("classic-formal-shirt"), v = store.getPublished(product.id);
  cart.clearCart();
  cart.addToCart(cart.buildCartItem(product, v, {}));
  cart.addToCart(cart.buildCartItem(product, v, {}));
  cart.addToCart(cart.buildCartItem(product, v, { "cuff-style": "french-cuff" }));
  const c = cart.getCart();
  assert.equal(c.length, 2); assert.equal(c[0].quantity, 2); assert.equal(c[1].price, 4200 + 150 + 500); // base + Sky Twill + French cuff
});
test("publishing an invalid draft is blocked", () => {
  const id = "modern-slim-fit-shirt";
  const d = store.getDraft(id);
  d.groups[1].options[1].updates["left-cuff"] = { type: "image" };
  store.saveDraft(id, d);
  const r = store.publish(id);
  assert.equal(r.ok, false); assert.ok(r.validation.errors.length);
});
test("T11 full garment replacement swaps layout, old published version untouched", () => {
  const id = "premium-business-shirt";
  const before = JSON.stringify(store.getPublished(id));
  const next = replaceFullGarment(store.getDraft(id), { preset: "trousers", baseImage: "seed:leg" });
  assert.ok(next.nodes.some((x) => x.id === "waistband")); assert.equal(next.rules.length, 0);
  store.saveDraft(id, next);
  assert.equal(JSON.stringify(store.getPublished(id)), before);
  assert.equal(validateTemplate(next, ctx).valid, true);
});
test("T12 canvas math is resolution independent (resize handles, rotated)", () => {
  const s = { x: 100, y: 100, width: 200, height: 100, rotation: 0 };
  assert.deepEqual(resizeBox("se", s, 50, 20), { x: 100, y: 100, width: 250, height: 120 });
  assert.deepEqual(resizeBox("nw", s, -10, -10), { x: 90, y: 90, width: 210, height: 110 });
  const r = resizeBox("e", { ...s, rotation: 90 }, 0, 40);
  assert.equal(r.width, 240); assert.equal(Math.round(r.y), 120);
});

console.log(`\n${passed} passed`);
