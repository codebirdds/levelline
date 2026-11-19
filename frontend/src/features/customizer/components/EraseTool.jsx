// src/components/EraseTool.jsx
// Brush se mask banao → auto-fill se "pta hi na chale" wala fill.
import { useRef, useState } from "react";
import { Modal } from "../ui/Modal.jsx";
import { btnCls, btnGold, labelCls } from "../ui/controls";
import { inpaintDiffuse, inpaintAI } from "../engine/inpaintUtils.js";

export default function EraseTool({ open, node, onClose, onApply }) {
  const [brush, setBrush] = useState(40);
  const [mode, setMode] = useState("diffuse");
  const [busy, setBusy] = useState(false);
  const imgRef = useRef(null);
  const maskRef = useRef(null);
  const painting = useRef(false);

  const initMask = (e) => {
    const c = maskRef.current;
    if (!c) return;
    const r = e.currentTarget.getBoundingClientRect();
    c.width = imgRef.current?.naturalWidth || r.width;
    c.height = imgRef.current?.naturalHeight || r.height;
    c.getContext("2d").clearRect(0, 0, c.width, c.height);
  };

  const paint = (e) => {
    if (!painting.current) return;
    const c = maskRef.current;
    const r = c.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * c.width;
    const y = ((e.clientY - r.top) / r.height) * c.height;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "rgba(255,80,80,0.95)";
    ctx.beginPath();
    ctx.arc(x, y, (brush * c.width) / r.width, 0, Math.PI * 2);
    ctx.fill();
  };

  const apply = async () => {
    setBusy(true);
    try {
      const imgCanvas = document.createElement("canvas");
      const img = imgRef.current;
      imgCanvas.width = img.naturalWidth;
      imgCanvas.height = img.naturalHeight;
      imgCanvas.getContext("2d").drawImage(img, 0, 0);

      const result =
        mode === "ai"
          ? await inpaintAI(imgCanvas, maskRef.current, process.env.REACT_APP_STABILITY_KEY)
          : await inpaintDiffuse(img, maskRef.current);

      onApply(result);
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!open || !node) return null;

  return (
    <Modal
      open={open}
      title="Erase / replace region"
      onClose={onClose}
      size="max-w-2xl"
      footer={
        <>
          <button className={btnCls} onClick={onClose}>Cancel</button>
          <button className={btnGold} onClick={apply} disabled={busy}>
            {busy ? "Filling…" : "Auto-fill"}
          </button>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-xs text-subtle">
          Jo part hatana hai uspe brush chalao. Auto-fill aas paas ke fabric se seamlessly bhar dega.
        </p>
        <div className="flex items-center gap-3">
          <span className={labelCls}>Brush</span>
          <input
            type="range"
            min="5"
            max="150"
            value={brush}
            onChange={(e) => setBrush(+e.target.value)}
            className="flex-1 accent-gold"
          />
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="rounded-sm bg-ink px-2 py-1 text-sm"
          >
            <option value="diffuse">Local (fast)</option>
            <option value="ai">AI (best)</option>
          </select>
        </div>
        <div className="relative mx-auto max-w-lg rounded bg-cream/90">
          <img
            ref={imgRef}
            src={node.image}
            className="block w-full select-none"
            draggable={false}
            onLoad={initMask}
          />
          <canvas
            ref={maskRef}
            className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
            onPointerDown={(e) => {
              painting.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              paint(e);
            }}
            onPointerMove={paint}
            onPointerUp={() => { painting.current = false; }}
            onPointerLeave={() => { painting.current = false; }}
          />
        </div>
      </div>
    </Modal>
  );
}