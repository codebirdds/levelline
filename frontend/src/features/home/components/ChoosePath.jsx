import { useEffect, useRef, useState } from "react";
import SectionHeading from "../../../components/common/SectionHeading";
import SmartLink from "../../../components/common/SmartLink";
import { Reveal } from "../../../components/animation";
import { PATHS } from "../content";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

function useInView({ threshold = 0.35, rootMargin = "-12% 0px -12% 0px", once = false } = {}) {
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

function PathCard({
  p, index, direction, duration, delayStep, threshold, rootMargin, once,
}) {
  const [ref, inView] = useInView({ threshold, rootMargin, once });

  const slide = direction === "left" ? -110 : 110;
  const textSlide = slide * 0.4;

  const cardDelay = index * delayStep;
  const textDelay = cardDelay + 700; // text card ke 0.7s baad — image pura aaye pehle

  const cardTr = inView
    ? `transform ${duration}ms ${EASE} ${cardDelay}ms, opacity ${duration}ms ${EASE} ${cardDelay}ms`
    : "none";
  const textTr = inView
    ? `transform ${duration}ms ${EASE} ${textDelay}ms, opacity ${duration}ms ${EASE} ${textDelay}ms`
    : "none";

  return (
    <div ref={ref} className="relative aspect-[400/270] w-full">
      <SmartLink href={p.href} className="group block size-full">
        <div
          className="absolute inset-0 overflow-hidden rounded-sm bg-ink will-change-transform"
          style={{
            transform: inView ? "translate3d(0,0,0)" : `translate3d(${slide}px, 0, 0)`,
            opacity: inView ? 1 : 0,
            transition: cardTr,
          }}
        >
          <img
            src={p.image}
            alt={p.title}
            loading="lazy"
            className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />

          <div
            className="relative z-10 flex h-full flex-col justify-end p-6 text-cream lg:p-10 lg:pl-4 lg:pb-5 xl:p-[clamp(40px,3.13vw,45px)] xl:pl-[clamp(16px,1.25vw,18px)] xl:pb-[clamp(20px,1.56vw,22.5px)]"
            style={{
              transform: inView ? "translate3d(0,0,0)" : `translate3d(${textSlide}px, 0, 0)`,
              opacity: inView ? 1 : 0,
              transition: textTr,
              willChange: "transform, opacity",
            }}
          >
            <h3 className="font-sans text-2xl font-medium text-[#ffffff] lg:text-3xl xl:text-[clamp(30px,2.34vw,33.8px)]">
              {p.title}
            </h3>
            <p className="mt-3 font-sans text-sm text-[#f3f3f3] lg:text-sm xl:text-[clamp(14px,1.09vw,15.8px)]">
              {p.lines.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </p>
            <span className="mt-7 inline-flex items-center gap-2 self-start font-sans text-sm uppercase tracking-wide text-[#f3f3f3] transition-all xl:mt-[clamp(28px,2.19vw,31.5px)] group-hover:font-bold">
              {p.cta}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </SmartLink>
    </div>
  );
}

export default function ChoosePath({
  revealDuration = 2400,        // 👈 2.4s per element — bahut slow
  revealDelayStep = 400,        // 👈 clear gap between cards
  revealThreshold = 0.35,       // 👈 35% visible hoga tabhi trigger
  revealRootMargin = "-12% 0px -12% 0px", // 👈 viewport ke andar aane ka wait
  revealOnce = false,

  headingVariant = "up",
  headingDelay = 0,
  headingDuration,
  headingDistance,
}) {
  return (
    <section
      id="custom"
      className="mx-auto w-full max-w-[1920px] px-4 pt-20 pb-10 sm:px-6 lg:px-8 xl:px-[clamp(32px,2.5vw,36px)]"
    >
      <Reveal
        variant={headingVariant}
        delay={headingDelay}
        duration={headingDuration}
        distance={headingDistance}
        threshold={revealThreshold}
        rootMargin={revealRootMargin}
        once={revealOnce}
        className="mx-auto max-w-3xl text-center"
      >
        <SectionHeading
          align="center"
          title="Choose Your Path"
          subtitle="Select your journey — step into our curated ready-to-wear collections, or craft something uniquely yours with our made-to-measure experience."
        />
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-14 lg:gap-2 xl:mt-[clamp(56px,4.38vw,63px)] xl:gap-[clamp(8px,0.63vw,9px)]">
        {PATHS.map((p, i) => (
          <PathCard
            key={p.title}
            p={p}
            index={i}
            direction={i % 2 === 0 ? "left" : "right"}
            duration={revealDuration}
            delayStep={revealDelayStep}
            threshold={revealThreshold}
            rootMargin={revealRootMargin}
            once={revealOnce}
          />
        ))}
      </div>
    </section>
  );
}