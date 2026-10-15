import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../../components/common/Modal";
import ConfirmDialog from "../../../../components/common/ConfirmDialog";
import {
  selectVariantFormOpen,
  openForm,
  closeForm,
} from "../../variants/variantSlice";           // ⬅️ FIXED PATH
import { deleteVariantThunk } from "../../variants/variantThunks";  // ⬅️ FIXED PATH
import VariantFormModal from "../../variants/components/VariantFormModal"; // ⬅️ FIXED PATH

export default function VariantsModal({ open, onClose, product, onRefresh }) {
  const dispatch = useDispatch();
  const formOpen = useSelector(selectVariantFormOpen);
  const [deleting, setDeleting] = useState(null);
  const wasOpenRef = useRef(false);

  // When the VariantFormModal closes, refresh products (variant count changes)
  useEffect(() => {
    if (wasOpenRef.current && !formOpen) {
      onRefresh?.();
    }
    wasOpenRef.current = formOpen;
  }, [formOpen, onRefresh]);

  if (!product) return null;
  const variants = product.variants || [];

  const handleAdd = () => {
    dispatch(openForm({ product_id: product.id })); // create mode w/ preset product
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
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border border-border rounded-md hover:bg-hover"
            >
              Close
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 text-sm font-semibold bg-brand text-white rounded-md hover:bg-brand-dark"
            >
              + Add Variant
            </button>
          </>
        }
      >
        {variants.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-muted">No variants yet.</p>
            <p className="text-xs text-subtle mt-1">
              Add your first variant — color, sizes, images.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {variants.map((v) => {
              const stock = (v.sizes || []).reduce((s, sz) => s + (sz.stock || 0), 0);
              const img =
                v.images?.find((i) => i.is_primary)?.url || v.images?.[0]?.url;

              return (
                <div key={v.id} className="flex gap-3 p-3 border border-border rounded-md">
                  <div className="w-16 h-16 shrink-0 rounded bg-bg overflow-hidden grid place-items-center">
                    {img ? (
                      <img src={img} alt={v.color} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xs text-subtle">No img</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {v.color_code && (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-border"
                          style={{ background: v.color_code }}
                        />
                      )}
                      <span className="font-medium text-ink text-sm">{v.color || "—"}</span>
                      <span
                        className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          v.status === "active"
                            ? "bg-brand-soft text-brand"
                            : "bg-red-50 text-danger"
                        }`}
                      >
                        {v.status || "active"}
                      </span>
                    </div>

                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {(v.sizes || []).map((sz, i) => (
                        <span
                          key={i}
                          title={sz.sku}
                          className="text-[10px] font-medium px-2 py-0.5 rounded bg-hover text-ink"
                        >
                          {sz.size} · {sz.stock}
                        </span>
                      ))}
                    </div>

                    <p className="mt-1.5 text-xs text-muted">
                      {v.images?.length || 0} image{(v.images?.length || 0) !== 1 && "s"} ·{" "}
                      {stock} total stock
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => handleEdit(v)}
                      className="text-xs font-semibold text-brand hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleting(v)}
                      className="text-xs font-semibold text-danger hover:underline"
                    >
                      Delete
                    </button>
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

      {/* Nested form modal — lives in variants/components */}
      <VariantFormModal />
    </>
  );
}