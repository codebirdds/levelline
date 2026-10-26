export default function ContactTable({ items, onView }) {
  if (!items.length) {
    return <p className="text-sm text-muted p-6 text-center">No contacts found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-border">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.id} className="border-b border-border last:border-0 hover:bg-hover">
              <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
              <td className="px-4 py-3">{c.email}</td>
              <td className="px-4 py-3">{c.phone}</td>
              <td className="px-4 py-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  c.status === "new" ? "bg-blue-50 text-blue-600"
                  : c.status === "contacted" ? "bg-amber-50 text-amber-600"
                  : "bg-emerald-50 text-emerald-600"
                }`}>
                  {c.status || "new"}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button 
                  onClick={() => onView(c)} 
                  className="text-xs font-semibold text-brand hover:underline"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
