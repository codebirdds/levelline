import { useDispatch, useSelector } from "react-redux";
import { FABRIC_TABS } from "../constants";
import { selectFabricFilter, selectFilteredFabrics, setFilter } from "../fabricSlice";

export default function FabricFilterBar() {
  const dispatch = useDispatch();
  const filter = useSelector(selectFabricFilter);
  const fabrics = useSelector(selectFilteredFabrics);

  return (
    <div className="flex items-center justify-between border-b border-border pb-3">
      <div
        role="tablist"
        className="no-scrollbar flex items-center gap-7 overflow-x-auto"
      >
        {FABRIC_TABS.map((t) => {
          const active = t === filter;
          return (
            <button
              key={t}
              role="tab"
              aria-selected={active}
              onClick={() => dispatch(setFilter(t))}
              className={`relative shrink-0 pb-2 font-sans text-sm transition-colors ${
                active
                  ? "font-medium text-[#414141]"
                  : "text-[#808080] hover:text-[#663f29]"
              }`}
            >
              {t}
              <span
                className={`absolute -bottom-[13px] left-0 h-[2px] w-full bg-[#414141] transition-opacity duration-300 ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              />
            </button>
          );
        })}
      </div>

      <span className="hidden shrink-0 font-sans text-xs uppercase tracking-wide text-[#414141] sm:inline">
        All Shirt Fabrics ({fabrics.length})
      </span>
    </div>
  );
}