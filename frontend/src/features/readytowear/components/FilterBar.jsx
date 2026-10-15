import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SORTS } from "../constants";
import {
  selectRtwCategory, selectRtwSort, setCategory, setSort,
} from "../readyToWearSlice";
import { listCategories } from "../../admin/categories/mediators";

export default function FilterBar() {
  const dispatch = useDispatch();
  const category = useSelector(selectRtwCategory);   // display name
  const sort = useSelector(selectRtwSort);
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    listCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Each tab carries both name (for display) and id (for API)
  const tabs = [
    { name: "ALL", id: null },
    ...categories.map((c) => ({ name: c.name, id: c.id })),
  ];

  return (
    <div className="border-b border-border">
      <div className="flex h-14 items-stretch gap-3 px-4 sm:px-8 lg:h-[46px] lg:gap-[84px] lg:px-[5.15%]">
        {/* Category tabs */}
        <div role="tablist" className="no-scrollbar flex min-w-0 flex-1 items-stretch overflow-x-auto">
          {tabs.map((t) => {
            const active = t.name === category;
            return (
              <button
                key={t.name}
                role="tab"
                aria-selected={active}
                onClick={() => dispatch(setCategory({ name: t.name, id: t.id }))}
                className={`relative flex shrink-0 items-center px-7 font-sans text-base transition-colors lg:text-sm ${
                  active ? "text-[#663f29]" : "text-[#808080] hover:text-[#663f29]"
                }`}
              >
                {t.name}
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