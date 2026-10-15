import api from "../../api/axiosInstance";
import { TRACK_ORDER } from "./endpoints";

const call = ({ method, url }, { params, args = [] } = {}) => {
  const resolvedUrl = typeof url === "function" ? url(...args) : url;
  return api({ method, url: resolvedUrl, params }).then((response) => response.data);
};


export const listMyOrders = (params) => call(TRACK_ORDER.LIST, { params });
export const getMyOrder = (id) => call(TRACK_ORDER.DETAIL, { args: [id] });
export const cancelMyOrder = (id) => call(TRACK_ORDER.CANCEL, { args: [id] });
