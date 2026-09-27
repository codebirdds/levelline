import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  status: "idle",       // idle | loading | authenticated | error
  error: null,
  bootstrapped: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart:   (s) => { s.status = "loading"; s.error = null; },
    authSuccess: (s, { payload }) => {
      s.user = payload.user;
      s.status = "authenticated";
      s.error = null;
    },
    authFailure: (s, { payload }) => { s.status = "error"; s.error = payload; },
    setBootstrapped: (s, { payload = true }) => { s.bootstrapped = payload; },
    logout: (s) => {
      s.user = null;
      s.status = "idle";
      s.error = null;
      s.bootstrapped = true;
    },
  },
});

export const {
  authStart, authSuccess, authFailure, setBootstrapped, logout,
} = authSlice.actions;

// Selectors
export const selectUser         = (s) => s.auth.user;
export const selectIsAuthed     = (s) => !!s.auth.user;
export const selectAuthStatus   = (s) => s.auth.status;
export const selectAuthError    = (s) => s.auth.error;
export const selectBootstrapped = (s) => s.auth.bootstrapped;

export default authSlice.reducer;