import { useState } from "react";
import { FOOTER } from "../../features/home/content";

const SOCIALS = [
  { label: "Facebook", d: <path d="M14 8h2V5h-2a3 3 0 0 0-3 3v2H9v3h2v6h3v-6h2l1-3h-3V8z" fill="currentColor" stroke="none" /> },
  { label: "X", d: <path d="M5 5l14 14M19 5L5 19" /> },
  { label: "YouTube", d: <><rect x="3" y="6" width="18" height="12" rx="3" /><path d="M10 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" /></> },
  { label: "LinkedIn", d: <><rect x="4" y="9" width="3" height="11" fill="currentColor" stroke="none" /><circle cx="5.5" cy="5.5" r="1.7" fill="currentColor" stroke="none" /><path d="M10 9h3v1.5c.6-1 1.8-1.8 3.3-1.8 2.8 0 3.7 1.8 3.7 4.4V20h-3v-6c0-1.4-.4-2.4-1.8-2.4S13 12.6 13 14v6h-3z" fill="currentColor" stroke="none" /></> },
];

const LinkList = ({ title, items }) => (
  <div>
    <h4 className="font-sans text-base font-semibold uppercase text-cream">{title}</h4>
    <ul className="mt-5 space-y-3">
      {items.map((i) => (
        <li key={i}>
          <a href="#" className="font-sans text-sm text-cream/80 transition hover:text-gold">{i}</a>
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (phone.trim().length < 7) return;
    // TODO: wire to a mediator (features/contact) when backend exists
    setSent(true);
    setPhone("");
  };

  return (
    <footer className="bg-ink-2 text-cream">
      <div className="container-x grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div>
          <img src="/images/levelline-logo.png" alt="Levelline" className="h-20 w-auto" />
          <div className="mt-6 flex gap-3">
            {SOCIALS.map((s) => (
              <a key={s.label} href="#" aria-label={s.label} className="flex size-11 items-center justify-center rounded-full border border-cream/40 transition hover:border-gold hover:text-gold">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{s.d}</svg>
              </a>
            ))}
          </div>
        </div>

        <LinkList title="Collections" items={FOOTER.collections} />
        <LinkList title="Services" items={FOOTER.services} />

        <form onSubmit={onSubmit}>
          <h4 className="font-sans text-base font-semibold uppercase text-cream">Get a call</h4>
          {sent ? (
            <p className="mt-5 font-sans text-sm text-cream/80">Thank you — we’ll call you soon.</p>
          ) : (
            <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your number"
                className="min-w-0 flex-1 border border-subtle bg-transparent px-4 py-3 font-sans text-sm text-cream placeholder:text-subtle focus:border-gold focus:outline-none"
              />
              <button type="submit" className="rounded-md bg-surface px-6 py-3 font-sans text-sm font-medium text-ink transition hover:bg-gold-soft">
                Submit
              </button>
            </div>
          )}
        </form>
      </div>
    </footer>
  );
}
