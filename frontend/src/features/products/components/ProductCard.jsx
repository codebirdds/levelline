import { formatCurrency } from "../../../utils/formatCurrency";

function Stars({ value = 0, count = 0 }) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <div className="flex gap-0.5 text-brand">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} width="12" height="12" viewBox="0 0 24 24"
            fill={i < Math.round(value) ? "currentColor" : "none"}
            stroke="currentColor" strokeWidth="1.5">
            <polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9" />
          </svg>
        ))}
      </div>
      <span className="text-muted">({count})</span>
    </div>
  );
}

export default function ProductCard({ product }) {
  const mrp = Math.round(product.price * 1.4);

  return (
    <div className="group bg-surface border border-border rounded-lg overflow-hidden hover:shadow-md transition flex flex-col">
      {/* Image container — fixed height + aspect, hides overflow */}
      <div className="relative bg-bg h-48 w-full overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
        <button
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-surface border border-border grid place-items-center text-muted hover:text-danger hover:border-danger transition z-10"
          aria-label="Wishlist"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8Z" />
          </svg>
        </button>
      </div>

      {/* Details — flex-1 so all cards align */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <h3 className="text-sm font-medium text-ink line-clamp-2 min-h-[2.5rem]">
          {product.title}
        </h3>

        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-ink">{formatCurrency(product.price)}</span>
          <span className="text-xs text-subtle line-through">{formatCurrency(mrp)}</span>
        </div>

        <Stars value={4.5} count={120} />

        <button className="w-full mt-auto border border-border rounded-md py-2 text-xs font-semibold text-ink hover:bg-brand hover:text-white hover:border-brand transition">
          Add to Cart
        </button>
      </div>
    </div>
  );
}