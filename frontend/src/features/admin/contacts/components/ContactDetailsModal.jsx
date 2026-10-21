export default function ContactDetailsModal({ contact, onClose }) {
  if (!contact) return null;

  const rows = [
    ["Name", contact.name],
    ["Email", contact.email],
    ["Phone", contact.phone],
    ["Service", contact.service_needed],
    ["Budget", contact.budget_range],
    ["Status", contact.status],
    ["Received", contact.createdAt && new Date(contact.createdAt).toLocaleString("en-IN")],
  ].filter(([, v]) => v);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-ink">Contact Details</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-muted transition hover:bg-hover hover:text-ink"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-5">
          <dl className="space-y-3">
            {rows.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[110px_1fr] gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0">
                <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
                <dd className="break-words text-sm text-ink">{value}</dd>
              </div>
            ))}
            <div>
              <dt className="mb-1 text-xs uppercase tracking-wide text-muted">Message</dt>
              <dd className="whitespace-pre-line rounded bg-[#fafafa] p-3 text-sm text-ink">
                {contact.project_description || "—"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}