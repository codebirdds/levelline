import SectionHeading from "../../../components/common/SectionHeading";
import ImageCard from "../../../components/ui/ImageCard";
import ArrowLink from "../../../components/ui/ArrowLink";
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
    <section id="custom" className="container-x pt-20 pb-10 ">
      {/* Centered heading + subtitle — Reveal (fade + slide) */}
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
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-14 lg:gap-2">
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
            className="w-full aspect-[400/270]"
          >
            <ImageCard
              image={p.image}
              alt={p.title}
              className="size-full"
            >
              <h3 className="font-sans text-2xl font-medium text-[#ffffff] lg:text-3xl">
                {p.title}
              </h3>
              <p className="mt-3 font-sans text-sm text-[#f3f3f3] lg:text-sm">
                {p.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </p>
              <ArrowLink href={p.href} light className="mt-7 self-start" lightColor="#f3f3f3" lightHoverColor="" hoverBold={true}>
                {p.cta}
              </ArrowLink>
            </ImageCard>
          </ImageReveal>
        ))}
      </div>
    </section>
  );
}