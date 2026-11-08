import Icon from "../../ui/Icon.jsx";
import { btnGold, iconBtn, labelCls } from "../../ui/controls";
import { moveLayer, updateNode } from "./editorUtils.js";

const TYPE_BADGE = { image: "IMG", position: "POS", both: "BOTH" };

export default function NodesPanel({ draft, selectedId, onSelect, edit, onAdd, onDelete, patchTypes }) {
  const nodes = [...draft.nodes].sort((a, b) => b.zIndex - a.zIndex);
  const baseMode = !patchTypes;
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between border-b border-ink-4 px-3 py-2.5">
        <span className={`${labelCls} mb-0`}>Garment nodes · {nodes.length}</span>
        {baseMode && <button className={btnGold} onClick={onAdd}><Icon name="plus" /> Add node</button>}
      </div>
      <ul className="min-h-0 flex-1 overflow-y-auto py-1">
        {nodes.length === 0 && <li className="px-4 py-8 text-center font-sans text-sm text-subtle">No nodes yet. Add the first layer of this garment.</li>}
        {nodes.map((n) => {
          const active = n.id === selectedId;
          const badge = patchTypes?.[n.id];
          return (
            <li key={n.id} className={`flex items-center gap-0.5 border-l-2 px-2 py-1 ${active ? "border-gold bg-ink-4/60" : "border-transparent hover:bg-ink-4/30"}`}>
              {baseMode && (
                <>
                  <button className={iconBtn} title={n.visible ? "Hide" : "Show"} onClick={() => edit((d) => updateNode(d, n.id, { visible: !n.visible }))}><Icon name={n.visible ? "eye" : "eye-off"} /></button>
                  <button className={iconBtn} title={n.locked ? "Unlock" : "Lock"} onClick={() => edit((d) => updateNode(d, n.id, { locked: !n.locked }))}><Icon name={n.locked ? "lock" : "unlock"} /></button>
                </>
              )}
              <button onClick={() => onSelect(n.id)} className={`min-w-0 flex-1 truncate px-1.5 text-left font-sans text-sm ${n.visible ? "text-cream" : "text-subtle"}`}>{n.name}</button>
              {badge && badge !== "none" && <span className="rounded-sm bg-gold px-1.5 py-0.5 font-sans text-xs font-semibold text-ink">{TYPE_BADGE[badge] ?? "POS"}</span>}
              {baseMode && (
                <>
                  <button className={iconBtn} title="Bring forward" onClick={() => edit((d) => moveLayer(d, n.id, 1))}><Icon name="up" /></button>
                  <button className={iconBtn} title="Send backward" onClick={() => edit((d) => moveLayer(d, n.id, -1))}><Icon name="down" /></button>
                  <button className={`${iconBtn} hover:text-danger`} title="Delete node" onClick={() => onDelete(n)}><Icon name="trash" /></button>
                </>
              )}
            </li>
          );
        })}
      </ul>
      {!baseMode && <p className="border-t border-ink-4 px-3 py-2 font-sans text-xs leading-relaxed text-subtle">Option mode: pick the type of change per node in the right panel, then drag/resize on the canvas.</p>}
    </div>
  );
}
