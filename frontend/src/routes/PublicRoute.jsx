import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthed } from "../features/auth/authSlice";
import { ROUTES } from "./routePaths";

export default function PublicRoute() {
  const isAuthed = useSelector(selectIsAuthed);
  return isAuthed ? <Navigate to={ROUTES.HOME} replace /> : <Outlet />;
}