import { Reveal, ImageReveal, Stagger } from "../../../components/animation";
import { PROPORTION_CARDS } from "../content";

export default function ProportioningCards() {
  return (
    <section className="container-x py-10 lg:py-14">
      <Stagger
        className="grid gap-4 lg:grid-cols-2 lg:gap-2"
        step={150}
        delay={0}
      >
        {PROPORTION_CARDS.map((card) => (
          <div
            key={card.title}
            className="relative w-full overflow-hidden bg-[#E3E3E3] aspect-[650/1250]"
          >
            {/* Full image — contained, no crop */}
            <img
              src={card.image}
              alt={card.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-contain"
            />

            {/* Bottom gradient for text legibility */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/90 via-ink/50 to-transparent" />

            {/* Text overlay */}
            <div className="relative flex h-full flex-col justify-end p-6 text-cream lg:p-8 xl:p-10">
              <h3 className="font-sans text-3xl font-medium text-cream lg:text-4xl">
                {card.title}
              </h3>
              <p className="mt-4 max-w-lg font-sans text-base text-cream/95 lg:text-sm">
                {card.text}
              </p>
            </div>
          </div>
        ))}
      </Stagger>
    </section>
  );
}