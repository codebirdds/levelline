import api from "../../api/axiosInstance";
import { FABRIC } from "./endpoints";
import { FABRICS } from "./content";

const USE_MOCK = true;

const call = ({ method, url }, { data, params, args = [] } = {}) => {
  const resolvedUrl = typeof url === "function" ? url(...args) : url;
  return api({ method, url: resolvedUrl, data, params }).then((r) => r.data);
};

export const listFabric = async () =>
  USE_MOCK ? [...FABRICS] : call(FABRIC.LIST);

export const getFabricById = async (id) => {
  if (USE_MOCK) return FABRICS.find((f) => f.id === id);
  return call(FABRIC.DETAIL, { args: [id] });
};