import { useEffect, useRef, useState } from "react";
import { inputCls, labelCls, btnCls } from "./controls";
import { resolveImageSrc, saveImageFile } from "../storage/assetStorage.js";
import { toast } from "./toast.jsx";

const fmt = (v) => String(Math.round((Number(v) || 0) * 10) / 10);

/** Number input that stays editable while typing and re-syncs when the canvas changes the value. */
export function NumField({ label, value, onChange, step = 1, min }) {
  const [text, setText] = useState(fmt(value));
  const focused = useRef(false);
  useEffect(() => { if (!focused.current) setText(fmt(value)); }, [value]);
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <input
        type="number"
        step={step}
        min={min}
        value={text}
        className={inputCls}
        onFocus={() => { focused.current = true; }}
        onBlur={() => { focused.current = false; setText(fmt(value)); }}
        onChange={(e) => {
          setText(e.target.value);
          const n = parseFloat(e.target.value);
          if (Number.isFinite(n) && (min === undefined || n >= min)) onChange(n);
        }}
      />
    </label>
  );
}

/** Thumbnail + upload. onChange(ref, {width,height}). Shows a clear message if the image is rejected. */
export function ImageField({ label = "Image", value, onChange, children }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const { ref, width, height } = await saveImageFile(file);
      onChange(ref, { width, height });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };
  const src = resolveImageSrc(value);
  return (
    <div>
      <span className={labelCls}>{label}</span>
      <div className="flex items-center gap-3">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-ink-4 bg-[repeating-conic-gradient(#2e2820_0%_25%,#232018_0%_50%)] bg-[length:12px_12px]">
          {src ? <img src={src} alt="" className="max-h-full max-w-full object-contain" /> : <span className="font-sans text-xs text-subtle">none</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btnCls} disabled={busy} onClick={() => input.current?.click()}>{busy ? "Uploading" : value ? "Replace image" : "Upload image"}</button>
          {children}
        </div>
        <input ref={input} type="file" accept="image/*" className="hidden" onChange={pick} />
      </div>
    </div>
  );
}
