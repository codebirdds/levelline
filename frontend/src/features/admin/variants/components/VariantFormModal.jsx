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
import { listProducts } from "../../products/mediators";

const MAX_IMAGES  = 6;
const MAX_SIZE_MB = 5;

const EMPTY = {
  product_id: "",
  color: "",
  color_code: "",
  sizes: [{ size: "S", sku: "", stock: 0 }],
  images: [],
  status: "active",
};

export default function VariantFormModal() {
  const dispatch = useDispatch();
  const open       = useSelector(selectVariantFormOpen);
  const editing    = useSelector(selectVariantEditing);
  const submitting = useSelector(selectVariantSubmitting);

  const [form, setForm]                     = useState(EMPTY);
  const [existingImages, setExistingImages] = useState([]); // urls already on server
  const [newFiles, setNewFiles]             = useState([]); // File objects to upload
  const [products, setProducts]             = useState([]);
  const [imgError, setImgError]             = useState(null);
  const fileRef = useRef(null);

  // ── Decide mode based on presence of an id ─────────────
  //   editing.id exists     → UPDATE variant
  //   editing.id missing    → CREATE variant (may include preset product_id)
  //   editing === null      → CREATE variant (no preset)
  const isEdit          = !!editing?.id;
  const isPresetProduct = !isEdit && !!editing?.product_id;

  // Load products once
  useEffect(() => {
    listProducts()
      .then((data) => {
        const arr = Array.isArray(data) ? data : data?.data || [];
        setProducts(arr);
      })
      .catch(() => {});
  }, []);

  // Hydrate form when modal opens
  useEffect(() => {
    if (!open) return;

    if (editing) {
      setForm({
        product_id: editing.product_id || editing.product?.id || "",
        color:      editing.color || "",
        color_code: editing.color_code || "",
        sizes:      editing.sizes?.length
          ? editing.sizes
          : [{ size: "S", sku: "", stock: 0 }],
        images:     editing.images || [],
        status:     editing.status || "active",
      });

      setExistingImages(
        (editing.images || []).map((img) =>
          typeof img === "string" ? img : img.url
        )
      );
    } else {
      setForm(EMPTY);
      setExistingImages([]);
    }

    setNewFiles([]);
    setImgError(null);
  }, [editing, open]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      newFiles.forEach((f) => f.__preview && URL.revokeObjectURL(f.__preview));
    };
  }, [newFiles]);

  const onClose = () => !submitting && dispatch(closeForm());
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // ── Sizes ──────────────────────────────────────────────
  const addSize = () =>
    set("sizes", [...form.sizes, { size: "", sku: "", stock: 0 }]);

  const removeSize = (i) =>
    set("sizes", form.sizes.filter((_, idx) => idx !== i));

  const updateSize = (i, field, val) =>
    set(
      "sizes",
      form.sizes.map((s, idx) => (idx === i ? { ...s, [field]: val } : s))
    );

  // ── Images ─────────────────────────────────────────────
  const totalImages = existingImages.length + newFiles.length;

  const acceptFiles = (fileList) => {
    setImgError(null);
    const incoming = Array.from(fileList);
    const accepted = [];

    for (const f of incoming) {
      if (!f.type.startsWith("image/")) continue;
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        setImgError(`"${f.name}" is larger than ${MAX_SIZE_MB}MB`);
        continue;
      }
      f.__preview = URL.createObjectURL(f);
      accepted.push(f);
    }

    const room  = MAX_IMAGES - existingImages.length - newFiles.length;
    const toAdd = accepted.slice(0, Math.max(0, room));

    if (accepted.length > room) {
      setImgError(`Max ${MAX_IMAGES} images allowed`);
    }

    setNewFiles((prev) => [...prev, ...toAdd]);
  };

  const onPickFiles = (e) => {
    acceptFiles(e.target.files);
    e.target.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    acceptFiles(e.dataTransfer.files);
  };

  const removeExisting = (i) =>
    setExistingImages((prev) => prev.filter((_, idx) => idx !== i));

  const removeNew = (i) => {
    setNewFiles((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(i, 1);
      if (removed?.__preview) URL.revokeObjectURL(removed.__preview);
      return copy;
    });
  };

  // ── Submit ─────────────────────────────────────────────
  const onSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;

    const payload = new FormData();
    payload.append("product_id", String(form.product_id));
    payload.append("color", form.color);
    if (form.color_code) payload.append("color_code", form.color_code);
    payload.append("sizes", JSON.stringify(form.sizes));
    payload.append("status", form.status);
    payload.append("keepImages", JSON.stringify(existingImages));

    newFiles.forEach((f) => payload.append("images", f));

    if (isEdit) {
      // UPDATE — send variant id as first arg
      dispatch(updateVariantThunk(editing.id, payload));
    } else {
      // CREATE — no id, product may be preset
      dispatch(createVariantThunk(payload));
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Variant" : "Add Variant"}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-border rounded-md hover:bg-hover"
          >
            Cancel
          </button>
          <button
            form="variant-form"
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-sm font-semibold bg-brand text-white rounded-md hover:bg-brand-dark disabled:opacity-60"
          >
            {submitting ? "Saving…" : isEdit ? "Update" : "Save"}
          </button>
        </>
      }
    >
      <form
        id="variant-form"
        onSubmit={onSubmit}
        encType="multipart/form-data"
        className="space-y-4"
      >
        {/* Product + Color */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Product *">
            <select
              required
              value={form.product_id}
              onChange={(e) => set("product_id", Number(e.target.value))}
              disabled={isPresetProduct}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none bg-surface disabled:bg-hover disabled:cursor-not-allowed disabled:text-muted"
            >
              <option value="">Select product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name || p.title}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Color *">
            <input
              required
              value={form.color}
              onChange={(e) => set("color", e.target.value)}
              placeholder="Red / Navy / Olive"
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none"
            />
          </Field>
        </div>

        {/* Color code + Status */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Color Code">
            <input
              value={form.color_code}
              onChange={(e) => set("color_code", e.target.value)}
              placeholder="#FF0000"
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none font-mono"
            />
          </Field>

          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none bg-surface"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Field>
        </div>

        {/* Sizes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted">Sizes</span>
            <button
              type="button"
              onClick={addSize}
              className="text-xs font-semibold text-brand hover:underline"
            >
              + Add Size
            </button>
          </div>

          <div className="space-y-2">
            {form.sizes.map((s, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 items-end">
                <div>
                  <span className="block mb-1 text-xs text-muted">Size</span>
                  <input
                    value={s.size}
                    onChange={(e) => updateSize(i, "size", e.target.value)}
                    placeholder="S/M/L/XL"
                    className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none"
                  />
                </div>

                <div>
                  <span className="block mb-1 text-xs text-muted">SKU</span>
                  <input
                    value={s.sku}
                    onChange={(e) => updateSize(i, "sku", e.target.value)}
                    placeholder="TSH-RED-S"
                    className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none font-mono"
                  />
                </div>

                <div>
                  <span className="block mb-1 text-xs text-muted">Stock</span>
                  <input
                    type="number"
                    min="0"
                    value={s.stock}
                    onChange={(e) => updateSize(i, "stock", Number(e.target.value))}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none"
                  />
                </div>

                <div>
                  <span className="block mb-1 text-xs text-muted">&nbsp;</span>
                  <button
                    type="button"
                    onClick={() => removeSize(i)}
                    disabled={form.sizes.length === 1}
                    className="w-full h-[38px] text-xs font-semibold text-danger hover:underline disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted">
              Images (Cloudinary upload)
            </span>
            <span className="text-xs text-muted">
              {totalImages}/{MAX_IMAGES}
            </span>
          </div>

          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border rounded-md px-4 py-6 text-center text-sm text-muted cursor-pointer hover:border-brand transition"
          >
            Drag & drop images here, or click to pick
            <span className="block text-xs mt-1">
              JPG/PNG/WEBP · up to {MAX_SIZE_MB}MB each · max {MAX_IMAGES}
            </span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={onPickFiles}
            />
          </div>

          {imgError && <p className="text-xs text-danger mt-2">{imgError}</p>}

          {totalImages > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
              {existingImages.map((src, i) => (
                <div key={`e-${i}`} className="relative group">
                  <img
                    src={src}
                    alt=""
                    className="w-full h-24 object-cover rounded border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => removeExisting(i)}
                    className="absolute top-1 right-1 w-5 h-5 text-[10px] leading-none bg-black/70 text-white rounded-full hover:bg-black"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {newFiles.map((f, i) => (
                <div key={`n-${i}`} className="relative group">
                  <img
                    src={f.__preview}
                    alt=""
                    className="w-full h-24 object-cover rounded border border-border"
                  />
                  <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white rounded px-1">
                    new
                  </span>
                  <button
                    type="button"
                    onClick={() => removeNew(i)}
                    className="absolute top-1 right-1 w-5 h-5 text-[10px] leading-none bg-black/70 text-white rounded-full hover:bg-black"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
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