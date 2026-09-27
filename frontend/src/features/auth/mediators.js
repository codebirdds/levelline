import api from "../../api/axiosInstance";
import { AUTH } from "./endpoints";

const USE_MOCK = true;   // 👈 flip to false when backend is live

const call = ({ method, url }, data) =>
  api({ method, url, data }).then((res) => res.data);

export const login = async (payload) => {
  if (USE_MOCK) {
    const isAdmin = payload.email?.toLowerCase().includes("admin");

    return {
      user: {
        id: isAdmin ? 999 : 1,
        name: isAdmin ? "Admin User" : "Demo User",
        email: payload.email,
        role: isAdmin ? "admin" : "customer",
      },
    };
  }
  return call(AUTH.LOGIN, payload);
};

export const signup = async (payload) => {
  if (USE_MOCK) {
    return {
      user: {
        id: Date.now(),
        name: payload.name,
        email: payload.email,
        role: "customer",
      },
    };
  }
  return call(AUTH.SIGNUP, payload);
};

export const refresh = async () => {
  if (USE_MOCK) {
    // no session on boot → throw so bootstrap treats as guest
    throw new Error("no-session");
  }
  return call(AUTH.REFRESH);
};

export const logout = async () => {
  if (USE_MOCK) return { ok: true };
  return call(AUTH.LOGOUT);
};

export const me = async () => {
  if (USE_MOCK) throw new Error("no-session");
  return call(AUTH.ME);
};

export const forgotPassword = async (email) => {
  if (USE_MOCK) return { ok: true };
  return call(AUTH.FORGOT, { email });
};