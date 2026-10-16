import { HERO } from "../content";

export default function HeroBanner() {
  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink">
      {HERO.video ? (
        <video
          className="absolute inset-0 size-full object-cover"
          src={HERO.video}
          poster={HERO.image}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <img src={HERO.image} alt="" className="absolute inset-0 size-full object-cover" />
      )}
  <div className="absolute inset-0 bg-black/55"></div>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#020202] to-transparent" />

      <div className="relative z-10 flex h-full flex-col items-center justify-end px-5 pb-6 text-center lg:pb-10">
        <h1 className="font-serif text-3xl uppercase leading-[0.95] tracking-tight text-cream/95 lg:text-4xl">
          The <br /> Art of Style
        </h1>
        <p className="mt-2 max-w-xl font-serif text-base text-cream/85 lg:mt-3 lg:text-sm">
          {HERO.tagline}
        </p>
      </div>
    </section>
  );
}
