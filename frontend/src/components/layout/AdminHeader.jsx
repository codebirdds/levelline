import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { selectUser } from "../../features/auth/authSlice";
import { logoutThunk } from "../../features/auth/authThunks";
import { ROUTES } from "../../routes/routePaths";

const TITLES = {
  [ROUTES.ADMIN_DASH]:       "Dashboard",
  [ROUTES.ADMIN_PRODUCTS]:   "Products",
  [ROUTES.ADMIN_CATEGORIES]: "Categories",
  [ROUTES.ADMIN_VARIANTS]:   "Product Variants",
  [ROUTES.ADMIN_ORDERS]:     "Orders",
};

// ✅ Added onMenuClick prop here
export default function AdminHeader({ onMenuClick }) {
  const dispatch = useDispatch();
  const user     = useSelector(selectUser);
  const { pathname } = useLocation();
  const title = TITLES[pathname] || "Admin";

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 lg:px-6">
      
      {/* LEFT SIDE: Hamburger Button & Title */}
      <div className="flex items-center gap-3">
        
        {/* 🔥 Open Menu Button (Only visible on Mobile/Tablet) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 -ml-1.5 rounded-md hover:bg-border/50 text-ink transition-colors"
          aria-label="Open Sidebar"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h1 className="text-lg font-semibold text-ink">{title}</h1>
        </div>
      </div>

      {/* RIGHT SIDE: User Info & Logout */}
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