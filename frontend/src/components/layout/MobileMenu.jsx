import { useEffect, useState } from "react";
import SmartLink from "../common/SmartLink";
import { NAV_LEFT, NAV_RIGHT, BOOK_CTA } from "../../features/home/content";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectUser } from "../../features/auth/authSlice";
import { ROUTES } from "../../routes/routePaths";
import BookAppointmentModal from "../../features/contact/components/BookAppointmentModal";

const ENTER_MS = 600; // panel slide-in
const EXIT_MS = 320;  // panel slide-out

const ANIM_CSS = `
@keyframes mmSlideIn {
  from { opacity: 0; transform: translate3d(32px, 0, 0); }
  to   { opacity: 1; transform: translate3d(0, 0, 0); }
}
.mm-item { animation: mmSlideIn 560ms cubic-bezier(0.22, 1, 0.36, 1) both; }

@media (prefers-reduced-motion: reduce) {
  .mm-item { animation: none !important; }
  .mm-panel, .mm-overlay { transition: none !important; }
}
`;

export default function MobileMenu({ open, onClose }) {
  const user = useSelector(selectUser);
  const [bookingOpen, setBookingOpen] = useState(false);

  // mount/unmount orchestration so exit animation plays
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }
    setVisible(false);
    const t = setTimeout(() => setMounted(false), EXIT_MS);
    return () => clearTimeout(t);
  }, [open]);

  // body scroll lock while mounted
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [mounted]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  // build nav list — nav items + optional track order
  const navItems = [
    ...[...NAV_LEFT, ...NAV_RIGHT].map((l) => ({
      label: l.label,
      href: l.href,
      external: true,
    })),
    ...(user?.role === "user"
      ? [{ label: "Track order", href: ROUTES.TRACK_ORDER, external: false }]
      : []),
  ];

  const CTA_DELAY = 360 + navItems.length * 100 + 80;

  return (
    <>
      <style>{ANIM_CSS}</style>

      <div className="fixed inset-0 z-50 lg:hidden" aria-hidden={!open}>
        {/* Overlay - Transparent with blur */}
        <div
          onClick={onClose}
          className="mm-overlay absolute inset-0 bg-black/30 backdrop-blur-sm"
          style={{
            transitionProperty: "opacity",
            transitionDuration: `${visible ? 400 : 260}ms`,
            transitionTimingFunction: "ease-out",
            opacity: visible ? 1 : 0,
            pointerEvents: visible ? "auto" : "none",
          }}
        />

        {/* Panel — LEFT side drawer with Glassmorphism effect */}
        <aside
          className="mm-panel absolute left-0 top-0 flex h-full w-[75%] max-w-sm flex-col bg-black/40 p-6 text-white shadow-2xl backdrop-blur-xl border-r border-white/10"
          style={{
            transitionProperty: "transform",
            transitionDuration: `${visible ? ENTER_MS : EXIT_MS}ms`,
            transitionTimingFunction: visible
              ? "cubic-bezier(0.22, 1, 0.36, 1)"
              : "cubic-bezier(0.4, 0, 1, 1)",
            transform: visible ? "translate3d(0,0,0)" : "translate3d(-100%,0,0)", // Slide from LEFT
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          {/* Close button (Top Left) */}
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="mm-item absolute left-6 top-6 z-10 p-2 text-gray-300 transition-colors hover:text-white"
            style={{ animationDelay: "120ms" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>

          {/* Nav items — Right aligned INSIDE the left drawer */}
          <nav className="flex h-full flex-col items-end justify-center gap-7 pr-4">
            {navItems.map((l, i) =>
              l.external ? (
                <div
                  key={l.label}
                  className="mm-item"
                  style={{ animationDelay: `${360 + i * 100}ms` }}
                >
                  <SmartLink
                    href={l.href}
                    onClick={onClose}
                    className="font-sans text-lg font-light uppercase tracking-[0.18em] text-gray-300 transition-colors hover:text-white"
                  >
                    {l.label}
                  </SmartLink>
                </div>
              ) : (
                <div
                  key={l.label}
                  className="mm-item"
                  style={{ animationDelay: `${360 + i * 100}ms` }}
                >
                  <Link
                    to={l.href}
                    onClick={onClose}
                    className="font-sans text-lg font-light uppercase tracking-[0.18em] text-gray-300 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </div>
              )
            )}
          </nav>

          {/* Book Appointment CTA (Aligned Right inside drawer) */}
          <button
            type="button"
            onClick={() => setBookingOpen(true)}
            className="mm-item absolute bottom-10 right-6 self-end border border-gray-500/50 px-6 py-3 text-center font-sans text-xs font-light uppercase tracking-widest text-gray-300 transition hover:bg-white hover:text-black"
            style={{ animationDelay: `${CTA_DELAY}ms` }}
          >
            {BOOK_CTA.label}
          </button>
        </aside>
      </div>

      <BookAppointmentModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </>
  );
}