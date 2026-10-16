export const CONTACT = {
  CREATE: { method: "post", url: "/contact" },
  LIST:   { method: "get",  url: "/contact" },
  DETAIL: { method: "get",  url: (id) => `/contact/${id}` },
  STATUS: { method: "put",  url: (id) => `/contact/${id}/status` },
};