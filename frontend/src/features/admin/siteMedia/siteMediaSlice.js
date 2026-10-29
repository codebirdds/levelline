import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
  submitting: false,
  error: null,
  modalOpen: false,
  editing: null,
};

const slice = createSlice({
  name: "siteMedia",
  initialState,
  reducers: {
    fetchStart: (s) => { s.loading = true; s.error = null; },
    fetchSuccess: (s, { payload }) => { s.loading = false; s.items = payload; },
    fetchFailure: (s, { payload }) => { s.loading = false; s.error = payload; },

    submitStart: (s) => { s.submitting = true; },
    submitEnd: (s) => { s.submitting = false; },

    openModal: (s, { payload = null }) => { s.modalOpen = true; s.editing = payload; },
    closeModal: (s) => { s.modalOpen = false; s.editing = null; },

    addItem: (s, { payload }) => { s.items = [payload, ...s.items]; },
    updateItem: (s, { payload }) => { s.items = s.items.map((i) => (i.id === payload.id ? payload : i)); },
    removeItem: (s, { payload }) => { s.items = s.items.filter((i) => i.id !== payload); },
  },
});

export const {
  fetchStart, fetchSuccess, fetchFailure,
  submitStart, submitEnd,
  openModal, closeModal,
  addItem, updateItem, removeItem,
} = slice.actions;

export const selectMediaItems = (s) => s.siteMedia.items;
export const selectMediaLoading = (s) => s.siteMedia.loading;
export const selectMediaModalOpen = (s) => s.siteMedia.modalOpen;
export const selectMediaSubmitting = (s) => s.siteMedia.submitting;
export const selectMediaEditing = (s) => s.siteMedia.editing;

export default slice.reducer;
