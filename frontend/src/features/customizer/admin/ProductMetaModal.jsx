import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal.jsx";
import { NumField } from "../ui/Fields.jsx";
import { btnCls, btnGold, inputCls, labelCls } from "../ui/controls";
import { PRESETS } from "../storage/seedData.js";

const EMPTY = { name: "", description: "", category: "Shirts", basePrice: 0, width: 1000, height: 1400, preset: "shirt" };

/** product = null => create. */
export default function ProductMetaModal({ open, product, onClose, onSubmit }) {
  const [f, setF] = useState(EMPTY);
  useEffect(() => {
    if (open) setF(product ? { ...EMPTY, ...product } : EMPTY);
  }, [open, product]);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const ok = f.name.trim().length > 1 && Number(f.basePrice) >= 0;

  return (
    <Modal open={open} title={product ? "Edit product" : "New product"} onClose={onClose} footer={
      <>
        <button className={btnCls} onClick={onClose}>Cancel</button>
        <button className={btnGold} disabled={!ok} onClick={() => onSubmit({ ...f, canvas: { width: Number(f.width), height: Number(f.height) } })}>{product ? "Save" : "Create product"}</button>
      </>
    }>
      <div className="space-y-4">
        <label className="block"><span className={labelCls}>Name</span><input autoFocus className={inputCls} value={f.name} onChange={set("name")} /></label>
        <label className="block"><span className={labelCls}>Description</span><textarea rows={3} className={inputCls} value={f.description} onChange={set("description")} /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block"><span className={labelCls}>Category</span><input className={inputCls} value={f.category} onChange={set("category")} /></label>
          <NumField label="Base price (₹)" min={0} value={f.basePrice} onChange={(v) => setF((s) => ({ ...s, basePrice: v }))} />
        </div>
        {!product && (
          <>
            <label className="block"><span className={labelCls}>Start from</span>
              <select className={inputCls} value={f.preset} onChange={set("preset")}>
                {Object.entries(PRESETS).map(([k, p]) => <option key={k} value={k}>{p.label}</option>)}
              </select></label>
            <div className="grid grid-cols-2 gap-3">
              <NumField label="Canvas width" min={100} value={f.width} onChange={(v) => setF((s) => ({ ...s, width: v }))} />
              <NumField label="Canvas height" min={100} value={f.height} onChange={(v) => setF((s) => ({ ...s, height: v }))} />
            </div>
            <p className="font-sans text-xs text-subtle">All node positions are stored in these canvas units, so layouts scale to any screen.</p>
          </>
        )}
      </div>
    </Modal>
  );
}
