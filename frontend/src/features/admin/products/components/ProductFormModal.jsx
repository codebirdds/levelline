import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../../components/common/Modal";
import {
  selectFormOpen, selectEditing, selectSubmitting,
  closeForm,
} from "../adminProductSlice";
import { createProductThunk, updateProductThunk } from "../adminProductThunks";

const EMPTY = {
  title: "",
  price: "",
  category: "men",
  stock: "",
  image: "",
};

export default function ProductFormModal() {
  const dispatch = useDispatch();
  const open       = useSelector(selectFormOpen);
  const editing    = useSelector(selectEditing);
  const submitting = useSelector(selectSubmitting);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    setForm(editing ? { ...editing } : EMPTY);
  }, [editing, open]);

  const onClose = () => !submitting && dispatch(closeForm());

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      image: form.image || `https://picsum.photos/seed/${Date.now()}/400/400`,
    };
    if (editing) dispatch(updateProductThunk(editing.id, payload));
    else         dispatch(createProductThunk(payload));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Edit Product" : "Add Product"}
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-hover">Cancel</button>
          <button
            form="product-form"
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-sm font-semibold bg-brand text-white rounded-md hover:bg-brand-dark disabled:opacity-60"
          >
            {submitting ? "Saving…" : editing ? "Save Changes" : "Create"}
          </button>
        </>
      }
    >
      <form id="product-form" onSubmit={onSubmit} className="space-y-4">
        <Field label="Title">
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Price (₹)">
            <input required type="number" min="0" value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
          <Field label="Stock">
            <input required type="number" min="0" value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
        </div>

        <Field label="Category">
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none bg-surface">
            {["men", "women", "kids", "home", "beauty", "genz"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field label="Image URL (optional)">
          <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="https://…"
            className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
        </Field>
      </form>
    </Modal>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block mb-1 text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}