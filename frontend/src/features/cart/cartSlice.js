import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as cartApi from "./cartMediators";

const initialState = {
  items: [],
  loading: false,
  error: null,
  fetched: false,   // ← ye flag loop rok dega
};

const unwrap = (res) => res?.data?.data ?? res?.data ?? res;

const normalizeItem = (raw, fallback = {}) => {
  const r = unwrap(raw) || {};
  const qty = Number(r.quantity ?? r.qty ?? fallback.quantity ?? 1);
  const unitPrice = Number(r.unit_price ?? r.price ?? fallback.unit_price ?? 0);
  return {
    ...r,
    id: r.id ?? fallback.id ?? Date.now(),
    product_id: r.product_id ?? fallback.product_id,
    product_variant_id: r.product_variant_id ?? r.variant_id ?? fallback.product_variant_id,
    size: r.size ?? fallback.size,
    quantity: qty,
    unit_price: unitPrice,
    subtotal: Number(r.subtotal ?? unitPrice * qty),
  };
};

export const fetchCartThunk = createAsyncThunk(
  "cart/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await cartApi.listCart();
      const data = unwrap(res);
      const items = Array.isArray(data) ? data : data?.items ?? data?.cart?.items ?? [];
      return { items: items.map((i) => normalizeItem(i)) };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load cart");
    }
  },
  {
    // agar already loading hai to dobara fire mat karo
    condition: (_, { getState }) => {
      const { cart } = getState();
      if (cart.loading) return false;
    },
  }
);

export const addCartThunk = createAsyncThunk(
  "cart/add",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await cartApi.addCart(payload);
      const item = unwrap(res);
      const raw =
        item?.items?.find?.(
          (i) => i.product_variant_id === payload.product_variant_id && i.size === payload.size
        ) ??
        item?.items?.[item.items.length - 1] ??
        item;
      return normalizeItem(raw, payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add to cart");
    }
  }
);

export const updateCartThunk = createAsyncThunk(
  "cart/update",
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const res = await cartApi.updateCart(id, { quantity });
      return normalizeItem(unwrap(res), { id, quantity });
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update cart");
    }
  }
);

export const removeCartThunk = createAsyncThunk(
  "cart/remove",
  async (id, { rejectWithValue }) => {
    try {
      await cartApi.removeCart(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove from cart");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (s) => { s.items = []; s.fetched = false; },
    localAddItem: (s, { payload }) => {
      const { product, variant, size, qty = 1 } = payload;
      const existing = s.items.find(
        (i) => i.product_variant_id === variant.id && i.size === size
      );
      if (existing) {
        existing.quantity += qty;
        existing.subtotal = Number((existing.unit_price * existing.quantity).toFixed(2));
      } else {
        const price = Number(
          variant.product?.discount_price ?? variant.product?.price ?? product?.discount_price ?? product?.price ?? 0
        );
        s.items.push({
          id: Date.now(),
          product_id: product.id,
          product_variant_id: variant.id,
          size,
          quantity: qty,
          product,
          variant,
          unit_price: price,
          subtotal: Number((price * qty).toFixed(2)),
        });
      }
    },
    localRemoveItem: (s, { payload }) => {
      s.items = s.items.filter(
        (i) => !(i.product_variant_id === payload.variant_id && i.size === payload.size)
      );
    },
    localUpdateQty: (s, { payload }) => {
      const item = s.items.find(
        (i) => i.product_variant_id === payload.variant_id && i.size === payload.size
      );
      if (item) {
        item.quantity = Math.max(1, payload.qty);
        item.subtotal = Number((item.unit_price * item.quantity).toFixed(2));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartThunk.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchCartThunk.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.fetched = true;             // ← important
        s.items = payload.items || [];
      })
      .addCase(fetchCartThunk.rejected, (s, { payload }) => {
        s.loading = false;
        s.fetched = true;             // ← even on error don't loop
        s.error = payload;
      })

      .addCase(addCartThunk.fulfilled, (s, { payload }) => {
        if (!payload) return;
        const idx = s.items.findIndex(
          (i) => i.product_variant_id === payload.product_variant_id && i.size === payload.size
        );
        if (idx >= 0) s.items[idx] = { ...s.items[idx], ...payload };
        else s.items.push(payload);
      })

      .addCase(updateCartThunk.fulfilled, (s, { payload }) => {
        const item = s.items.find((i) => i.id === payload.id);
        if (item) {
          item.quantity = payload.quantity;
          item.subtotal = payload.subtotal;
        }
      })

      .addCase(removeCartThunk.fulfilled, (s, { payload }) => {
        s.items = s.items.filter((i) => i.id !== payload);
      });
  },
});

export const {
  clearCart, localAddItem, localRemoveItem, localUpdateQty,
} = cartSlice.actions;

export const selectCartItems = (s) => s.cart.items;
export const selectCartLoading = (s) => s.cart.loading;
export const selectCartError = (s) => s.cart.error;
export const selectCartFetched = (s) => s.cart.fetched;
export const selectCartTotalItems = (s) =>
  s.cart.items.reduce((t, i) => t + (i.quantity ?? i.qty ?? 0), 0);
export const selectCartSubtotal = (s) =>
  s.cart.items.reduce((t, i) => t + (i.subtotal || 0), 0);

export default cartSlice.reducer;