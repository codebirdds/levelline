import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../../components/common/Modal";
import ConfirmDialog from "../../../../components/common/ConfirmDialog";
import { formatCurrency } from "../../../../utils/formatCurrency";
import {
  selectVariantFormOpen,
  openForm,
} from "../../variants/variantSlice";
import { deleteVariantThunk } from "../../variants/variantThunks";
import VariantFormModal from "../../variants/components/VariantFormModal";

export default function VariantsModal({ open, onClose, product, onRefresh }) {
  const dispatch = useDispatch();
  const formOpen = useSelector(selectVariantFormOpen);
  const [deleting, setDeleting] = useState(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (wasOpenRef.current && !formOpen) {
      onRefresh?.();
    }
    wasOpenRef.current = formOpen;
  }, [formOpen, onRefresh]);

  if (!product) return null;
  const variants = product.variants || [];

  const handleAdd = () => {
    dispatch(openForm({ product_id: product.id }));
  };

  const handleEdit = (v) => {
    dispatch(openForm({ ...v, product_id: product.id }));
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    await dispatch(deleteVariantThunk(deleting.id));
    setDeleting(null);
    onRefresh?.();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={`Variants — ${product.name}`}
        footer={
          <>
            <button onClick={onClose} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-hover">
              Close
            </button>
            <button onClick={handleAdd} className="px-4 py-2 text-sm font-semibold bg-brand text-white rounded-md hover:bg-brand-dark">
              + Add Variant
            </button>
          </>
        }
      >
        {variants.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-muted">No variants yet.</p>
            <p className="text-xs text-subtle mt-1">Add your first variant — color, sizes, images.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {variants.map((v) => {
              const stock = (v.sizes || []).reduce((s, sz) => s + (sz.stock || 0), 0);
              const rawImages = Array.isArray(v.images) ? v.images : [];
              const imageUrls = rawImages.map(img => (typeof img === "string" ? img : img?.url)).filter(Boolean);
              
              const base = Number(v.price) || 0;
              const discount = Number(v.discount_price) || 0;
              const final = discount > 0 ? Math.max(base - discount, 0) : base;

              return (
                <div key={v.id} className="flex gap-3 p-3 border border-border rounded-md">
                  {/* Show all images as small grid */}
                  <div className="w-24 shrink-0 flex flex-wrap content-start gap-1">
                    {imageUrls.length > 0 ? (
                      imageUrls.map((url, idx) => (
                        <img 
                          key={idx} 
                          src={url} 
                          alt="" 
                          className="w-11 h-11 object-cover rounded bg-bg border border-border" 
                        />
                      ))
                    ) : (
                      <div className="w-full h-11 flex items-center justify-center rounded bg-bg border border-border text-[10px] text-subtle">
                        No img
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {v.color_code && (
                        <span className="w-3.5 h-3.5 rounded-full border border-border" style={{ background: v.color_code }} />
                      )}
                      <span className="font-medium text-ink text-sm">{v.color || "—"}</span>
                      <span className={`ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${v.status === "active" ? "bg-brand-soft text-brand" : "bg-red-50 text-danger"}`}>
                        {v.status || "active"}
                      </span>
                      <span className="ml-auto font-medium text-ink">
                        {formatCurrency(final)}
                      </span>
                    </div>

                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {(v.sizes || []).map((sz, i) => (
                        <span key={i} title={sz.sku} className="text-[10px] font-medium px-2 py-0.5 rounded bg-hover text-ink">
                          {sz.size} · {sz.stock}
                        </span>
                      ))}
                    </div>

                    <p className="mt-1.5 text-xs text-muted">
                      {imageUrls.length} image{imageUrls.length !== 1 && "s"} · {stock} total stock
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 shrink-0">
                    <button onClick={() => handleEdit(v)} className="text-xs font-semibold text-brand hover:underline">Edit</button>
                    <button onClick={() => setDeleting(v)} className="text-xs font-semibold text-danger hover:underline">Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        message={`Delete variant "${deleting?.color}"? This cannot be undone.`}
      />

      <VariantFormModal />
    </>
  );
}