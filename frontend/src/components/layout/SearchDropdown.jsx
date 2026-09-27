import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { searchProductsThunk } from "../../features/products/productThunks";
import {
  selectSearchResults,
  selectSearchLoading,
  searchClear,
} from "../../features/products/productSlice";
import { useDebounce } from "../../hooks/useDebounce";
import ProductCard from "../../features/products/components/ProductCard";
import { ROUTES } from "../../routes/routePaths";

export default function SearchDropdown({ open, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const debouncedQ = useDebounce(query, 300);

  const results = useSelector(selectSearchResults);
  const loading = useSelector(selectSearchLoading);
  const inputRef = useRef(null);

  // Reset + autofocus when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setQuery("");
      dispatch(searchClear());
    }
  }, [open, dispatch]);

  // Debounced search
  useEffect(() => {
    if (debouncedQ.trim()) dispatch(searchProductsThunk(debouncedQ));
    else dispatch(searchClear());
  }, [debouncedQ, dispatch]);

  // Esc closes
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  // Submit → go to /search page
  const onSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(q)}`);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop — dims page behind, click closes */}
      <div
        className="fixed inset-0 top-[var(--header-h)] bg-ink/60 z-40"
        onClick={onClose}
      />

      {/* Panel — sits directly below header, full width */}
      <div
        className="fixed left-0 right-0 z-50 bg-cream border-b border-border shadow-xl"
        style={{ top: "var(--header-h)" }}
      >
        <div className="container-x py-6 md:py-8 max-h-[80vh] overflow-y-auto">

          {/* Input */}
          <form onSubmit={onSubmit} className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 h-12 px-4 bg-surface border border-border focus-within:border-gold transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.6"
                   strokeLinecap="round" className="text-muted shrink-0">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>

              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, categories, styles…"
                className="flex-1 bg-transparent outline-none text-sm text-ink placeholder:text-subtle"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(""); dispatch(searchClear()); }}
                  className="text-subtle hover:text-ink text-xs transition"
                >
                  ✕
                </button>
              )}
            </div>
          </form>

          {/* Results */}
          <div className="max-w-6xl mx-auto mt-8">

            {/* Empty state — nothing typed */}
            {!query.trim() && (
              <div className="text-center py-10">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted">
                  Start typing to search
                </p>
                <p className="text-sm text-subtle mt-3">
                  Try "suit", "blazer", "shirt"
                </p>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <p className="text-center text-sm text-muted py-10">Searching…</p>
            )}

            {/* No results */}
            {!loading && query.trim() && results.length === 0 && (
              <div className="text-center py-10">
                <p className="font-serif text-2xl text-ink">No results</p>
                <p className="text-sm text-muted mt-2">Nothing matched "{query}"</p>
              </div>
            )}

            {/* Results grid */}
            {!loading && results.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-5">
                  <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted">
                    {results.length} result{results.length !== 1 && "s"}
                  </p>
                  <button
                    onClick={onSubmit}
                    className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold hover:underline"
                  >
                    View all →
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {results.slice(0, 10).map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}