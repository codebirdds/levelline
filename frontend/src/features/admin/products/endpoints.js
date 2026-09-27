export const ADMIN_PRODUCTS = {
  LIST:   { method: "GET",    url: "/admin/products" },
  CREATE: { method: "POST",   url: "/admin/products" },
  UPDATE: { method: "PUT",    url: (id) => `/admin/products/${id}` },
  DELETE: { method: "DELETE", url: (id) => `/admin/products/${id}` },
};