import { useEffect, useMemo, useState } from "react";
import GarmentCanvas from "./GarmentCanvas.jsx";
import Accordion from "./Accordion.jsx";
import OptionThumb from "./OptionThumb.jsx";
import SectionHeading from "../../../components/common/SectionHeading";
import { TYPE } from "../../../components/common/typography";
import { formatCurrency } from "../../../utils/formatCurrency";
import { defaultFabricId, defaultSelections, getOptionState, resolveGarment, selectOption } from "../engine/configurationResolver.js";
import { getSections, groupFocusBox } from "../engine/previewFocus.js";
import { resolveImageSrc } from "../storage/assetStorage.js";
import Icon from "../ui/Icon.jsx"; 

const Check = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>
);
const delta = (n) => (n ? `+${formatCurrency(n)}` : "");

function FabricSwatch({ fabric, active, onPick }) {
  const tex = fabric.texture ? resolveImageSrc(fabric.texture) : "";
  return (
    <button type="button" onClick={onPick} aria-pressed={active} className="group text-left">
      <span className={`relative block aspect-square overflow-hidden rounded-sm border transition ${active ? "border-ink ring-1 ring-ink" : "border-border group-hover:border-[#808080]"}`}
        style={{ backgroundColor: fabric.color, backgroundImage: tex ? `url("${tex}")` : "none", backgroundSize: "14px", backgroundBlendMode: "multiply" }}>
        {active && <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-ink text-cream"><Check /></span>}
      </span>
      <span className="mt-1.5 block font-sans text-sm leading-tight text-[#6b6b6b]">{fabric.name}</span>
      {fabric.priceDelta ? <span className="block font-sans text-xs text-[#808080]">{delta(fabric.priceDelta)}</span> : null}
    </button>
  );
}

/**
 * Customer-facing configurator (storefront AND admin preview — same component, same engine).
 * Two independent dimensions: fabric (tint of garment regions) + component options (image/geometry patches).
 * Everything shown is generated from the template: sections, groups, options, fabrics.
 * onAddToCart({ selections, fabricId, resolved, price }) — omit it for a preview-only view.
 */
export default function ConfiguratorView({ product, template, onAddToCart, embedded = false }) {
  const sections = useMemo(() => getSections(template), [template]);
  const [selections, setSelections] = useState(() => defaultSelections(template));
  const [fabricId, setFabricId] = useState(() => defaultFabricId(template));
  const [openId, setOpenId] = useState(() => sections[0]?.id ?? null);
  const [notices, setNotices] = useState([]);
  const [blocked, setBlocked] = useState("");
  
  const [zoom, setZoom] = useState(1.6);

  // preload every option image once so swaps never flash
  useEffect(() => {
    template.groups.forEach((g) => g.options.forEach((o) => Object.values(o.updates || {}).forEach((u) => {
      if (u?.image) { const i = new Image(); i.src = resolveImageSrc(u.image); }
    })));
  }, [template]);

  const resolved = useMemo(() => resolveGarment(template, selections, { fabricId }), [template, selections, fabricId]);
  const price = product.basePrice + resolved.priceDelta;
  const focus = useMemo(() => {
    const base = defaultSelections(template);
    return Object.fromEntries(template.groups.map((g) => [g.id, groupFocusBox(template, g, base)]));
  }, [template]);

  const choose = (groupId, optionId) => {
    const r = selectOption(template, selections, groupId, optionId);
    setBlocked(r.blocked?.message ?? "");
    setNotices(r.notices);
    if (!r.blocked) setSelections(r.selections); // fabric is untouched by component choices
  };
  
  const reset = () => { 
    setSelections(defaultSelections(template)); 
    setFabricId(defaultFabricId(template)); 
    setNotices([]); 
    setBlocked(""); 
    setZoom(1);
  };

  const selectedName = (g) => g.options.find((o) => o.id === resolved.selections[g.id])?.name ?? "";
  const ratio = template.canvas.width / template.canvas.height;

  const renderGroup = (g, showLabel) => {
    const f = focus[g.id];
    return (
      <div key={g.id} className={showLabel ? "mt-5 first:mt-0" : ""}>
        {showLabel && <p className={`mb-2 ${TYPE.label}`}>{g.name}</p>}
        <div className={f ? "grid grid-cols-2 gap-3 sm:grid-cols-3" : "flex flex-wrap gap-2"}>
          {g.options.map((o) => {
            const active = resolved.selections[g.id] === o.id;
            const st = getOptionState(template, selections, g.id, o.id);
            const tone = active ? "border-ink" : st.disabled ? "border-border opacity-45" : "border-border hover:border-[#808080]";
            return f ? (
              <button key={o.id} type="button" onClick={() => choose(g.id, o.id)} aria-pressed={active} title={st.disabled ? st.reason : st.hint} className={`relative rounded-sm border bg-white p-1.5 text-left transition ${tone}`}>
                <OptionThumb template={template} selections={selections} groupId={g.id} optionId={o.id} fabricId={fabricId} focus={f} />
                {active && <span className="absolute right-3 top-3 flex size-4 items-center justify-center rounded-full bg-ink text-cream"><Check /></span>}
                <span className="mt-1.5 block font-sans text-sm leading-tight text-[#6b6b6b]">{o.name}</span>
                {o.priceDelta ? <span className="block font-sans text-xs text-[#808080]">{delta(o.priceDelta)}</span> : null}
              </button>
            ) : (
              <button key={o.id} type="button" onClick={() => choose(g.id, o.id)} aria-pressed={active} title={st.disabled ? st.reason : st.hint} className={`min-w-12 rounded-sm border px-4 py-2.5 font-sans text-sm transition ${active ? "border-ink bg-ink text-cream" : `${tone} text-[#6b6b6b]`}`}>
                {o.name}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const items = sections.map((s) => {
    if (s.kind === "fabric") {
      return {
        id: s.id, title: s.title, value: resolved.fabric?.name ?? "",
        content: (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {template.fabrics.map((f) => <FabricSwatch key={f.id} fabric={f} active={resolved.fabric?.id === f.id} onPick={() => setFabricId(f.id)} />)}
          </div>
        ),
      };
    }
    const groups = (s.groupIds ?? []).map((id) => template.groups.find((g) => g.id === id)).filter(Boolean);
    return { id: s.id, title: s.title, value: groups.map(selectedName).join(" · "), content: groups.map((g) => renderGroup(g, groups.length > 1)) };
  });

  return (
    <div className={`grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] ${embedded ? "" : "min-h-[calc(100vh-var(--header-h))]"}`}>
      
      {/* LEFT — garment preview */}
      <div className="relative overflow-hidden bg-[#f1f1ef] px-4 py-6 sm:px-10 lg:py-10">
        
        {/* 👈 NEW: Floating Zoom Controls moved to TOP RIGHT */}
        <div className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full border border-border bg-white/90 px-3 py-1.5 shadow-md backdrop-blur-sm lg:right-8 lg:top-8">
          <button 
            className="p-1.5 text-[#6b6b6b] transition hover:scale-110 hover:text-ink active:scale-95" 
            onClick={() => setZoom(z => Math.max(0.5, +(z - 0.2).toFixed(1)))} 
            aria-label="Zoom out"
          >
            <Icon name="minus" />
          </button>
          <button 
            className="min-w-12 text-center font-sans text-xs font-semibold text-[#6b6b6b] transition hover:text-ink" 
            onClick={() => setZoom(1)}
            title="Reset zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button 
            className="p-1.5 text-[#6b6b6b] transition hover:scale-110 hover:text-ink active:scale-95" 
            onClick={() => setZoom(z => Math.min(2.5, +(z + 0.2).toFixed(1)))} 
            aria-label="Zoom in"
          >
            <Icon name="plus" />
          </button>
        </div>

        {/* Sticky Canvas Container */}
        <div className="flex h-[calc(100vh-var(--header-h)-120px)] min-h-[400px] items-center justify-center lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
          <GarmentCanvas 
            canvas={template.canvas} 
            nodes={resolved.nodes} 
            className="w-full transition-transform duration-300 ease-in-out" 
            style={{ maxWidth: `min(100%, calc(74vh * ${ratio}))`, transform: `scale(${zoom})` }} 
          />
        </div>
      </div>

      {/* RIGHT — customization panel */}
      <div className={`bg-white px-5 pt-8 sm:px-10 lg:px-14 lg:pt-12 ${embedded ? "pb-8" : "pb-32 lg:pb-12"}`}>
        <SectionHeading align="left" title={product.name} subtitle={product.description} />
        <div className="mt-8">
          <Accordion items={items} openId={openId} onToggle={setOpenId} />
        </div>

        {(blocked || notices.length > 0) && (
          <div role="status" className={`mt-5 rounded-sm border px-4 py-3 font-sans text-sm leading-relaxed ${blocked ? "border-danger/50 text-danger" : "border-border text-[#808080]"}`}>
            {blocked || notices.map((n) => <p key={n}>{n}</p>)}
          </div>
        )}

        <button type="button" onClick={reset} className="mt-5 font-sans text-xs uppercase tracking-wide text-[#808080] underline underline-offset-4 hover:text-ink">Reset all choices</button>

        {/* purchase area */}
        <div className={`${embedded ? "mt-6" : "fixed inset-x-0 bottom-0 z-30 lg:static lg:mt-8"} border-t border-border bg-white px-5 py-4 sm:px-10 lg:px-0`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className={TYPE.label}>Total</p>
              <p className={TYPE.bold} aria-live="polite">{formatCurrency(price)}</p>
            </div>
            {onAddToCart ? (
              <button type="button" onClick={() => onAddToCart({ selections: resolved.selections, fabricId: resolved.fabric?.id ?? null, resolved, price })}
                className="max-w-xs flex-1 rounded-sm bg-ink py-4 font-sans text-sm font-semibold uppercase tracking-wide text-cream transition hover:bg-ink-3">
                Add to cart
              </button>
            ) : <span className={TYPE.label}>Preview only</span>}
          </div>
        </div>
      </div>
    </div>
  );
}