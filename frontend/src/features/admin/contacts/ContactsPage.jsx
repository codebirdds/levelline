import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../components/common/Spinner";
import ContactTable from "./components/ContactTable";
import { fetchAdminContactsThunk } from "./adminContactThunks";
import {
  selectAdminContacts,
  selectAdminContactsLoading,
  selectAdminContactsError,
} from "./adminContactSlice";

export default function ContactsPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectAdminContacts);
  const loading = useSelector(selectAdminContactsLoading);
  const error = useSelector(selectAdminContactsError);

  useEffect(() => {
    dispatch(fetchAdminContactsThunk());
  }, [dispatch]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">
          {items.length} {items.length === 1 ? "contact" : "contacts"}
        </p>
        <button
          onClick={() => dispatch(fetchAdminContactsThunk())}
          className="text-sm font-semibold bg-surface border border-border px-4 py-2 rounded-md hover:bg-hover transition"
        >
          Refresh
        </button>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <div className="bg-surface border border-border rounded-lg">
        {loading ? <Spinner full /> : <ContactTable items={items} />}
      </div>
    </div>
  );
}