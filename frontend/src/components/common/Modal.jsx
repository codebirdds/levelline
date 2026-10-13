import { useEffect } from "react";

export default function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden"
      style={{ position: "fixed", top: 0, right: 0, bottom: 0, left: 0, zIndex: 9999, overflow: "hidden" }}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, zIndex: 1 }}
      />
      <div
        className="absolute inset-0 flex items-center justify-center p-4"
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, zIndex: 2, overflowY: "auto" }}
      >
        <div
          className="relative w-full max-w-lg bg-surface rounded-lg shadow-xl border border-border my-auto"
          style={{ position: "relative", zIndex: 3, maxHeight: "calc(100vh - 2rem)", overflowY: "auto" }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-surface z-10">
            <h2 className="text-base font-semibold text-ink">{title}</h2>
            <button onClick={onClose} className="text-muted hover:text-ink text-lg leading-none">✕</button>
          </div>
          <div className="p-5">{children}</div>
          {footer && <div className="px-5 py-4 border-t border-border flex justify-end gap-3 sticky bottom-0 bg-surface">{footer}</div>}
        </div>
      </div>
    </div>
  );
}