import { useState } from "react";
import { TYPE } from "../../../components/common/typography";

/** Exclusive accordion. Smooth height via grid-template-rows (no measuring). Content mounts on first open. */
export default function Accordion({ items, openId, onToggle }) {
  const [seen, setSeen] = useState(() => new Set(openId ? [openId] : []));
  const toggle = (id) => {
    setSeen((s) => new Set(s).add(id));
    onToggle(openId === id ? null : id);
  };
  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((it) => {
        const open = openId === it.id;
        return (
          <section key={it.id}>
            <h3>
              <button
                type="button"
                id={`acc-${it.id}`}
                aria-expanded={open}
                aria-controls={`acc-panel-${it.id}`}
                onClick={() => toggle(it.id)}
                className="flex w-full items-center gap-4 py-5 text-left"
              >
                <span className={TYPE.h3}>{it.title}</span>
                <span className="ml-auto min-w-0 truncate font-sans text-sm text-[#808080]">{it.value}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 transition-transform duration-500 ${open ? "rotate-180" : ""}`} aria-hidden="true">
                  <path d="M5 9l7 7 7-7" />
                </svg>
              </button>
            </h3>
            <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
              <div className="overflow-hidden">
                <div id={`acc-panel-${it.id}`} role="region" aria-labelledby={`acc-${it.id}`} inert={!open} className="pb-6 pt-1">
                  {seen.has(it.id) ? it.content : null}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
