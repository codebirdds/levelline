import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUser } from "../features/auth/authSlice";
import { ROUTES } from "./routePaths";
import Home from "../features/home/Home";

export default function HomeRedirect() {
  const user = useSelector(selectUser);
  return user?.role === "admin"
    ? <Navigate to={ROUTES.ADMIN_DASH} replace />
    : <Home />;
}