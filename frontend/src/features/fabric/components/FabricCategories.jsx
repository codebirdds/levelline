import { useDispatch, useSelector } from "react-redux";
import { Reveal } from "../../../components/animation";
import { FABRIC_CATEGORIES } from "../constants";
import { CATEGORY_IMAGES } from "../content";
import { selectFabricCategory, setCategory } from "../fabricSlice";

export default function FabricCategories() {
  const dispatch = useDispatch();
  const active = useSelector(selectFabricCategory);

  return (
    <section className="container-x py-12 lg:py-16">
      <Reveal>
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.25em] text-[#808080]">
          Explore by Category
        </p>
      </Reveal>

      <Reveal delay={100}>
        <h2 className="mt-2 font-sans text-2xl font-medium text-[#6b6b6b] lg:text-3xl">
          Choose Your Garment Type
        </h2>
      </Reveal>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-10 lg:grid-cols-7 lg:gap-4">
        {FABRIC_CATEGORIES.map((c, i) => {
          const isActive = c === active;
          return (
            <Reveal key={c} delay={i * 60}>
              <button
                onClick={() => dispatch(setCategory(c))}
                className={`group flex w-full flex-col items-center border bg-white p-3 transition lg:p-4 ${
                  isActive
                    ? "border-[#663f29]"
                    : "border-border hover:border-[#663f29]/50"
                }`}
              >
                <div className="aspect-square w-full overflow-hidden bg-[#F5F1E9]">
                  <img
                    src={CATEGORY_IMAGES[c]}
                    alt={c}
                    loading="lazy"
                    className="size-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span
                  className={`mt-3 font-sans text-sm ${
                    isActive ? "font-medium text-[#663f29]" : "text-[#414141]"
                  }`}
                >
                  {c}
                </span>
              </button>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}