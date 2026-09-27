import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthed } from "../features/auth/authSlice";
import { ROUTES } from "./routePaths";

export default function PrivateRoute({ allowedRoles }) {
  const isAuthed = useSelector(selectIsAuthed);
  const user     = useSelector((s) => s.auth.user);
  const location = useLocation();

  if (!isAuthed) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }
  return <Outlet />;
}