// import api from "../../../api/axiosInstance";
import api from "../../api/axiosInstance"; 
import { CART } from "./endpoints";

const call = ({ method, url }, { data, args = [] } = {}) => {
  const resolvedUrl = typeof url === "function" ? url(...args) : url;
  return api({ method, url: resolvedUrl, data }).then((r) => r.data);
};

export const addCart = async (payload) => {
  return call(CART.ADD, { data: payload });
};

export const updateCart = async (id, payload) => {
  return call(CART.UPDATE, { data: payload, args: [id] });
};

export const removeCart = async (id) => {
  return call(CART.REMOVE, { args: [id] });
};

export const listCart = async () => {
  const res = await call(CART.LIST);
  return res.data || res;
};

export const getCart = async (id) => {
  const res = await call(CART.GET, { args: [id] });
  return res.data || res;
};