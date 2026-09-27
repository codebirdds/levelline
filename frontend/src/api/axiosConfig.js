export const axiosConfig = {
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  timeout: 15000,
  withCredentials: true,  // 🔥 sends + receives cookies
  headers: { "Content-Type": "application/json" },
};