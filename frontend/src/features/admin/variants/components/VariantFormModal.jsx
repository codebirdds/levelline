import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../../components/common/Modal";
import {
  selectVariantFormOpen,
  selectVariantEditing,
  selectVariantSubmitting,
  closeForm,
} from "../variantSlice";
import { createVariantThunk, updateVariantThunk } from "../variantThunks";

const EMPTY = {
  name: "",          // ✅ Added
  description: "",   // ✅ Added
  color: "",
  color_code: "#000000",
  price: "",
  discount_price: "",
  status: "active",
};

export default function VariantFormModal() {
  const dispatch = useDispatch();
  const open = useSelector(selectVariantFormOpen);
  const editing = useSelector(selectVariantEditing);
  const submitting = useSelector(selectVariantSubmitting);
  
  const [form, setForm] = useState(EMPTY);
  const [sizes, setSizes] = useState([{ size: "", sku: "", stock: 0 }]);
  const [imageFiles, setImageFiles] = useState(null);

  useEffect(() => {
    if (open) {
      if (editing?.id) {
        // Editing existing variant
        setForm({ ...EMPTY, ...editing });
        setSizes(editing.sizes || [{ size: "", sku: "", stock: 0 }]);
      } else {
        // Adding new variant (editing contains only product_id)
        setForm({ ...EMPTY, product_id: editing?.product_id });
        setSizes([{ size: "", sku: "", stock: 0 }]);
      }
      setImageFiles(null);
    }
  }, [editing, open]);

  const onClose = () => !submitting && dispatch(closeForm());
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...sizes];
    newSizes[index][field] = field === "stock" ? Number(value) : value;
    setSizes(newSizes);
  };

  const addSize = () => setSizes([...sizes, { size: "", sku: "", stock: 0 }]);
  const removeSize = (index) => setSizes(sizes.filter((_, i) => i !== index));

  const onSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("product_id", editing?.product_id || form.product_id);
    
    // ✅ Append Name and Description
    if (form.name) formData.append("name", form.name);
    if (form.description) formData.append("description", form.description);
    
    formData.append("color", form.color);
    formData.append("color_code", form.color_code);
    formData.append("price", Number(form.price));
    if (form.discount_price) formData.append("discount_price", Number(form.discount_price));
    formData.append("status", form.status);
    
    formData.append("sizes", JSON.stringify(sizes));

    if (imageFiles && imageFiles.length > 0) {
      Array.from(imageFiles).forEach(file => {
        formData.append("images", file);
      });
    }

    if (editing?.id) {
      dispatch(updateVariantThunk(editing.id, formData));
    } else {
      dispatch(createVariantThunk(formData));
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing?.id ? "Edit Variant" : "Add Variant"}
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-hover">Cancel</button>
          <button
            form="variant-form"
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-sm font-semibold bg-brand text-white rounded-md hover:bg-brand-dark disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Save Variant"}
          </button>
        </>
      }
    >
      <form id="variant-form" onSubmit={onSubmit} className="space-y-4">
        
        {/* ✅ Name & Description */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Variant Name">
            <input value={form.name} onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Classic Oxford Shirt"
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
          <Field label="Description">
            <input value={form.description} onChange={(e) => set("description", e.target.value)}
              placeholder="e.g. Premium cotton, slim fit"
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Color Name *">
            <input required value={form.color} onChange={(e) => set("color", e.target.value)}
              placeholder="e.g. Midnight Blue"
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
          <Field label="Color Swatch">
            <input type="color" value={form.color_code} onChange={(e) => set("color_code", e.target.value)}
              className="w-full h-[38px] border border-border rounded-md p-1 cursor-pointer focus:border-brand outline-none bg-surface" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Price (₹) *">
            <input required type="number" min="0" value={form.price}
              onChange={(e) => set("price", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
          <Field label="Discount Price (₹)">
            <input type="number" min="0" value={form.discount_price}
              onChange={(e) => set("discount_price", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none" />
          </Field>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted">Sizes & Stock *</span>
            <button type="button" onClick={addSize} className="text-xs font-semibold text-brand hover:underline">
              + Add Size
            </button>
          </div>
          <div className="space-y-2">
            {sizes.map((sz, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input placeholder="Size (e.g. M)" required value={sz.size} onChange={(e) => handleSizeChange(i, "size", e.target.value)}
                  className="w-1/3 border border-border rounded-md px-2 py-1.5 text-sm focus:border-brand outline-none" />
                <input placeholder="SKU" required value={sz.sku} onChange={(e) => handleSizeChange(i, "sku", e.target.value)}
                  className="w-1/3 border border-border rounded-md px-2 py-1.5 text-sm focus:border-brand outline-none font-mono" />
                <input type="number" placeholder="Stock" required min="0" value={sz.stock} onChange={(e) => handleSizeChange(i, "stock", e.target.value)}
                  className="w-1/4 border border-border rounded-md px-2 py-1.5 text-sm focus:border-brand outline-none" />
                <button type="button" onClick={() => removeSize(i)} className="text-red-500 hover:text-red-700 font-bold px-1">
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <Field label="Variant Images">
          <input type="file" multiple accept="image/*" onChange={(e) => setImageFiles(e.target.files)}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand file:text-white hover:file:bg-brand-dark" />
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