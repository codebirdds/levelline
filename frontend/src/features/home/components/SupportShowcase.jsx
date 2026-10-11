import { SUPPORT_IMAGES } from "../content";

export default function SupportShowcase() {
  return (
    <section className="flex items-end gap-4 pt-6 lg:gap-14 lg:pt-12">
      <div className="hidden aspect-[453/1022] w-[24%] shrink-0 overflow-hidden rounded-tl-[50rem] bg-cream-2 lg:block">
        <img src={SUPPORT_IMAGES.arch} alt="" loading="lazy" className="size-full object-cover" />
      </div>
      <div className="aspect-[1379/715] w-full overflow-hidden bg-cream-2 lg:w-auto lg:flex-1">
        <img src={SUPPORT_IMAGES.wide} alt="" loading="lazy" className="size-full object-cover" />
      </div>
    </section>
  );
}
