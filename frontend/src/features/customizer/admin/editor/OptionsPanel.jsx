import { useState } from "react";
import Icon from "../../ui/Icon.jsx";
import { btnCls, btnGold, iconBtn, inputCls, labelCls } from "../../ui/controls";
import { addGroup, addOption, deleteGroup, deleteOption, moveGroup, moveOption, renameGroup, setDefaultOption, uniqueId } from "./editorUtils.js";

export default function OptionsPanel({ draft, target, onTarget, edit, askDelete }) {
  const [newGroup, setNewGroup] = useState("");
  const [newOption, setNewOption] = useState({});

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="space-y-2 border-b border-ink-4 px-3 py-2.5">
        <button onClick={() => onTarget(null)} className={`${btnCls} w-full ${!target ? "border-gold text-gold" : ""}`}>Base layout (edit garment nodes)</button>
        <form className="flex gap-1.5" onSubmit={(e) => {
          e.preventDefault();
          if (!newGroup.trim()) return;
          edit((d) => addGroup(d, newGroup).draft);
          setNewGroup("");
        }}>
          <input className={inputCls} placeholder="New group, e.g. Collar Style" value={newGroup} onChange={(e) => setNewGroup(e.target.value)} />
          <button className={btnGold} type="submit"><Icon name="plus" /></button>
        </form>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {draft.groups.length === 0 && <p className="px-4 py-8 text-center font-sans text-sm text-subtle">No configuration groups yet.</p>}
        {draft.groups.map((g) => (
          <section key={g.id} className="border-b border-ink-4 px-3 py-3">
            <div className="flex items-center gap-1">
              <input className="min-w-0 flex-1 rounded-sm border border-transparent bg-transparent px-1.5 py-1 font-sans text-sm font-semibold text-cream hover:border-ink-4 focus:border-gold focus:outline-none" value={g.name} onChange={(e) => edit((d) => renameGroup(d, g.id, e.target.value))} aria-label="Group name" />
              <button className={iconBtn} title="Move up" onClick={() => edit((d) => moveGroup(d, g.id, -1))}><Icon name="up" /></button>
              <button className={iconBtn} title="Move down" onClick={() => edit((d) => moveGroup(d, g.id, 1))}><Icon name="down" /></button>
              <button className={`${iconBtn} hover:text-danger`} title="Delete group" onClick={() => askDelete({ message: `Delete group "${g.name}" and all its options? Rules using them are removed too.`, run: () => { edit((d) => deleteGroup(d, g.id)); if (target?.groupId === g.id) onTarget(null); } })}><Icon name="trash" /></button>
            </div>
            <ul className="mt-1.5 space-y-0.5">
              {g.options.map((o) => {
                const active = target?.optionId === o.id;
                const changes = Object.values(o.updates || {}).filter((u) => u.type !== "none").length;
                return (
                  <li key={o.id} className={`flex items-center gap-0.5 rounded-sm border-l-2 pr-1 ${active ? "border-gold bg-ink-4/60" : "border-transparent hover:bg-ink-4/30"}`}>
                    <button className={`${iconBtn} ${g.defaultOptionId === o.id ? "text-gold" : ""}`} title={g.defaultOptionId === o.id ? "Default option" : "Make default"} onClick={() => edit((d) => setDefaultOption(d, g.id, o.id))}><Icon name="star" fill={g.defaultOptionId === o.id ? "currentColor" : "none"} /></button>
                    <button onClick={() => onTarget({ groupId: g.id, optionId: o.id })} className="min-w-0 flex-1 truncate px-1 py-1.5 text-left font-sans text-sm text-cream">
                      {o.name} {changes > 0 && <span className="ml-1 font-sans text-xs text-subtle">· {changes} node{changes > 1 ? "s" : ""}</span>}
                    </button>
                    <button className={iconBtn} title="Move up" onClick={() => edit((d) => moveOption(d, g.id, o.id, -1))}><Icon name="up" /></button>
                    <button className={iconBtn} title="Move down" onClick={() => edit((d) => moveOption(d, g.id, o.id, 1))}><Icon name="down" /></button>
                    <button className={`${iconBtn} hover:text-danger`} title="Delete option" disabled={g.options.length <= 1} onClick={() => askDelete({ message: `Delete option "${o.name}"?`, run: () => { edit((d) => deleteOption(d, g.id, o.id)); if (active) onTarget(null); } })}><Icon name="trash" /></button>
                  </li>
                );
              })}
            </ul>
            <form className="mt-2 flex gap-1.5" onSubmit={(e) => {
              e.preventDefault();
              const name = (newOption[g.id] || "").trim();
              if (!name) return;
              const optionId = uniqueId(name, draft.groups.flatMap((x) => x.options.map((o) => o.id)));
              edit((d) => addOption(d, g.id, name).draft);
              setNewOption((s) => ({ ...s, [g.id]: "" }));
              onTarget({ groupId: g.id, optionId });
            }}>
              <input className={inputCls} placeholder="Add option…" value={newOption[g.id] || ""} onChange={(e) => setNewOption((s) => ({ ...s, [g.id]: e.target.value }))} />
              <button className={btnCls} type="submit"><Icon name="plus" /></button>
            </form>
          </section>
        ))}
      </div>
      <p className={`${labelCls} mb-0 border-t border-ink-4 px-3 py-2 normal-case`}>★ = default option · click an option to edit its patch</p>
    </div>
  );
}
