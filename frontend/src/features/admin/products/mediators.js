import api from "../../../api/axiosInstance";
import { ADMIN_PRODUCTS } from "./endpoints";

const call = ({ method, url }, { data, args = [] } = {}) => {
  const resolvedUrl = typeof url === "function" ? url(...args) : url;
  
  // ✅ ADDED: FormData handling for images
  const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
  const config = isFormData
    ? { headers: { "Content-Type": "multipart/form-data" } }
    : {};

  return api({ method, url: resolvedUrl, data, ...config }).then((r) => r.data);
};

export const listProducts = async () => {
  const res = await call(ADMIN_PRODUCTS.LIST);
  return res.data || res;
};

export const createProduct = async (payload) => {
  return call(ADMIN_PRODUCTS.CREATE, { data: payload });
};

export const updateProduct = async (id, payload) => {
  return call(ADMIN_PRODUCTS.UPDATE, { data: payload, args: [id] });
};

export const deleteProduct = async (id) => {
  return call(ADMIN_PRODUCTS.DELETE, { args: [id] });
};