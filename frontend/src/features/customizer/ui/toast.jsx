import { useEffect, useState } from "react";

let seq = 0;
const subs = new Set();
const push = (type, message) => {
  const t = { id: ++seq, type, message };
  subs.forEach((f) => f({ add: t }));
  setTimeout(() => subs.forEach((f) => f({ remove: t.id })), type === "error" ? 6500 : 3200);
};
export const toast = { success: (m) => push("success", m), error: (m) => push("error", m), info: (m) => push("info", m) };

/** Mount ONE <ToastHost/> per page. */
export function ToastHost() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const f = (e) => setItems((l) => (e.add ? [...l, e.add] : l.filter((x) => x.id !== e.remove)));
    subs.add(f);
    return () => subs.delete(f);
  }, []);
  const tone = { success: "border-gold text-cream", error: "border-danger text-cream", info: "border-ink-4 text-cream" };
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[120] flex max-w-sm flex-col gap-2" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={`pointer-events-auto rounded-sm border-l-4 bg-ink-2 px-4 py-3 font-sans text-sm shadow-lg ${tone[t.type]}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
