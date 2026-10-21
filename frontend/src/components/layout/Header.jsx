import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";
import { NAV_LEFT, NAV_RIGHT, BOOK_CTA } from "../../features/home/content";
import MobileMenu from "./MobileMenu";
import SmartLink from "../common/SmartLink";
import logo from "../../assets/images/LandingPage/header/levelin.png";
import { selectUser } from "../../features/auth/authSlice";
import BookAppointmentModal from "../../features/contact/components/BookAppointmentModal";

const linkCls =
  "font-sans  text-[10px] min-[1400px]:text-[15px] font-medium uppercase tracking-wide transition";

const isExternal = (href) =>
  !href || href.startsWith("#") || /^https?:/.test(href);

const NavLink = ({ href, className, children }) =>
  isExternal(href) ? (
    <SmartLink href={href} className={className}>
      {children}
    </SmartLink>
  ) : (
    <Link to={href} className={className}>
      {children}
    </Link>
  );

export default function Header({ scroll }) {
  const user = useSelector(selectUser);
  const [scrolled, setScrolled] = useState(scroll);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;

      if (y < 40) {
        if (!scroll) setScrolled(false);
      } else if (y > lastY) {
        setScrolled(false);
      } else {
        setScrolled(true);
      }

      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scroll]);

  return (
    <>
      <header
        className={`inset-x-0 top-0 z-40 transition-all duration-300 ${!scrolled && "pt-6"}
          h-[calc(var(--header-h)*0.6)]
          ${
            scrolled
              ? "fixed bg-[#f8f8f8] text-black shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
              : "absolute bg-transparent text-cream"
          }`}
      >
        {!scrolled && (
          <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-black/25 to-transparent" />
        )}

        <div className="container-x relative z-10 flex h-full items-center">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className={`p-1.5 lg:hidden ${scrolled ? "text-black" : "text-cream"}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>

          <nav className="hidden flex-1 justify-end gap-10 pr-10 lg:flex">
            {NAV_LEFT.map((l) => (
              <NavLink
                key={l.label}
                href={l.href}
                className={`${linkCls} ${
                  scrolled ? "text-black hover:text-gold" : "text-cream hover:text-gold"
                }`}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <Link to={ROUTES.HOME} className="mx-auto shrink-0 lg:mx-0">
            <img
              src={logo}
              alt="Levelline"
              className={`h-7 w-auto ${
                scrolled ? "lg:h-10" : "mt-14 lg:h-20"
              } transition-all duration-300 ${scrolled ? "brightness-0" : ""}`}
            />
          </Link>

          <div className="hidden flex-1 items-center justify-between pl-10 lg:flex">
            <nav className="flex gap-10">
              {NAV_RIGHT.map((l) => (
                <NavLink
                  key={l.label}
                  href={l.href}
                  className={`${linkCls} ${
                    scrolled ? "text-black hover:text-gold" : "text-cream hover:text-gold"
                  }`}
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setBookingOpen(true)}
                className={`rounded-sm border-[1px] px-3 py-2 font-sans text-[9.5px] min-[1400px]:text-[15px] font-medium uppercase transition ${
                  !scrolled ? "mt-4" : ""
                } font-medium uppercase transition ${
                  scrolled
                    ? "border-[#6b6b6b] text-[#6b6b6b] hover:bg-black hover:text-white"
                    : "border-cream text-cream hover:bg-cream hover:text-ink"
                }`}
              >
                {BOOK_CTA.label}
              </button>
            </div>
          </div>

          <span className="w-8 lg:hidden" aria-hidden="true" />
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Book appointment modal */}
      <BookAppointmentModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </>
  );
}