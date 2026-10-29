import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../../components/common/Modal";
import { selectMediaModalOpen, selectMediaEditing, selectMediaSubmitting, closeModal } from "../siteMediaSlice";
import { createMediaThunk, updateMediaThunk } from "../siteMediaThunks";

// ✅ Fixed Dropdown Options for Admin
const SECTION_OPTIONS = [
  { key: "home_hero", label: "Home Page Hero" },
  { key: "home_define_fit", label: "Defining Your Fit" },
  { key: "ready_to_wear_hero", label: "Ready to Wear Hero" },
  { key: "fabric_hero", label: "Fabric Hero" },
];

const EMPTY = { section_key: "", display_name: "", media_type: "image", status: "active", desktop_media: null, mobile_media: null };

export default function SiteMediaFormModal() {
  const dispatch = useDispatch();
  const open = useSelector(selectMediaModalOpen);
  const editing = useSelector(selectMediaEditing);
  const submitting = useSelector(selectMediaSubmitting);
  
  const [form, setForm] = useState(EMPTY);
  const [desktopPreview, setDesktopPreview] = useState(null);
  const [mobilePreview, setMobilePreview] = useState(null);

  useEffect(() => {
    if (editing) {
      setForm({ ...editing, desktop_media: null, mobile_media: null });
      setDesktopPreview(editing.desktop_url);
      setMobilePreview(editing.mobile_url);
    } else {
      setForm(EMPTY);
      setDesktopPreview(null);
      setMobilePreview(null);
    }
  }, [editing, open]);

  const onClose = () => !submitting && dispatch(closeModal());

  // ✅ Handle Dropdown Change
  const handleSectionChange = (e) => {
    const selectedKey = e.target.value;
    const selectedOption = SECTION_OPTIONS.find(opt => opt.key === selectedKey);
    setForm({ 
      ...form, 
      section_key: selectedKey,
      display_name: selectedOption ? selectedOption.label : "" // Automatically set display name
    });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, [field]: file });
    const url = URL.createObjectURL(file);
    if (field === "desktop_media") setDesktopPreview(url);
    if (field === "mobile_media") setMobilePreview(url);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("section_key", form.section_key);
    payload.append("display_name", form.display_name);
    payload.append("media_type", form.media_type);
    payload.append("status", form.status);
    
    if (form.desktop_media) payload.append("desktop_media", form.desktop_media);
    if (form.mobile_media) payload.append("mobile_media", form.mobile_media);

    if (editing) dispatch(updateMediaThunk(editing.id, payload));
    else dispatch(createMediaThunk(payload));
  };

  return (
    <Modal open={open} onClose={onClose} title={editing ? "Edit Section Media" : "Add Section Media"}
      footer={
        <>
          <button onClick={onClose} disabled={submitting} className="px-4 py-2 text-sm border rounded-md disabled:opacity-60">Cancel</button>
          <button form="media-form" type="submit" disabled={submitting} className="px-4 py-2 text-sm font-semibold bg-brand text-white rounded-md disabled:opacity-60">
            {submitting ? "Saving…" : editing ? "Update" : "Save"}
          </button>
        </>
      }
    >
      <form id="media-form" onSubmit={onSubmit} className="space-y-4">
        
        {/* ✅ Dropdown for Admin */}
        <label className="block">
          <span className="block mb-1 text-xs font-medium text-muted">Select Section</span>
          <select 
            required 
            value={form.section_key} 
            onChange={handleSectionChange} 
            disabled={!!editing} // Edit mode me change nahi kar sakte
            className="w-full border rounded-md px-3 py-2 text-sm bg-surface disabled:opacity-60"
          >
            <option value="" disabled>-- Select a section --</option>
            {SECTION_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>{opt.label}</option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="block mb-1 text-xs font-medium text-muted">Media Type</span>
            <select value={form.media_type} onChange={(e) => setForm({ ...form, media_type: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm bg-surface">
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </label>
          <label className="block">
            <span className="block mb-1 text-xs font-medium text-muted">Status</span>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm bg-surface">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
          <label className="block">
            <span className="block mb-1 text-xs font-medium text-muted">Desktop File (PC)</span>
            <input type="file" accept={form.media_type === "video" ? "video/*" : "image/*"} onChange={(e) => handleFileChange(e, "desktop_media")} className="w-full text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-brand file:text-white" />
            {desktopPreview && (
               form.media_type === "video" 
                 ? <p className="text-xs text-blue-500 mt-2 truncate">Video Selected</p>
                 : <img src={desktopPreview} className="mt-2 h-16 w-full object-cover rounded border" />
            )}
          </label>
          <label className="block">
            <span className="block mb-1 text-xs font-medium text-muted">Mobile File</span>
            <input type="file" accept={form.media_type === "video" ? "video/*" : "image/*"} onChange={(e) => handleFileChange(e, "mobile_media")} className="w-full text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-brand file:text-white" />
            {mobilePreview && (
               form.media_type === "video" 
                 ? <p className="text-xs text-blue-500 mt-2 truncate">Video Selected</p>
                 : <img src={mobilePreview} className="mt-2 h-16 w-full object-cover rounded border" />
            )}
          </label>
        </div>
      </form>
    </Modal>
  );
}