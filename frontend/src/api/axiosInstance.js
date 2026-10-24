import axios from "axios";
import { axiosConfig } from "./axiosConfig";

const api = axios.create(axiosConfig);

let _store;
export const injectStore = (store) => { _store = store; };

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// Attach token
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

// Handle 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const is401 = error.response?.status === 401;

    if (is401) {
      // 1. Clear Local Storage (this removes the stuff in your screenshot)
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

export default api;