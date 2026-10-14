import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
  submitting: false,
  error: null,
  formOpen: false,
  editing: null,
  selectedProductId: null,
};

const slice = createSlice({
  name: "adminVariants",
  initialState,
  reducers: {
    fetchStart:  (s) => { s.loading = true; s.error = null; },
    fetchSuccess:(s, { payload }) => { s.loading = false; s.items = payload; },
    fetchFailure:(s, { payload }) => { s.loading = false; s.error = payload; },

    submitStart: (s) => { s.submitting = true; },
    submitEnd:   (s) => { s.submitting = false; },

    openForm:  (s, { payload = null }) => { s.formOpen = true; s.editing = payload; },
    closeForm: (s) => { s.formOpen = false; s.editing = null; },

    setProduct: (s, { payload }) => { s.selectedProductId = payload; },

    addItem:    (s, { payload }) => { s.items = [payload, ...s.items]; },
    updateItem: (s, { payload }) => { s.items = s.items.map((v) => (v.id === payload.id ? payload : v)); },
    removeItem: (s, { payload }) => { s.items = s.items.filter((v) => v.id !== payload); },
  },
});

export const {
  fetchStart, fetchSuccess, fetchFailure,
  submitStart, submitEnd,
  openForm, closeForm, setProduct,
  addItem, updateItem, removeItem,
} = slice.actions;

export const selectVariants      = (s) => s.variants.items;
export const selectVariantLoading = (s) => s.variants.loading;
export const selectVariantFormOpen = (s) => s.variants.formOpen;
export const selectVariantEditing  = (s) => s.variants.editing;
export const selectSubmitting     = (s) => s.variants.submitting;
export const selectSelectedProductId = (s) => s.variants.selectedProductId;

export default slice.reducer;