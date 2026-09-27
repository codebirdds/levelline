import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../../components/common/Modal";
import {
  selectCategoryFormOpen, selectCategoryEditing,
  closeForm,
} from "../categorySlice";
import { createCategoryThunk, updateCategoryThunk } from "../categoryThunks";

const EMPTY = { name: "", slug: "" };

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function CategoryFormModal() {
  const dispatch = useDispatch();
  const open    = useSelector(selectCategoryFormOpen);
  const editing = useSelector(selectCategoryEditing);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    setForm(editing ? { name: editing.name, slug: editing.slug } : EMPTY);
  }, [editing, open]);

  const onClose = () => dispatch(closeForm());

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
    };
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
      <form id="category-form" onSubmit={onSubmit} className="space-y-4">
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
          <span className="block mb-1 text-xs font-medium text-muted">Slug (auto if empty)</span>
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder={slugify(form.name)}
            className="w-full border border-border rounded-md px-3 py-2 text-sm focus:border-brand outline-none font-mono"
          />
        </label>
      </form>
    </Modal>
  );
}