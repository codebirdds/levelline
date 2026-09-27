import * as authMediators from "./mediators";
import {
  authStart, authSuccess, authFailure, logout as logoutAction, setBootstrapped,
} from "./authSlice";

// ---------- LOGIN ----------
export const loginThunk = (creds) => async (dispatch) => {
  dispatch(authStart());
  try {
    const { user } = await authMediators.login(creds);
    dispatch(authSuccess({ user }));
    return user;
  } catch (err) {
    const msg = err.response?.data?.message || "Login failed";
    dispatch(authFailure(msg));
    throw err;
  }
};

// ---------- SIGNUP ----------
export const signupThunk = (body) => async (dispatch) => {
  dispatch(authStart());
  try {
    const { user } = await authMediators.signup(body);
    dispatch(authSuccess({ user }));
    return user;
  } catch (err) {
    const msg = err.response?.data?.message || "Signup failed";
    dispatch(authFailure(msg));
    throw err;
  }
};

// ---------- BOOTSTRAP (silent refresh on app start) ----------
export const bootstrapAuthThunk = () => async (dispatch) => {
  try {
    const { user } = await authMediators.refresh();
    dispatch(authSuccess({ user }));
  } catch {
    // no valid session — treat as guest
  } finally {
    dispatch(setBootstrapped(true));
  }
};

// ---------- LOGOUT ----------
export const logoutThunk = () => async (dispatch) => {
  try { await authMediators.logout(); } catch {}
  dispatch(logoutAction());
};

// ---------- FORGOT PASSWORD ----------
export const forgotPasswordThunk = (email) => async () => {
  return authMediators.forgotPassword(email);
};