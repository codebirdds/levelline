export const FABRIC = {
  LIST: { method: "get", url: "/fabric" },
  DETAIL: { method: "get", url: (id) => `/fabric/${id}` },
};