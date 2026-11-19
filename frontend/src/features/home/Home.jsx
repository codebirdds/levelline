import CraftedSection from "../about/components/CraftedSection";
import {
  HeroBanner, ChoosePath, BespokeIntro, HowItWorks, FabricBanner, Customization,
  ProportioningCards, ValueProps, DefiningFit, ThreeWaysToShop, Testimonials,
} from "./components";
import { TESTIMONIALS } from "./content";
import { SERVICES } from "../about/content";

export default function Home() {
  return (
    <main className="relative bg-[#f8f8f8]">
      {/* Hero wrapper — sticky, but occupies 100svh in document flow.
          This is the spacer AND the pin. No separate spacer needed. */}
      <div className="sticky top-0 z-0 h-[100svh] min-h-[560px]">
        <HeroBanner />
      </div>

      {/* Sheet — scrolls over hero. Opaque. No rounded, no shadow. */}
      <div className="relative z-10 bg-[#f8f8f8]">
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
      </div>
    </main>
  );
}