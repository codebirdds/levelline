import { useEffect, useRef, useState } from "react";
import { PROPORTION_CARDS } from "../content";

/* Reusable hook */
function useInView({ threshold = 0, rootMargin = "0px", once = false } = {}) {
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

function AnimatedCard({ card, index }) {
  // Image trigger: later (70% viewport) so user sees the full zoom-out
  const [cardRef, cardInView] = useInView({
    threshold: 0.1,
    rootMargin: "0px 0px -30% 0px",
  });

  // Text trigger: ONLY when text hits middle of viewport
  const [textRef, textInView] = useInView({
    threshold: 0,
    rootMargin: "-40% 0px -40% 0px",
  });

  // Image load state
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, [card.image]);

  const animateImage = cardInView && loaded;
  const delay = index * 150;

  return (
    <div
      ref={cardRef}
      className="relative w-full overflow-hidden bg-[#E3E3E3] aspect-[650/1250]"
    >
      {/* ── IMAGE LAYER ── 
          NO translate. Just a slow cinematic zoom-out (dolly back)
          + fade-in. Tall images look premium this way because the 
          frame stays locked and the subject "breathes into place".
      */}
      <div
        className="absolute inset-0"
        style={{
          opacity: animateImage ? 1 : 0,
          transform: animateImage ? "scale(1)" : "scale(1.1)",
          transition: `
            opacity 1600ms ease-out ${delay}ms,
            transform 2600ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms
          `,
          willChange: "transform, opacity",
        }}
      >
        <img
          ref={imgRef}
          src={card.image}
          alt={card.title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Gradient overlay for text legibility */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/95 via-ink/60 to-transparent" />

      {/* ── TEXT LAYER (unchanged — user loves it) ── */}
      <div className="relative flex h-full flex-col justify-end p-6 text-cream lg:p-8 xl:p-10">
        <div ref={textRef}>
          <h3
            className="font-sans text-3xl font-medium text-cream lg:text-4xl"
            style={{
              opacity: textInView ? 1 : 0,
              transform: textInView ? "translateY(0)" : "translateY(50px)",
              filter: textInView ? "blur(0px)" : "blur(12px)",
              transition: `opacity 1200ms cubic-bezier(0.16, 1, 0.3, 1) ${delay + 100}ms, transform 1200ms cubic-bezier(0.16, 1, 0.3, 1) ${delay + 100}ms, filter 1200ms cubic-bezier(0.16, 1, 0.3, 1) ${delay + 100}ms`,
              willChange: "transform, opacity, filter",
            }}
          >
            {card.title}
          </h3>
          <p
            className="mt-4 max-w-lg font-sans text-base text-cream/95 lg:text-sm"
            style={{
              opacity: textInView ? 1 : 0,
              transform: textInView ? "translateY(0)" : "translateY(50px)",
              filter: textInView ? "blur(0px)" : "blur(8px)",
              transition: `opacity 1200ms cubic-bezier(0.16, 1, 0.3, 1) ${delay + 250}ms, transform 1200ms cubic-bezier(0.16, 1, 0.3, 1) ${delay + 250}ms, filter 1200ms cubic-bezier(0.16, 1, 0.3, 1) ${delay + 250}ms`,
              willChange: "transform, opacity, filter",
            }}
          >
            {card.text}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ProportioningCards() {
  return (
    <section className="container-x py-10 lg:py-14">
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-2">
        {PROPORTION_CARDS.map((card, i) => (
          <AnimatedCard key={card.title} card={card} index={i} />
        ))}
      </div>
    </section>
  );
}