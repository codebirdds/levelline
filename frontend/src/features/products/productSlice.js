import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  selected: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    fetchStart:   (s) => { s.loading = true; s.error = null; },
    fetchSuccess: (s, { payload }) => { s.loading = false; s.items = payload; },
    fetchFailure: (s, { payload }) => { s.loading = false; s.error = payload; },
    setSelected: (s, { payload }) => { s.selected = payload; },
  },
});

export const {
  fetchStart, fetchSuccess, fetchFailure, setSelected,
} = productSlice.actions;

export const selectProducts        = (s) => s.products.items;
export const selectProductsLoading = (s) => s.products.loading;
export const selectProductError    = (s) => s.products.error;
export const selectSelectedProduct = (s) => s.products.selected;

export default productSlice.reducer;