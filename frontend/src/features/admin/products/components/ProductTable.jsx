import { formatCurrency } from "../../../../utils/formatCurrency";

export default function ProductTable({ items, onEdit, onDelete }) {
  if (!items.length) {
    return <p className="text-sm text-muted p-6 text-center">No products yet.</p>;
  }

  const firstVariant = (p) => {
    const v = p?.variants?.[0];
    return v || null;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-border">
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => {
            const v = firstVariant(p);
            return (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-hover">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                   
                    <span className="font-medium text-ink line-clamp-1 max-w-[260px]">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted capitalize">{p.category?.name || "—"}</td>
                <td className="px-4 py-3 font-medium text-ink">{formatCurrency(Number(p.price))}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    p.status === "active" ? "bg-emerald-50 text-emerald-600"
                    : p.status === "draft" ? "bg-amber-50 text-amber-600"
                    : "bg-red-50 text-red-600"
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => onEdit(p)} className="text-xs font-semibold text-brand hover:underline mr-3">Edit</button>
                  <button onClick={() => onDelete(p)} className="text-xs font-semibold text-danger hover:underline">Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}