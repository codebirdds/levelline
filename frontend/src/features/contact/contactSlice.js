import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  submitting: false,
  error: null,
  success: false,   // flips to true after a successful submit
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    submitStart(state) {
      state.submitting = true;
      state.error = null;
      state.success = false;
    },
    submitSuccess(state) {
      state.submitting = false;
      state.success = true;
    },
    submitFailure(state, action) {
      state.submitting = false;
      state.error = action.payload;
    },
    resetContact(state) {
      state.submitting = false;
      state.error = null;
      state.success = false;
    },
  },
});

export const {
  submitStart,
  submitSuccess,
  submitFailure,
  resetContact,
} = contactSlice.actions;

export const selectContactSubmitting = (s) => s.contact.submitting;
export const selectContactError      = (s) => s.contact.error;
export const selectContactSuccess    = (s) => s.contact.success;

export default contactSlice.reducer;