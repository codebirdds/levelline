export const ADMIN_CATEGORIES = {
  LIST:   { method: "GET",    url: "v1/category" },
  CREATE: { method: "POST",   url: "v1/category" },
  UPDATE: { method: "PUT",    url: (id) => `v1/category/${id}` },
  DELETE: { method: "DELETE", url: (id) => `v1/category/${id}` },
};