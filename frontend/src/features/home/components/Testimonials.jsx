import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import SectionHeading from "../../../components/common/SectionHeading";
import { Reveal } from "../../../components/animation";
import { TYPE } from "../../../components/common/typography";
import { prefersReducedMotion } from "../../../components/animation/useInView";

const GAP = 16;
const AUTOPLAY_MS = 2000;

const Stars = ({ rating = 5 }) => (
  <div className="flex gap-0.5 text-[#f5a623]" aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i < rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 2l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 18l-6.4 3.6L7 14.5l-5.3-5 7.2-.9z" />
      </svg>
    ))}
  </div>
);

const Avatar = ({ src }) =>
  src ? (
    <img src={src} alt="" loading="lazy" draggable={false} className="size-9 shrink-0 rounded-full object-cover" />
  ) : (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#3b2314] text-white">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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

  useEffect(() => {
    if (width > 0) {
      const id = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(id);
    }
  }, [width]);

  useEffect(() => {
    setAnimate(false);
    setIndex(n > 1 ? n : 0);
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setAnimate(true))
    );
    return () => cancelAnimationFrame(id);
  }, [n]);

  const go = useCallback((dir) => setIndex((i) => i + dir), []);

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

  useEffect(() => {
    if (!autoPlay || !loop || paused || prefersReducedMotion()) return;
    const id = setInterval(() => {
      if (!document.hidden) go(1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [autoPlay, loop, paused, go]);

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

  // Smaller cards — narrower viewport → tighter slides
  const cardW =
    width === 0
      ? 260
      : width < 640
      ? width * 0.72
      : width < 1024
      ? width * 0.5
      : Math.min(width * 0.34, 480);

  const x = width === 0 ? 0 : width / 2 - cardW / 2 - index * (cardW + GAP);

  return (
    <section className="relative overflow-hidden py-8 lg:py-12">
   <span
  aria-hidden="true"
  className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 select-none whitespace-nowrap font-sans text-[11vw] font-bold leading-none text-[#4a5a85]/[0.07] sm:text-[8vw] lg:top-6 2xl:text-[8rem]"
>
  LEVELLINE
</span>

<div className="container-x relative text-center">
  <Reveal variant="fade">
    <span className="inline-block rounded-full bg-[#f6f3ee] px-2.5 py-0.5 font-sans text-[9px] font-semibold uppercase tracking-wide text-[#6b6b6b]">
      {badge}
    </span>
  </Reveal>
  <Reveal delay={120} className="mt-3">
    <SectionHeading title={title} subtitle={subtitle} />
  </Reveal>
</div>
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
        className="mt-6 select-none overflow-hidden py-8 lg:mt-8 lg:py-10 [touch-action:pan-y]"
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
                className={`flex shrink-0 flex-col items-center rounded-lg border p-4 text-center transition-[transform,background-color,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-5 lg:p-6 ${
                  active
                    ? "z-10 scale-[1.03] border-transparent bg-[#f6f3ee] shadow-md"
                    : "scale-100 border-border bg-white shadow-sm"
                }`}
                style={{ width: cardW, marginRight: GAP }}
              >
                {t.title && (
                  <h3 className="mb-2.5 font-sans text-sm font-medium text-[#414141] lg:text-base">
                    {t.title}
                  </h3>
                )}
                <blockquote className="flex-1 font-sans text-xs leading-relaxed text-[#808080] lg:text-sm">
                  {t.text}
                </blockquote>

                <figcaption
                  className={`mt-4 inline-flex items-center gap-2.5 rounded-lg border px-3 py-2 text-left lg:mt-5 ${
                    active
                      ? "border-transparent bg-[#f3ecdf]"
                      : "border-border/60 bg-transparent"
                  }`}
                >
                  <Avatar src={t.avatar} />
                  <div>
                    <p className="font-sans text-xs font-medium text-[#6b6b6b] lg:text-sm">
                      {t.name}
                    </p>
                    <p className="font-sans text-[11px] text-[#808080] lg:text-xs">
                      {t.role}
                    </p>
                    <div className="mt-0.5">
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