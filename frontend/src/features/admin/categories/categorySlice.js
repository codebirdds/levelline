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
  name: "categories",
  initialState,
  reducers: {
    fetchStart:  (s) => { s.loading = true; s.error = null; },
    fetchSuccess:(s, { payload }) => { s.loading = false; s.items = payload; },
    fetchFailure:(s, { payload }) => { s.loading = false; s.error = payload; },

    submitStart: () => {},
    submitEnd:   () => {},

    openForm:  (s, { payload = null }) => { s.formOpen = true; s.editing = payload; },
    closeForm: (s) => { s.formOpen = false; s.editing = null; },

    addItem:    (s, { payload }) => { s.items = [payload, ...s.items]; },
    updateItem: (s, { payload }) => { s.items = s.items.map((c) => (c.id === payload.id ? payload : c)); },
    removeItem: (s, { payload }) => { s.items = s.items.filter((c) => c.id !== payload); },
  },
});

export const {
  fetchStart, fetchSuccess, fetchFailure,
  submitStart, submitEnd,
  openForm, closeForm,
  addItem, updateItem, removeItem,
} = slice.actions;

export const selectCategories     = (s) => s.categories.items;
export const selectCategoryLoading = (s) => s.categories.loading;
export const selectCategoryFormOpen = (s) => s.categories.formOpen;
export const selectCategoryEditing  = (s) => s.categories.editing;

export default slice.reducer;