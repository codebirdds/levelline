import api from "../../api/axiosInstance"; // Apna path check kar lena
import { CHECKOUT_ENDPOINTS } from "./endpoints";

const call = ({ method, url }, { data, args = [] } = {}) => {
  const resolvedUrl = typeof url === "function" ? url(...args) : url;
  return api({ method, url: resolvedUrl, data }).then((r) => r.data);
};

export const placeOrder = async (payload) => {
  return call(CHECKOUT_ENDPOINTS.PLACE_ORDER, { data: payload });
};

export const createRazorpayOrder = async (internalOrderId) => {
  return call(CHECKOUT_ENDPOINTS.CREATE_RAZORPAY, { data: { orderId: internalOrderId } });
};

export const verifyRazorpayPayment = async (paymentData) => {
  return call(CHECKOUT_ENDPOINTS.VERIFY_RAZORPAY, { data: paymentData });
};
