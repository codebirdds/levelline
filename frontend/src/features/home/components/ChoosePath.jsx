import SectionHeading from "../../../components/common/SectionHeading";
import ImageCard from "../../../components/ui/ImageCard";
import SmartLink from "../../../components/common/SmartLink";
import { ImageReveal, Reveal } from "../../../components/animation";
import { PATHS } from "../content";

export default function ChoosePath({
  // Card reveal props
  revealVariant = "zoom",       // "zoom" | "wipe"
  revealDuration = 1200,
  revealDelayStep = 150,        // stagger between cards
  revealScaleFrom = 1.12,
  revealThreshold = 0.08,
  revealRootMargin,
  revealOnce,

  // Heading Reveal props
  headingVariant = "up",        // up | down | left | right | zoom | fade
  headingDelay = 0,
  headingDuration,
  headingDistance,
}) {
  return (
    <section
      id="custom"
      className="mx-auto w-full max-w-[1920px] px-4 pt-20 pb-10 sm:px-6 lg:px-8 xl:px-[clamp(32px,2.5vw,36px)]"
    >
      {/* Centered heading + subtitle */}
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

      {/* Full-width cards — ImageReveal (zoom / wipe) */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-14 lg:gap-2 xl:mt-[clamp(56px,4.38vw,63px)] xl:gap-[clamp(8px,0.63vw,9px)]">
        {PATHS.map((p, i) => (
          <ImageReveal
            key={p.title}
            variant={revealVariant}
            duration={revealDuration}
            delay={i * revealDelayStep}
            scaleFrom={revealScaleFrom}
            threshold={revealThreshold}
            rootMargin={revealRootMargin}
            once={revealOnce}
            className="aspect-[400/270] w-full"
          >
            {/* ✅ Wrapped in SmartLink to make the whole card clickable */}
            <SmartLink
              href={p.href}
              className="group block size-full cursor-pointer"
            >
              <ImageCard
                image={p.image}
                alt={p.title}
                className="size-full"
              >
                <h3 className="font-sans text-2xl font-medium text-[#ffffff] lg:text-3xl xl:text-[clamp(30px,2.34vw,33.8px)]">
                  {p.title}
                </h3>
                <p className="mt-3 font-sans text-sm text-[#f3f3f3] lg:text-sm xl:text-[clamp(14px,1.09vw,15.8px)]">
                  {p.lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </p>
                
                {/* ✅ Replaced ArrowLink with a visual span to prevent nested <a> tags */}
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
              </ImageCard>
            </SmartLink>
          </ImageReveal>
        ))}
      </div>
    </section>
  );
}