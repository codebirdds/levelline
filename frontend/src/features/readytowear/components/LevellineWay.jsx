import { Reveal, Stagger, ImageReveal } from "../../../components/animation";
import ArrowLink from "../../../components/ui/ArrowLink";
import { WAY } from "../content";

export default function LevellineWay() {
  return (
    <section className="px-5 pb-16 pt-16 sm:px-10 lg:px-[7.6%] lg:pb-24 lg:pt-24">
      <div className="grid gap-12 lg:grid-cols-[524px_1fr] lg:gap-16">
        {/* Left column — label, title, text, CTA */}
        <div>
          <Reveal variant="fade">
            <p className="font-sans text-xs uppercase tracking-wide text-[#808080] lg:text-sm">
              {WAY.label}
            </p>
          </Reveal>

          <Reveal delay={120}>
            <h2 className="mt-4 font-sans text-lg font-medium text-[#6b6b6b] lg:mt-5 lg:text-md">
              {WAY.title[0]} <br className="hidden sm:block" />
              {WAY.title[1]}
            </h2>
          </Reveal>

          <Reveal delay={240}>
            <p className="mt-3 max-w-[524px] font-sans text-sm leading-relaxed text-[#808080]">
              {WAY.text}
            </p>
          </Reveal>

          <Reveal delay={360}>
            <ArrowLink href={WAY.href} className="mt-8 uppercase lg:mt-12">
              {WAY.cta}
            </ArrowLink>
          </Reveal>
        </div>

        {/* Right column — step cards */}
        <Stagger
          className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-5"
          step={120}
        >
          {WAY.steps.map((s, i) => (
            <div key={s.title}>
              <ImageReveal className="aspect-[243/276] bg-tile">
                <img
                  src={s.image}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover"
                />
              </ImageReveal>

              <p className="mt-3 font-sans text-xs leading-5 text-[#808080]">
                {String(i + 1).padStart(2, "0")}
              </p>

              <h3 className="mt-2 font-sans text-lg font-medium text-[#6b6b6b] lg:text-md">
                {s.title}
              </h3>

              <p className="mt-3 max-w-[243px] font-sans text-sm leading-relaxed text-[#808080]">
                {s.text}
              </p>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}