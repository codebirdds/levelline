import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../../components/common/Modal";
import {
  selectFormOpen, selectEditing, selectSubmitting,
  closeForm,
} from "../adminProductSlice";
import { createProductThunk, updateProductThunk } from "../adminProductThunks";
import { listCategories } from "../../categories/mediators";

const EMPTY = {
  name: "",
  slug: "",
  description: "",
  brand: "",
  product_type: "",
  gender: "men",
  category_id: "",
  subcategory: "",
  material: "",
  pattern: "",
  fit: "",
  occasion: "",
  country_of_origin: "",
  care_instructions: "",
  price: "",
  discount_price: "",
  status: "active",
  is_featured: false,
};

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function ProductFormModal() {
  const dispatch = useDispatch();
  const open       = useSelector(selectFormOpen);
  const editing    = useSelector(selectEditing);
  const submitting = useSelector(selectSubmitting);
  const [form, setForm] = useState(EMPTY);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    listCategories().then((data) => setCategories(Array.isArray(data) ? data : [])).catch(() => {});
  }, []);

  useEffect(() => {
    setForm(editing ? { ...EMPTY, ...editing, category_id: editing.category_id || "" } : EMPTY);
  }, [editing, open]);

  const onClose = () => !submitting && dispatch(closeForm());

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      discount_price: form.discount_price ? Number(form.discount_price) : null,
    };
    if(payload.variants){
      delete payload.variants; // Remove variants if present, as they are not part of the main product payload
    }
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
        <div className="grid grid-cols-2 gap-4">
          <Field label="Name *">
            <input required value={form.name} onChange={(e) => { set("name", e.target.value); if (!form.slug) set("slug", slugify(e.target.value)); }}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
          <Field label="Slug">
            <input value={form.slug} onChange={(e) => set("slug", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none font-mono" />
          </Field>
        </div>

        <Field label="Description">
          <textarea rows={2} value={form.description} onChange={(e) => set("description", e.target.value)}
            className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
        </Field>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Brand">
            <input value={form.brand} onChange={(e) => set("brand", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
          <Field label="Product Type">
            <input value={form.product_type} onChange={(e) => set("product_type", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
          <Field label="Gender">
            <select value={form.gender} onChange={(e) => set("gender", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none bg-surface">
              {["men","women","unisex","boys","girls","kids"].map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Category *">
            <select required value={form.category_id}
              onChange={(e) => set("category_id", Number(e.target.value))}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none bg-surface">
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Subcategory">
            <input value={form.subcategory} onChange={(e) => set("subcategory", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
          <Field label="Material">
            <input value={form.material} onChange={(e) => set("material", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Pattern">
            <input value={form.pattern} onChange={(e) => set("pattern", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
          <Field label="Fit">
            <input value={form.fit} onChange={(e) => set("fit", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
          <Field label="Occasion">
            <input value={form.occasion} onChange={(e) => set("occasion", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Country of Origin">
            <input value={form.country_of_origin} onChange={(e) => set("country_of_origin", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
          <Field label="Price (₹) *">
            <input required type="number" min="0" value={form.price}
              onChange={(e) => set("price", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
          <Field label="Discount Price">
            <input type="number" min="0" value={form.discount_price}
              onChange={(e) => set("discount_price", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Care Instructions">
            <input value={form.care_instructions} onChange={(e) => set("care_instructions", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => set("status", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none bg-surface">
              {["active","inactive","draft"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_featured} onChange={(e) => set("is_featured", e.target.checked)} />
          Featured
        </label>
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