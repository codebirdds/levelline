import { useDispatch, useSelector } from "react-redux";
import { selectFabricSelectedId, setSelected } from "../fabricSlice";

const ArrowCircleIcon = () => (
  <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-[#414141] text-[#414141]">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  </span>
);

export default function FabricCard({ fabric }) {
  const dispatch = useDispatch();
  const selectedId = useSelector(selectFabricSelectedId);
  const isActive = selectedId === fabric.id;

  return (
    <button
      onClick={() => dispatch(setSelected(fabric.id))}
      className="group block w-full text-left"
    >
      <div className="relative aspect-square overflow-hidden bg-[#F5F1E9]">
        <img
          src={fabric.image}
          alt={fabric.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="pointer-events-none absolute left-3 top-3 font-sans text-[10px] uppercase tracking-wider text-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Click to explore
        </span>
        {isActive && (
          <span className="pointer-events-none absolute inset-0 ring-1 ring-[#663f29]" />
        )}
      </div>
      <div
        className={`mt-2 flex items-center justify-between border px-3 py-2 transition ${
          isActive
            ? "border-[#663f29] bg-[#F5F1E9]"
            : "border-border bg-white group-hover:border-[#663f29]/50"
        }`}
      >
        <span className="truncate font-sans text-sm text-[#414141]">
          {fabric.name}
        </span>
        <ArrowCircleIcon />
      </div>
    </button>
  );
}