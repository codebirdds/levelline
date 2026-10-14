import api from "../../../api/axiosInstance";
import { ADMIN_CATEGORIES } from "./endpoints";

const call = ({ method, url }, { data, args = [] } = {}) => {
  const resolvedUrl = typeof url === "function" ? url(...args) : url;
  const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
  const config = isFormData
    ? { headers: { "Content-Type": "multipart/form-data" } }
    : {};
  return api({ method, url: resolvedUrl, data, ...config }).then((r) => r.data);
};

export const listCategories = async () => {
  const res = await call(ADMIN_CATEGORIES.LIST);
  return res.data || res;
};

export const createCategory = async (payload) => {
  return call(ADMIN_CATEGORIES.CREATE, { data: payload });
};

export const updateCategory = async (id, payload) => {
  return call(ADMIN_CATEGORIES.UPDATE, { data: payload, args: [id] });
};

export const deleteCategory = async (id) => {
  return call(ADMIN_CATEGORIES.DELETE, { args: [id] });
};