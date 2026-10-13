export const CART = {
  ADD:    { method: "POST",   url: "v1/cart" },
  UPDATE: { method: "PUT",    url: (id) => `v1/cart/${id}` },
  REMOVE: { method: "DELETE", url: (id) => `v1/cart/${id}` },
  LIST:   { method: "GET",    url: "v1/cart" },
  GET:    { method: "GET",    url: (id) => `v1/cart/${id}` },
};