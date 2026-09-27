const CHIPS = [
  "Headphone type",
  "Price",
  "Review",
  "Color",
  "Material",
  "Offer",
];

export default function CategoryBar() {
  return (
    <div className="border-b border-border bg-surface">
      <div className="container-x h-[var(--chipbar-h)] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {CHIPS.map((c) => (
            <button
              key={c}
              className="shrink-0 px-3.5 py-1.5 text-xs font-medium rounded-full border border-border bg-surface text-ink hover:border-brand hover:text-brand transition"
            >
              {c}
            </button>
          ))}
        </div>

        <button className="shrink-0 flex items-center gap-2 text-xs font-semibold text-ink hover:text-brand">
          All Filters
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="4" y1="12" x2="14" y2="12"/>
            <line x1="4" y1="18" x2="10" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  );
}