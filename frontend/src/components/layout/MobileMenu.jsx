import { useEffect, useState } from "react";
import SmartLink from "../common/SmartLink";
import { NAV_LEFT, NAV_RIGHT, BOOK_CTA } from "../../features/home/content";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectUser } from "../../features/auth/authSlice";
import { ROUTES } from "../../routes/routePaths";
import BookAppointmentModal from "../../features/contact/components/BookAppointmentModal"; // ✅ Import Modal

export default function MobileMenu({ open, onClose }) {
  const user = useSelector(selectUser);
  
  // ✅ Added state for Modal
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <>
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div
          onClick={onClose}
          className={`absolute inset-0 bg-ink/60 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`absolute left-0 top-0 flex h-full w-4/5 max-w-sm flex-col bg-ink p-6 text-cream transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button onClick={onClose} aria-label="Close menu" className="mb-8 self-end p-2 hover:text-gold">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
          <nav className="flex flex-col gap-6">
            {[...NAV_LEFT, ...NAV_RIGHT].map((l) => (
              <SmartLink key={l.label} href={l.href} onClick={onClose} className="font-sans text-lg font-medium uppercase tracking-wide hover:text-gold">
                {l.label}
              </SmartLink>
            ))}
            {user?.role === "user" && <Link to={ROUTES.TRACK_ORDER} onClick={onClose} className="font-sans text-lg font-medium uppercase tracking-wide hover:text-gold">Track order</Link>}
          </nav>

          {/* ✅ Replaced SmartLink with Button to open Modal */}
          <button
            type="button"
            onClick={() => {
              setBookingOpen(true);
              // Optional: Close the menu when modal opens? 
              // onClose(); 
            }}
            className="mt-auto rounded-sm border-[1.5px] border-cream px-5 py-3.5 text-center font-sans text-sm font-medium uppercase transition hover:bg-cream hover:text-ink"
          >
            {BOOK_CTA.label}
          </button>
        </aside>
      </div>

      {/* ✅ Added Modal here */}
      <BookAppointmentModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </>
  );
}