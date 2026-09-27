export default function CategoryTable({ items, onEdit, onDelete }) {
  if (!items.length) {
    return <p className="text-sm text-muted p-6 text-center">No categories yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-border">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Slug</th>
            <th className="px-4 py-3">Products</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.id} className="border-b border-border last:border-0 hover:bg-hover">
              <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
              <td className="px-4 py-3 text-muted font-mono text-xs">{c.slug}</td>
              <td className="px-4 py-3">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-brand-soft text-brand">
                  {c.count}
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