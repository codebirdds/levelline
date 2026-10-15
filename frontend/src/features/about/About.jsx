import SectionHeading from "../../components/common/SectionHeading";
import { Reveal } from "../../components/animation";
import ThreeWaysToShop from "../home/components/ThreeWaysToShop";
import AboutIntro from "./components/AboutIntro";
import SplitSection from "./components/SplitSection";
import StoreStrip from "./components/StoreStrip";
import CraftedSection from "./components/CraftedSection";
import AboutHero from "./components/AboutHero";
import {
  ABOUT_HERO,
  ABOUT_SPLIT_IMAGES,
  STORE_IMAGES,
  SERVICES,
} from "./content";

export default function About() {
  return (
    <main className="bg-[#f8f8f8]">
      <AboutHero {...ABOUT_HERO} />

      <AboutIntro />

      <SplitSection
        image={ABOUT_SPLIT_IMAGES.redefining}
        aspect="aspect-[698/715]"
        className="lg:grid-cols-[840fr_698fr] lg:gap-x-[6%] lg:px-[6.5%]"
      >
        <SectionHeading title="Redefining the Art of Bespoke" className="[&>h2]:tracking-wider" />
        <p className="mx-auto max-w-[840px] text-center lg:mt-8">
          At Levelline, true elegance is never mass-produced. It begins with an uncompromising
          devotion to detail—where fine craftsmanship meets modern sophistication. We don't just
          stitch garments; we engineer a seamless extension of your personal style using the
          world's finest fabrics and time-honored sartorial techniques.
        </p>
      </SplitSection>

      <SplitSection
        imageFirst
        image={ABOUT_SPLIT_IMAGES.levellineWay}
        aspect="aspect-[868/605]"
        className="mt-14 lg:mt-[200px] lg:grid-cols-[868fr_812fr] lg:gap-x-[4.5%] lg:pl-[4.3%] lg:pr-[3.6%]"
      >
        <p className="text-xs uppercase tracking-[0.18em] text-[#808080]">
          The Levelline way
        </p>
        <Reveal className="mt-3">
          <SectionHeading
            align="left"
            title={<>More than just <br />a suit.</>}
            className="[&>h2]:uppercase"
          />
        </Reveal>
        <p className="lg:mt-6">
          A bespoke suit is more than just clothing—it's a reflection of who you are, your
          confidence, and your individuality. From the initial selection of world-class fabrics to
          the final fitting, every line, stitch, and detail is crafted with unyielding precision
          and care, creating a garment designed exclusively for you.
        </p>
      </SplitSection>

      <StoreStrip images={STORE_IMAGES} className="mt-14 lg:mt-[227px]" />

      <div className="lg:mt-[100px]">
        <ThreeWaysToShop />
      </div>

      <CraftedSection services={SERVICES} />
    </main>
  );
}