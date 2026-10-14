import api from "../../../api/axiosInstance";
import { ADMIN_VARIANTS } from "./endpoints";

const call = ({ method, url }, { data, args = [] } = {}) => {
  const resolvedUrl = typeof url === "function" ? url(...args) : url;
  const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
  const config = isFormData
    ? { headers: { "Content-Type": "multipart/form-data" } }
    : {};
  return api({ method, url: resolvedUrl, data, ...config }).then((r) => r.data);
};

export const listVariants = async (params) => {
  const res = await call(ADMIN_VARIANTS.LIST, { params });
  return res.data || res;
};

export const listVariantsByProduct = async (productId) => {
  const res = await call(ADMIN_VARIANTS.BY_PRODUCT, { args: [productId] }, { params: { product_id: productId } });
  return res.data || res;
};

export const createVariant = async (payload) => {
  return call(ADMIN_VARIANTS.CREATE, { data: payload });
};

export const updateVariant = async (id, payload) => {
  return call(ADMIN_VARIANTS.UPDATE, { data: payload, args: [id] });
};

export const deleteVariant = async (id) => {
  return call(ADMIN_VARIANTS.DELETE, { args: [id] });
};