export const TRACK_ORDER = {
  LIST: { method: "GET", url: "v1/order" },
  DETAIL: { method: "GET", url: (id) => `v1/order/${id}` },
  CANCEL: { method: "PATCH", url: (id) => `v1/order/${id}/cancel` },
};
