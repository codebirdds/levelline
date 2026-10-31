import PillButton from "../../../components/common/PillButton";
import { Reveal } from "../../../components/animation";
import fabric from "../Assets/fabric.png";

export default function FabricBanner() {
  return (
    <section
      id="fabrics"
      className="relative isolate my-10 flex h-screen items-center justify-center overflow-hidden bg-ink"
    >
      {/* Background image */}
      <img
        src={fabric}
        alt=""
        loading="lazy"
        className="absolute inset-0 -z-10 size-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-ink/20" />

      {/* Content */}
      <div className="container-x flex flex-col items-center text-center text-cream">
        <Reveal variant="fade">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.25em] text-cream/80 lg:text-xs">
            The Foundation of Exceptional Tailoring
          </p>
        </Reveal>

        <Reveal delay={150}>
          <h2 className="mt-4 max-w-4xl font-sans text-3xl font-medium uppercase leading-snug text-cream lg:text-4xl">
            Curated from the world's finest fabrics
          </h2>
        </Reveal>

        <Reveal delay={300}>
          <p className="mt-6 max-w-3xl font-sans text-sm leading-relaxed text-cream/85 lg:mt-8 lg:text-base">
            Woven with precision by legendary Italian and global houses, our
            hand-selected wools, cashmeres, and silks offer an extraordinary drape
            and effortless comfort.
          </p>
        </Reveal>

        <Reveal delay={450}>
          <PillButton href="#fabrics" variant="light" className="mt-8 lg:mt-12">
            Explore Fabrics
          </PillButton>
        </Reveal>
      </div>
    </section>
  );
}