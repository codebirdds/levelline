import { useState } from "react";
import { useDispatch } from "react-redux";
import { changeContactStatusThunk } from "../adminContactThunks";
import { CONTACT_STATUSES, STATUS_STYLES } from "../../../contact/constants";
import ContactDetailsModal from "./ContactDetailsModal";

export default function ContactTable({ items = [] }) {
  const dispatch = useDispatch();
  const [viewing, setViewing] = useState(null);

  if (!items.length) {
    return (
      <p className="p-8 text-center text-sm text-muted">No contacts yet.</p>
    );
  }

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    }) : "";

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr
                key={c.id}
                className="border-b border-border align-top last:border-0 hover:bg-hover"
              >
                <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                <td className="px-4 py-3">
                  <p className="text-muted">{c.email}</p>
                  {c.phone && <p className="text-xs text-muted">{c.phone}</p>}
                </td>
                <td className="px-4 py-3">
                  <p className="line-clamp-2 max-w-[280px] text-muted">
                    {c.project_description || "—"}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      STATUS_STYLES[c.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {c.status || "new"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted">
                  {formatDate(c.createdAt)}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <select
                    value={c.status || "new"}
                    onChange={(e) =>
                      dispatch(changeContactStatusThunk(c.id, e.target.value))
                    }
                    className="mr-2 rounded border border-border bg-white px-2 py-1 text-xs"
                  >
                    {CONTACT_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setViewing(c)}
                    className="text-xs font-semibold text-brand hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ContactDetailsModal
        contact={viewing}
        onClose={() => setViewing(null)}
      />
    </>
  );
}