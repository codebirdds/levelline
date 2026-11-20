// All localStorage access in the app goes through here (namespacing, safe JSON, quota errors, change events).
const NS = "levelline";
export const SCHEMA_VERSION = 1;
const EVENT = "levelline:storage";

export class StorageError extends Error {}

const store = () => {
  try { return typeof localStorage !== "undefined" ? localStorage : null; } catch { return null; }
};
export const storageKey = (name) => `${NS}:${name}`;

export function read(name, fallback = null) {
  const s = store();
  if (!s) return fallback;
  try {
    const raw = s.getItem(storageKey(name));
    return raw == null ? fallback : JSON.parse(raw);
  } catch (e) {
    console.error(`[storage] corrupt value for "${name}", using fallback`, e);
    return fallback;
  }
}

export function readRaw(name) {
  const s = store();
  try { return s ? s.getItem(storageKey(name)) : null; } catch { return null; }
}

export function write(name, value, { raw = false } = {}) {
  const s = store();
  if (!s) throw new StorageError("localStorage is not available in this browser.");
  try {
    s.setItem(storageKey(name), raw ? value : JSON.stringify(value));
  } catch (e) {
    const full = e?.name === "QuotaExceededError" || e?.code === 22 || /quota/i.test(e?.message || "");
    console.error(`[storage] write failed for "${name}"`, e);
    throw new StorageError(full ? "Browser storage is full. Delete unused products or images and try again  nothing was saved." : `Could not save: ${e.message}`);
  }
  emit(name);
}

export function remove(name) {
  const s = store();
  if (s) s.removeItem(storageKey(name));
  emit(name);
}

export function clearNamespace() {
  const s = store();
  if (!s) return;
  for (let i = s.length - 1; i >= 0; i--) { const k = s.key(i); if (k && k.startsWith(`${NS}:`)) s.removeItem(k); }
  emit("*");
}

const emit = (name) => {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(EVENT, { detail: { name } }));
};

export function subscribe(cb) {
  if (typeof window === "undefined") return () => {};
  const h = () => cb();
  window.addEventListener(EVENT, h);
  window.addEventListener("storage", h); // other tabs
  return () => { window.removeEventListener(EVENT, h); window.removeEventListener("storage", h); };
}

export const uid = (prefix = "id") => `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
export const slug = (s) => String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "item";
export const clone = (v) => JSON.parse(JSON.stringify(v));
export const stableStringify = (v) =>
  JSON.stringify(v, (_, val) => (val && typeof val === "object" && !Array.isArray(val) ? Object.fromEntries(Object.entries(val).sort(([a], [b]) => (a < b ? -1 : 1))) : val));
