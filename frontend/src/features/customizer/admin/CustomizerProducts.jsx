import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GarmentCanvas from "../components/GarmentCanvas.jsx";
import ProductMetaModal from "./ProductMetaModal.jsx";
import { ConfirmModal } from "../ui/Modal.jsx";
import { ToastHost, toast } from "../ui/toast.jsx";
import { btnCls, btnDanger, btnGold } from "../ui/controls";
import { useStored } from "../hooks/useStorage.js";
import { resolveGarment } from "../engine/configurationResolver.js";
import { formatCurrency } from "../../../utils/formatCurrency";
import {
  createProduct, deleteProduct, duplicateProduct, getDraft, listProducts, resetDemoData, updateProduct, isDraftDirty,
} from "../storage/productStorage.js";

const run = (fn, ok) => { try { const r = fn(); if (ok) toast.success(ok); return r; } catch (e) { toast.error(e.message); return null; } };

export default function CustomizerProducts() {
  const navigate = useNavigate();
  const products = useStored(listProducts);
  const [form, setForm] = useState(null);
  const [confirm, setConfirm] = useState(null);

  return (
    <div className="rounded-lg bg-ink p-4 font-sans text-cream sm:p-6">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <h1 className="text-lg font-medium">Garment customizer</h1>
          <p className="text-sm text-subtle">{products.length} product{products.length === 1 ? "" : "s"}  data is stored in this browser (localStorage)</p>
        </div>
        <Link to="/customize" target="_blank" className={btnCls}>Open storefront</Link>
        <button className={btnDanger} onClick={() => setConfirm({ title: "Reset demo data?", label: "Reset", message: "This deletes ALL products, drafts, published versions and cart items in this browser and restores the sample products.", run: () => { run(resetDemoData, "Demo data restored"); } })}>Reset demo data</button>
        <button className={btnGold} onClick={() => setForm({ product: null })}>+ New product</button>
      </div>

      {products.length === 0 ? (
        <p className="rounded-sm border border-dashed border-ink-4 py-16 text-center text-sm text-subtle">No products yet. Create your first customizable garment.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => {
            const draft = getDraft(p.id);
            const nodes = draft ? resolveGarment(draft, {}).nodes.filter(n => (n.view || "front") === "front") : [];
            const pending = p.publishedVersionId && isDraftDirty(p.id);
            return (
              <li key={p.id} className="flex gap-4 rounded-sm border border-ink-4 bg-ink-2 p-3">
                <div className="w-24 shrink-0 rounded-sm bg-cream/90 p-1">
                  {draft && nodes.length > 0 ? <GarmentCanvas canvas={draft.canvas} nodes={nodes} className="w-full" /> : <div className="aspect-[5/7]" />}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-subtle">{p.category}  {formatCurrency(p.basePrice)}</p>
                  <p className="mt-1 flex flex-wrap gap-1.5 text-xs">
                    <span className={`rounded-sm px-1.5 py-0.5 font-semibold ${p.status === "published" ? "bg-gold text-ink" : "bg-ink-4 text-cream"}`}>{p.status === "published" ? `Published v${p.publishedVersionId.split("_").pop()}` : "Draft"}</span>
                    {pending && <span className="rounded-sm bg-ink-4 px-1.5 py-0.5 text-gold">unpublished changes</span>}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
                    <button className={btnGold} onClick={() => navigate(`/admin/customizer/${p.id}`)}>Open editor</button>
                    <button className={btnCls} onClick={() => setForm({ product: p })}>Edit</button>
                    <button className={btnCls} onClick={() => run(() => duplicateProduct(p.id), "Product duplicated")}>Duplicate</button>
                    <button className={`${btnCls} hover:border-danger hover:text-danger`} onClick={() => setConfirm({ title: "Delete product?", label: "Delete", message: `Delete "${p.name}", its draft and all published versions? Cart items already created keep their own snapshot.`, run: () => run(() => deleteProduct(p.id), "Product deleted") })}>Delete</button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ProductMetaModal open={!!form} product={form?.product ?? null} onClose={() => setForm(null)} onSubmit={(v) => {
        if (form.product) run(() => updateProduct(form.product.id, { name: v.name.trim(), description: v.description, category: v.category, basePrice: Number(v.basePrice), hasFlatView: v.hasFlatView }), "Product updated");
        else { const p = run(() => createProduct(v, v.preset), "Product created"); if (p) navigate(`/admin/customizer/${p.id}`); }
        setForm(null);
      }} />
      <ConfirmModal open={!!confirm} title={confirm?.title} message={confirm?.message} confirmLabel={confirm?.label} onConfirm={() => confirm?.run()} onClose={() => setConfirm(null)} />
      <ToastHost />
    </div>
  );
}
