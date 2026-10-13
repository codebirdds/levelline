import { Stagger } from "../../../components/animation";

/** Full-bleed photo strip. images = array of src strings. */
export default function StoreStrip({ images = [], className = "" }) {
  if (!images.length) return null;
  return (
    <section className={`overflow-hidden ${className}`}>
      <Stagger
        variant="fade"
        step={120}
        className="no-scrollbar flex snap-x gap-3 overflow-x-auto px-5 lg:-mx-[7.7%] lg:gap-[1.04vw] lg:overflow-visible lg:px-0"
      >
        {images.map((src, i) => (
          <div key={src + i} className="aspect-[577/376] w-[78%] shrink-0 snap-start overflow-hidden sm:w-[45%] lg:w-[26%]">
            <img src={src} alt="" loading="lazy" className="size-full object-cover" />
          </div>
        ))}
      </Stagger>
    </section>
  );
}
