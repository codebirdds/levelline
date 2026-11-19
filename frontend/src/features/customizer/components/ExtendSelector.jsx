// src/components/ExtendSelector.jsx
import { useRef, useState } from "react";

export default function ExtendSelector({ node, canvas, onCommit, onCancel }) {
  // Box starts exactly at the node's current size
  const initial = { x: node.x, y: node.y, w: node.width, h: node.height };
  const [rect, setRect] = useState(initial);
  const [drag, setDrag] = useState(null);
  const rootRef = useRef(null);

  const toUnits = (e) => {
    const r = rootRef.current.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * canvas.width,
      y: ((e.clientY - r.top) / r.height) * canvas.height,
    };
  };

  const startHandleDrag = (e, handle) => {
    e.stopPropagation();
    e.preventDefault();
    const p = toUnits(e);
    setDrag({ type: "handle", handle, sx: p.x, sy: p.y, start: { ...rect } });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const startMoveDrag = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const p = toUnits(e);
    setDrag({ type: "move", sx: p.x, sy: p.y, start: { ...rect } });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!drag) return;
    const p = toUnits(e);
    const dx = p.x - drag.sx;
    const dy = p.y - drag.sy;

    if (drag.type === "move") {
      const s = drag.start;
      setRect({ ...s, x: s.x + dx, y: s.y + dy });
    } else if (drag.type === "handle") {
      const s = drag.start;
      let x = s.x, y = s.y, w = s.w, h = s.h;
      const id = drag.handle;
      
      // Drag outward to extend
      if (id.includes("l")) {
        const nx = Math.min(s.x + s.w - 10, s.x + dx);
        w = s.x + s.w - nx;
        x = nx;
      }
      if (id.includes("r")) w = Math.max(10, s.w + dx);
      if (id.includes("t")) {
        const ny = Math.min(s.y + s.h - 10, s.y + dy);
        h = s.y + s.h - ny;
        y = ny;
      }
      if (id.includes("b")) h = Math.max(10, s.h + dy);
      setRect({ ...s, x, y, w, h });
    }
  };

  const handles = [
    { id: "tl", x: rect.x, y: rect.y, cur: "nwse-resize" },
    { id: "tr", x: rect.x + rect.w, y: rect.y, cur: "nesw-resize" },
    { id: "bl", x: rect.x, y: rect.y + rect.h, cur: "nesw-resize" },
    { id: "br", x: rect.x + rect.w, y: rect.y + rect.h, cur: "nwse-resize" },
    { id: "t", x: rect.x + rect.w / 2, y: rect.y, cur: "ns-resize" },
    { id: "b", x: rect.x + rect.w / 2, y: rect.y + rect.h, cur: "ns-resize" },
    { id: "l", x: rect.x, y: rect.y + rect.h / 2, cur: "ew-resize" },
    { id: "r", x: rect.x + rect.w, y: rect.y + rect.h / 2, cur: "ew-resize" },
  ];

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 z-50 bg-black/20"
      onPointerMove={onPointerMove}
      onPointerUp={() => setDrag(null)}
    >
      <div
        className="absolute border-2 border-dashed border-gold bg-gold/20"
        style={{
          left: `${(rect.x / canvas.width) * 100}%`,
          top: `${(rect.y / canvas.height) * 100}%`,
          width: `${(rect.w / canvas.width) * 100}%`,
          height: `${(rect.h / canvas.height) * 100}%`,
        }}
      >
        {/* Center move area */}
        <div className="absolute inset-0 cursor-move" onPointerDown={startMoveDrag} />
        
        {/* Original node area outline (so user knows what's existing and what's new) */}
        <div 
          className="absolute border border-white/50 pointer-events-none"
          style={{
            left: `${((node.x - rect.x) / rect.w) * 100}%`,
            top: `${((node.y - rect.y) / rect.h) * 100}%`,
            width: `${(node.width / rect.w) * 100}%`,
            height: `${(node.height / rect.h) * 100}%`,
          }}
        />

        {handles.map((h) => (
          <div
            key={h.id}
            className="absolute h-3 w-3 rounded-sm bg-gold border border-ink shadow-lg"
            style={{
              left: `calc(${((h.x - rect.x) / rect.w) * 100}% - 6px)`,
              top: `calc(${((h.y - rect.y) / rect.h) * 100}% - 6px)`,
              cursor: h.cur,
            }}
            onPointerDown={(e) => startHandleDrag(e, h.id)}
          />
        ))}
      </div>

      <div className="absolute top-4 right-4 flex gap-2 z-50">
        <button className="rounded-sm bg-ink px-4 py-2 text-sm font-semibold text-cream shadow-lg hover:bg-ink-4" onClick={onCancel}>Cancel</button>
        <button className="rounded-sm bg-gold px-4 py-2 text-sm font-bold text-ink shadow-lg hover:bg-gold-dark" onClick={() => onCommit(rect)}>Apply Extension</button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-ink/90 px-4 py-2 text-sm text-cream pointer-events-none">
        Drag the handles outward to add fabric seamlessly. Click Apply.
      </div>
    </div>
  );
}