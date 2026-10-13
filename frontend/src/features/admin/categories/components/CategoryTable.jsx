export default function CategoryTable({ items, onEdit, onDelete }) {
  if (!items.length) {
    return <p className="text-sm text-muted p-6 text-center">No categories yet.</p>;
  }

  const img = (c) => {
    const arr = Array.isArray(c.images) ? c.images : c.images ? [c.images] : [];
    return arr[0] || null;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-border">
            <th className="px-4 py-3">Image</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.id} className="border-b border-border last:border-0 hover:bg-hover">
              <td className="px-4 py-3">
                {img(c) ? (
                  <img src={img(c)} alt={c.name} className="w-10 h-10 object-cover rounded border border-border" />
                ) : (
                  <div className="w-10 h-10 rounded border border-border bg-bg flex items-center justify-center text-xs text-muted">—</div>
                )}
              </td>
              <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
              <td className="px-4 py-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  c.status === "active" ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
                }`}>
                  {c.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button onClick={() => onEdit(c)} className="text-xs font-semibold text-brand hover:underline mr-3">Edit</button>
                <button onClick={() => onDelete(c)} className="text-xs font-semibold text-danger hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}