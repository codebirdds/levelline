import { useEffect, useRef, useState } from "react";
import SectionHeading from "../../../components/common/SectionHeading";
import { STEPS } from "../content";

/* ── bounce keyframes — 1800ms, wider swing ── */
/* ── bounce keyframes — 1800ms, 60% less bounce ── */
const BOUNCE_CSS = `
@keyframes hiwBounce {
  0%   { opacity: 0; transform: translate3d(-40px, 0, 0); }
  55%  { opacity: 1; transform: translate3d(8px, 0, 0); }
  75%  { transform: translate3d(-4px, 0, 0); }
  88%  { transform: translate3d(1.5px, 0, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}
.hiw-bounce {
  animation: hiwBounce 1800ms cubic-bezier(0.22, 1, 0.36, 1) both;
  will-change: transform, opacity;
}
@media (prefers-reduced-motion: reduce) {
  .hiw-bounce {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
`;
/* Re-triggers every time section enters the middle band of viewport. */
function useInView({
  threshold = 0,
  rootMargin = "0px 0px -40% 0px",
  once = false,
} = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}

/* Generic bouncy wrapper — works for text, headings, anything. */
function BouncyItem({ delay = 0, ready, className = "", children }) {
  const animate = ready;
  return (
    <div
      className={`${className} ${animate ? "hiw-bounce" : ""}`}
      style={animate ? { animationDelay: `${delay}ms` } : { opacity: 0 }}
    >
      {children}
    </div>
  );
}

/* Image — waits for its own load AND section in view, then bounces. */
function BouncyImage({ src, alt, delay = 0, ready, className = "" }) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, [src]);

  const animate = ready && loaded;

  return (
    <div
      className={`h-full w-full ${className} ${animate ? "hiw-bounce" : ""}`}
      style={animate ? { animationDelay: `${delay}ms` } : { opacity: 0 }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className="h-full w-full object-contain"
      />
    </div>
  );
}

function Chevron() {
  return (
    <svg
      width="12"
      height="14"
      viewBox="0 0 12 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 1l6 6-6 6" />
    </svg>
  );
}

export default function HowItWorks() {
  const [sectionRef, inView] = useInView();

  return (
    <section ref={sectionRef} className="py-10 overflow-hidden">
      <style>{BOUNCE_CSS}</style>

      <div className="container-x">
        {/* Heading — bounces in first */}
        <BouncyItem ready={inView} delay={0} className="text-center">
          <SectionHeading title="How it works" underline />
        </BouncyItem>

        {/* ---------- Desktop ---------- */}
        <div className="hidden lg:block mt-12 px-4">
          {/* TITLE ROW — bounces left→right, same timing style as images */}
          <div className="relative grid grid-cols-5 gap-4 xl:gap-12 items-center">
            {STEPS.map((step, i) => (
              <BouncyItem
                key={step.title}
                ready={inView}
                delay={150 + i * 250}
                className="relative flex justify-center w-full"
              >
                <h3 className="text-center font-sans text-[10px] min-[1400px]:text-[12px] font-medium uppercase tracking-[0.18em] text-heading whitespace-nowrap">
                  {step.title}
                </h3>
                {i < STEPS.length - 1 && (
                  <span className="absolute top-1/2 -translate-y-1/2 text-muted/70 -right-2 translate-x-1/2 xl:-right-6">
                    <Chevron />
                  </span>
                )}
              </BouncyItem>
            ))}
          </div>

          {/* IMAGE ROW — bounces, 150ms after each title */}
          <div className="grid grid-cols-5 gap-4 mt-6 xl:gap-12">
            {STEPS.map((step, i) => (
              <div key={step.title} className="w-full flex justify-center">
                <div className="w-full max-w-[160px] aspect-[190/234]">
                  <BouncyImage
                    src={step.image}
                    alt={step.title}
                    delay={300 + i * 250}
                    ready={inView}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* DESCRIPTION ROW — bounces, 150ms after each image */}
          <div className="grid grid-cols-5 gap-4 mt-5 xl:gap-12">
            {STEPS.map((step, i) => (
              <BouncyItem
                key={step.title}
                ready={inView}
                delay={450 + i * 250}
                className="flex justify-center w-full"
              >
                <p className="text-center max-w-[160px] font-sans text-[10px] leading-relaxed text-subheading">
                  {step.text}
                </p>
              </BouncyItem>
            ))}
          </div>
        </div>

        {/* ---------- Mobile ---------- */}
        <ol className="lg:hidden mt-10 space-y-12">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex flex-col items-center text-center">
              <BouncyItem
                ready={inView}
                delay={i * 250}
                className="w-full flex justify-center"
              >
                <h3 className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-heading">
                  {step.title}
                </h3>
              </BouncyItem>

              <div className="mt-6 w-full !max-w-[100px] aspect-[214/334]">
                <BouncyImage
                  src={step.image}
                  alt={step.title}
                  delay={i * 250 + 80}
                  ready={inView}
                />
              </div>

              <BouncyItem
                ready={inView}
                delay={i * 250 + 160}
                className="w-full flex justify-center"
              >
                <p className="mt-5 max-w-[260px] font-sans text-[12px] leading-relaxed text-subheading">
                  {step.text}
                </p>
              </BouncyItem>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}