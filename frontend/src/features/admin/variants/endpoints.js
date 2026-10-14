export const ADMIN_VARIANTS = {
  LIST:   { method: "GET",    url: "v1/product/variant" },
  CREATE: { method: "POST",   url: "v1/product/variant" },
  UPDATE: { method: "PUT",    url: (id) => `v1/product/variant/${id}` },
  DELETE: { method: "DELETE", url: (id) => `v1/product/variant/${id}` },
  BY_PRODUCT: { method: "GET", url: (id) => `v1/product/variant` },
};