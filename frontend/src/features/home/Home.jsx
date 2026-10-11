import {
  HeroBanner, ChoosePath, BespokeIntro, HowItWorks, FabricBanner, Customization,
  ProportioningCards, ValueProps, DefiningFit, ThreeWaysToShop, Testimonials, SupportShowcase,
} from "./components";

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
      <Testimonials />
      <SupportShowcase />
    </main>
  );
}
