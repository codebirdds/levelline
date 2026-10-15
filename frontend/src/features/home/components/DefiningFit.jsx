import ArrowLink from "../../../components/ui/ArrowLink";
import { Reveal, ImageReveal } from "../../../components/animation";
import { FIT } from "../content";

export default function DefiningFit() {
  return (
    <section className="container-x py-10 lg:py-14">
      <div className="grid items-center gap-8 lg:grid-cols-[1.45fr_1fr] lg:gap-14">
        {/* Video — fade + slide in from the right */}
        <Reveal variant="left" duration={1000}>
          <div className="aspect-[1173/616] overflow-hidden rounded-sm bg-[#F5F1E9]">
            <video
              src={FIT.video}
              className="size-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>
        </Reveal>

        {/* Text — fade + slide in from the left, slightly delayed */}
        <Reveal variant="right" delay={150}>
          <h2 className="font-sans text-lg font-medium text-[#6b6b6b] lg:text-md">
            {FIT.title}
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-[#808080]">
            {FIT.text}
          </p>
          <ArrowLink href={FIT.href} className="mt-8 uppercase">
            {FIT.cta}
          </ArrowLink>
        </Reveal>
      </div>
    </section>
  );
}