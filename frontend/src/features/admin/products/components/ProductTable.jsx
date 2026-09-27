import { formatCurrency } from "../../../../utils/formatCurrency";

export default function ProductTable({ items, onEdit, onDelete }) {
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
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="border-b border-border last:border-0 hover:bg-hover">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img src={p.image} alt={p.title} className="w-10 h-10 object-contain rounded bg-bg p-1" />
                  <span className="font-medium text-ink line-clamp-1 max-w-[260px]">{p.title}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-muted capitalize">{p.category}</td>
              <td className="px-4 py-3 font-medium text-ink">{formatCurrency(p.price)}</td>
              <td className="px-4 py-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  p.stock > 10 ? "bg-brand-soft text-brand"
                  : p.stock > 0 ? "bg-amber-50 text-amber-600"
                  : "bg-red-50 text-danger"
                }`}>
                  {p.stock} in stock
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button onClick={() => onEdit(p)} className="text-xs font-semibold text-brand hover:underline mr-3">Edit</button>
                <button onClick={() => onDelete(p)} className="text-xs font-semibold text-danger hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}