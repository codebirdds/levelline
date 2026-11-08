import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SmartLink from "../../../components/common/SmartLink";
import { useCart } from "../hooks/useStorage.js";

const LEFT = [
  { label: "Featured", href: "/customize" },
  { label: "Tailored", href: "/customize?category=Tailored" },
  { label: "Dress Shirts", href: "/customize?category=Shirts" },
  { label: "Custom", href: "/customize" },
];
const RIGHT = [
  { label: "Sportswear", href: "/customize?category=Sportswear" },
  { label: "Accessories", href: "/customize?category=Accessories" },
  { label: "Explore", href: "/customize" },
];
const link = "font-sans text-xs uppercase tracking-[0.18em] text-[#6b6b6b] transition-colors hover:text-ink";

export default function CustomizerNav() {
  const [open, setOpen] = useState(false);
  const count = useCart().reduce((n, i) => n + i.quantity, 0);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 h-[var(--header-h)] border-b border-border bg-white/90 backdrop-blur-md">
        <div className="container-x flex h-full items-center">
          <button onClick={() => setOpen(true)} aria-label="Open menu" className="-ml-2 p-2 text-[#6b6b6b] lg:hidden">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 7h18M3 12h18M3 17h18" /></svg>
          </button>

          <nav className="hidden flex-1 justify-end gap-9 pr-12 lg:flex" aria-label="Primary">
            {LEFT.map((l) => <SmartLink key={l.label} href={l.href} className={link}>{l.label}</SmartLink>)}
          </nav>

          <Link to="/" className="mx-auto shrink-0 lg:mx-0" aria-label="Levelline home">
            {/* logo asset is light-on-dark; brightness-0 renders it as a dark mark on this light bar */}
            <img src="/images/levelline-logo.png" alt="Levelline" className="h-10 w-auto brightness-0 lg:h-14" />
          </Link>

          <div className="hidden flex-1 items-center justify-between pl-12 lg:flex">
            <nav className="flex gap-9" aria-label="Secondary">
              {RIGHT.map((l) => <SmartLink key={l.label} href={l.href} className={link}>{l.label}</SmartLink>)}
            </nav>
            <Link to="/cart" className={`${link} flex items-center gap-2`}>Cart <span className="rounded-full bg-ink px-1.5 py-0.5 text-[10px] leading-none text-cream">{count}</span></Link>
          </div>

          <Link to="/cart" aria-label={`Cart, ${count} items`} className="-mr-2 flex items-center gap-1 p-2 text-[#6b6b6b] lg:hidden">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 016 0v2" /></svg>
            <span className="font-sans text-xs">{count}</span>
          </Link>
        </div>
      </header>

      <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
        <aside className={`absolute left-0 top-0 h-full w-4/5 max-w-xs bg-white p-6 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="mb-8 block p-2 text-[#6b6b6b]">✕</button>
          <nav className="flex flex-col gap-6">
            {[...LEFT, ...RIGHT].map((l) => <SmartLink key={l.label} href={l.href} onClick={() => setOpen(false)} className={`${link} text-sm`}>{l.label}</SmartLink>)}
          </nav>
        </aside>
      </div>
    </>
  );
}
