import { btnDanger, btnGold, inputCls, labelCls } from "../../ui/controls";
import { addRule, deleteRule, updateRule } from "./editorUtils.js";

export default function RulesPanel({ draft, edit }) {
  const options = draft.groups.flatMap((g) => g.options.map((o) => ({ id: o.id, label: `${g.name}  ${o.name}` })));
  const add = () => {
    if (options.length < 2) return;
    edit((d) => addRule(d, { type: "requires", optionId: options[0].id, targetOptionIds: [options[1].id] }));
  };
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between border-b border-ink-4 px-3 py-2.5">
        <span className={`${labelCls} mb-0`}>Compatibility rules</span>
        <button className={btnGold} onClick={add} disabled={options.length < 2}>+ Add rule</button>
      </div>
      <p className="px-3 py-2 font-sans text-xs leading-relaxed text-subtle">
        <b className="text-cream">Requires</b>: the option needs ANY target selected (the customer gets it auto-selected).{" "}
        <b className="text-cream">Excludes</b>: the option can't be combined with ANY target (the choice is blocked).
      </p>
      <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 pb-3">
        {draft.rules.length === 0 && <li className="py-6 text-center font-sans text-sm text-subtle">No rules. Every combination is allowed.</li>}
        {draft.rules.map((r) => (
          <li key={r.id} className="space-y-2 rounded-sm border border-ink-4 p-2.5">
            <div className="flex gap-1.5">
              <select className={inputCls} value={r.optionId} onChange={(e) => edit((d) => updateRule(d, r.id, { optionId: e.target.value }))}>
                {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
              <select className={`${inputCls} w-28 shrink-0`} value={r.type} onChange={(e) => edit((d) => updateRule(d, r.id, { type: e.target.value }))}>
                <option value="requires">requires</option>
                <option value="excludes">excludes</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {options.filter((o) => o.id !== r.optionId).map((o) => {
                const on = r.targetOptionIds.includes(o.id);
                return (
                  <button key={o.id} onClick={() => edit((d) => updateRule(d, r.id, { targetOptionIds: on ? r.targetOptionIds.filter((x) => x !== o.id) : [...r.targetOptionIds, o.id] }))}
                    className={`rounded-sm border px-2 py-1 font-sans text-xs ${on ? "border-gold bg-gold/15 text-gold" : "border-ink-4 text-subtle hover:text-cream"}`}>{o.label}</button>
                );
              })}
            </div>
            <input className={inputCls} placeholder="Message shown to customers (optional)" value={r.message || ""} onChange={(e) => edit((d) => updateRule(d, r.id, { message: e.target.value }))} />
            <button className={btnDanger} onClick={() => edit((d) => deleteRule(d, r.id))}>Delete rule</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
