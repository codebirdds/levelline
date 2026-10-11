import { useSelector } from "react-redux";
import { selectSelectedFabric } from "../fabricSlice";
import { FABRIC_FEATURES } from "../constants";

const FeatureIcon = ({ kind }) => {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  if (kind === "premium")
    return (
      <svg {...common}>
        <path d="M4 4h16l-2 8-6 8-6-8z" />
        <path d="M4 4l8 8 8-8M12 12v8" />
      </svg>
    );
  if (kind === "soft")
    return (
      <svg {...common}>
        <path d="M3 8c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2M3 14c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2" />
      </svg>
    );
  if (kind === "durable")
    return (
      <svg {...common}>
        <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M12 3l2.2 4.5 5 .7-3.6 3.5.8 5-4.4-2.3-4.4 2.3.8-5-3.6-3.5 5-.7z" />
    </svg>
  );
};

const PencilIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
  </svg>
);

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2z" />
  </svg>
);

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export default function FabricDetails() {
  const fabric = useSelector(selectSelectedFabric);
  if (!fabric) return null;

  return (
    <div className="border border-border bg-[#F5F1E9]">
      {/* Fabric image */}
      <div className="aspect-[5/4] overflow-hidden">
        <img
          src={fabric.image}
          alt={fabric.name}
          className="size-full object-cover"
        />
      </div>

      <div className="p-5 lg:p-6">
        <h3 className="font-sans text-lg font-medium text-[#414141] lg:text-xl">
          {fabric.name}
        </h3>

        <p className="mt-3 font-sans text-sm leading-relaxed text-[#808080]">
          {fabric.desc}
        </p>

        {/* Feature row */}
        <div className="mt-6 grid grid-cols-4 gap-2 border-y border-border py-4">
          {fabric.features.slice(0, 4).map((k) => (
            <div key={k} className="flex flex-col items-center text-center">
              <span className="text-[#414141]">
                <FeatureIcon kind={k} />
              </span>
              <span className="mt-2 font-sans text-[10px] leading-tight text-[#414141]">
                {FABRIC_FEATURES[k].label}
              </span>
            </div>
          ))}
        </div>

        {/* Proceed label */}
        <p className="mt-6 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#808080]">
          Choose how you'd like to proceed
        </p>

        {/* Actions */}
        <button className="mt-3 flex h-12 w-full items-center justify-between bg-ink px-4 font-sans text-sm font-medium text-cream transition hover:bg-[#663f29]">
          <span className="inline-flex items-center gap-2">
            <PencilIcon /> Customise This Fabric
          </span>
          <ArrowRight />
        </button>

        <button className="mt-2 flex h-12 w-full items-center justify-between border border-[#414141] bg-transparent px-4 font-sans text-sm font-medium text-[#414141] transition hover:bg-ink hover:text-cream">
          <span className="inline-flex items-center gap-2">
            <HomeIcon /> Get Home Consultation
          </span>
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}