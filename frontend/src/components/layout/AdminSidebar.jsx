import { NavLink } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";

const LINKS = [
  { to: ROUTES.ADMIN_DASH,       label: "Dashboard",  icon: "M3 12h7V3H3v9Zm11 9h7v-7h-7v7Zm0-18v7h7V3h-7ZM3 21h7v-7H3v7Z" },
  { to: ROUTES.ADMIN_PRODUCTS,   label: "Products",   icon: "M21 16V8l-9-5-9 5v8l9 5 9-5Zm-9-11 6 3.5-6 3.5-6-3.5L12 5Z" },
  { to: ROUTES.ADMIN_CATEGORIES, label: "Categories", icon: "M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z" },
];

export default function AdminSidebar() {
  return (
    <aside className="w-60 shrink-0 bg-ink text-white flex flex-col">
      <div className="h-16 flex items-center px-5 border-b border-white/10">
        <span className="w-8 h-8 rounded-md bg-brand text-white grid place-items-center font-bold text-sm mr-2">S</span>
        <span className="font-bold text-lg">Shopcart</span>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition ${
                isActive ? "bg-brand text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d={l.icon} />
            </svg>
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 text-[10px] text-white/40 border-t border-white/10">
        v1.0.0 · Admin
      </div>
    </aside>
  );
}