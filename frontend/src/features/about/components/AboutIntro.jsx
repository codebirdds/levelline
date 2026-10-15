import SectionHeading from "../../../components/common/SectionHeading";
import { Reveal } from "../../../components/animation";

export default function AboutIntro() {
  return (
    <section className="px-5 pb-12 pt-12 sm:px-10 lg:px-[10%] lg:pb-20 lg:pt-16">
      <Reveal>
        <SectionHeading
          title="Timeless Craftsmanship Meets Modern Precision"
          className="mx-auto max-w-[719px] [&>h2]:tracking-wider"
        />
      </Reveal>

      <Reveal delay={150}>
        <p className="mx-auto mt-6 max-w-[840px] text-center font-sans text-sm leading-relaxed text-[#808080] lg:mt-8 lg:text-base">
          Levelline is a bespoke tailoring house dedicated to the art of personal
          tailoring and bespoke craftsmanship. We offer a completely personalized
          experience, creating garments impeccably crafted to your exact measurements,
          posture, and individual style. From private consultation to the final
          fitting—whether at our studio or in the comfort of your home—we guide you
          through selecting the world's finest fabrics and subtle design details,
          ensuring every piece embodies effortless sophistication.
        </p>
      </Reveal>
    </section>
  );
}