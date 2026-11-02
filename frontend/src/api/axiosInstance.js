import axios from "axios";
import { axiosConfig } from "./axiosConfig";

const api = axios.create(axiosConfig);

let _store;
export const injectStore = (store) => { _store = store; };

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// ── Retry config (Safari 18+ network-drop fix) ─────────────────────────────
const MAX_RETRIES = 3;
const BASE_DELAY = 300;
const RETRYABLE_METHODS = new Set(["get", "head", "options"]);
const RETRYABLE_CODES = new Set(["ECONNABORTED", "ERR_NETWORK", "ERR_CANCELED"]);

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

function isRetryable(error) {
  if (!error.config) return false;
  // Never retry POST/PUT/PATCH/DELETE — could duplicate orders/payments
  const method = (error.config.method || "get").toLowerCase();
  if (!RETRYABLE_METHODS.has(method)) return false;
  // Never retry 4xx — those are real bugs, not network drops
  const status = error.response?.status;
  if (status && status >= 400 && status < 500) return false;
  // Retry: network drops, timeouts, 5xx
  if (RETRYABLE_CODES.has(error.code)) return true;
  if (status && status >= 500 && status < 600) return true;
  if (!error.response) return true;
  return false;
}

// ── Attach token (UNCHANGED) ───────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Handle 401 (UNCHANGED) ─────────────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const is401 = error.response?.status === 401;

    if (is401) {
      // 1. Clear Local Storage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      // 2. Dispatch Redux logout so the UI updates immediately
      const { logout } = await import("../features/auth/authSlice");
      _store?.dispatch(logout());

      // 3. Redirect to login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// ── Retry on transient network failures (NEW) ──────────────────────────────
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (!isRetryable(error)) return Promise.reject(error);

    const config = error.config;
    config.__retryCount = config.__retryCount || 0;
    if (config.__retryCount >= MAX_RETRIES) return Promise.reject(error);

    config.__retryCount += 1;
    const delay = BASE_DELAY * 2 ** (config.__retryCount - 1);

    console.warn(
      `[api retry] ${config.method?.toUpperCase()} ${config.url} ` +
      `failed (${error.code || error.response?.status}). ` +
      `Retry ${config.__retryCount}/${MAX_RETRIES} in ${delay}ms…`
    );

    await sleep(delay);
    return api(config);
  }
);

export default api;