
export const READY_TO_WEAR = {
  LIST: { method: "GET", url: "v1/product" },
  DETAIL: { method: "GET", url: (id) => `v1/product/${id}` },
};