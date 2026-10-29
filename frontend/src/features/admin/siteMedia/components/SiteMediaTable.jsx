export default function SiteMediaTable({ items, onEdit, onDelete }) {
  if (!items.length) return <p className="text-sm text-muted p-6 text-center">No media sections yet.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-border">
            <th className="px-4 py-3">Section Name</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Media Preview</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-border last:border-0 hover:bg-hover">
              <td className="px-4 py-3 font-medium text-ink">{item.display_name}</td>
              <td className="px-4 py-3 uppercase text-xs font-semibold text-brand">{item.media_type}</td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                   <div className="text-center">
                     <span className="block text-[9px] text-muted mb-1">PC</span>
                     {item.desktop_url ? (
                       item.media_type === 'video' 
                         ? <span className="text-[10px] bg-gray-100 px-2 py-1 rounded">Video</span>
                         : <img src={item.desktop_url} className="w-12 h-8 object-cover rounded border" />
                     ) : <span className="text-[10px] text-gray-400">None</span>}
                   </div>
                   <div className="text-center">
                     <span className="block text-[9px] text-muted mb-1">Mobile</span>
                     {item.mobile_url ? (
                       item.media_type === 'video' 
                         ? <span className="text-[10px] bg-gray-100 px-2 py-1 rounded">Video</span>
                         : <img src={item.mobile_url} className="w-8 h-12 object-cover rounded border" />
                     ) : <span className="text-[10px] text-gray-400">None</span>}
                   </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button onClick={() => onEdit(item)} className="text-xs font-semibold text-brand hover:underline mr-3">Edit</button>
                <button onClick={() => onDelete(item)} className="text-xs font-semibold text-danger hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}