import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SORTS } from "../constants";
import { selectRtwCategory, selectRtwSort, setCategory, setSort } from "../readyToWearSlice";
import { listCategories } from "../../admin/categories/mediators";

export default function FilterBar() {
  const dispatch = useDispatch();
  const category = useSelector(selectRtwCategory);
  const sort = useSelector(selectRtwSort);
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    listCategories().then((data) => setCategories(Array.isArray(data) ? data : [])).catch(() => {});
  }, []);

  const tabs = ["ALL", ...categories.map((c) => c.name)];

  return (
    <div className="border-b border-border">
      <div className="flex h-14 items-stretch gap-3 px-4 sm:px-8 lg:h-[46px] lg:gap-[84px] lg:px-[5.15%]">
        {/* Filters / sort */}
        <div className="relative shrink-0 self-center lg:self-start">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="flex h-9 items-center gap-3 w-[140px] rounded-sm border-[1.5px]  border-[#dadada] px-4 font-sans text-base font-medium text-[#6b6b6b] transition hover:border-[#663f29] hover:text-[#663f29] lg:h-[40px] lg:text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M1.5 2.5h13L9.5 8.6V13l-3 1.5V8.6z" />
            </svg>
            Filters
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
              <ul className="absolute left-0 top-full z-40 mt-2 w-56 rounded-sm border border-border bg-surface py-2 shadow-md">
                {SORTS.map((s) => (
                  <li key={s.value}>
                    <button
                      onClick={() => { dispatch(setSort(s.value)); setOpen(false); }}
                      className={`w-full px-4 py-2.5 text-left font-sans text-base transition hover:bg-cream-2 lg:text-sm ${
                        sort === s.value ? "font-semibold text-[#663f29]" : "text-[#808080]"
                      }`}
                    >
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Category tabs */}
        <div role="tablist" className="no-scrollbar flex min-w-0 flex-1 items-stretch overflow-x-auto">
          {tabs.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                role="tab"
                aria-selected={active}
                onClick={() => dispatch(setCategory(c))}
                className={`relative flex shrink-0 items-center px-7 font-sans text-base transition-colors lg:text-sm ${
                  active ? "text-[#663f29]" : "text-[#808080] hover:text-[#663f29]"
                }`}
              >
                {c}
                <span
                  className={`absolute -bottom-px left-1/2 h-[3px] w-8 -translate-x-1/2 bg-[#663f29] transition-opacity duration-300 lg:w-[50px] ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}