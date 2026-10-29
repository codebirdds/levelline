import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectUser } from "../features/auth/authSlice";
import { ROUTES } from "./routePaths";

export default function PublicRoute() {
  const user = useSelector(selectUser);
  const location = useLocation();

  // ✅ DEBUG LOGS
  console.log("=== 🛡️ DEBUG: PublicRoute Check ===");
  console.log("1. Is User Logged In?:", !!user);
  console.log("2. Location State:", location.state);

  if (user) {
    // Agar user admin hai, toh admin panel bhejo
    if (user.role === "admin") {
      console.log("🚨 PublicRoute: Admin detected, going to ADMIN");
      return <Navigate to={ROUTES.ADMIN} replace />;
    }

    // ✅ FIX: Sirf 'from' check karo, intent ko ignore karo
    const from = location.state?.from?.pathname;
    console.log("🚨 PublicRoute: Logged in user visiting Login, redirecting to:", from || ROUTES.HOME);
    
    return <Navigate to={from || ROUTES.HOME} replace />;
  }

  return <Outlet />;
}