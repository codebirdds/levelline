import { useState } from "react";
import { ImageField, NumField } from "../../ui/Fields.jsx";
import { btnCls, btnGold, inputCls, labelCls } from "../../ui/controls";
import Icon from "../../ui/Icon.jsx";

export default function FabricsPanel({ draft, edit }) {
  const [newFabric, setNewFabric] = useState("");

  const updateFabric = (id, patch) => {
    edit((d) => ({
      ...d,
      fabrics: (d.fabrics || []).map((f) => (f.id === id ? { ...f, ...patch } : f)),
    }));
  };

  const addFabric = (e) => {
    e.preventDefault();
    if (!newFabric.trim()) return;
    const id = newFabric.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    edit((d) => ({
      ...d,
      fabrics: [
        ...(d.fabrics || []),
        { id, name: newFabric.trim(), color: "#ffffff", priceDelta: 0, texture: null, tile: null }
      ],
    }));
    setNewFabric("");
  };

  const deleteFabric = (id) => {
    edit((d) => ({
      ...d,
      fabrics: (d.fabrics || []).filter((f) => f.id !== id),
    }));
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="space-y-2 border-b border-ink-4 px-3 py-2.5">
        <form className="flex gap-1.5" onSubmit={addFabric}>
          <input className={inputCls} placeholder="New fabric name..." value={newFabric} onChange={(e) => setNewFabric(e.target.value)} />
          <button className={btnGold} type="submit"><Icon name="plus" /></button>
        </form>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {(draft.fabrics || []).length === 0 && (
          <p className="px-4 py-8 text-center font-sans text-sm text-subtle">No fabrics yet.</p>
        )}
        {(draft.fabrics || []).map((f) => (
          <section key={f.id} className="border-b border-ink-4 px-3 py-3 space-y-3">
            <div className="flex items-center justify-between">
              <input
                className="min-w-0 flex-1 rounded-sm border border-transparent bg-transparent px-1.5 py-1 font-sans text-sm font-semibold text-cream hover:border-ink-4 focus:border-gold focus:outline-none"
                value={f.name}
                onChange={(e) => updateFabric(f.id, { name: e.target.value })}
              />
              <button className={`${btnCls} hover:text-danger hover:border-danger`} onClick={() => deleteFabric(f.id)}>
                <Icon name="trash" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className={labelCls}>Main Color</span>
                <input type="color" className="h-8 w-full cursor-pointer rounded-sm border border-ink-4 bg-ink" value={f.color || "#ffffff"} onChange={(e) => updateFabric(f.id, { color: e.target.value })} />
              </label>
              <NumField label="Price +" value={f.priceDelta || 0} onChange={(v) => updateFabric(f.id, { priceDelta: v })} />
            </div>

            <ImageField label="Main Texture" value={f.texture || ""} onChange={(ref) => updateFabric(f.id, { texture: ref, tile: null })}>
              {f.texture && <button className={btnCls} onClick={() => updateFabric(f.id, { texture: null, tile: null })}>Clear</button>}
            </ImageField>
          </section>
        ))}
      </div>
    </div>
  );
}
