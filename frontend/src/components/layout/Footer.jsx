import { useState } from "react";
import { FOOTER } from "../../features/home/content";
import BookAppointmentModal from "../../features/contact/components/BookAppointmentModal";
import logo from "../../assets/images/LandingPage/header/levelin.png";

const SOCIALS = [
  { label: "Facebook", d: <path d="M14 8h2V5h-2a3 3 0 0 0-3 3v2H9v3h2v6h3v-6h2l1-3h-3V8z" fill="currentColor" stroke="none" /> },
  { label: "X", d: <path d="M5 5l14 14M19 5L5 19" /> },
  { label: "YouTube", d: <><rect x="3" y="6" width="18" height="12" rx="3" /><path d="M10 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" /></> },
  { label: "LinkedIn", d: <><rect x="4" y="9" width="3" height="11" fill="currentColor" stroke="none" /><circle cx="5.5" cy="5.5" r="1.7" fill="currentColor" stroke="none" /><path d="M10 9h3v1.5c.6-1 1.8-1.8 3.3-1.8 2.8 0 3.7 1.8 3.7 4.4V20h-3v-6c0-1.4-.4-2.4-1.8-2.4S13 12.6 13 14v6h-3z" fill="currentColor" stroke="none" /></> },
];

const LinkList = ({ title, items }) => (
  <div>
    <h4 className="font-sans text-sm font-semibold uppercase tracking-wider text-cream/90">{title}</h4>
    <ul className="mt-4 space-y-3 lg:mt-5">
      {items.map((i) => (
        <li key={i}>
          <a href="#" className="font-sans text-sm text-cream/70 transition hover:text-gold">{i}</a>
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-cream/10 bg-ink-2 text-cream">
        <div className="container-x flex flex-col py-10 lg:grid lg:grid-cols-4 lg:gap-8 lg:py-16">
          
          {/* 1. Logo & Desktop Socials */}
          <div className="flex flex-col gap-8">
            <div>
              <img src={logo} alt="Levelline" className="h-12 w-auto lg:h-20" />
            </div>
            {/* Desktop Socials (hidden on mobile) */}
            <div className="mt-auto hidden gap-3 lg:flex">
              {SOCIALS.map((s) => (
                <a key={s.label} href="#" aria-label={s.label} className="flex size-10 items-center justify-center rounded-full border border-cream/30 transition hover:border-gold hover:text-gold">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{s.d}</svg>
                </a>
              ))}
            </div>
          </div>

          {/* 2 & 3. Links (2 columns on mobile, separate columns on desktop) */}
          <div className="mt-10 grid grid-cols-2 gap-8 lg:mt-0 lg:contents">
            <LinkList title="Collections" items={FOOTER.collections} />
            <LinkList title="Services" items={FOOTER.services} />
          </div>

          {/* 4. Get a call */}
          <div className="mt-10 lg:mt-0">
            <h4 className="font-sans text-sm font-semibold uppercase tracking-wider text-cream/90">Get a call</h4>
            <p className="mt-4 font-sans text-sm leading-relaxed text-cream/70">
              Have a question or want to book a private fitting? Our stylists are here to help.
            </p>
            <button 
              onClick={() => setBookingOpen(true)}
              className="mt-6 w-full rounded-md bg-surface px-6 py-3 font-sans text-sm font-medium text-ink transition hover:bg-gold-soft sm:w-auto"
            >
              Request a Call
            </button>
          </div>

          {/* Mobile Socials (moved to the very bottom) */}
          <div className="mt-12 border-t border-cream/10 pt-8 lg:hidden">
            <div className="flex gap-3">
              {SOCIALS.map((s) => (
                <a key={s.label} href="#" aria-label={s.label} className="flex size-10 items-center justify-center rounded-full border border-cream/30 transition hover:border-gold hover:text-gold">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{s.d}</svg>
                </a>
              ))}
            </div>
          </div>

        </div>
      </footer>

      {/* Modal */}
      <BookAppointmentModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </>
  );
}