export const SITE_MEDIA = {
  LIST: { method: "GET", url: "v1/site-media" },
  CREATE: { method: "POST", url: "v1/site-media" },
  UPDATE: { method: "PATCH", url: (id) => `v1/site-media/${id}` }, // ✅ PATCH request
  DELETE: { method: "DELETE", url: (id) => `v1/site-media/${id}` },
};
