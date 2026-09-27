export const PRODUCTS = {
  LIST:   { method: "GET", url: "/products" },
  SEARCH: { method: "GET", url: "/products/search" },
  DETAIL: { method: "GET", url: (id) => `/products/${id}` },
};