import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
  error: null,
  category: "ALL",        // display name for tabs
  category_id: null,      // ← new — actual id sent to API
  sort: "featured",
};

const slice = createSlice({
  name: "readyToWear",
  initialState,
  reducers: {
    fetchStart: (s) => { s.loading = true; s.error = null; },
    fetchSuccess: (s, a) => { s.loading = false; s.items = a.payload; },
    fetchFailure: (s, a) => { s.loading = false; s.error = a.payload; },

    // Accepts { name, id } — "ALL" passes id: null
    setCategory: (s, a) => {
      const payload = a.payload;
      if (typeof payload === "string") {
        // backward-compatible: plain string means "ALL" or a name without id
        s.category = payload;
        s.category_id = null;
      } else {
        s.category = payload.name ?? "ALL";
        s.category_id = payload.id ?? null;
      }
    },

    setSort: (s, a) => { s.sort = a.payload; },
  },
});

export const { fetchStart, fetchSuccess, fetchFailure, setCategory, setSort } = slice.actions;
export default slice.reducer;

// ── Selectors ──
export const selectRtwLoading     = (s) => s.readyToWear?.loading;
export const selectRtwError       = (s) => s.readyToWear?.error;
export const selectRtwCategory    = (s) => s.readyToWear?.category;
export const selectRtwCategoryId  = (s) => s.readyToWear?.category_id; // ← new
export const selectRtwSort        = (s) => s.readyToWear?.sort;
const selectRtwItems              = (s) => s.readyToWear?.items;

// Backend now filters + sorts, so just pass items through.
// If you want a client-side safety net, keep the old filtering logic.
export const selectVisibleRtw = createSelector(
  [selectRtwItems],
  (items) => items ?? []
);