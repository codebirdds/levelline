import SectionHeading from "../../../components/common/SectionHeading";
import ImageCard from "../../../components/ui/ImageCard";
import { Reveal, Stagger } from "../../../components/animation";
import { SHOP_OPTIONS } from "../content";

export default function ThreeWaysToShop() {
  return (
    <section id="services" className="container-x py-10 lg:py-14">
      <div className="grid items-center gap-6 lg:grid-cols-[2fr_4fr] lg:gap-10">
        {/* Left heading */}
        <Reveal variant="right" delay={100}>
          <SectionHeading
            align="left"
            title="Three Ways To Shop"
            subtitle="Uncompromising Elegance, Delivered On Your Terms"
          />
        </Reveal>

        {/* Right: 3 compact cards — cascade in from the left */}
        <Stagger
          className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3"
          variant="left"
          step={150}
          delay={200}
        >
          {SHOP_OPTIONS.map((o) => (
            <ImageCard
              key={o.title}
              image={o.image}
              alt={o.title}
              className="aspect-[3/4]"
            >
              {/* Dark gradient at the bottom so text pops */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Content sits above the gradient */}
              <div className="relative z-10">
                <h3 className="font-sans text-sm font-semibold uppercase tracking-wide text-white lg:text-base">
                  {o.title}
                </h3>
                <p className="mt-2 font-sans text-xs leading-relaxed text-white/85">
                  {o.text}
                </p>

                <a
                  href={o.href}
                  className="mt-4 inline-block rounded-full border border-white/50 px-4 py-1.5 font-sans text-[10px] font-medium uppercase tracking-[0.08em] text-white transition hover:bg-white hover:text-black"
                >
                  {o.cta}
                </a>
              </div>
            </ImageCard>
          ))}
        </Stagger>
      </div>
    </section>
  );
}