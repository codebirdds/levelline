import ArrowLink from "../../../components/ui/ArrowLink";
import { FIT } from "../content";

export default function DefiningFit() {
  return (
    <section className="container-x py-10">
      <div className="grid items-center gap-8 lg:grid-cols-[1.45fr_1fr] lg:gap-14">
        <div className="aspect-[1173/616] overflow-hidden rounded-sm">
          <video
            src={FIT.video}
            className="size-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>
        <div>
          <h2 className="font-sans text-lg font-medium text-[#6b6b6b] lg:text-md">
            {FIT.title}
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-[#808080]">
            {FIT.text}
          </p>
          <ArrowLink href={FIT.href} className="mt-8 uppercase">
            {FIT.cta}
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}