import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthed } from "../features/auth/authSlice";
import { ROUTES } from "./routePaths";

export default function PrivateRoute({ allowedRoles }) {
  const isAuthed = useSelector(selectIsAuthed);
  const user     = useSelector((s) => s.auth.user);
  const location = useLocation();

  // ✅ DEBUG LOGS YAHAN ADD KAR
  console.log("=== 🛡️ DEBUG: PrivateRoute Check ===");
  console.log("1. Trying to access:", location.pathname);
  console.log("2. isAuthed (Redux):", isAuthed);
  console.log("3. User (Redux):", user);
  console.log("4. Allowed Roles:", allowedRoles);

  if (!isAuthed) {
    console.log("🚨 DEBUG: PrivateRoute BLOCKED access. Redirecting to /login. Saving 'from' as:", location.pathname);
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    console.log("🚨 DEBUG: PrivateRoute BLOCKED access due to role mismatch. User role:", user?.role, "Allowed:", allowedRoles);
    return <Navigate to={ROUTES.HOME} replace />;
  }
  
  console.log("✅ DEBUG: PrivateRoute ALLOWED access to:", location.pathname);
  return <Outlet />;
}