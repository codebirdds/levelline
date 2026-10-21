import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectVariants, selectVariantLoading,
  selectSelectedProductId,
  setProduct, openForm,
} from "./variantSlice";
import { fetchVariantsThunk, fetchVariantsByProductThunk, deleteVariantThunk } from "./variantThunks";
import VariantTable from "./components/VariantTable";
import VariantFormModal from "./components/VariantFormModal";
import ConfirmDialog from "../../../components/common/ConfirmDialog";


const EMPTY_PRODUCT = { id: null, name: "" };

export default function VariantsPage() {
  const dispatch = useDispatch();
  const items    = useSelector(selectVariants);
  const loading  = useSelector(selectVariantLoading);
  const productId = useSelector(selectSelectedProductId);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    dispatch(fetchVariantsThunk());
  }, [dispatch]);

  const onFilterByProduct = (p) => {
    if (!p) { dispatch(fetchVariantsThunk()); dispatch(setProduct(null)); return; }
    dispatch(setProduct(p.id));
    dispatch(fetchVariantsByProductThunk(p.id));
  };

  const onConfirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await dispatch(deleteVariantThunk(deleting.id));
      setDeleting(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{items.length} variant{items.length !== 1 && "s"}</p>
        <button
          onClick={() => dispatch(openForm(null))}
          className="text-sm font-semibold bg-brand text-white px-4 py-2 rounded-md hover:bg-brand-dark transition"
        >
          + Add Variant
        </button>
      </div>

      <div className="bg-surface border border-border rounded-lg">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <div className="h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
            <p className="text-sm text-muted">Loading variants…</p>
          </div>
        ) : (
          <VariantTable items={items} onEdit={(v) => dispatch(openForm(v))} onDelete={setDeleting} onFilterByProduct={onFilterByProduct} />
        )}
      </div>

      <VariantFormModal />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={onConfirmDelete}
        loading={busy}
        message={`Delete variant for "${deleting?.color}"? This cannot be undone.`}
      />
    </div>
  );
}