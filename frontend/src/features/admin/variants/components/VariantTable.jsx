import { formatCurrency } from "../../../../utils/formatCurrency";

export default function VariantTable({ items, onEdit, onDelete, onFilterByProduct }) {
  if (!items.length) {
    return <p className="text-sm text-muted p-6 text-center">No variants yet.</p>;
  }

  const firstImage = (v) => {
    const arr = Array.isArray(v.images) ? v.images : [];
    return arr[0]?.url || arr[0] || null;
  };

  const minPrice = (v) => {
    const stocks = v.sizes || [];
    if (!stocks.length) return "—";
    return stocks.map((s) => Number(s.stock)).join(", ");
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-border">
            <th className="px-4 py-3">Image</th>
            <th className="px-4 py-3">Product</th>
            {/* ✅ Added Name Column */}
            <th className="px-4 py-3">Variant Name</th>
            <th className="px-4 py-3">Color</th>
            <th className="px-4 py-3">Sizes</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((v) => (
            <tr key={v.id} className="border-b border-border last:border-0 hover:bg-hover">
              <td className="px-4 py-3">
                {firstImage(v) ? (
                  <img src={firstImage(v)} alt={v.color} className="w-10 h-10 object-cover rounded border border-border" />
                ) : (
                  <div className="w-10 h-10 rounded border border-border bg-bg flex items-center justify-center text-xs text-muted">—</div>
                )}
              </td>
              <td className="px-4 py-3 font-medium text-ink">{v.product?.name || `#${v.product_id}`}</td>
              
              {/* ✅ Render Name & Description */}
              <td className="px-4 py-3">
                <p className="font-medium text-ink">{v.name || "—"}</p>
                {v.description && <p className="text-xs text-muted truncate max-w-[150px]">{v.description}</p>}
              </td>

              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {v.color_code && (
                    <span
                      className="size-4 rounded-full ring-1 ring-border"
                      style={{ backgroundColor: v.color_code }}
                    />
                  )}
                  <span className="text-ink">{v.color}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-muted">{(v.sizes || []).map((s) => s.size).join(", ")}</td>
              <td className="px-4 py-3 text-muted">{minPrice(v)}</td>
              <td className="px-4 py-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  v.status === "active" ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
                }`}>
                  {v.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button onClick={() => onEdit(v)} className="text-xs font-semibold text-brand hover:underline mr-3">Edit</button>
                <button onClick={() => onDelete(v)} className="text-xs font-semibold text-danger hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}