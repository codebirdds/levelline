import axios from "axios";
import { axiosConfig } from "./axiosConfig";

const api = axios.create(axiosConfig);

let _store;
export const injectStore = (store) => { _store = store; };

// Refresh interceptor (from previous message) — keep as-is
let isRefreshing = false;
let queue = [];
const flushQueue = (err) => {
  queue.forEach(({ resolve, reject }) => (err ? reject(err) : resolve()));
  queue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const is401 = error.response?.status === 401;
    const isRefreshCall = original?.url?.includes("/auth/refresh");
    const retried = original?._retry;

    if (!is401 || isRefreshCall || retried) return Promise.reject(error);

    if (isRefreshing) {
      return new Promise((resolve, reject) => queue.push({ resolve, reject }))
        .then(() => api(original));
    }

    original._retry = true;
    isRefreshing = true;

    try {
      await axios.post(
        `${axiosConfig.baseURL}/auth/refresh`,
        {},
        { withCredentials: true }
      );
      flushQueue(null);
      return api(original);
    } catch (refreshErr) {
      flushQueue(refreshErr);
      const { logout } = await import("../features/auth/authSlice");
      _store?.dispatch(logout());
      if (window.location.pathname !== "/login") window.location.href = "/login";
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;