import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { selectUser } from "../../features/auth/authSlice";
import { logoutThunk } from "../../features/auth/authThunks";
import { ROUTES } from "../../routes/routePaths";

const TITLES = {
  [ROUTES.ADMIN_DASH]:       "Dashboard",
  [ROUTES.ADMIN_PRODUCTS]:   "Products",
  [ROUTES.ADMIN_CATEGORIES]: "Categories",
};

export default function AdminHeader() {
  const dispatch = useDispatch();
  const user     = useSelector(selectUser);
  const { pathname } = useLocation();
  const title = TITLES[pathname] || "Admin";

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6">
      <div>
        <h1 className="text-lg font-semibold text-ink">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted hidden sm:inline">
          Hi, <span className="font-medium text-ink">{user?.name || "Admin"}</span>
        </span>
        <button
          onClick={() => dispatch(logoutThunk())}
          className="text-xs font-semibold border border-border rounded-md px-3 py-1.5 hover:border-danger hover:text-danger transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}