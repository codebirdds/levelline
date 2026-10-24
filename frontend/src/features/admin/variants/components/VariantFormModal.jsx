import { useEffect, useRef, useState } from "react";
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
  name: "",
  description: "",
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
  
  // Image State
  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      if (editing?.id) {
        setForm({ ...EMPTY, ...editing });
        setSizes(editing.sizes || [{ size: "", sku: "", stock: 0 }]);
        
        if (Array.isArray(editing.images)) {
          const loadedImages = [...editing.images]
            .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
            .map((img, idx) => ({
              id: `existing-${idx}`,
              url: img.url || img,
              file: null,
              is_primary: img.is_primary || idx === 0
            }));
          setImages(loadedImages);
        } else {
          setImages([]);
        }
      } else {
        setForm({ ...EMPTY, product_id: editing?.product_id });
        setSizes([{ size: "", sku: "", stock: 0 }]);
        setImages([]);
      }
      setActiveIndex(0);
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

  // ── Image Handling ──
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImages = files.map(file => ({
      id: `new-${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      file,
      is_primary: false
    }));

    setImages(prev => [...prev, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (activeIndex >= index && activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
    }
  };

  // ── Drag and Drop ──
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);
    
    setImages(newImages);
    setDraggedIndex(index);
    setActiveIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("product_id", editing?.product_id || form.product_id);
    
    if (form.name) formData.append("name", form.name);
    if (form.description) formData.append("description", form.description);
    
    formData.append("color", form.color);
    formData.append("color_code", form.color_code);
    formData.append("price", Number(form.price));
    if (form.discount_price) formData.append("discount_price", Number(form.discount_price));
    formData.append("status", form.status);
    
    formData.append("sizes", JSON.stringify(sizes));

    const newFiles = images.filter(img => img.file).map(img => img.file);
    
    if (newFiles.length > 0) {
      newFiles.forEach(file => {
        formData.append("images", file);
      });
    } else if (editing?.id && images.length > 0) {
      const existingImagesJson = images.map((img, idx) => ({
        url: img.url,
        is_primary: idx === 0,
        sort_order: idx + 1
      }));
      formData.append("images", JSON.stringify(existingImagesJson));
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
      className="max-w-4xl" 
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
      <form id="variant-form" onSubmit={onSubmit} className="space-y-5">
        
        {/* 1. Name & Description */}
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

        {/* 2. Color & Swatch */}
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

        {/* 3. Price & Discount */}
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

        {/* 4. Sizes & Stock */}
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

        {/* 5. Image Manager UI (Moved to bottom) */}
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted uppercase tracking-wide">Images</span>
            <div>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageUpload} 
                ref={fileInputRef} 
                className="hidden" 
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold bg-white border border-border px-3 py-1.5 rounded hover:bg-gray-50 transition"
              >
                + Add Images
              </button>
            </div>
          </div>

          {images.length === 0 ? (
            <div className="flex aspect-video w-full items-center justify-center rounded-md border-2 border-dashed border-border bg-white text-sm text-muted">
              No images uploaded yet.
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-4 w-full">
              {/* Big Preview */}
              <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-md border border-border bg-white h-[300px] md:h-[400px]">
                <img
                  src={images[activeIndex]?.url}
                  alt="Main preview"
                  className="max-h-full max-w-full object-contain"
                />
                <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
                  {activeIndex === 0 ? "Primary (Main)" : `Image ${activeIndex + 1}`}
                </span>
              </div>

              {/* Thumbnails (Draggable) */}
              <div className="flex w-full md:w-24 shrink-0 flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto">
                {images.map((img, idx) => (
                  <div
                    key={img.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragEnd={handleDragEnd}
                    onClick={() => setActiveIndex(idx)}
                    className={`group relative flex aspect-square w-20 md:w-full shrink-0 cursor-grab items-center justify-center overflow-hidden rounded border bg-white transition-all ${
                      activeIndex === idx ? "border-brand ring-2 ring-brand/20" : "border-border opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img.url} alt="" className="size-full object-contain p-1" />
                    
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                      className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-red-100 text-red-600 opacity-0 transition hover:bg-red-200 group-hover:opacity-100"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                    
                    <span className="absolute bottom-1 left-1 rounded bg-black/50 px-1 text-[9px] text-white">
                      {idx === 0 ? "Main" : idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="text-[10px] text-muted">
            Drag and drop the images to reorder. The first image will be used as the primary display image.
          </p>
        </div>

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