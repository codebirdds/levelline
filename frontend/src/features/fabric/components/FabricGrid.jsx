import { useSelector } from "react-redux";
import { Reveal } from "../../../components/animation";
import { selectFilteredFabrics, selectFabricLoading } from "../fabricSlice";
import FabricFilterBar from "./FabricFilterBar";
import FabricCard from "./FabricCard";
import FabricDetails from "./FabricDetails";

export default function FabricGrid() {
  const fabrics = useSelector(selectFilteredFabrics);
  const loading = useSelector(selectFabricLoading);

  return (
    <section className="container-x pb-16 lg:pb-20">
      <Reveal>
        <FabricFilterBar />
      </Reveal>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_400px]">
        {/* Left — swatch grid */}
        <div>
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <div className="h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
              <p className="text-sm text-[#808080]">Loading fabrics…</p>
            </div>
          ) : fabrics.length === 0 ? (
            <p className="py-16 text-center font-sans text-sm text-[#808080]">
              No fabrics in this category yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:gap-5">
              {fabrics.map((f, i) => (
                <Reveal key={f.id} delay={i * 40}>
                  <FabricCard fabric={f} />
                </Reveal>
              ))}
            </div>
          )}
        </div>

        {/* Right — details card, sticky on desktop */}
        <div className="lg:sticky lg:top-[80px] lg:self-start">
          <Reveal delay={200}>
            <FabricDetails />
          </Reveal>
        </div>
      </div>
    </section>
  );
}