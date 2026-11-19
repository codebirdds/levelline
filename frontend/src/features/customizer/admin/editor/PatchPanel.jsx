import { ImageField, NumField } from "../../ui/Fields.jsx";
import { btnCls, inputCls, labelCls } from "../../ui/controls";
import { touchesImage, touchesLayout, UPDATE_TYPES } from "../../engine/patchMerger.js";
import { setUpdateType, updateOption } from "./editorUtils.js";

const HELP = {
  none: "No changes — this node stays exactly as in the base garment. Drag/resize it on the canvas, or pick a type, to start a patch.",
  image: "Replaces the image only. Geometry is preserved from the baseline.",
  position: "Changes geometry/visibility/layer only. The image is preserved. Only differences are saved.",
  both: "Replaces the image AND changes geometry. Only differences are saved.",
};

export default function PatchPanel({ draft, target, baseline, resolved, selectedId, onSelect, edit, applyLayout, applyImage }) {
  const group = draft.groups.find((g) => g.id === target.groupId);
  const option = group?.options.find((o) => o.id === target.optionId);
  if (!option) return null;
  const updates = option.updates || {};
  const node = draft.nodes.find((n) => n.id === selectedId);
  const upd = node ? updates[node.id] : null;
  const type = upd?.type ?? "none";
  const eff = node && resolved.nodes.find((n) => n.id === node.id);
  const base = node && baseline.nodes.find((n) => n.id === node.id);
  const setType = (nodeId, t) => edit((d) => setUpdateType(d, group.id, option.id, nodeId, t));

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="space-y-3 border-b border-ink-4 p-3">
        <p className={`${labelCls} mb-0`}>Patch · {group.name}</p>
        <div className="grid grid-cols-[1fr_6.5rem] gap-2">
          <label><span className={labelCls}>Option name</span>
            <input className={inputCls} value={option.name} onChange={(e) => edit((d) => updateOption(d, group.id, option.id, { name: e.target.value }))} /></label>
          <NumField label="Price +" value={option.priceDelta || 0} onChange={(v) => edit((d) => updateOption(d, group.id, option.id, { priceDelta: v }))} />
        </div>
      </div>

      <ul className="max-h-[42%] shrink-0 overflow-y-auto border-b border-ink-4">
        {draft.nodes.map((n) => {
          const t = updates[n.id]?.type ?? "none";
          return (
            <li key={n.id} className={`flex items-center gap-2 border-l-2 px-3 py-1.5 ${n.id === selectedId ? "border-gold bg-ink-4/60" : "border-transparent"}`}>
              <button className="min-w-0 flex-1 truncate text-left font-sans text-sm text-cream" onClick={() => onSelect(n.id)}>{n.name}</button>
              <div className="flex overflow-hidden rounded-sm border border-ink-4" role="group" aria-label={`${n.name} update type`}>
                {UPDATE_TYPES.map((u) => (
                  <button key={u} onClick={() => { setType(n.id, u); onSelect(n.id); }}
                    className={`px-1.5 py-1 font-sans text-xs font-semibold uppercase ${t === u ? "bg-gold text-ink" : "text-subtle hover:text-cream"}`}>{u === "position" ? "pos" : u === "image" ? "img" : u}</button>
                ))}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3">
        {!node ? (
          <p className="font-sans text-sm text-subtle">Select a node to configure what this option changes.</p>
        ) : (
          <>
            <p className="font-sans text-sm font-semibold text-cream">{node.name} <span className="ml-1 rounded-sm bg-ink-4 px-1.5 py-0.5 font-sans text-xs uppercase text-gold">{type}</span></p>
            <p className="font-sans text-xs leading-relaxed text-subtle">{HELP[type]}</p>
            {touchesImage(type) && (
              <ImageField label="Replacement image" value={upd?.image === undefined ? "" : upd.image} onChange={(ref) => applyImage(node.id, ref)}>
                {upd && "image" in upd && upd.image !== null && <button className={btnCls} onClick={() => applyImage(node.id, null)}>Clear image</button>}
              </ImageField>
            )}
            {touchesLayout(type) && eff && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <NumField label="X" value={eff.x} onChange={(v) => applyLayout(node.id, { x: v })} />
                  <NumField label="Y" value={eff.y} onChange={(v) => applyLayout(node.id, { y: v })} />
                  <NumField label="Width" min={1} value={eff.width} onChange={(v) => applyLayout(node.id, { width: v })} />
                  <NumField label="Height" min={1} value={eff.height} onChange={(v) => applyLayout(node.id, { height: v })} />
                  <NumField label="Rotation °" value={eff.rotation || 0} onChange={(v) => applyLayout(node.id, { rotation: v })} />
                  <NumField label="Layer (z)" value={eff.zIndex} onChange={(v) => applyLayout(node.id, { zIndex: Math.round(v) })} />
                </div>
                <label className="flex items-center gap-2 font-sans text-sm text-cream"><input type="checkbox" className="accent-gold" checked={eff.visible} onChange={(e) => applyLayout(node.id, { visible: e.target.checked })} /> Visible</label>
              </>
            )}
            {type !== "none" && (
              <div>
                <span className={labelCls}>Saved patch (differences only)</span>
                <pre className="max-h-40 overflow-auto rounded-sm bg-ink p-2 font-mono text-xs text-cream/80">{JSON.stringify(upd, null, 1).replace(/"(asset:[^"]{6})[^"]*"/g, '"$1…"')}</pre>
                <button className={`${btnCls} mt-2`} onClick={() => setType(node.id, "none")}>Reset node to baseline</button>
              </div>
            )}
            {base && type !== "none" && <p className="font-sans text-xs text-subtle">Baseline: x {Math.round(base.x)}, y {Math.round(base.y)}, {Math.round(base.width)}×{Math.round(base.height)}</p>}
          </>
        )}
      </div>
    </div>
  );
}
