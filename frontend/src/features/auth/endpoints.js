export const AUTH = {
  LOGIN:    { method: "POST", url: "v1/user/login" },
  SIGNUP:   { method: "POST", url: "v1/user/register" },
  REFRESH:  { method: "POST", url: "v1/auth/refresh" },
  LOGOUT:   { method: "POST", url: "v1/auth/logout" },
  ME:       { method: "GET",  url: "v1/auth/me" },
  FORGOT:   { method: "POST", url: "v1/user/reset-password" },
};