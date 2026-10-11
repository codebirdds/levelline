import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  coupon: null,
  address: {
    name: "Stephan Gogna",
    line: "33 b gali no 7 singh, Delhi, Delhi, India - 110059",
    tag: "Home",
  },
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    addItem(state, action) {
      const { product, size, qty = 1 } = action.payload;
      const existing = state.items.find(
        (i) => i.id === product.id && i.size === size
      );
      if (existing) {
        existing.qty += qty;
      } else {
        state.items.push({
          id: product.id,
          slug: product.slug,
          title: product.title,
          image: product.image,
          price: product.price,
          mrp: product.mrp,
          size,
          qty,
        });
      }
    },
    removeItem(state, action) {
      const { id, size } = action.payload;
      state.items = state.items.filter(
        (i) => !(i.id === id && i.size === size)
      );
    },
    updateQty(state, action) {
      const { id, size, qty } = action.payload;
      const item = state.items.find((i) => i.id === id && i.size === size);
      if (item) item.qty = Math.max(1, qty);
    },
    applyCoupon(state, action) {
      state.coupon = action.payload; // { code, percent }
    },
    removeCoupon(state) {
      state.coupon = null;
    },
    clearBag(state) {
      state.items = [];
      state.coupon = null;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQty,
  applyCoupon,
  removeCoupon,
  clearBag,
} = checkoutSlice.actions;

export const selectCheckoutItems  = (s) => s.checkout.items;
export const selectCheckoutCoupon = (s) => s.checkout.coupon;
export const selectCheckoutAddress = (s) => s.checkout.address;

export default checkoutSlice.reducer;