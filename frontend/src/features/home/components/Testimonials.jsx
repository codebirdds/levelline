import { useEffect, useRef, useState } from "react";
import { TESTIMONIALS } from "../content";

const Stars = () => (
  <div className="flex gap-0.5 text-gold" aria-label="5 out of 5 stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 18l-6.4 3.6L7 14.5l-5.3-5 7.2-.9z" />
      </svg>
    ))}
  </div>
);

const Arrow = ({ dir, onClick }) => (
  <button
    onClick={onClick}
    aria-label={dir < 0 ? "Previous testimonials" : "Next testimonials"}
    className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-heading transition hover:bg-ink hover:text-cream lg:size-12"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dir < 0 ? "rotate(180deg)" : "none" }}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

export default function Testimonials({
  autoPlay = true,
  interval = 4000,
  pauseOnHover = true,
}) {
  const track = useRef(null);
  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const realCount = TESTIMONIALS.length;
  const items = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS]; // 3x clones

  const stepSize = () => {
    const el = track.current;
    if (!el?.firstElementChild) return 0;
    return el.firstElementChild.getBoundingClientRect().width + 24; // card + gap
  };

  // Scroll one card forward/back with smooth behavior
  const scrollBy = (dir) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * stepSize(), behavior: "smooth" });
  };

  // Seamless loop: silently jump one set when entering a clone zone
  const normalize = () => {
    const el = track.current;
    if (!el) return;
    const oneSet = el.scrollWidth / 3;
    if (el.scrollLeft >= oneSet * 2) {
      el.scrollLeft -= oneSet;
    } else if (el.scrollLeft < oneSet * 0.5) {
      el.scrollLeft += oneSet;
    }
  };

  // Start in the middle set so we can scroll both directions
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    requestAnimationFrame(() => {
      const oneSet = el.scrollWidth / 3;
      el.scrollLeft = oneSet;
    });
  }, []);

  // Auto-slide
  useEffect(() => {
    if (!autoPlay || paused) return;
    const id = setInterval(() => scrollBy(1), interval);
    return () => clearInterval(id);
  }, [autoPlay, paused, interval]);

  // Track active card + run loop normalization on every scroll
  useEffect(() => {
    const el = track.current;
    if (!el) return;

    const onScroll = () => {
      normalize();

      const cards = Array.from(el.children);
      const center = el.scrollLeft + el.clientWidth / 2;
      let closest = 0;
      let minDist = Infinity;
      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const d = Math.abs(cardCenter - center);
        if (d < minDist) {
          minDist = d;
          closest = i;
        }
      });
      setActiveIndex(closest % realCount);
    };

    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [realCount]);

  return (
    <section className="relative overflow-hidden py-12 lg:py-20">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 select-none whitespace-nowrap font-serif text-[18vw] font-bold leading-none tracking-tight text-ink/[0.05] lg:top-8 lg:text-[14rem]"
      >
        LEVELLINE
      </span>

      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-border px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#6b6b6b]">
            Testimonials
          </span>
          <h2 className="mt-6 font-sans text-2xl font-medium text-[#6b6b6b] lg:text-4xl">
            Master Craftsmanship &amp; Unmatched Experience
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-sans text-sm leading-relaxed text-[#808080] lg:text-base">
            Discover how Levelline delivers bespoke excellence through flawless fit,
            premium fabrics, and personalized luxury tailored specifically for our
            discerning global clients.
          </p>
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 lg:mt-14">
          <Arrow dir={-1} onClick={() => scrollBy(-1)} />
          <Arrow dir={1} onClick={() => scrollBy(1)} />
        </div>

        <div
          ref={track}
          onMouseEnter={() => pauseOnHover && setPaused(true)}
          onMouseLeave={() => pauseOnHover && setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
          className="no-scrollbar mt-6 flex snap-x snap-mandatory items-stretch gap-6 overflow-x-auto pb-4"
        >
          {items.map((t, i) => {
            const active = i % realCount === activeIndex;
            return (
              <figure
                key={`${t.name}-${i}`}
                className={`shrink-0 basis-[85%] snap-center rounded-lg p-8 transition-all duration-700 ease-in-out sm:basis-[calc(50%-12px)] lg:basis-[calc((100%-48px)/3)] lg:p-10 ${
                  active ? "scale-105 bg-[#F6F3EE] shadow-md" : "scale-100 bg-white shadow-sm"
                }`}
              >
                <blockquote className="min-h-[7rem] font-sans text-base leading-relaxed text-[#808080]">
                  {t.text}
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <img src={t.avatar} alt="" loading="lazy" className="size-14 shrink-0 rounded-full object-cover lg:size-16" />
                  <div>
                    <p className="font-sans text-lg font-medium text-[#6b6b6b] lg:text-md">{t.name}</p>
                    <p className="mt-1 font-sans text-sm leading-relaxed text-[#808080]">{t.role}</p>
                    <div className="mt-2"><Stars /></div>
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}