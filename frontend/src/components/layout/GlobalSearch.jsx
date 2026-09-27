import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchProductsThunk } from "../../features/products/productThunks";
import {
  selectSearchResults,
  selectSearchLoading,
  searchClear,
} from "../../features/products/productSlice";
import { useDebounce } from "../../hooks/useDebounce";
import ProductCard from "../../features/products/components/ProductCard";

export default function GlobalSearch() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [open, setOpen]   = useState(false);
  const debouncedQ = useDebounce(query, 300);

  const results = useSelector(selectSearchResults);
  const loading = useSelector(selectSearchLoading);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (debouncedQ.trim()) dispatch(searchProductsThunk(debouncedQ));
    else dispatch(searchClear());
  }, [debouncedQ, dispatch]);

  useEffect(() => {
    const onClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const showDropdown = open && query.trim().length > 0;

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="flex items-center gap-2 h-10 px-3 border border-gold/35 rounded-sm focus-within:border-gold transition">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
             className="text-cream/50">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search"
          className="flex-1 bg-transparent outline-none text-xs text-cream placeholder:text-cream/40 tracking-wide"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); dispatch(searchClear()); }}
            className="text-cream/50 hover:text-cream text-xs transition"
          >
            ✕
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-cream rounded-sm shadow-lg border border-border max-h-[70vh] overflow-y-auto z-50">
          {loading && <p className="p-4 text-sm text-muted">Searching…</p>}
          {!loading && results.length === 0 && (
            <p className="p-4 text-sm text-muted">No results for "{query}"</p>
          )}
          {!loading && results.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4">
              {results.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}