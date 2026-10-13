import api from "../../api/axiosInstance";
import { AUTH } from "./endpoints";

const call = ({ method, url }, data) =>
  api({ method, url, data }).then((res) => res.data);

export const login = async (payload) => {
  return call(AUTH.LOGIN, payload);
};

export const signup = async (payload) => {
  return call(AUTH.SIGNUP, payload);
};

export const refresh = async () => {
  return call(AUTH.REFRESH);
};

export const logout = async () => {
  return call(AUTH.LOGOUT);
};

export const me = async () => {
  return call(AUTH.ME);
};

export const forgotPassword = async (email, password) => {
  return call(AUTH.FORGOT, { email, newPassword: password });
};

