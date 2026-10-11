import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROUTES } from "../../routes/routePaths";
import { selectCheckoutItems } from "../../features/checkout/checkoutSlice";
import { formatCurrency } from "../../utils/formatCurrency";
import logo from "../../assets/images/LandingPage/Header/levelin.png";

const PHONE = "1800-833-4488";
const IS_LOGGED_IN = false; // ← dummy flag; swap for real auth later

export default function SimpleHeader() {
  const items = useSelector(selectCheckoutItems);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 h-[60px] border-b border-border bg-white">
      <div className="container-x relative flex h-full items-center justify-between">

        {/* ─── LEFT: phone ─── */}
        <a
          href={`tel:${PHONE.replace(/-/g, "")}`}
          className="flex items-center gap-2 font-sans text-sm text-[#414141] transition hover:text-[#663f29]"
        >
          <PhoneIcon />
          <span className="hidden sm:inline">{PHONE}</span>
        </a>

        {/* ─── CENTER: logo (truly centered) ─── */}
        <Link
          to={ROUTES.HOME}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          aria-label="Levelline home"
        >
          <img
            src={logo}
            alt="Levelline"
            className="h-6 w-auto brightness-0 lg:h-7"
          />
        </Link>

        {/* ─── RIGHT: cart + profile ─── */}
        <div className="flex items-center gap-1 sm:gap-2">

          {/* ── CART ── */}
          <div
            className="relative"
            onMouseEnter={() => setCartOpen(true)}
            onMouseLeave={() => setCartOpen(false)}
          >
            <Link
              to={ROUTES.CHECKOUT}
              aria-label="Cart"
              className="relative flex size-10 items-center justify-center text-[#414141] transition hover:text-[#663f29]"
            >
              <BagIcon />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 flex size-[18px] items-center justify-center rounded-full bg-[#1a1a1a] font-sans text-[10px] font-medium leading-none text-white">
                  {count}
                </span>
              )}
            </Link>

            {cartOpen && (
              <div className="absolute right-0 top-full pt-2">
                <div className="w-[320px] border border-border bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                  {items.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="font-sans text-sm text-[#808080]">
                        Your bag is empty
                      </p>
                      <Link
                        to={ROUTES.READY_TO_WEAR}
                        className="mt-3 inline-block font-sans text-xs uppercase tracking-wide text-[#663f29] underline underline-offset-2"
                      >
                        Continue shopping
                      </Link>
                    </div>
                  ) : (
                    <>
                      {/* Items */}
                      <div className="max-h-[280px] overflow-y-auto p-4">
                        {items.map((i) => (
                          <div
                            key={`${i.id}-${i.size}`}
                            className="flex gap-3 border-b border-border py-3 last:border-0 last:pb-0 first:pt-0"
                          >
                            <div className="aspect-square w-14 shrink-0 overflow-hidden bg-[#F5F1E9]">
                              <img
                                src={i.image}
                                alt={i.title}
                                className="size-full object-contain"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-sans text-sm text-[#414141]">
                                {i.title}
                              </p>
                              <p className="mt-0.5 font-sans text-sm font-bold text-[#414141]">
                                {formatCurrency(i.price)}
                              </p>
                              <p className="mt-0.5 font-sans text-xs text-[#808080]">
                                Size: {i.size} · Qty: {i.qty}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="border-t border-border p-4">
                        <div className="flex items-center justify-between font-sans text-sm">
                          <span className="text-[#414141]">Total payable:</span>
                          <span className="font-bold text-[#414141]">
                            {formatCurrency(total)}
                          </span>
                        </div>
                        <Link
                          to={ROUTES.CHECKOUT}
                          className="mt-3 flex h-10 w-full items-center justify-center bg-ink font-sans text-xs font-medium uppercase tracking-wide text-cream transition hover:bg-[#663f29]"
                        >
                          Checkout
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── PROFILE ── */}
          <div
            className="relative"
            onMouseEnter={() => setProfileOpen(true)}
            onMouseLeave={() => setProfileOpen(false)}
          >
            <button
              aria-label="Profile"
              className="flex size-10 items-center justify-center text-[#414141] transition hover:text-[#663f29]"
            >
              <UserIcon />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full pt-2">
                <div className="w-[220px] border border-border bg-white p-3 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                  {IS_LOGGED_IN ? (
                    <div className="flex flex-col">
                      <Link
                        to="#"
                        className="block px-2 py-2 font-sans text-sm text-[#414141] transition hover:text-[#663f29]"
                      >
                        My Account
                      </Link>
                      <Link
                        to="#"
                        className="block px-2 py-2 font-sans text-sm text-[#414141] transition hover:text-[#663f29]"
                      >
                        Orders
                      </Link>
                      <button className="px-2 py-2 text-left font-sans text-sm text-[#414141] transition hover:text-[#663f29]">
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link
                      to={ROUTES.LOGIN}
                      className="flex h-10 w-full items-center justify-center border border-[#414141] font-sans text-xs font-medium uppercase tracking-wide text-[#414141] transition hover:bg-ink hover:text-cream"
                    >
                      Log in / Register
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/* ─────────── Icons ─────────── */

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z" />
  </svg>
);

const BagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 8h14l-1 13H6L5 8z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);