import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectUser } from "../features/auth/authSlice";
import { ROUTES } from "./routePaths";

export default function PublicRoute() {
  const user = useSelector(selectUser);
  const location = useLocation();

  if (user) {
    // If we were sent here from somewhere (e.g. Add to Bag from a product page),
    // honour that destination instead of dumping the user at home.
    const from = location.state?.from?.pathname;
    const intent = location.state?.intent;

    if (user.role === "admin") {
      return <Navigate to={ROUTES.ADMIN} replace />;
    }

    if (intent === "buy") {
      return <Navigate to={ROUTES.CHECKOUT} replace />;
    }

    return <Navigate to={from || ROUTES.HOME} replace />;
  }

  return <Outlet />;
}