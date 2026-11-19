import { useState } from "react";
import { Modal } from "../../ui/Modal.jsx";
import { ImageField, NumField } from "../../ui/Fields.jsx";
import { btnCls, btnGold, inputCls, labelCls } from "../../ui/controls";

export default function AddNodeModal({ open, canvas, onClose, onAdd }) {
  const [name, setName] = useState("");
  const [img, setImg] = useState(null); // {ref,width,height}
  const [size, setSize] = useState({ width: 300, height: 300 });
  const reset = () => { setName(""); setImg(null); setSize({ width: 300, height: 300 }); };
  const close = () => { reset(); onClose(); };
  const ok = name.trim() && img && size.width > 0 && size.height > 0;

  return (
    <Modal open={open} title="Add node" onClose={close} footer={
      <>
        <button className={btnCls} onClick={close}>Cancel</button>
        <button className={btnGold} disabled={!ok} onClick={() => { onAdd({ name, image: img.ref, ...size }); reset(); }}>Add to canvas</button>
      </>
    }>
      <div className="space-y-4">
        <label className="block"><span className={labelCls}>Node name</span>
          <input autoFocus className={inputCls} value={name} placeholder="e.g. Epaulette" onChange={(e) => setName(e.target.value)} /></label>
        <ImageField label="Node image" value={img?.ref} onChange={(ref, dim) => {
          setImg({ ref, ...dim });
          const w = Math.min(300, canvas.width * 0.4);
          setSize({ width: Math.round(w), height: Math.round((w * dim.height) / dim.width) });
        }} />
        <div className="grid grid-cols-2 gap-3">
          <NumField label="Width (canvas units)" min={1} value={size.width} onChange={(v) => setSize((s) => ({ ...s, width: v }))} />
          <NumField label="Height (canvas units)" min={1} value={size.height} onChange={(v) => setSize((s) => ({ ...s, height: v }))} />
        </div>
        <p className="font-sans text-xs text-subtle">It is placed in the centre of the canvas, on the top layer. Drag it where it belongs.</p>
      </div>
    </Modal>
  );
}
