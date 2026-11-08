// Isolated asset layer: today localStorage, later swap for cloud/backend URLs without touching the engine.
import { read, readRaw, write, remove, uid, StorageError } from "./storageCore.js";
import { isSeedRef, seedDataUrl, seedExists } from "./seedAssets.js";

export const MAX_ASSET_BYTES = 450 * 1024; // per image after compression
const MAX_DIMENSION = 1400;
const mem = new Map();

/** "asset:<id>" | "seed:<piece>" | any URL  ->  something an <img> can load. */
export function resolveImageSrc(ref) {
  if (!ref) return "";
  if (isSeedRef(ref)) return seedDataUrl(ref);
  if (ref.startsWith("asset:")) {
    const id = ref.slice(6);
    if (!mem.has(id)) mem.set(id, readRaw(`asset:${id}`) || "");
    return mem.get(id);
  }
  return ref;
}

export function assetExists(ref) {
  if (!ref) return false;
  if (isSeedRef(ref)) return seedExists(ref);
  if (ref.startsWith("asset:")) return !!resolveImageSrc(ref);
  return true; // external URL — can't verify offline
}

export function assetMeta(ref) {
  if (ref?.startsWith("asset:")) return read(`assetmeta:${ref.slice(6)}`, null);
  return null;
}

const readFile = (file) => new Promise((res, rej) => {
  const r = new FileReader();
  r.onload = () => res(r.result);
  r.onerror = () => rej(new StorageError("Could not read the file."));
  r.readAsDataURL(file);
});
const loadImage = (src) => new Promise((res, rej) => {
  const i = new Image();
  i.onload = () => res(i);
  i.onerror = () => rej(new StorageError("This file is not a valid image."));
  i.src = src;
});

/** Validates, downsizes (keeps transparency) and stores an uploaded image. Throws StorageError with a clear message. */
export async function saveImageFile(file) {
  if (!file?.type?.startsWith("image/")) throw new StorageError("Please choose an image file (PNG, WebP, JPG or SVG).");
  let dataUrl = await readFile(file);
  const img = await loadImage(dataUrl);
  let { naturalWidth: width, naturalHeight: height } = img;
  if (!width || !height) throw new StorageError("Image has invalid dimensions.");

  if (file.type !== "image/svg+xml") {
    const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
    width = Math.round(width * scale);
    height = Math.round(height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(img, 0, 0, width, height);
    dataUrl = canvas.toDataURL("image/webp", 0.88);
    if (!dataUrl.startsWith("data:image/webp")) dataUrl = canvas.toDataURL("image/png");
  }
  if (dataUrl.length > MAX_ASSET_BYTES * 1.37) {
    throw new StorageError(`Image is too large (${Math.round((dataUrl.length / 1.37) / 1024)} KB after compression). The limit is ${Math.round(MAX_ASSET_BYTES / 1024)} KB — please use a smaller image.`);
  }
  const id = uid("img");
  write(`asset:${id}`, dataUrl, { raw: true });
  try { write(`assetmeta:${id}`, { width, height, name: file.name }); } catch (e) { remove(`asset:${id}`); throw e; }
  mem.set(id, dataUrl);
  return { ref: `asset:${id}`, width, height };
}

export const imageDimensions = async (ref) => {
  const img = await loadImage(resolveImageSrc(ref));
  return { width: img.naturalWidth, height: img.naturalHeight };
};
