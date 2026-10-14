export const ADMIN_PRODUCTS = {
  LIST:   { method: "GET",    url: "v1/product" },
  CREATE: { method: "POST",   url: "v1/product" },
  UPDATE: { method: "PUT",    url: (id) => `v1/product/${id}` },
  DELETE: { method: "DELETE", url: (id) => `v1/product/${id}` },
};