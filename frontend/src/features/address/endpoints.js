export const ADDRESS = {
  LIST:   { method: "GET",    url: "v1/address" },
  CREATE: { method: "POST",   url: "v1/address" },
  GET:    { method: "GET",    url: (id) => `v1/address/${id}` },
  UPDATE: { method: "PUT",    url: (id) => `v1/address/${id}` },
  DELETE: { method: "DELETE", url: (id) => `v1/address/${id}` },
  SET_DEFAULT: { method: "PATCH", url: (id) => `v1/address/${id}/default` },
};