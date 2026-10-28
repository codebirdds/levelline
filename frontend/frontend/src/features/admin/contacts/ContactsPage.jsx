import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectContacts, selectContactLoading,
  openModal,
} from "./contactsSlice";
import { fetchContactsThunk } from "./contactsThunks";
import ContactTable from "./components/ContactTable";
import ContactDetailsModal from "./components/ContactDetailsModal";

export default function ContactsPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectContacts);
  const loading = useSelector(selectContactLoading);

  useEffect(() => {
    dispatch(fetchContactsThunk());
  }, [dispatch]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{items.length} contact{items.length === 1 ? "" : "s"}</p>
      </div>

      <div className="bg-surface border border-border rounded-lg">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <div className="h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
            <p className="text-sm text-muted">Loading contacts…</p>
          </div>
        ) : (
          <ContactTable items={items} onView={(c) => dispatch(openModal(c))} />
        )}
      </div>

      <ContactDetailsModal />
    </div>
  );
}
