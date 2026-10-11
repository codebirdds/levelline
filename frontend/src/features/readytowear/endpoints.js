
export const READY_TO_WEAR = {
  LIST: { method: "get", url: "/ready-to-wear" },
  DETAIL: { method: "get", url: (id) => `/ready-to-wear/${id}` },
  DETAIL_BY_SLUG: { method: "get", url: (slug) => `/ready-to-wear/slug/${slug}` },  // ← new
};