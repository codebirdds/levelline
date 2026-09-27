import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAdminProducts, selectAdminLoading,
  openForm,
} from "./adminProductSlice";
import { fetchAdminProductsThunk, deleteProductThunk } from "./adminProductThunks";
import ProductTable from "./components/ProductTable";
import ProductFormModal from "./components/ProductFormModal";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import Spinner from "../../../components/common/Spinner";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const items    = useSelector(selectAdminProducts);
  const loading  = useSelector(selectAdminLoading);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminProductsThunk());
  }, [dispatch]);

  const onConfirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await dispatch(deleteProductThunk(deleting.id));
      setDeleting(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{items.length} product{items.length !== 1 && "s"}</p>
        <button
          onClick={() => dispatch(openForm(null))}
          className="text-sm font-semibold bg-brand text-white px-4 py-2 rounded-md hover:bg-brand-dark transition"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-surface border border-border rounded-lg">
        {loading ? <Spinner full /> : <ProductTable items={items} onEdit={(p) => dispatch(openForm(p))} onDelete={setDeleting} />}
      </div>

      <ProductFormModal />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={onConfirmDelete}
        loading={busy}
        message={`Delete "${deleting?.title}"? This cannot be undone.`}
      />
    </div>
  );
}