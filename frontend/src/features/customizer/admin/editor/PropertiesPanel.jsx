import { ImageField, NumField } from "../../ui/Fields.jsx";
import { btnDanger, inputCls, labelCls } from "../../ui/controls";
import { updateNode } from "./editorUtils.js";

/** Base-layout properties of the selected node. Inputs and canvas dragging share the same state. */
export default function PropertiesPanel({ node, edit, applyLayout, onDelete }) {
  if (!node) {
    return <p className="px-5 py-10 text-center font-sans text-sm leading-relaxed text-subtle">Select a node on the canvas or in the list to edit its properties.</p>;
  }
  const set = (patch) => edit((d) => updateNode(d, node.id, patch));
  return (
    <div className="space-y-4 p-3">
      <label className="block">
        <span className={labelCls}>Name</span>
        <input className={inputCls} value={node.name} onChange={(e) => set({ name: e.target.value })} />
      </label>
      <p className="font-sans text-xs text-subtle">ID: <code className="text-cream/80">{node.id}</code></p>
      <ImageField value={node.image} onChange={(ref) => set({ image: ref })} />
      <div className="grid grid-cols-2 gap-3">
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
      <button className={btnDanger} onClick={() => onDelete(node)}>Delete node</button>
    </div>
  );
}
