export const ADMIN_CATEGORIES = {
  LIST:   { method: "GET",    url: "/admin/categories" },
  CREATE: { method: "POST",   url: "/admin/categories" },
  UPDATE: { method: "PUT",    url: (id) => `/admin/categories/${id}` },
  DELETE: { method: "DELETE", url: (id) => `/admin/categories/${id}` },
};