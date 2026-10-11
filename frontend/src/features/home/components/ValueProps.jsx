import { VALUE_PROPS } from "../content";

export default function ValueProps() {
  return (
    <section className="container-x py-10">
      <div className="grid gap-10 text-center md:grid-cols-3 lg:gap-8">
        {VALUE_PROPS.map((v) => (
          <div key={v.title} className="mx-auto max-w-sm">
            <img src={v.icon} alt="" loading="lazy" className="mx-auto h-14 min-w-12 w-auto lg:h-16" />
            <h3 className="mt-6 font-sans text-lg font-medium text-[#6b6b6b] lg:text-md">
              {v.title}
            </h3>
            <p className="mt-3 font-sans text-sm leading-relaxed text-[#808080]">
              {v.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}