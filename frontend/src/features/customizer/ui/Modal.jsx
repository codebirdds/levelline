import { useEffect } from "react";
import { btnCls, btnGold, btnDanger } from "./controls";

export function Modal({ open, title, onClose, children, footer, size = "max-w-lg" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div onClick={onClose} className="absolute inset-0 bg-ink/75" />
      <div className={`relative flex max-h-[90vh] w-full ${size} flex-col overflow-hidden rounded-lg border border-ink-4 bg-ink-2 text-cream shadow-lg`}>
        <div className="flex items-center justify-between border-b border-ink-4 px-5 py-3.5">
          <h3 className="font-sans text-lg font-medium text-cream">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-subtle hover:text-cream">✕</button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-ink-4 px-5 py-3.5">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmModal({ open, title = "Are you sure?", message, confirmLabel = "Delete", danger = true, onConfirm, onClose }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      size="max-w-md"
      footer={
        <>
          <button className={btnCls} onClick={onClose}>Cancel</button>
          <button className={danger ? btnDanger : btnGold} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</button>
        </>
      }
    >
      <p className="font-sans text-sm leading-relaxed text-cream/80">{message}</p>
    </Modal>
  );
}
