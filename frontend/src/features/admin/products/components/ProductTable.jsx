import { formatCurrency } from "../../../../utils/formatCurrency";

export default function ProductTable({ items, onEdit, onDelete, onManageVariants }) {
  if (!items.length) {
    return <p className="text-sm text-muted p-6 text-center">No products yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-border">
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Variants</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => {
            const variants = p.variants || [];
            const totalStock = variants.reduce(
              (sum, v) =>
                sum + (v.sizes || []).reduce((s, sz) => s + (sz.stock || 0), 0),
              0
            );
            const colors = variants.map((v) => v.color).filter(Boolean);
            const primaryImg =
              variants[0]?.images?.find((i) => i.is_primary)?.url ||
              variants[0]?.images?.[0]?.url ||
              null;
            const price = Number(p.discount_price) || Number(p.price) || 0;
            const mrp   = Number(p.price) || 0;

            return (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-hover">
                {/* Product */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {primaryImg ? (
                      <img
                        src={primaryImg}
                        alt={p.name}
                        className="w-10 h-10 object-contain rounded bg-bg p-1"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-bg" />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-ink line-clamp-1 max-w-[260px]">{p.name}</p>
                      {p.brand && <p className="text-xs text-muted">{p.brand}</p>}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-4 py-3 text-muted capitalize">{p.category?.name || "—"}</td>

                {/* Price */}
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-ink">{formatCurrency(price)}</span>
                    {mrp > price && (
                      <span className="text-xs text-subtle line-through">{formatCurrency(mrp)}</span>
                    )}
                  </div>
                </td>

                {/* Variants */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => onManageVariants(p)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
                  >
                    {variants.length} variant{variants.length !== 1 && "s"}
                    {colors.length > 0 && (
                      <span className="text-muted font-normal">({colors.join(", ")})</span>
                    )}
                  </button>
                </td>

                {/* Stock */}
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      totalStock > 10
                        ? "bg-brand-soft text-brand"
                        : totalStock > 0
                        ? "bg-amber-50 text-amber-600"
                        : "bg-red-50 text-danger"
                    }`}
                  >
                    {totalStock} in stock
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => onEdit(p)}
                    className="text-xs font-semibold text-brand hover:underline mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onManageVariants(p)}
                    className="text-xs font-semibold text-ink hover:underline mr-3"
                  >
                    View Variants
                  </button>
                  <button
                    onClick={() => onDelete(p)}
                    className="text-xs font-semibold text-danger hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}