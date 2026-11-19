import { read, write, remove, clearNamespace, uid, slug, clone, stableStringify, SCHEMA_VERSION, StorageError } from "./storageCore.js";
import { buildSeed, PRESETS } from "./seedData.js";
import { validateTemplate } from "../engine/configurationValidator.js";
import { assetExists, assetMeta } from "./assetStorage.js";

let ready = false;
function init() {
  if (ready) return;
  ready = true;
  const meta = read("meta");
  if (meta?.schema === SCHEMA_VERSION && read("products")) return;
  seed();
}
function seed() {
  clearNamespace();
  const s = buildSeed();
  write("products", s.products);
  write("drafts", s.drafts);
  write("versions", s.versions);
  write("meta", { schema: SCHEMA_VERSION, seededAt: new Date().toISOString() });
}

const products = () => (init(), read("products", []));
const drafts = () => (init(), read("drafts", {}));
const versions = () => (init(), read("versions", {}));

export const listProducts = () => products();
export const listPublishedProducts = () => products().filter((p) => p.status === "published" && p.publishedVersionId && versions()[p.publishedVersionId]);
export const getProduct = (id) => products().find((p) => p.id === id) ?? null;
export const getDraft = (id) => drafts()[id] ?? null;
export const getVersion = (versionId) => versions()[versionId] ?? null;
export const getPublished = (productId) => {
  const p = getProduct(productId);
  return p?.publishedVersionId ? getVersion(p.publishedVersionId) : null;
};
export const listVersions = (productId) => Object.values(versions()).filter((v) => v.productId === productId).sort((a, b) => b.number - a.number);
export const isDraftDirty = (productId) => {
  const pub = getPublished(productId), draft = getDraft(productId);
  return !pub || stableStringify(pub.template) !== stableStringify(draft);
};

export function createProduct(meta, presetKey = "blank") {
  const list = products();
  let id = slug(meta.name);
  if (list.some((p) => p.id === id)) id = `${id}-${uid("p").slice(-4)}`;
  const now = new Date().toISOString();
  const product = { id, name: meta.name.trim(), description: meta.description?.trim() ?? "", category: meta.category?.trim() || "Shirts", basePrice: Number(meta.basePrice) || 0, status: "draft", publishedVersionId: null, hasFlatView: !!meta.hasFlatView, createdAt: now, updatedAt: now };
  const template = (PRESETS[presetKey] ?? PRESETS.blank).build(id);
  if (meta.canvas?.width > 0 && meta.canvas?.height > 0) template.canvas = { width: Number(meta.canvas.width), height: Number(meta.canvas.height) };
  const d = drafts();
  write("drafts", { ...d, [id]: template });
  write("products", [...list, product]);
  return product;
}

export function updateProduct(id, patch) {
  const list = products();
  if (!list.some((p) => p.id === id)) throw new StorageError("Product not found.");
  write("products", list.map((p) => (p.id === id ? { ...p, ...patch, id, updatedAt: new Date().toISOString() } : p)));
}

export function deleteProduct(id) {
  const { [id]: _d, ...restDrafts } = drafts();
  const restVersions = Object.fromEntries(Object.entries(versions()).filter(([, v]) => v.productId !== id));
  write("products", products().filter((p) => p.id !== id));
  write("drafts", restDrafts);
  write("versions", restVersions);
}

export function duplicateProduct(id) {
  const src = getProduct(id), draft = getDraft(id);
  if (!src || !draft) throw new StorageError("Product not found.");
  const copy = createProduct({ name: `${src.name} (Copy)`, description: src.description, category: src.category, basePrice: src.basePrice, hasFlatView: src.hasFlatView }, "blank");
  const template = { ...clone(draft), productId: copy.id };
  write("drafts", { ...drafts(), [copy.id]: template });
  return copy;
}

export function saveDraft(productId, template) {
  if (!getProduct(productId)) throw new StorageError("Product not found.");
  write("drafts", { ...drafts(), [productId]: { ...clone(template), productId } });
  updateProduct(productId, {});
}

export const validateDraft = (productId) => validateTemplate(getDraft(productId), { assetExists, assetMeta });

export function publish(productId) {
  const draft = getDraft(productId);
  if (!draft) throw new StorageError("Nothing to publish.");
  const validation = validateTemplate(draft, { assetExists, assetMeta });
  if (!validation.valid) return { ok: false, validation };
  const all = versions();
  const number = Math.max(0, ...Object.values(all).filter((v) => v.productId === productId).map((v) => v.number)) + 1;
  const id = `ver_${productId}_${number}`;
  write("versions", { ...all, [id]: { id, productId, number, publishedAt: new Date().toISOString(), template: clone(draft) } });
  updateProduct(productId, { status: "published", publishedVersionId: id });
  return { ok: true, versionId: id, validation };
}

export function unpublish(productId) {
  updateProduct(productId, { status: "draft", publishedVersionId: null });
}

export function resetDemoData() {
  ready = true;
  seed();
}

export { remove };
