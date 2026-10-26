import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../../components/common/Modal";
import {
  selectContactModalOpen, selectContactSelected, selectContactSubmitting,
  closeModal,
} from "../contactsSlice";
import { updateContactStatusThunk } from "../contactsThunks";

export default function ContactDetailsModal() {
  const dispatch = useDispatch();
  const open = useSelector(selectContactModalOpen);
  const selected = useSelector(selectContactSelected);
  const submitting = useSelector(selectContactSubmitting);
  
  const [status, setStatus] = useState("new");

  useEffect(() => {
    if (selected) {
      setStatus(selected.status || "new");
    }
  }, [selected]);

  const onClose = () => !submitting && dispatch(closeModal());

  const onSubmit = (e) => {
    e.preventDefault();
    if (selected) {
      dispatch(updateContactStatusThunk(selected.id, status));
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Contact Details"
      footer={
        <>
          <button onClick={onClose} disabled={submitting} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-hover disabled:opacity-60">
            Close
          </button>
          <button form="contact-form" type="submit" disabled={submitting} className="px-4 py-2 text-sm font-semibold bg-brand text-white rounded-md hover:bg-brand-dark disabled:opacity-60">
            {submitting ? "Saving…" : "Update Status"}
          </button>
        </>
      }
    >
      {selected && (
        <form id="contact-form" onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block mb-1 text-xs font-medium text-muted">Name</span>
              <p className="text-sm font-medium">{selected.name}</p>
            </div>
            <div>
              <span className="block mb-1 text-xs font-medium text-muted">Email</span>
              <p className="text-sm">{selected.email}</p>
            </div>
            <div>
              <span className="block mb-1 text-xs font-medium text-muted">Phone</span>
              <p className="text-sm">{selected.phone}</p>
            </div>
            <div>
              <span className="block mb-1 text-xs font-medium text-muted">Service</span>
              <p className="text-sm">{selected.service_needed || "N/A"}</p>
            </div>
          </div>

          <div>
            <span className="block mb-1 text-xs font-medium text-muted">Project Description</span>
            <div className="p-3 bg-bg border border-border rounded-md text-sm whitespace-pre-wrap">
              {selected.project_description}
            </div>
          </div>

          <label className="block border-t border-border pt-4">
            <span className="block mb-1 text-xs font-medium text-muted">Update Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none bg-surface"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="resolved">Resolved</option>
              <option value="archived">Archived</option>
            </select>
          </label>
        </form>
      )}
    </Modal>
  );
}
