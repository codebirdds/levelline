import ArrowLink from "../../../components/ui/ArrowLink";
import { Reveal } from "../../../components/animation";
import ServicesGrid from "./ServicesGrid";
import { ABOUT_IMAGES } from "../content";

export default function CraftedSection({ services = [] }) {
  return (
    <section className="px-5 pb-12 pt-12 sm:px-8 lg:px-[3%] lg:pb-16 lg:pt-16">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[260px_290px_minmax(0,1fr)] lg:items-start lg:gap-8 xl:gap-10">
        {/* ── LEFT: image ── */}
        <Reveal variant="fade" className="self-start">
          <div className="aspect-[400/500] w-full overflow-hidden bg-[#F5F1E9] lg:max-w-[260px]">
            <img
              src={ABOUT_IMAGES.premiumFabric}
              alt=""
              loading="lazy"
              className="size-full object-cover"
            />
          </div>
        </Reveal>

        {/* ── MIDDLE: text ── */}
        <div className="self-start lg:pt-2">
          <Reveal>
            <h2 className="font-sans text-xl font-medium leading-snug text-[#6b6b6b] lg:text-2xl">
              Crafted with Precision, <br />
              Designed for You
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <p className="mt-3 font-sans text-sm italic leading-relaxed text-[#808080]">
              Every detail matters. From the finest fabrics to the final stitch,
              our services are designed to give you a truly personal experience.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <ArrowLink
              href="/#services"
              className="mt-5 inline-block text-xs uppercase tracking-[0.15em]"
            >
              Explore the services
            </ArrowLink>
          </Reveal>
        </div>

        {/* ── RIGHT: services grid ── */}
        <ServicesGrid
          items={services}
          className="md:col-span-2 lg:col-span-1"
        />
      </div>
    </section>
  );
}