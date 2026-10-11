import { Reveal, ImageReveal } from "../../../components/animation";
import ArrowLink from "../../../components/ui/ArrowLink";
import { PERSONALISE } from "../content";

export default function PersonaliseBanner() {
  return (
    <section className="mt-10 px-4  lg:px-[7.6%] ">
      <Reveal
        variant="up"
        distance={40}
        className="grid overflow-hidden bg-panel shadow-md lg:min-h-[230px] lg:grid-cols-2"
      >
        <ImageReveal className="relative aspect-[16/10] lg:aspect-auto">
          <img
            src={PERSONALISE.image}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
          />
        </ImageReveal>

        <div className="flex flex-col justify-center p-6 sm:p-8 lg:py-10 lg:pl-14 lg:pr-10 bg-[#edeae4]">
          <h2 className="font-sans text-lg font-medium text-[#6b6b6b] lg:text-md">
            {PERSONALISE.title}
          </h2>
          <p className="mt-3 max-w-[520px] font-sans text-sm leading-relaxed text-[#808080]">
            {PERSONALISE.text}
          </p>
          <ArrowLink href={PERSONALISE.href} className="mt-5 self-start uppercase lg:mt-6">
            {PERSONALISE.cta}
          </ArrowLink>
        </div>
      </Reveal>
    </section>
  );
}