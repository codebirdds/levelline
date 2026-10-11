import SectionHeading from "../../../components/common/SectionHeading";
import PillButton from "../../../components/common/PillButton";
import ImageCard from "../../../components/ui/ImageCard";
import { SHOP_OPTIONS } from "../content";

export default function ThreeWaysToShop() {
  return (
    <section id="services" className="container-x py-10">
      <div className="grid gap-4 lg:grid-cols-[2fr_4fr] items-center">
        <SectionHeading
          align="left"
          title="Three Ways To Shop"
          subtitle="Uncompromising Elegance, Delivered On Your Terms"
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 ">
          {SHOP_OPTIONS.map((o) => (
            <ImageCard
              key={o.title}
              image={o.image}
              alt={o.title}
              className="aspect-[4/5]"
            >
              <h3 className="font-sans text-lg font-medium text-[#6b6b6b] lg:text-md">
                {o.title}
              </h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-[#808080]">
                {o.text}
              </p>
              <PillButton href={o.href} variant="light" size="sm" className="mt-5 self-start">
                {o.cta}
              </PillButton>
            </ImageCard>
          ))}
        </div>
      </div>
    </section>
  );
}