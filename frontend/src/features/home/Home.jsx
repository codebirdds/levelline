import CraftedSection from "../about/components/CraftedSection";
import {
  HeroBanner, ChoosePath, BespokeIntro, HowItWorks, FabricBanner, Customization,
  ProportioningCards, ValueProps, DefiningFit, ThreeWaysToShop, Testimonials, SupportShowcase,
} from "./components";
import { TESTIMONIALS } from "./content";
import {SERVICES} from "../about/content";
export default function Home() {
  return (
    <main className="bg-[#f8f8f8]">
      <HeroBanner />
      <ChoosePath />
      <BespokeIntro />
      <HowItWorks />
      <FabricBanner />
      <Customization />
      <ProportioningCards />
      <ValueProps />
      <DefiningFit />
      <ThreeWaysToShop />
      <Testimonials items={TESTIMONIALS} />
      <CraftedSection services={SERVICES} />
    </main>
  );
}