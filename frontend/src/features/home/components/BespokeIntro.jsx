import PillButton from "../../../components/common/PillButton";

export default function BespokeIntro() {
  return (
    <section id="about" className="container-x py-10 text-center">
      <h2 className="font-sans font-medium text-3xl lg:text-4xl text-[#6b6b6b]">
        What does bespoke mean at Levelline?
      </h2>

      <p className="mx-auto mt-4 max-w-5xl font-sans text-base lg:text-sm text-[#808080]">
        At Levelline, true bespoke tailoring is an intimate art form crafted around your unique
        identity—moving far beyond standard sizing. From selecting rare, world-class fabrics to
        defining custom lapels, hand-finished linings, and precise multi-stage fittings, every
        creation is engineered for effortless comfort, intentional design, and timeless
        sophistication.
      </p>

      <PillButton className="mt-8 !text-#6b6b6b" size="sm" >
        Learn More
      </PillButton>
    </section>
  );
}