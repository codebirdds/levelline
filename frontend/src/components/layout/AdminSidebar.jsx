import { NavLink } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";

const LINKS = [
  // { to: ROUTES.ADMIN_DASH,       label: "Dashboard",  icon: "M3 12h7V3H3v9Zm11 9h7v-7h-7v7Zm0-18v7h7V3h-7ZM3 21h7v-7H3v7Z" },
  { to: ROUTES.ADMIN_CATEGORIES, label: "Categories", icon: "M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z" },
  { to: ROUTES.ADMIN_PRODUCTS,   label: "Products",   icon: "M21 16V8l-9-5-9 5v8l9 5 9-5Zm-9-11 6 3.5-6 3.5-6-3.5L12 5Z" },
  // { to: ROUTES.ADMIN_VARIANTS,   label: "Variants",   icon: "M7 7h10v10H7V7Zm0-4h10v2H7V3ZM3 3h2v2H3V3Zm0 16h2v2H3v-2Zm16 0h2v2h-2v-2Zm0-16h2v2h-2V3Z" },
  { to: ROUTES.ADMIN_ORDERS,     label: "Orders",     icon: "M3 4h18v2H3V4Zm0 5h18v2H3V9Zm0 5h12v2H3v-2Zm0 5h12v2H3v-2Z" },
  
  // ✅ ADDED CONTACTS HERE
  { to: ROUTES.ADMIN_CONTACTS,   label: "Contacts",   icon: "M3 5h18v14H3V5Zm2 2v10h14V7l-7 5-7-5Zm0 0 7 5 7-5Z" },
    { to: ROUTES.ADMIN_SITE_MEDIA, label: "Site Media", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }, 
];

export default function AdminSidebar({ isOpen, onClose }) {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-60 shrink-0 bg-ink text-white flex flex-col transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
        <div className="flex items-center">
          <span className="w-8 h-8 rounded-md bg-brand text-white grid place-items-center font-bold text-sm mr-2">
            S
          </span>
          <span className="font-bold text-lg">Shopcart</span>
        </div>
        
        {/* Close Button for Mobile (Only visible on phone) */}
        <button 
          onClick={onClose} 
          className="lg:hidden text-white/70 hover:text-white p-1 rounded-md hover:bg-white/10 transition"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            onClick={() => {
              // Auto close menu on mobile when a link is clicked
              if (window.innerWidth < 1024) onClose();
            }}
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