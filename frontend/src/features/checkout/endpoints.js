export const CHECKOUT_ENDPOINTS = {
  PLACE_ORDER: { method: "POST", url: "v1/order" },
  CREATE_RAZORPAY: { method: "POST", url: "v1/order/razorpay-order" },
  VERIFY_RAZORPAY: { method: "POST", url: "v1/order/verify-razorpay-payment" },
};
