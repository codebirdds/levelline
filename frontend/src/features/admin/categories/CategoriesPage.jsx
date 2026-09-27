import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCategories, selectCategoryLoading,
  openForm,
} from "./categorySlice";
import { fetchCategoriesThunk, deleteCategoryThunk } from "./categoryThunks";
import CategoryTable from "./components/CategoryTable";
import CategoryFormModal from "./components/CategoryFormModal";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import Spinner from "../../../components/common/Spinner";

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const items    = useSelector(selectCategories);
  const loading  = useSelector(selectCategoryLoading);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  const onConfirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await dispatch(deleteCategoryThunk(deleting.id));
      setDeleting(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{items.length} categor{items.length === 1 ? "y" : "ies"}</p>
        <button
          onClick={() => dispatch(openForm(null))}
          className="text-sm font-semibold bg-brand text-white px-4 py-2 rounded-md hover:bg-brand-dark transition"
        >
          + Add Category
        </button>
      </div>

      <div className="bg-surface border border-border rounded-lg">
        {loading ? <Spinner full /> : <CategoryTable items={items} onEdit={(c) => dispatch(openForm(c))} onDelete={setDeleting} />}
      </div>

      <CategoryFormModal />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={onConfirmDelete}
        loading={busy}
        message={`Delete "${deleting?.name}"? This cannot be undone.`}
      />
    </div>
  );
}