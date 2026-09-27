import { Link } from "react-router-dom";

const VIDEO_SRC  = "/videos/hero.mp4";
const POSTER_SRC = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1920&q=80";

export default function HeroBanner() {
  return (
    <section className="relative w-full h-[100vh] bg-ink overflow-hidden">

      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay muted loop playsInline preload="auto"
        poster={POSTER_SRC}
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* Fallback image */}
      <img
        src={POSTER_SRC}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover -z-[1]"
      />

      {/* Overlays — light, edges only */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/35 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink/60 to-transparent" />

      {/* Content */}
      <div className="relative h-full min-h-[92vh] md:min-h-[720px] lg:min-h-[780px] container-x flex items-center">
        <div className="max-w-xl pt-20">

          {/* Heading */}
          <h1 className="font-serif text-cream font-medium leading-[1.02] text-[2.25rem] sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.5rem]">
            The Art of
            <br />
            <span className="font-normal">Bespoke</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-cream/85 mt-5">
            Timeless Craftsmanship · Modern Elegance
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to="/products"
              className="inline-flex items-center justify-center h-11 px-7 bg-cream text-ink text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-gold transition-colors duration-300"
            >
              Explore Collection
            </Link>
            <Link
              to="/customize"
              className="inline-flex items-center justify-center h-11 px-7 border border-cream/55 text-cream text-[11px] font-semibold tracking-[0.2em] uppercase hover:border-gold hover:text-gold transition-colors duration-300"
            >
              Customization Coming Soon
            </Link>
          </div>
        </div>
      </div>

      {/* Floating card — desktop only */}
      <div className="hidden lg:block absolute right-8 xl:right-14 bottom-14 xl:bottom-16 w-[280px] xl:w-[300px]">
        <div className="bg-ink-2/85 backdrop-blur-md border border-gold/35 p-6">

          <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-gold">
            Bespoke Customization
          </p>

          <h3 className="font-serif text-cream text-2xl mt-2 leading-tight">
            Coming Soon
          </h3>

          <p className="text-cream/65 text-xs mt-2 leading-relaxed">
            Create your own garment.
          </p>

          <div className="h-px bg-gold/35 my-5" />

          <Link
            to="/customize"
            className="flex items-center justify-center h-10 w-full border border-gold text-gold text-[10px] font-semibold tracking-[0.26em] uppercase hover:bg-gold hover:text-ink transition-colors duration-300"
          >
            Explore Bespoke
          </Link>
        </div>
      </div>
    </section>
  );
}