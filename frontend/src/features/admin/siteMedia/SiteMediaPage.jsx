import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectMediaItems, selectMediaLoading, openModal } from "./siteMediaSlice";
import { fetchMediaThunk, deleteMediaThunk } from "./siteMediaThunks";
import SiteMediaTable from "./components/SiteMediaTable";
import SiteMediaFormModal from "./components/SiteMediaFormModal";

export default function SiteMediaPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectMediaItems);
  const loading = useSelector(selectMediaLoading);

  useEffect(() => { dispatch(fetchMediaThunk()); }, [dispatch]);

  const handleDelete = (item) => {
    if (window.confirm(`Delete section "${item.display_name}"?`)) {
      dispatch(deleteMediaThunk(item.id));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{items.length} section(s)</p>
        <button onClick={() => dispatch(openModal(null))} className="text-sm font-semibold bg-brand text-white px-4 py-2 rounded-md hover:bg-brand-dark transition">
          + Add Section
        </button>
      </div>

      <div className="bg-surface border border-border rounded-lg">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <div className="h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
            <p className="text-sm text-muted">Loading media…</p>
          </div>
        ) : (
          <SiteMediaTable items={items} onEdit={(i) => dispatch(openModal(i))} onDelete={handleDelete} />
        )}
      </div>

      <SiteMediaFormModal />
    </div>
  );
}
