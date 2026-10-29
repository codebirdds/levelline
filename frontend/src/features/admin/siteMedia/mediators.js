import api from "../../../api/axiosInstance";
import { SITE_MEDIA } from "./endpoints";

const call = ({ method, url }, { data, args = [] } = {}) => {
  const resolvedUrl = typeof url === "function" ? url(...args) : url;
  const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
  const config = isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
  return api({ method, url: resolvedUrl, data, ...config }).then((r) => r.data);
};

export const listMedia = async () => {
  const res = await call(SITE_MEDIA.LIST);
  return res.data || res;
};

export const createMedia = async (payload) => {
  return call(SITE_MEDIA.CREATE, { data: payload });
};

export const updateMedia = async (id, payload) => {
  return call(SITE_MEDIA.UPDATE, { data: payload, args: [id] });
};

export const deleteMedia = async (id) => {
  return call(SITE_MEDIA.DELETE, { args: [id] });
};
