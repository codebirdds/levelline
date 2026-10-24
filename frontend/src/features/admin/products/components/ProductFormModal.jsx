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
  status: "active",
  is_featured: false,
  is_outfit: false,
  price: "",
  discount_price: "",
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
  const [imageFiles, setImageFiles] = useState(null);

  useEffect(() => {
    listCategories().then((data) => setCategories(Array.isArray(data) ? data : [])).catch(() => {});
  }, []);

  useEffect(() => {
    setForm(editing ? { ...EMPTY, ...editing, category_id: editing.category_id || "" } : EMPTY);
    setImageFiles(null);
  }, [editing, open]);

  const onClose = () => !submitting && dispatch(closeForm());
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    Object.keys(form).forEach(key => {
      if (key !== "variants" && key !== "images" && key !== "price" && key !== "discount_price") {
        formData.append(key, form[key]);
      }
    });

    if (form.is_outfit) {
      formData.append("price", Number(form.price));
      if (form.discount_price) formData.append("discount_price", Number(form.discount_price));
      
      if (imageFiles && imageFiles.length > 0) {
        Array.from(imageFiles).forEach(file => {
          formData.append("images", file);
        });
      }
    }

    // ✅ THE FIX: Check editing?.id instead of just editing
    if (editing?.id) {
      dispatch(updateProductThunk(editing.id, formData));
    } else {
      dispatch(createProductThunk(formData));
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing?.id ? "Edit Product" : "Add Product"}
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-hover">Cancel</button>
          <button
            form="product-form"
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-sm font-semibold bg-brand text-white rounded-md hover:bg-brand-dark disabled:opacity-60"
          >
            {submitting ? "Saving…" : editing?.id ? "Update" : "Save"}
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
            <select required value={form.category_id} onChange={(e) => set("category_id", Number(e.target.value))}
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

        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={form.is_outfit} onChange={(e) => set("is_outfit", e.target.checked)} className="w-4 h-4 accent-brand" />
          Is this a Full Outfit?
        </label>

        {form.is_outfit && (
          <div className="p-4 border border-border rounded-md bg-surface space-y-4">
            <p className="text-xs text-muted font-medium mb-2">Outfit specific fields:</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (₹) *">
                <input required={form.is_outfit} type="number" min="0" value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
              </Field>
              <Field label="Discount Price">
                <input type="number" min="0" value={form.discount_price}
                  onChange={(e) => set("discount_price", e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
              </Field>
            </div>
            <Field label="Outfit Images">
              <input type="file" multiple accept="image/*" onChange={(e) => setImageFiles(e.target.files)}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand file:text-white hover:file:bg-brand-dark" />
            </Field>
          </div>
        )}

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