import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const adminContactSlice = createSlice({
  name: "adminContacts",
  initialState,
  reducers: {
    fetchStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess(state, action) {
      state.loading = false;
      state.items = action.payload;
    },
    fetchFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updateOne(state, action) {
      const updated = action.payload;
      state.items = state.items.map((c) =>
        c.id === updated.id ? { ...c, ...updated } : c
      );
    },
  },
});

export const { fetchStart, fetchSuccess, fetchFailure, updateOne } =
  adminContactSlice.actions;

export const selectAdminContacts        = (s) => s.adminContacts.items;
export const selectAdminContactsLoading = (s) => s.adminContacts.loading;
export const selectAdminContactsError   = (s) => s.adminContacts.error;

export default adminContactSlice.reducer;