import * as authMediators from "./mediators";
import {
  authStart, authSuccess, authFailure, logout as logoutAction, setBootstrapped,
} from "./authSlice";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// ---------- LOGIN ----------
export const loginThunk = (creds) => async (dispatch) => {
  dispatch(authStart());
  try {
    const response = await authMediators.login(creds);

    const user = response?.data?.user;
    const token = response?.data?.token || response?.data?.accessToken;

    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    dispatch(authSuccess({ data: { user, token } }));
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
    const response = await authMediators.signup(body);
    const user = response?.data?.user || response?.user;
    const token = response?.data?.token || response?.data?.accessToken;

    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    dispatch(authSuccess({ data: { user, token } }));
    return user;
  } catch (err) {
    const msg = err.response?.data?.message || "Signup failed";
    dispatch(authFailure(msg));
    throw err;
  }
};

// ---------- BOOTSTRAP (restore session from localStorage on app start) ----------
export const bootstrapAuthThunk = () => async (dispatch) => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch(authSuccess({ data: { user, token } }));
      } catch {
        // Invalid user data, clear storage
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
  } catch {
    // no valid session — treat as guest
  } finally {
    dispatch(setBootstrapped(true));
  }
};

// ---------- LOGOUT ----------
export const logoutThunk = () => async (dispatch) => {
  try { await authMediators.logout(); } catch {}
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  dispatch(logoutAction());
};

// ---------- FORGOT PASSWORD ----------
export const forgotPasswordThunk = (email, password) => async () => {
  return authMediators.forgotPassword(email, password);
};