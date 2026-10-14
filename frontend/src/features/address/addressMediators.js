import api from "../../api/axiosInstance";
import { ADDRESS } from "./endpoints";

const call = ({ method, url }, { data, args = [] } = {}) => {
  const resolvedUrl = typeof url === "function" ? url(...args) : url;
  return api({ method, url: resolvedUrl, data }).then((r) => r.data);
};

export const listAddresses = async () => {
  const res = await call(ADDRESS.LIST);
  return res.data || res;
};

export const createAddress = async (payload) => {
  return call(ADDRESS.CREATE, { data: payload });
};

export const getAddress = async (id) => {
  const res = await call(ADDRESS.GET, { args: [id] });
  return res.data || res;
};

export const updateAddress = async (id, payload) => {
  return call(ADDRESS.UPDATE, { data: payload, args: [id] });
};

export const deleteAddress = async (id) => {
  return call(ADDRESS.DELETE, { args: [id] });
};

export const setDefaultAddress = async (id) => {
  return call(ADDRESS.SET_DEFAULT, { args: [id] });
};