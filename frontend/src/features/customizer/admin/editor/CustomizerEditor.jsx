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
import ReplaceGarmentModal from "./ReplaceGarmentModal.jsx";
import Icon from "../../ui/Icon.jsx";
import { ConfirmModal, Modal } from "../../ui/Modal.jsx";
import { ToastHost, toast } from "../../ui/toast.jsx";
import { btnCls, btnGold, inputCls, labelCls } from "../../ui/controls";
import { useStored } from "../../hooks/useStorage.js";
import { resolveGarment, defaultSelections } from "../../engine/configurationResolver.js";
import { validateTemplate } from "../../engine/configurationValidator.js";
import { buildLayoutPatch, touchesImage } from "../../engine/patchMerger.js";
import { assetExists, assetMeta } from "../../storage/assetStorage.js";
import { getDraft, getProduct, isDraftDirty, publish, saveDraft } from "../../storage/productStorage.js";
import { addNode, deleteNode, replaceFullGarment, setNodeUpdate, uniqueId, updateNode } from "./editorUtils.js";

const TABS = [["nodes", "Nodes"], ["options", "Options"], ["rules", "Rules"]];
const PANE = (active, name, base) => `${active === name ? "flex" : "hidden"} lg:flex ${base}`;

export default function CustomizerEditor() {
  const { productId } = useParams();
  const product = useStored(() => getProduct(productId));
  const unpublished = useStored(() => isDraftDirty(productId));

  const [draft, setDraft] = useState(() => getDraft(productId));
  const [dirty, setDirty] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [target, setTarget] = useState(null); // null = base layout, else { groupId, optionId } = patch mode
  const [preview, setPreview] = useState({}); // preview choices of the OTHER groups while editing a patch
  const [tab, setTab] = useState("nodes");
  const [pane, setPane] = useState("canvas");
  const [zoom, setZoom] = useState(1);
  const [guide, setGuide] = useState(false);
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [area, setArea] = useState({ w: 800, h: 600 });
  const areaRef = useRef(null);

  const live = useRef({});
  live.current = { target, preview, draft, selectedId };

  const edit = useCallback((fn) => { setDraft(fn); setDirty(true); }, []);

  /* ---------- derived: effective preview vs baseline (same engine as the storefront) ---------- */
  const selections = useMemo(() => (target ? { ...preview, [target.groupId]: target.optionId } : null), [target, preview]);
  const resolved = useMemo(() => (selections ? resolveGarment(draft, selections) : null), [draft, selections]);
  const baseline = useMemo(() => (selections ? resolveGarment(draft, selections, { skipGroupId: target.groupId }) : null), [draft, selections, target]);
  const nodes = resolved ? resolved.nodes : draft.nodes;
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

  /* ---------- the ONE place geometry/image edits are written (canvas drag, inputs, arrow keys) ---------- */
  const applyLayout = useCallback((nodeId, fields) => {
    setDirty(true);
    setDraft((prev) => {
      const t = live.current.target;
      if (!t) return updateNode(prev, nodeId, fields); // base layout: edit the node itself
      const sel = { ...live.current.preview, [t.groupId]: t.optionId };
      const eff = resolveGarment(prev, sel).nodes.find((n) => n.id === nodeId);
      const base = resolveGarment(prev, sel, { skipGroupId: t.groupId }).nodes.find((n) => n.id === nodeId);
      if (!eff || !base) return prev;
      const patch = buildLayoutPatch(base, { ...eff, ...fields }); // ONLY the differences from the baseline
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

  /* ---------- persistence ---------- */
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

  /* ---------- keyboard: Ctrl+S, arrow nudge ---------- */
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

  /* ---------- canvas fit + zoom ---------- */
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
  const requestDeleteNode = (n) => askDelete({ message: `Delete node "${n.name}"? It is also removed from every option patch.`, run: () => { edit((d) => deleteNode(d, n.id)); setSelectedId(null); } });

  if (!product || !draft) return <div className="p-10 font-sans text-sm text-cream">Product not found. <Link className="text-gold underline" to="/admin/customizer">Back to products</Link></div>;

  const targetGroup = target && draft.groups.find((g) => g.id === target.groupId);
  const targetOption = targetGroup?.options.find((o) => o.id === target.optionId);
  const selectedBase = draft.nodes.find((n) => n.id === selectedId);

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-ink font-sans text-cream">
      {/* ---------------- toolbar ---------------- */}
      <header className="flex shrink-0 flex-wrap items-center gap-2 border-b border-ink-4 bg-ink-2 px-3 py-2">
        <Link to="/admin/customizer" className={btnCls}><Icon name="back" /> Products</Link>
        <div className="mr-auto min-w-0">
          <p className="truncate text-sm font-semibold">{product.name}</p>
          <p className="text-xs text-subtle">
            {dirty ? "Unsaved changes" : "All changes saved"} · {product.publishedVersionId ? `Published ${product.publishedVersionId.split("_").pop() ? "v" + product.publishedVersionId.split("_").pop() : ""}${unpublished ? " (draft has newer changes)" : ""}` : "Not published"}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button className={btnCls} onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.2).toFixed(1)))} aria-label="Zoom out"><Icon name="minus" /></button>
          <button className={`${btnCls} w-14`} onClick={() => setZoom(1)} title="Reset view">{Math.round(zoom * 100)}%</button>
          <button className={btnCls} onClick={() => setZoom((z) => Math.min(3, +(z + 0.2).toFixed(1)))} aria-label="Zoom in"><Icon name="plus" /></button>
        </div>
        <button className={`${btnCls} ${guide ? "border-gold text-gold" : ""}`} onClick={() => setGuide((g) => !g)} title="Show the base garment image as a faint guide">Guide</button>
        <button className={`${btnCls} ${validation.errors.length ? "border-danger/60 text-danger" : ""}`} onClick={() => setModal("validate")}>
          Validate · {validation.errors.length}⛔ {validation.warnings.length}⚠
        </button>
        <button className={btnCls} onClick={() => setModal("replace")}>Replace garment</button>
        <button className={btnCls} onClick={() => setModal("preview")}>Preview draft</button>
        {product.publishedVersionId && <Link to={`/customize/${product.id}`} target="_blank" className={btnCls}>View published</Link>}
        <button className={btnCls} onClick={save} disabled={!dirty}>Save draft</button>
        <button className={btnGold} onClick={doPublish}>Publish</button>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* ---------------- left: nodes / options / rules ---------------- */}
        <aside className={PANE(pane, "left", "w-full shrink-0 flex-col border-r border-ink-4 bg-ink-2 lg:w-72")}>
          <div className="flex shrink-0 border-b border-ink-4">
            {TABS.map(([k, label]) => (
              <button key={k} onClick={() => setTab(k)} className={`flex-1 px-3 py-2.5 text-xs font-semibold uppercase tracking-wide ${tab === k ? "border-b-2 border-gold text-gold" : "text-subtle hover:text-cream"}`}>{label}</button>
            ))}
          </div>
          <div className="min-h-0 flex-1">
            {tab === "nodes" && <NodesPanel draft={draft} selectedId={selectedId} onSelect={(id) => { setSelectedId(id); setPane("canvas"); }} edit={edit} onAdd={() => setModal("add")} onDelete={requestDeleteNode} patchTypes={patchTypes} />}
            {tab === "options" && <OptionsPanel draft={draft} target={target} onTarget={(t) => { setTarget(t); setPane("canvas"); }} edit={edit} askDelete={askDelete} />}
            {tab === "rules" && <RulesPanel draft={draft} edit={edit} />}
          </div>
        </aside>

        {/* ---------------- center: canvas ---------------- */}
        <main className={PANE(pane, "canvas", "min-w-0 flex-1 flex-col bg-ink")}>
          <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-ink-4 px-4 py-2 text-xs">
            {target ? (
              <>
                <span className="rounded-sm bg-gold px-2 py-1 font-semibold text-ink">PATCH · {targetGroup?.name} → {targetOption?.name}</span>
                <span className="text-subtle">Preview the other options as:</span>
                {draft.groups.filter((g) => g.id !== target.groupId).map((g) => (
                  <label key={g.id} className="flex items-center gap-1.5 text-subtle">{g.name}
                    <select className={`${inputCls} w-auto py-1`} value={resolved?.selections[g.id] ?? ""} onChange={(e) => setPreview((p) => ({ ...p, [g.id]: e.target.value }))}>
                      {g.options.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </select>
                  </label>
                ))}
                <button className={btnCls} onClick={() => setPreview(defaultSelections(draft))}>Reset preview</button>
              </>
            ) : (
              <span className="rounded-sm bg-ink-4 px-2 py-1 font-semibold">BASE LAYOUT · editing the garment's nodes directly</span>
            )}
            <span className="ml-auto hidden text-subtle xl:block">Drag to move · handles to resize · arrows nudge (Shift ×10) · Ctrl+scroll zoom</span>
          </div>
          <div ref={areaRef} className="flex min-h-0 flex-1 overflow-auto p-6" onWheel={(e) => { if (e.ctrlKey) { e.preventDefault(); setZoom((z) => Math.min(3, Math.max(0.4, +(z - Math.sign(e.deltaY) * 0.1).toFixed(2)))); } }}>
            {draft.nodes.length === 0 && <p className="m-auto font-sans text-sm text-subtle">This garment has no nodes yet — add one from the Nodes tab.</p>}
            {draft.nodes.length > 0 && (
              <GarmentCanvas
                canvas={draft.canvas}
                nodes={nodes}
                guideImage={guide ? draft.baseImage : null}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onGeometryChange={applyLayout}
                className="m-auto shrink-0 bg-cream shadow-lg"
                style={{ width: fit * zoom }}
              />
            )}
          </div>
        </main>

        {/* ---------------- right: properties / patch ---------------- */}
        <aside className={PANE(pane, "right", "w-full shrink-0 flex-col border-l border-ink-4 bg-ink-2 lg:w-80")}>
          <div className="shrink-0 border-b border-ink-4 px-3 py-2.5"><span className={`${labelCls} mb-0`}>{target ? "Configuration patch" : "Node properties"}</span></div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {target
              ? <PatchPanel draft={draft} target={target} baseline={baseline} resolved={resolved} selectedId={selectedId} onSelect={setSelectedId} edit={edit} applyLayout={applyLayout} applyImage={applyImage} />
              : <PropertiesPanel node={selectedBase} edit={edit} applyLayout={applyLayout} onDelete={requestDeleteNode} />}
          </div>
        </aside>
      </div>

      {/* mobile pane switcher */}
      <nav className="flex shrink-0 border-t border-ink-4 bg-ink-2 lg:hidden">
        {[["left", "Layers & options"], ["canvas", "Canvas"], ["right", "Properties"]].map(([k, l]) => (
          <button key={k} onClick={() => setPane(k)} className={`flex-1 py-3 text-xs font-semibold uppercase ${pane === k ? "text-gold" : "text-subtle"}`}>{l}</button>
        ))}
      </nav>

      {/* ---------------- modals ---------------- */}
      <AddNodeModal open={modal === "add"} canvas={draft.canvas} onClose={() => setModal(null)} onAdd={(n) => {
        const id = uniqueId(n.name, draft.nodes.map((x) => x.id));
        edit((d) => addNode(d, n).draft);
        setSelectedId(id); setModal(null); toast.success(`Node "${n.name}" added`);
      }} />
      <ReplaceGarmentModal key={String(modal === "replace")} open={modal === "replace"} productId={productId} onClose={() => setModal(null)} onApply={(opts) => {
        edit((d) => replaceFullGarment(d, opts));
        setTarget(null); setSelectedId(null); setPreview({}); setModal(null);
        toast.success("Garment replaced in the draft. Review the nodes, then publish when ready.");
      }} />

      <Modal open={modal === "validate"} title="Validation" onClose={() => setModal(null)} size="max-w-2xl">
        {validation.issues.length === 0 ? <p className="text-sm text-gold">All checks passed. This draft can be published.</p> : (
          <ul className="space-y-2">
            {validation.issues.map((i, k) => (
              <li key={k}>
                <button
                  className={`w-full rounded-sm border-l-4 bg-ink px-3 py-2 text-left text-sm ${i.level === "error" ? "border-danger" : "border-gold"}`}
                  onClick={() => {
                    if (i.optionId) { const g = draft.groups.find((x) => x.options.some((o) => o.id === i.optionId)); if (g) { setTarget({ groupId: g.id, optionId: i.optionId }); setTab("options"); } }
                    if (i.nodeId) setSelectedId(i.nodeId);
                    setModal(null);
                  }}
                >
                  <span className="mr-2 text-xs font-semibold uppercase text-subtle">{i.level}</span>{i.message}
                </button>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      <Modal open={modal === "preview"} title="Draft preview — exactly what customers will see" onClose={() => setModal(null)} size="max-w-6xl">
        <div className="rounded-sm bg-page p-4 sm:p-6">
          <ConfiguratorView template={draft} product={product} embedded />
        </div>
      </Modal>

      <ConfirmModal open={!!confirm} message={confirm?.message} onConfirm={() => confirm?.run()} onClose={() => setConfirm(null)} />
      <ToastHost />
    </div>
  );
}
