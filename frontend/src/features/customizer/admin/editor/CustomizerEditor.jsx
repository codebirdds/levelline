// src/admin/customizer/CustomizerEditor.jsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import GarmentCanvas from "../../components/GarmentCanvas.jsx";
import ConfiguratorView from "../../components/ConfiguratorView.jsx";
import NodesPanel from "./NodesPanel.jsx";
import OptionsPanel from "./OptionsPanel.jsx";
import RulesPanel from "./RulesPanel.jsx";
import PropertiesPanel from "./PropertiesPanel.jsx";
import PatchPanel from "./PatchPanel.jsx";
import AddNodeModal from "./AddNodeModal.jsx";
import FabricsPanel from "./FabricsPanel.jsx";
import ReplaceGarmentModal from "./ReplaceGarmentModal.jsx";
import EraseTool from "../../components/EraseTool.jsx";
import Icon from "../../ui/Icon.jsx";
import { ConfirmModal, Modal } from "../../ui/Modal.jsx";
import { ToastHost, toast } from "../../ui/toast.jsx";
import { btnCls, btnGold, inputCls, labelCls } from "../../ui/controls";
import { useStored } from "../../hooks/useStorage.js";
import { resolveGarment, defaultSelections } from "../../engine/configurationResolver.js";
import { validateTemplate } from "../../engine/configurationValidator.js";
import { buildLayoutPatch, touchesImage } from "../../engine/patchMerger.js";
import { flattenCrop, extendCanvas } from "../../engine/extendImage.js";
import { assetExists, assetMeta, saveImageFile } from "../../storage/assetStorage.js";
import { getDraft, getProduct, isDraftDirty, publish, saveDraft } from "../../storage/productStorage.js";
import { addNode, deleteNode, replaceFullGarment, setNodeUpdate, uniqueId, updateNode, setCropShape } from "./editorUtils.js";

const TABS = [["nodes", "Nodes"], ["options", "Options"], ["fabrics", "Fabrics"], ["rules", "Rules"]];
const PANE = (active, name, base) => `${active === name ? "flex" : "hidden"} lg:flex ${base}`;

