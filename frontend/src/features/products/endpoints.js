export const PRODUCTS = {
  LIST:   { method: "GET", url: "v1/product" },
  DETAIL: { method: "GET", url: (id) => `v1/product/${id}` },
};