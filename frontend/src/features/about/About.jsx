import PageHero from "../../components/common/PageHero";
import SectionHeading from "../../components/common/SectionHeading";
import { Reveal } from "../../components/animation";
import { TYPE } from "../../components/common/typography";
import ThreeWaysToShop from "../home/components/ThreeWaysToShop";
import AboutIntro from "./components/AboutIntro";
import SplitSection from "./components/SplitSection";
import StoreStrip from "./components/StoreStrip";
import CraftedSection from "./components/CraftedSection";
// You create ./content.js:
//   STORE_IMAGES = ["/images/about/store-1.jpg", ...]            (4 photos)
//   SERVICES     = [{ title, text, icon: "/images/about/icon-1.png" }, ...]   (8 items)
import { STORE_IMAGES, SERVICES } from "./content";

export default function About() {
  return (
    <main className="bg-page">
      <PageHero
        image="/images/about/hero.jpg"
        eyebrow="The art of bespoke"
        title="About Us"
        text="Crafting refined garments tailored to your individuality, where timeless elegance meets modern sophistication."
        textWidth="max-w-[978px]"
        contentClassName="px-5 pb-10 sm:px-10 lg:px-[10.4%] lg:pb-[63px]"
      />

      <AboutIntro />

      <SplitSection
        image="/images/about/redefining.jpg"
        aspect="aspect-[698/715]"
        className="lg:grid-cols-[840fr_698fr] lg:gap-x-[6%] lg:px-[6.5%]"
      >
        <SectionHeading title="Redefining the Art of Bespoke" className="[&>h2]:tracking-wider" />
        <p className={`mx-auto max-w-[840px] text-center lg:mt-8 ${TYPE.p}`}>
          At Levelline, true elegance is never mass-produced. It begins with an uncompromising
          devotion to detail—where fine craftsmanship meets modern sophistication. We don't just
          stitch garments; we engineer a seamless extension of your personal style using the
          world’s finest fabrics and time-honored sartorial techniques.
        </p>
      </SplitSection>

      <SplitSection
        imageFirst
        image="/images/about/levelline-way.jpg"
        aspect="aspect-[868/605]"
        className="mt-14 lg:mt-[200px] lg:grid-cols-[868fr_812fr] lg:gap-x-[4.5%] lg:pl-[4.3%] lg:pr-[3.6%]"
      >
        <p className={TYPE.label}>The Levelline way</p>
        <Reveal className="mt-3">
          <SectionHeading align="left" title={<>More than just <br />a suit.</>} className="[&>h2]:uppercase" />
        </Reveal>
        <p className={`lg:mt-6 ${TYPE.p}`}>
          A bespoke suit is more than just clothing—it’s a reflection of who you are, your
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
