import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
  submitting: false,
  error: null,
  formOpen: false,
  editing: null,
  selectedProductId: null, // ✅ Added to track the filtered product
};

const variantSlice = createSlice({
  name: "adminVariants",
  initialState,
  reducers: {
    fetchStart: (s) => { s.loading = true; s.error = null; },
    fetchSuccess: (s, { payload }) => { s.loading = false; s.items = payload; },
    fetchFailure: (s, { payload }) => { s.loading = false; s.error = payload; },

    submitStart: (s) => { s.submitting = true; },
    submitEnd: (s) => { s.submitting = false; },

    openForm: (s, { payload = null }) => { s.formOpen = true; s.editing = payload; },
    closeForm: (s) => { s.formOpen = false; s.editing = null; },

    // ✅ Added setProduct action
    setProduct: (s, { payload }) => { s.selectedProductId = payload; },

    addItem: (s, { payload }) => { s.items = [payload, ...s.items]; },
    updateItem: (s, { payload }) => { s.items = s.items.map((v) => (v.id === payload.id ? payload : v)); },
    removeItem: (s, { payload }) => { s.items = s.items.filter((v) => v.id !== payload); },
  },
});

export const {
  fetchStart, fetchSuccess, fetchFailure,
  submitStart, submitEnd,
  openForm, closeForm, setProduct, // ✅ Export setProduct
  addItem, updateItem, removeItem,
} = variantSlice.actions;

// ✅ Selectors (Fixed names to match what your page imports)
export const selectVariants = (s) => s.adminVariants.items;
export const selectVariantLoading = (s) => s.adminVariants.loading; // Renamed from selectVariantsLoading
export const selectVariantSubmitting = (s) => s.adminVariants.submitting;
export const selectVariantError = (s) => s.adminVariants.error;
export const selectVariantFormOpen = (s) => s.adminVariants.formOpen;
export const selectVariantEditing = (s) => s.adminVariants.editing;
export const selectSelectedProductId = (s) => s.adminVariants.selectedProductId; // ✅ Added selector

export default variantSlice.reducer;