import api from "../../api/axiosInstance";
import { PRODUCTS } from "./endpoints";

const call = ({ method, url }, { data, params, args = [] } = {}) => {
  const resolvedUrl = typeof url === "function" ? url(...args) : url;
  return api({ method, url: resolvedUrl, data, params }).then((r) => r.data);
};

export const getProducts = async (params) => {
  return call(PRODUCTS.LIST, { params });
};

export const getProductById = async (id) => {
  return call(PRODUCTS.DETAIL, { args: [id] });
};