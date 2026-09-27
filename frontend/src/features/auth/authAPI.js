import api from "../../api/axiosInstance";
import { AUTH } from "./endpoints";

const call = ({ method, url }, data, config = {}) =>
  api({ method, url, data, ...config }).then((res) => res.data);

// Public API of the auth feature
export const login    = (payload) => call(AUTH.LOGIN, payload);
export const signup   = (payload) => call(AUTH.SIGNUP, payload);
export const refresh  = ()        => call(AUTH.REFRESH);
export const logout   = ()        => call(AUTH.LOGOUT);
export const me       = ()        => call(AUTH.ME);
export const forgotPassword = (email) => call(AUTH.FORGOT, { email });