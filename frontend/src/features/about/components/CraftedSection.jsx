import SectionHeading from "../../../components/common/SectionHeading";
import ArrowLink from "../../../components/ui/ArrowLink";
import { Reveal, ImageReveal } from "../../../components/animation";
import { TYPE } from "../../../components/common/typography";
import ServicesGrid from "./ServicesGrid";

export default function CraftedSection({ services = [] }) {
  return (
    <section className="px-5 pb-16 pt-16 sm:px-10 lg:px-[2%] lg:pb-[111px] lg:pt-[110px]">
      <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] xl:grid-cols-[400fr_384fr_950fr] xl:items-center xl:gap-x-[55px]">
        <ImageReveal className="aspect-[400/505] bg-cream-2">
          <img src="/images/about/crafted.jpg" alt="" loading="lazy" className="size-full object-cover" />
        </ImageReveal>

        <div>
          <Reveal>
            <SectionHeading align="left" title={<>Crafted with Precision, <br className="hidden xl:block" />Designed for You</>} />
          </Reveal>
          <Reveal delay={120}>
            <p className={`max-w-[384px] ${TYPE.p}`}>
              Every detail matters. From the finest fabrics to the final stitch, our services are
              designed to give you a truly personal experience.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <ArrowLink href="/#services" className="mt-8 uppercase lg:mt-12">Explore the services</ArrowLink>
          </Reveal>
        </div>

        <ServicesGrid items={services} className="md:col-span-2 xl:col-span-1" />
      </div>
    </section>
  );
}
