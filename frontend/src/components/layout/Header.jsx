import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthed } from "../../features/auth/authSlice";
import { ROUTES } from "../../routes/routePaths";
import SearchDropdown from "./SearchDropdown";

const NAV = [
  { label: "Picks",     to: "/?cat=picks" },
  { label: "Style",     to: "/?cat=style" },
  { label: "Modes",     to: "/?cat=modes" },
  { label: "Customize", to: "/customize"  },
  { label: "Gift",      to: "/?cat=gift"  },
];

export default function Header() {
  const isAuthed = useSelector(selectIsAuthed);
  const [scrolled, setScrolled]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || searchOpen;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          solid
            ? "bg-ink/95 backdrop-blur-md border-b border-gold/20"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container-x h-[var(--header-h)] flex items-center justify-between relative">

          {/* LEFT — Logo */}
          <Link
            to={ROUTES.HOME}
            className="shrink-0 font-serif text-xl md:text-2xl font-medium tracking-wide leading-none text-cream"
          >
            Leveline
          </Link>

          {/* CENTER — Nav */}
          <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 xl:gap-10">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-[10px] font-medium uppercase tracking-[0.24em] text-cream/85 hover:text-gold transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT — Icons */}
          <div className="flex items-center gap-5 shrink-0">

            {/* Search icon */}
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              className="text-cream/85 hover:text-gold transition-colors duration-200"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.6"
                   strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="hidden sm:block text-cream/85 hover:text-gold transition-colors duration-200"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.6"
                   strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8Z" />
              </svg>
            </Link>

            {/* Account */}
            <Link
              to={isAuthed ? ROUTES.ADMIN : ROUTES.LOGIN}
              aria-label="Account"
              className="text-cream/85 hover:text-gold transition-colors duration-200"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.6"
                   strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Search panel — drops below header */}
      <SearchDropdown
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}