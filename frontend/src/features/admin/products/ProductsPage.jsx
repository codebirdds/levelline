import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAdminProducts,
  selectAdminLoading,
  openForm,
} from "./adminProductSlice";
import { fetchAdminProductsThunk, deleteProductThunk } from "./adminProductThunks";
import ProductTable from "./components/ProductTable";
import ProductFormModal from "./components/ProductFormModal";
import VariantsModal from "./components/VariantsModal";
import ConfirmDialog from "../../../components/common/ConfirmDialog";


export default function ProductsPage() {
  const dispatch = useDispatch();
  const items    = useSelector(selectAdminProducts);
  const loading  = useSelector(selectAdminLoading);
  const [deleting, setDeleting]                   = useState(null);
  const [busy, setBusy]                           = useState(false);
  const [variantProductId, setVariantProductId]   = useState(null);

  // Derive live product so it updates after refetch
  const liveProduct = variantProductId
    ? items.find((p) => p.id === variantProductId) || null
    : null;

  useEffect(() => {
    dispatch(fetchAdminProductsThunk());
  }, [dispatch]);

  const refresh = () => dispatch(fetchAdminProductsThunk());

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
        <p className="text-sm text-muted">
          {items.length} product{items.length !== 1 && "s"}
        </p>
        <button
          onClick={() => dispatch(openForm(null))}
          className="text-sm font-semibold bg-brand text-white px-4 py-2 rounded-md hover:bg-brand-dark transition"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-surface border border-border rounded-lg">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <div className="h-8 w-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
            <p className="text-sm text-muted">Loading products…</p>
          </div>
        ) : (
          <ProductTable
            items={items}
            onEdit={(p) => dispatch(openForm(p))}
            onDelete={setDeleting}
            onManageVariants={(p) => setVariantProductId(p.id)}
          />
        )}
      </div>

      {/* Product add/edit modal */}
      <ProductFormModal />

      {/* Nested variants modal */}
      <VariantsModal
        open={!!variantProductId}
        onClose={() => setVariantProductId(null)}
        product={liveProduct}
        onRefresh={refresh}
      />

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