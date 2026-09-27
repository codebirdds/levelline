export const AUTH = {
  LOGIN:    { method: "POST", url: "/auth/login" },
  SIGNUP:   { method: "POST", url: "/auth/signup" },
  REFRESH:  { method: "POST", url: "/auth/refresh" },
  LOGOUT:   { method: "POST", url: "/auth/logout" },
  ME:       { method: "GET",  url: "/auth/me" },
  FORGOT:   { method: "POST", url: "/auth/forgot-password" },
};