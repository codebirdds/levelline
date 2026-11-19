import { useState } from "react";
import { Modal } from "../../ui/Modal.jsx";
import { ImageField } from "../../ui/Fields.jsx";
import { btnCls, btnDanger, inputCls, labelCls } from "../../ui/controls";
import { PRESETS } from "../../storage/seedData.js";
import { getDraft, listProducts } from "../../storage/productStorage.js";

/** FULL GARMENT REPLACEMENT — swaps the whole node layout, groups and rules. Explicit, confirmed, never automatic. */
export default function ReplaceGarmentModal({ open, productId, onClose, onApply }) {
  const [source, setSource] = useState("preset:shirt");
  const [base, setBase] = useState("");
  const others = listProducts().filter((p) => p.id !== productId);
  const apply = () => {
    if (source.startsWith("preset:")) onApply({ preset: source.slice(7), baseImage: base });
    else onApply({ fromTemplate: getDraft(source.slice(5)), baseImage: base });
    setBase("");
  };
  return (
    <Modal open={open} title="Replace full garment" onClose={onClose} footer={
      <>
        <button className={btnCls} onClick={onClose}>Cancel</button>
        <button className={btnDanger} onClick={apply}>Replace garment</button>
      </>
    }>
      <div className="space-y-4">
        <p className="font-sans text-sm leading-relaxed text-cream/80">
          This replaces <b>all nodes, configuration groups and rules</b> of this draft with another garment layout. Already published versions and cart items are NOT affected until you publish again.
        </p>
        <label className="block"><span className={labelCls}>Load node layout from</span>
          <select className={inputCls} value={source} onChange={(e) => setSource(e.target.value)}>
            {Object.entries(PRESETS).map(([k, p]) => <option key={k} value={`preset:${k}`}>Preset — {p.label}</option>)}
            {others.map((p) => <option key={p.id} value={`from:${p.id}`}>Copy layout of — {p.name}</option>)}
          </select></label>
        <ImageField label="New complete garment preview image (optional)" value={base} onChange={(ref) => setBase(ref)} />
      </div>
    </Modal>
  );
}
