import { useState } from "react";
import { ImageField, NumField } from "../../ui/Fields.jsx";
import { btnDanger, btnCls, btnGold, inputCls, labelCls } from "../../ui/controls";
import { updateNode, flipNode, setCropShape, resetCrop, addNodeVariant, updateNodeVariant, deleteNodeVariant } from "./editorUtils.js";
import { normalizeCrop } from "../../engine/cropUtils.js";
import Icon from "../../ui/Icon.jsx";
import { resolveImageSrc } from "../../storage/assetStorage.js";
import { toast } from "../../ui/toast.jsx";

export default function PropertiesPanel({ node, edit, applyLayout, onDelete, onEnterCropMode, onEraseNode, onExtendMode }) {
  const [newVariantName, setNewVariantName] = useState("");

  if (!node) {
    return (
      <p className="px-5 py-10 text-center font-sans text-sm leading-relaxed text-subtle">
        Select a node on the canvas or in the list to edit its properties.
      </p>
    );
  }

  const set = (patch) => edit((d) => updateNode(d, node.id, patch));
  const crop = normalizeCrop(node.crop);
  const cropType = crop.type === "polygon" ? "polygon" : "rect";

  const handleAddVariant = (ref) => {
    const name = newVariantName.trim();
    if (!name) {
      toast.error("Enter a name first");
      return;
    }
    edit((d) => addNodeVariant(d, node.id, { name, image: ref }));
    setNewVariantName("");
    toast.success(`Variant "${name}" added`);
  };

  return (
    <div className="space-y-4 p-3">
      <label className="block">
        <span className={labelCls}>Name</span>
        <input className={inputCls} value={node.name} onChange={(e) => set({ name: e.target.value })} />
      </label>
      <p className="font-sans text-xs text-subtle">ID: <code className="text-cream/80">{node.id}</code></p>
      <ImageField label="Default Image" value={node.image} onChange={(ref) => set({ image: ref })} />

      {/* ?? FLAG + CRUD SECTION */}
      <div className="rounded-sm border border-ink-4 p-3 space-y-3">
        <label className="flex items-center gap-2 font-sans text-sm font-semibold text-cream">
          <input
            type="checkbox"
            checked={!!node.useVariants}
            onChange={(e) => set({ useVariants: e.target.checked })}
            className="accent-gold"
          />
          Override fabric with custom images
        </label>
        <p className="font-sans text-xs leading-relaxed text-subtle">
          {node.useVariants
            ? "Customer will pick from the images below instead of seeing the fabric texture on this node."
            : "Customer sees the fabric texture on this node (no override)."}
        </p>

        {node.useVariants && (
          <div className="space-y-2 border-t border-ink-4 pt-3">
            <label className="block">
              <span className={labelCls}>Nested Accordion Title</span>
              <input
                className={inputCls}
                placeholder="e.g. Collar Fabric"
                value={node.variantTitle || ""}
                onChange={(e) => set({ variantTitle: e.target.value })}
              />
            </label>

            <p className={`${labelCls} mt-3`}>Image Variants · {(node.imageVariants || []).length}</p>

            {(node.imageVariants || []).length === 0 && (
              <p className="font-sans text-xs italic text-subtle">No variants yet — add the first one below.</p>
            )}

            {(node.imageVariants || []).map((v) => (
              <div key={v.id} className="flex items-center gap-2 rounded-sm border border-ink-4 bg-ink p-2">
                <div className="size-12 shrink-0 overflow-hidden rounded-sm border border-ink-4 bg-[repeating-conic-gradient(#2e2820_0%_25%,#232018_0%_50%)] bg-[length:10px_10px]">
                  <img src={resolveImageSrc(v.image)} alt="" className="h-full w-full object-contain" />
                </div>
                <input
                  className={`${inputCls} min-w-0 flex-1`}
                  value={v.name}
                  placeholder="Variant name"
                  onChange={(e) => edit((d) => updateNodeVariant(d, node.id, v.id, { name: e.target.value }))}
                />
                <button
                  className={`${btnCls} hover:border-danger hover:text-danger`}
                  title="Delete variant"
                  onClick={() => edit((d) => deleteNodeVariant(d, node.id, v.id))}
                >
                  <Icon name="trash" />
                </button>
              </div>
            ))}

            <div className="rounded-sm border border-dashed border-ink-4 bg-ink p-2 space-y-2 mt-2">
              <p className="font-sans text-xs font-semibold uppercase tracking-wide text-gold">Add new variant</p>
              <input
                className={inputCls}
                placeholder="Variant name (e.g. Red Collar)"
                value={newVariantName}
                onChange={(e) => setNewVariantName(e.target.value)}
              />
              <ImageField
                label="Variant image"
                value=""
                onChange={handleAddVariant}
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-ink-4 pt-4">
        <NumField label="X" value={node.x} onChange={(v) => applyLayout(node.id, { x: v })} />
        <NumField label="Y" value={node.y} onChange={(v) => applyLayout(node.id, { y: v })} />
        <NumField label="Width" min={1} value={node.width} onChange={(v) => applyLayout(node.id, { width: v })} />
        <NumField label="Height" min={1} value={node.height} onChange={(v) => applyLayout(node.id, { height: v })} />
        <NumField label="Rotation °" value={node.rotation || 0} onChange={(v) => applyLayout(node.id, { rotation: v })} />
        <NumField label="Layer (z)" value={node.zIndex} onChange={(v) => applyLayout(node.id, { zIndex: Math.round(v) })} />
      </div>

      <div className="flex gap-5 font-sans text-sm text-cream">
        <label className="flex items-center gap-2"><input type="checkbox" checked={node.visible} onChange={(e) => set({ visible: e.target.checked })} className="accent-gold" /> Visible</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={!!node.locked} onChange={(e) => set({ locked: e.target.checked })} className="accent-gold" /> Locked</label>
      </div>

      <div className="border-t border-ink-4 pt-4">
        <span className={labelCls}>Reverse / Flip</span>
        <div className="flex gap-2">
          <button className={`${btnCls} flex-1 ${node.flipX ? "border-gold text-gold" : ""}`} onClick={() => edit((d) => flipNode(d, node.id, "x"))}>Flip H</button>
          <button className={`${btnCls} flex-1 ${node.flipY ? "border-gold text-gold" : ""}`} onClick={() => edit((d) => flipNode(d, node.id, "y"))}>Flip V</button>
        </div>
      </div>

      <div className="border-t border-ink-4 pt-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className={`${labelCls} mb-0`}>Crop · {cropType}</span>
          <button className={btnCls} onClick={() => onEnterCropMode?.(node.id)}>Edit on canvas</button>
        </div>
        {cropType === "rect" && (
          <div className="grid grid-cols-2 gap-2">
            <NumField label="Left %" min={0} max={99} value={crop.x} onChange={(v) => edit((d) => setCropShape(d, node.id, { ...crop, x: v }))} />
            <NumField label="Top %" min={0} max={99} value={crop.y} onChange={(v) => edit((d) => setCropShape(d, node.id, { ...crop, y: v }))} />
            <NumField label="Width %" min={1} max={100} value={crop.w} onChange={(v) => edit((d) => setCropShape(d, node.id, { ...crop, w: v }))} />
            <NumField label="Height %" min={1} max={100} value={crop.h} onChange={(v) => edit((d) => setCropShape(d, node.id, { ...crop, h: v }))} />
          </div>
        )}
        {cropType === "polygon" && <p className="font-sans text-xs text-subtle">Lasso crop · {crop.points.length} points.</p>}
        <div>
          <span className="mb-1 block font-sans text-xs text-subtle">Feather · {crop.feather || 0}</span>
          <input type="range" min="0" max="20" step="1" value={crop.feather || 0} onChange={(e) => edit((d) => setCropShape(d, node.id, { ...crop, feather: Number(e.target.value) }))} className="w-full accent-gold" />
        </div>
        <button className={btnCls} onClick={() => edit((d) => resetCrop(d, node.id))}>Reset crop</button>
      </div>

      <div className="border-t border-ink-4 pt-4 space-y-2">
        <span className={labelCls}>Add / Extend Fabric</span>
        <p className="font-sans text-xs text-subtle">Drag the box outward to seamlessly add fabric.</p>
        <button className={`${btnGold} w-full`} onClick={() => onExtendMode?.(node.id)}>? Expand Area</button>
      </div>

      <div className="border-t border-ink-4 pt-4 space-y-2">
        <span className={labelCls}>Erase / replace region</span>
        <button className={`${btnCls} w-full`} onClick={() => onEraseNode?.(node)}>Open eraser…</button>
      </div>

      <button className={btnDanger} onClick={() => onDelete(node)}>Delete node</button>
    </div>
  );
}