export default function CustomizerEditor() {
  const { productId } = useParams();
  const product = useStored(() => getProduct(productId));
  const unpublished = useStored(() => isDraftDirty(productId));

  const [draft, setDraft] = useState(() => getDraft(productId));
  const [dirty, setDirty] = useState(false);
  const [activeView, setActiveView] = useState("product");
  const [selectedId, setSelectedId] = useState(null);
  const [target, setTarget] = useState(null);
  const [preview, setPreview] = useState({});
  const [tab, setTab] = useState("nodes");
  const [pane, setPane] = useState("canvas");
  const [zoom, setZoom] = useState(1);
  const [guide, setGuide] = useState(false);
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [area, setArea] = useState({ w: 800, h: 600 });
  const [cropMode, setCropMode] = useState(null);
  const [extendMode, setExtendMode] = useState(null);
  const [eraseFor, setEraseFor] = useState(null);
  const areaRef = useRef(null);

  const views = ["product", "front", "back", ...(product?.hasFlatView ? ["paint"] : [])];

  const live = useRef({});
  live.current = { target, preview, draft, selectedId, activeView };

  const edit = useCallback((fn) => { setDraft(fn); setDirty(true); }, []);

  const selections = useMemo(() => (target ? { ...preview, [target.groupId]: target.optionId } : null), [target, preview]);
  const resolved = useMemo(() => (selections ? resolveGarment(draft, selections) : null), [draft, selections]);
  const baseline = useMemo(() => (selections ? resolveGarment(draft, selections, { skipGroupId: target.groupId }) : null), [draft, selections, target]);
  
  const allNodes = resolved ? resolved.nodes : draft.nodes;
  const nodes = useMemo(() => allNodes.filter(n => (n.view || "front") === activeView), [allNodes, activeView]);

  const validation = useMemo(() => validateTemplate(draft, { assetExists, assetMeta }), [draft]);
  const patchTypes = useMemo(() => {
    if (!target) return null;
    const o = draft.groups.find((g) => g.id === target.groupId)?.options.find((x) => x.id === target.optionId);
    return Object.fromEntries(draft.nodes.map((n) => [n.id, o?.updates?.[n.id]?.type ?? "none"]));
  }, [draft, target]);

  useEffect(() => {
    if (target && !draft.groups.find((g) => g.id === target.groupId)?.options.some((o) => o.id === target.optionId)) setTarget(null);
    if (selectedId && !draft.nodes.some((n) => n.id === selectedId)) setSelectedId(null);
  }, [draft, target, selectedId]);

  useEffect(() => {
    if (!views.includes(activeView)) setActiveView("product");
  }, [views, activeView]);

  const applyLayout = useCallback((nodeId, fields) => {
    setDirty(true);
    setDraft((prev) => {
      const t = live.current.target;
      if (!t) return updateNode(prev, nodeId, fields);
      const sel = { ...live.current.preview, [t.groupId]: t.optionId };
      const eff = resolveGarment(prev, sel).nodes.find((n) => n.id === nodeId);
      const base = resolveGarment(prev, sel, { skipGroupId: t.groupId }).nodes.find((n) => n.id === nodeId);
      if (!eff || !base) return prev;
      const patch = buildLayoutPatch(base, { ...eff, ...fields });
      const cur = prev.groups.find((g) => g.id === t.groupId)?.options.find((o) => o.id === t.optionId)?.updates?.[nodeId];
      let type = !cur || cur.type === "none" ? "position" : cur.type === "image" ? "both" : cur.type;
      if (!Object.keys(patch).length) {
        if (type === "position") return setNodeUpdate(prev, t.groupId, t.optionId, nodeId, null);
        if (type === "both") type = "image";
      }
      const upd = { type };
      if (touchesImage(type) && cur && cur.image !== undefined) upd.image = cur.image;
      return setNodeUpdate(prev, t.groupId, t.optionId, nodeId, { ...upd, ...patch });
    });
  }, []);

  const applyImage = useCallback((nodeId, ref) => {
    setDirty(true);
    setDraft((prev) => {
      const t = live.current.target;
      if (!t) return updateNode(prev, nodeId, { image: ref });
      const cur = prev.groups.find((g) => g.id === t.groupId)?.options.find((o) => o.id === t.optionId)?.updates?.[nodeId];
      const type = !cur || cur.type === "none" ? "image" : cur.type === "position" ? "both" : cur.type;
      return setNodeUpdate(prev, t.groupId, t.optionId, nodeId, { ...(cur || {}), type, image: ref });
    });
  }, []);

  const save = useCallback(() => {
    try { saveDraft(productId, live.current.draft); setDirty(false); toast.success("Draft saved"); return true; }
    catch (e) { toast.error(e.message); return false; }
  }, [productId]);

  const doPublish = () => {
    if (!save()) return;
    try {
      const r = publish(productId);
      if (!r.ok) { setModal("validate"); toast.error(`Can't publish: ${r.validation.errors.length} error(s) to fix.`); return; }
      toast.success("Published. Customers now see this version; existing cart items keep theirs.");
    } catch (e) { toast.error(e.message); }
  };

  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); save(); return; }
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;
      const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
      const id = live.current.selectedId;
      const n = id && nodesRef.current.find((x) => x.id === id);
      if (!d || !n || n.locked) return;
      e.preventDefault();
      const k = e.shiftKey ? 10 : 1;
      applyLayout(id, { x: n.x + d[0] * k, y: n.y + d[1] * k });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save, applyLayout]);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => setArea({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const ratio = draft.canvas.width / draft.canvas.height;
  const fit = Math.max(120, Math.min(area.w - 48, (area.h - 48) * ratio));

  const askDelete = ({ message, run }) => setConfirm({ message, run });
  const requestDeleteNode = (n) => askDelete({
    message: `Delete node "${n.name}"? It is also removed from every option patch.`,
    run: () => { edit((d) => deleteNode(d, n.id)); setSelectedId(null); },
  });

  const handleExtendApply = useCallback(async (nodeId, newRect) => {
    const node = live.current.draft.nodes.find((n) => n.id === nodeId);
    if (!node) return;
    setExtendMode(null);

    try {
      const flat = await flattenCrop(node.image, node.crop);
      const extLeft = Math.max(0, node.x - newRect.x);
      const extRight = Math.max(0, (newRect.x + newRect.w) - (node.x + node.width));
      const extTop = Math.max(0, node.y - newRect.y);
      const extBottom = Math.max(0, (newRect.y + newRect.h) - (node.y + node.height));

      if (extLeft + extRight + extTop + extBottom === 0) { toast.error("Nothing to extend"); return; }

      const pxX = flat.width / node.width;
      const pxY = flat.height / node.height;
      const extended = extendCanvas(flat, {
        left: Math.round(extLeft * pxX), right: Math.round(extRight * pxX),
        top: Math.round(extTop * pxY), bottom: Math.round(extBottom * pxY), mode: "mirror",
      });
      const blob = await new Promise((r) => extended.toBlob(r, "image/png"));
      const file = new File([blob], `extended-${nodeId}.png`, { type: "image/png" });
      const { ref } = await saveImageFile(file);

      edit((d) => updateNode(d, nodeId, { image: ref, x: newRect.x, y: newRect.y, width: newRect.w, height: newRect.h, crop: { type: "rect", x: 0, y: 0, w: 100, h: 100, feather: 0 } }));
      toast.success("Area extended seamlessly");
    } catch (e) { toast.error(e.message); }
  }, [edit]);

  if (!product || !draft) return <div className="p-10 font-sans text-sm text-cream">Product not found. <Link className="text-gold underline" to="/admin/customizer">Back to products</Link></div>;

  const targetGroup = target && draft.groups.find((g) => g.id === target.groupId);
  const targetOption = targetGroup?.options.find((o) => o.id === target.optionId);
  const selectedBase = draft.nodes.find((n) => n.id === selectedId);

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-ink font-sans text-cream">
      <header className="flex shrink-0 flex-wrap items-center gap-2 border-b border-ink-4 bg-ink-2 px-3 py-2">
        <Link to="/admin/customizer" className={btnCls}><Icon name="back" /> Products</Link>
        <div className="mr-auto min-w-0">
          <p className="truncate text-sm font-semibold">{product.name}</p>
          <p className="text-xs text-subtle">{dirty ? "Unsaved changes" : "All changes saved"}</p>
        </div>
        
        {/* VIEW SWITCHER */}
        <div className="flex items-center gap-1 rounded-sm border border-ink-4 bg-ink px-1 py-1">
          {views.map(v => (
            <button key={v} onClick={() => { setActiveView(v); setSelectedId(null); }} className={`rounded-sm px-3 py-1 text-xs font-semibold capitalize transition ${activeView === v ? "bg-gold text-ink" : "text-subtle hover:text-cream"}`}>{v} View</button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button className={btnCls} onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.2).toFixed(1)))}><Icon name="minus" /></button>
          <button className={`${btnCls} w-14`} onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</button>
          <button className={btnCls} onClick={() => setZoom((z) => Math.min(3, +(z + 0.2).toFixed(1)))}><Icon name="plus" /></button>
        </div>
        <button className={`${btnCls} ${guide ? "border-gold text-gold" : ""}`} onClick={() => setGuide((g) => !g)}>Guide</button>
        <button className={`${btnCls} ${validation.errors.length ? "border-danger/60 text-danger" : ""}`} onClick={() => setModal("validate")}>
          Validate  {validation.errors.length}? {validation.warnings.length}?
        </button>
        <button className={btnCls} onClick={() => setModal("preview")}>Preview draft</button>
        <button className={btnCls} onClick={save} disabled={!dirty}>Save draft</button>
        <button className={btnGold} onClick={doPublish}>Publish</button>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className={PANE(pane, "left", "w-full shrink-0 flex-col border-r border-ink-4 bg-ink-2 lg:w-72")}>
          <div className="flex shrink-0 border-b border-ink-4">
            {TABS.map(([k, label]) => (
              <button key={k} onClick={() => setTab(k)} className={`flex-1 px-3 py-2.5 text-xs font-semibold uppercase tracking-wide ${tab === k ? "border-b-2 border-gold text-gold" : "text-subtle hover:text-cream"}`}>{label}</button>
            ))}
          </div>
          <div className="min-h-0 flex-1">
            {tab === "nodes" && <NodesPanel nodes={nodes} draft={draft} selectedId={selectedId} onSelect={(id) => { setSelectedId(id); setPane("canvas"); }} edit={edit} onAdd={() => setModal("add")} onDelete={requestDeleteNode} patchTypes={patchTypes} />}
            {tab === "options" && <OptionsPanel draft={draft} target={target} onTarget={(t) => { setTarget(t); setPane("canvas"); }} edit={edit} askDelete={askDelete} />}
            {tab === "fabrics" && <FabricsPanel draft={draft} edit={edit} />}
            {tab === "rules" && <RulesPanel draft={draft} edit={edit} />}
          </div>
        </aside>

        <main className={PANE(pane, "canvas", "min-w-0 flex-1 flex-col bg-ink")}>
          <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-ink-4 px-4 py-2 text-xs">
            <span className="rounded-sm bg-gold px-2 py-1 font-semibold text-ink uppercase">{activeView} VIEW</span>
            {target ? (
              <>
                <span className="text-subtle">PATCH  {targetGroup?.name} ? {targetOption?.name}</span>
              </>
            ) : (
              <span className="rounded-sm bg-ink-4 px-2 py-1 font-semibold">BASE LAYOUT  editing {activeView} nodes directly</span>
            )}
            <span className="ml-auto hidden text-subtle xl:block">Drag to move  handles to resize  arrows nudge (Shift 10)</span>
          </div>
          <div ref={areaRef} className="flex min-h-0 flex-1 overflow-auto p-6">
            {nodes.length === 0 && <p className="m-auto font-sans text-sm text-subtle">This view has no nodes yet  add one from the Nodes tab.</p>}
            {nodes.length > 0 && (
              <GarmentCanvas
                canvas={draft.canvas}
                nodes={nodes}
                guideImage={guide ? draft.baseImage : null}
                selectedId={cropMode || extendMode || selectedId}
                onSelect={setSelectedId}
                onGeometryChange={applyLayout}
                className="m-auto shrink-0 bg-cream shadow-lg"
                style={{ width: fit * zoom }}
                cropMode={!!cropMode}
                onCropChange={(id, c) => { edit((d) => setCropShape(d, id, c)); setCropMode(null); }}
                onCropCancel={() => setCropMode(null)}
                extendMode={!!extendMode}
                onExtendChange={handleExtendApply}
                onExtendCancel={() => setExtendMode(null)}
              />
            )}
          </div>
        </main>

        <aside className={PANE(pane, "right", "w-full shrink-0 flex-col border-l border-ink-4 bg-ink-2 lg:w-80")}>
          <div className="shrink-0 border-b border-ink-4 px-3 py-2.5"><span className={`${labelCls} mb-0`}>{target ? "Configuration patch" : "Node properties"}</span></div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {target
              ? <PatchPanel draft={draft} target={target} baseline={baseline} resolved={resolved} selectedId={selectedId} onSelect={setSelectedId} edit={edit} applyLayout={applyLayout} applyImage={applyImage} />
              : <PropertiesPanel
                  node={selectedBase}
                  edit={edit}
                  applyLayout={applyLayout}
                  onDelete={requestDeleteNode}
                  onEnterCropMode={(id) => { setCropMode(id); setSelectedId(id); }}
                  onEraseNode={(n) => setEraseFor(n)}
                  onExtendMode={(id) => { setExtendMode(id); setSelectedId(id); }}
                />}
          </div>
        </aside>
      </div>

      <AddNodeModal open={modal === "add"} canvas={draft.canvas} onClose={() => setModal(null)} onAdd={(n) => {
        const id = uniqueId(n.name, draft.nodes.map((x) => x.id));
        edit((d) => addNode(d, { ...n, view: activeView }).draft);
        setSelectedId(id); setModal(null); toast.success(`Node "${n.name}" added to ${activeView}`);
      }} />
      
      <ConfirmModal open={!!confirm} message={confirm?.message} onConfirm={() => confirm?.run()} onClose={() => setConfirm(null)} />
      <ToastHost />
    </div>
  );
}
