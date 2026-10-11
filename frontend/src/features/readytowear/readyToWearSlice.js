import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
  error: null,
  category: "ALL",
  sort: "featured",
};

const slice = createSlice({
  name: "readyToWear",
  initialState,
  reducers: {
    fetchStart: (s) => { s.loading = true; s.error = null; },
    fetchSuccess: (s, a) => { s.loading = false; s.items = a.payload; },
    fetchFailure: (s, a) => { s.loading = false; s.error = a.payload; },
    setCategory: (s, a) => { s.category = a.payload; },
    setSort: (s, a) => { s.sort = a.payload; },
  },
});

export const { fetchStart, fetchSuccess, fetchFailure, setCategory, setSort } = slice.actions;
export default slice.reducer;

export const selectRtwLoading = (s) => s.readyToWear?.loading;
export const selectRtwError = (s) => s.readyToWear?.error;
export const selectRtwCategory = (s) => s.readyToWear?.category;
export const selectRtwSort = (s) => s.readyToWear?.sort;
const selectRtwItems = (s) => s.readyToWear?.items;

export const selectVisibleRtw = createSelector(
  [selectRtwItems, selectRtwCategory, selectRtwSort],
  (items, category, sort) => {
    let list = category === "ALL" ? items : items?.filter((i) => i.category === category);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }
);
