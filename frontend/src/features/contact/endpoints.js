export const CONTACT = {
  CREATE: { method: "post", url: "v1/contact" },
  LIST:   { method: "get",  url: "v1/contact" },
  DETAIL: { method: "get",  url: (id) => `v1/contact/${id}` },
  STATUS: { method: "put",  url: (id) => `v1/contact/${id}/status` },
};