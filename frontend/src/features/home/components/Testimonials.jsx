import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import SectionHeading from "../../../components/common/SectionHeading";
import { Reveal } from "../../../components/animation";
import { TYPE } from "../../../components/common/typography";
import { prefersReducedMotion } from "../../../components/animation/useInView";

const GAP = 24;
const AUTOPLAY_MS = 2000;

const Stars = ({ rating = 5 }) => (
  <div className="flex gap-0.5 text-[#f5a623]" aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i < rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 2l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 18l-6.4 3.6L7 14.5l-5.3-5 7.2-.9z" />
      </svg>
    ))}
  </div>
);

const Avatar = ({ src }) =>
  src ? (
    <img src={src} alt="" loading="lazy" draggable={false} className="size-11 shrink-0 rounded-full object-cover" />
  ) : (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#3b2314] text-white">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
      </svg>
    </span>
  );

export default function Testimonials({
  items = [],
  badge = "Testimonials",
  title = "Master Craftsmanship & Unmatched Experience",
  subtitle = "Discover how Levelline delivers bespoke excellence through flawless fit, premium fabrics, and personalized luxury tailored specifically for our discerning global clients.",
  autoPlay = true,
}) {
  const n = items.length;
  const loop = n > 1;
  const viewportRef = useRef(null);
  const swipeRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(loop ? n : 0);
  const [animate, setAnimate] = useState(false);
  const [paused, setPaused] = useState(false);

  const slides = loop ? [...items, ...items, ...items] : items;

  // Measure viewport — retries so width is never stuck at 0
  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      if (w > 0) setWidth(w);
    };
    measure();
    const raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  // Turn on animation once we have a real width
  useEffect(() => {
    if (width > 0) {
      const id = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(id);
    }
  }, [width]);

  // Reset to middle copy when the data changes
  useEffect(() => {
    setAnimate(false);
    setIndex(n > 1 ? n : 0);
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setAnimate(true))
    );
    return () => cancelAnimationFrame(id);
  }, [n]);

  const go = useCallback((dir) => setIndex((i) => i + dir), []);

  // Silent jump back to the middle set (copies are identical)
  const settle = useCallback(() => {
    if (!loop) return;
    const jump = (i) => {
      setAnimate(false);
      setIndex(i);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setAnimate(true))
      );
    };
    if (index >= 2 * n) jump(index - n);
    else if (index < n) jump(index + n);
  }, [index, loop, n]);

  const onTransitionEnd = (e) => {
    if (e.target === e.currentTarget && e.propertyName === "transform") settle();
  };

  // Autoplay
  useEffect(() => {
    if (!autoPlay || !loop || paused || prefersReducedMotion()) return;
    const id = setInterval(() => {
      if (!document.hidden) go(1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [autoPlay, loop, paused, go]);

  // Swipe
  const onPointerDown = (e) => {
    swipeRef.current = e.clientX;
    setPaused(true);
  };
  const endSwipe = (e) => {
    if (swipeRef.current != null && e) {
      const dx = e.clientX - swipeRef.current;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    }
    swipeRef.current = null;
    setPaused(false);
  };

  if (!n) return null;

  // Card width — safe fallback so cards render immediately
  const cardW =
    width === 0
      ? 300
      : width < 640
      ? width * 0.78
      : width < 1024
      ? width * 0.6
      : Math.min(width * 0.42, 640);

  const x = width === 0 ? 0 : width / 2 - cardW / 2 - index * (cardW + GAP);

  return (
    <section className="relative overflow-hidden py-12 lg:py-20">
      {/* Watermark — unchanged */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-16 -translate-x-1/2 select-none whitespace-nowrap font-sans text-[16vw] font-bold leading-none text-[#4a5a85]/[0.07] sm:text-[11vw] lg:top-20 2xl:text-[12rem]"
      >
        LEVELLINE
      </span>

      {/* Heading — unchanged */}
      <div className="container-x relative text-center">
        <Reveal variant="fade">
          <span className="inline-block rounded-full bg-[#f6f3ee] px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-wide text-[#6b6b6b]">
            {badge}
          </span>
        </Reveal>
        <Reveal delay={120} className="mt-6">
          <SectionHeading title={title} subtitle={subtitle} />
        </Reveal>
      </div>

      {/* Carousel — full-width viewport so neighbours peek in */}
      <div
        ref={viewportRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Testimonials"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onPointerDown={onPointerDown}
        onPointerUp={endSwipe}
        onPointerCancel={() => endSwipe(null)}
        onPointerLeave={() => endSwipe(null)}
        className="mt-10 select-none overflow-hidden py-10 lg:mt-14 lg:py-14 [touch-action:pan-y]"
      >
        <div
          onTransitionEnd={onTransitionEnd}
          className="flex items-stretch will-change-transform"
          style={{
            transform: `translate3d(${x}px, 0, 0)`,
            transition:
              animate && !prefersReducedMotion()
                ? "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)"
                : "none",
          }}
        >
          {slides.map((t, i) => {
            const active = i === index;
            const isClone = loop && (i < n || i >= 2 * n);
            return (
              <figure
                key={i}
                aria-hidden={isClone || undefined}
                className={`flex shrink-0 flex-col items-center rounded-lg border p-6 text-center transition-[transform,background-color,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-8 lg:p-10 ${
                  active
                    ? "z-10 scale-[1.04] border-transparent bg-[#f6f3ee] shadow-md"
                    : "scale-100 border-border bg-white shadow-sm"
                }`}
                style={{ width: cardW, marginRight: GAP }}
              >
                {t.title && (
                  <h3 className={`${TYPE.h3} mb-4`}>{t.title}</h3>
                )}
                <blockquote className={`flex-1 ${TYPE.p}`}>{t.text}</blockquote>

                <figcaption
                  className={`mt-6 inline-flex items-center gap-3 rounded-lg border px-4 py-3 text-left lg:mt-8 ${
                    active
                      ? "border-transparent bg-[#f3ecdf]"
                      : "border-border/60 bg-transparent"
                  }`}
                >
                  <Avatar src={t.avatar} />
                  <div>
                    <p className="font-sans text-sm font-medium text-[#6b6b6b]">
                      {t.name}
                    </p>
                    <p className="font-sans text-sm text-[#808080]">{t.role}</p>
                    <div className="mt-1">
                      <Stars rating={t.rating ?? 5} />
                    </div>
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