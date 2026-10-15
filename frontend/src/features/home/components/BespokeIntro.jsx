import SectionHeading from "../../../components/common/SectionHeading";
import PillButton from "../../../components/common/PillButton";
import { Reveal } from "../../../components/animation";

export default function BespokeIntro() {
  return (
    <section id="about" className="container-x py-10 text-center lg:py-14">
      <Reveal>
        <SectionHeading
          title="What does bespoke mean at Levelline?"
          className="mx-auto max-w-4xl"
        />
      </Reveal>

      <Reveal delay={150}>
        <p className="mx-auto mt-4 max-w-5xl font-sans text-base leading-relaxed text-[#808080] lg:text-sm">
          At Levelline, true bespoke tailoring is an intimate art form crafted around your unique
          identity—moving far beyond standard sizing. From selecting rare, world-class fabrics to
          defining custom lapels, hand-finished linings, and precise multi-stage fittings, every
          creation is engineered for effortless comfort, intentional design, and timeless
          sophistication.
        </p>
      </Reveal>

      <Reveal delay={280}>
        <PillButton className="mt-8" size="sm">
          Learn More
        </PillButton>
      </Reveal>
    </section>
  );
}