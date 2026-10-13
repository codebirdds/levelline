import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../../components/common/Modal";
import {
  selectCategoryFormOpen, selectCategoryEditing,
  closeForm,
} from "../categorySlice";
import { createCategoryThunk, updateCategoryThunk } from "../categoryThunks";

const EMPTY = { name: "", description: "", status: "active", image: null };

export default function CategoryFormModal() {
  const dispatch = useDispatch();
  const open    = useSelector(selectCategoryFormOpen);
  const editing = useSelector(selectCategoryEditing);
  const [form, setForm] = useState(EMPTY);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (editing) {
      const img = Array.isArray(editing.images) ? editing.images[0] : editing.images;
      setForm({ name: editing.name, description: editing.description || "", status: editing.status || "active", image: null });
      setPreview(img || null);
    } else {
      setForm(EMPTY);
      setPreview(null);
    }
  }, [editing, open]);

  const onClose = () => dispatch(closeForm());

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("description", form.description);
    payload.append("status", form.status);
    if (form.image) payload.append("images", form.image);

    if (editing) dispatch(updateCategoryThunk(editing.id, payload));
    else         dispatch(createCategoryThunk(payload));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Edit Category" : "Add Category"}
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-hover">Cancel</button>
          <button form="category-form" type="submit" className="px-4 py-2 text-sm font-semibold bg-brand text-white rounded-md hover:bg-brand-dark">
            {editing ? "Save Changes" : "Create"}
          </button>
        </>
      }
    >
      <form id="category-form" onSubmit={onSubmit} encType="multipart/form-data" className="space-y-4">
        <label className="block">
          <span className="block mb-1 text-xs font-medium text-muted">Name</span>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none"
          />
        </label>

        <label className="block">
          <span className="block mb-1 text-xs font-medium text-muted">Description</span>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none"
          />
        </label>

        <label className="block">
          <span className="block mb-1 text-xs font-medium text-muted">Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-brand file:text-white"
          />
          {preview && (
            <img src={preview} alt="preview" className="mt-2 w-20 h-20 object-cover rounded border border-border" />
          )}
        </label>

        <label className="block">
          <span className="block mb-1 text-xs font-medium text-muted">Status</span>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none bg-surface"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
      </form>
    </Modal>
  );
}