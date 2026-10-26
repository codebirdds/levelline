import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
  submitting: false,
  error: null,
  modalOpen: false,
  selected: null,
};

const slice = createSlice({
  name: "adminContacts",
  initialState,
  reducers: {
    fetchStart: (s) => { s.loading = true; s.error = null; },
    fetchSuccess: (s, { payload }) => { s.loading = false; s.items = payload; },
    fetchFailure: (s, { payload }) => { s.loading = false; s.error = payload; },

    submitStart: (s) => { s.submitting = true; },
    submitEnd: (s) => { s.submitting = false; },

    openModal: (s, { payload = null }) => { s.modalOpen = true; s.selected = payload; },
    closeModal: (s) => { s.modalOpen = false; s.selected = null; },

    updateItem: (s, { payload }) => {
      s.items = s.items.map((c) => (c.id === payload.id ? { ...c, ...payload } : c));
    },
  },
});

export const {
  fetchStart, fetchSuccess, fetchFailure,
  submitStart, submitEnd,
  openModal, closeModal,
  updateItem,
} = slice.actions;

export const selectContacts = (s) => s.adminContacts.items;
export const selectContactLoading = (s) => s.adminContacts.loading;
export const selectContactModalOpen = (s) => s.adminContacts.modalOpen;
export const selectContactSubmitting = (s) => s.adminContacts.submitting;
export const selectContactSelected = (s) => s.adminContacts.selected;

export default slice.reducer;
