import api from "../../api/axiosInstance";
import { READY_TO_WEAR } from "./endpoints";

const call = ({ method, url }, { data, params, args = [] } = {}) => {
  const resolvedUrl = typeof url === "function" ? url(...args) : url;
  return api({ method, url: resolvedUrl, data, params }).then((r) => r.data);
};

// Normalize backend product shape → frontend card/detail shape
const normalize = (p) => {
  if (!p) return p;
  const variant = p?.variants?.[0] || {};
  const variantImages = Array.isArray(variant.images) ? variant.images : [];
  return {
    ...p,
    id: p.id,
    title: p.name,
    slug: p.slug,
    price: Number(p.price),
    mrp: p.discount_price ? Number(p.discount_price) : null,
    image: variantImages[0] || variant.image || "",
    images: variantImages.length ? variantImages : [variantImages[0] || variant.image || ""],
    category: p.category?.name || p.category || "",
    fabric: p.material || "",
    color: variant.color || "",
    category_id: p.category_id,
    material: p.material,
    gender: p.gender,
    fit: p.fit,
    occasion: p.occasion,
    pattern: p.pattern,
    brand: p.brand,
    description: p.description,
    status: p.status,
    variants: p.variants,
  };
};

export const listReadyToWear = async ({ category_id, sort } = {}) => {
  // Build params — only include category_id if it's a real value
  const params = { status: "active", limit: 100 };
  if (category_id != null && category_id !== "") {
    params.category_id = category_id;
  }
  if (sort) params.sort = sort;

  const res = await call(READY_TO_WEAR.LIST, { params });
  const rows = res?.data || res || [];
  return rows.map(normalize);
};

export const getReadyToWearById = async (id) => {
  const res = await call(READY_TO_WEAR.DETAIL, { args: [id] });
  return normalize(res?.data || res);
};

export const getReadyToWearBySlug = async (slug) => {
  const res = await listReadyToWear();
  return res.find((p) => p.slug === slug);
};