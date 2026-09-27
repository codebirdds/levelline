import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
  submitting: false,
  error: null,
  formOpen: false,
  editing: null,
};

const slice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {
    fetchStart:  (s) => { s.loading = true; s.error = null; },
    fetchSuccess:(s, { payload }) => { s.loading = false; s.items = payload; },
    fetchFailure:(s, { payload }) => { s.loading = false; s.error = payload; },

    submitStart:  (s) => { s.submitting = true; },
    submitEnd:    (s) => { s.submitting = false; },

    openForm:  (s, { payload = null }) => { s.formOpen = true; s.editing = payload; },
    closeForm: (s) => { s.formOpen = false; s.editing = null; },

    addItem:    (s, { payload }) => { s.items = [payload, ...s.items]; },
    updateItem: (s, { payload }) => { s.items = s.items.map((p) => (p.id === payload.id ? payload : p)); },
    removeItem: (s, { payload }) => { s.items = s.items.filter((p) => p.id !== payload); },
  },
});

export const {
  fetchStart, fetchSuccess, fetchFailure,
  submitStart, submitEnd,
  openForm, closeForm,
  addItem, updateItem, removeItem,
} = slice.actions;

export const selectAdminProducts = (s) => s.adminProducts.items;
export const selectAdminLoading  = (s) => s.adminProducts.loading;
export const selectFormOpen      = (s) => s.adminProducts.formOpen;
export const selectEditing       = (s) => s.adminProducts.editing;
export const selectSubmitting    = (s) => s.adminProducts.submitting;

export default slice.reducer;