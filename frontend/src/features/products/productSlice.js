import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  searchResults: [],
  selected: null,
  loading: false,
  searchLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    fetchStart:   (s) => { s.loading = true; s.error = null; },
    fetchSuccess: (s, { payload }) => { s.loading = false; s.items = payload; },
    fetchFailure: (s, { payload }) => { s.loading = false; s.error = payload; },

    searchStart:   (s) => { s.searchLoading = true; },
    searchSuccess: (s, { payload }) => { s.searchLoading = false; s.searchResults = payload; },
    searchClear:   (s) => { s.searchResults = []; s.searchLoading = false; },

    setSelected: (s, { payload }) => { s.selected = payload; },
  },
});

export const {
  fetchStart, fetchSuccess, fetchFailure,
  searchStart, searchSuccess, searchClear,
  setSelected,
} = productSlice.actions;

export const selectProducts        = (s) => s.products.items;
export const selectSearchResults   = (s) => s.products.searchResults;
export const selectProductsLoading = (s) => s.products.loading;
export const selectSearchLoading   = (s) => s.products.searchLoading;
export const selectProductError    = (s) => s.products.error;

export default productSlice.reducer;