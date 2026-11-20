// src/components/CropSelector.jsx
import { useRef, useState } from "react";
import { normalizeCrop } from "../engine/cropUtils.js";

export default function CropSelector({ crop, onCommit, onCancel }) {
  const initial = normalizeCrop(crop);
  const [shape, setShape] = useState(initial);
  const [mode, setMode] = useState(initial.type === "polygon" ? "polygon" : "rect");
  const [draftPoints, setDraftPoints] = useState(
    initial.type === "polygon" ? initial.points : null
  );
  const [drag, setDrag] = useState(null);
  const rootRef = useRef(null);

  const toPct = (e) => {
    const r = rootRef.current.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)),
      y: Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100)),
    };
  };

  const startHandleDrag = (e, handle) => {
    e.stopPropagation();
    e.preventDefault();
    const p = toPct(e);
    setDrag({ type: "handle", handle, sx: p.x, sy: p.y, start: { ...shape } });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const startMoveDrag = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const p = toPct(e);
    setDrag({ type: "move", sx: p.x, sy: p.y, start: { ...shape } });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const startVertexDrag = (e, index) => {
    e.stopPropagation();
    e.preventDefault();
    const p = toPct(e);
    setDrag({ type: "vertex", index, sx: p.x, sy: p.y, startPoints: [...draftPoints] });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!drag) return;
    const p = toPct(e);
    const dx = p.x - drag.sx;
    const dy = p.y - drag.sy;

    if (drag.type === "move") {
      const s = drag.start;
      setShape({
        ...s,
        x: Math.max(0, Math.min(100 - s.w, s.x + dx)),
        y: Math.max(0, Math.min(100 - s.h, s.y + dy)),
      });
    } else if (drag.type === "handle") {
      const s = drag.start;
      let x = s.x, y = s.y, w = s.w, h = s.h;
      const id = drag.handle;
      if (id.includes("l")) {
        const nx = Math.max(0, Math.min(s.x + s.w - 1, s.x + dx));
        w = s.x + s.w - nx;
        x = nx;
      }
      if (id.includes("r")) w = Math.max(1, Math.min(100 - s.x, s.w + dx));
      if (id.includes("t")) {
        const ny = Math.max(0, Math.min(s.y + s.h - 1, s.y + dy));
        h = s.y + s.h - ny;
        y = ny;
      }
      if (id.includes("b")) h = Math.max(1, Math.min(100 - s.y, s.h + dy));
      setShape({ ...s, x, y, w, h });
    } else if (drag.type === "vertex") {
      setDraftPoints(drag.startPoints.map((pt, i) => (i === drag.index ? [p.x, p.y] : pt)));
    }
  };

  const onPointerUp = () => setDrag(null);

  const finish = () => {
    if (mode === "rect") {
      onCommit({
        type: "rect",
        x: shape.x,
        y: shape.y,
        w: shape.w,
        h: shape.h,
        feather: shape.feather || 0,
      });
    } else if (draftPoints && draftPoints.length >= 3) {
      onCommit({ type: "polygon", points: draftPoints, feather: shape.feather || 0 });
    }
  };

  const onSurfaceDown = (e) => {
    if (drag || mode !== "polygon") return;
    const p = toPct(e);
    setDraftPoints((pts) => [...(pts || []), [p.x, p.y]]);
  };

  const handles = [
    { id: "tl", x: shape.x, y: shape.y, cur: "nwse-resize" },
    { id: "tr", x: shape.x + shape.w, y: shape.y, cur: "nesw-resize" },
    { id: "bl", x: shape.x, y: shape.y + shape.h, cur: "nesw-resize" },
    { id: "br", x: shape.x + shape.w, y: shape.y + shape.h, cur: "nwse-resize" },
    { id: "t", x: shape.x + shape.w / 2, y: shape.y, cur: "ns-resize" },
    { id: "b", x: shape.x + shape.w / 2, y: shape.y + shape.h, cur: "ns-resize" },
    { id: "l", x: shape.x, y: shape.y + shape.h / 2, cur: "ew-resize" },
    { id: "r", x: shape.x + shape.w, y: shape.y + shape.h / 2, cur: "ew-resize" },
  ];

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 z-30"
      style={{ boxShadow: "0 0 0 2px rgba(212,175,55,.9)" }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerDown={onSurfaceDown}
    >
      <div className="pointer-events-none absolute inset-0 bg-black/40" />

      {/* Mode toggle */}
      <div className="absolute left-2 top-2 z-40 flex gap-1 rounded-sm bg-ink p-1">
        <button
          className={`px-2 py-1 text-xs font-semibold ${mode === "rect" ? "bg-gold text-ink" : "text-cream"}`}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            setMode("rect");
            setDraftPoints(null);
          }}
        >
          Rect
        </button>
        <button
          className={`px-2 py-1 text-xs font-semibold ${mode === "polygon" ? "bg-gold text-ink" : "text-cream"}`}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            setMode("polygon");
            setDraftPoints(shape.type === "polygon" ? shape.points : []);
          }}
        >
          Lasso
        </button>
      </div>

      {/* Cancel / Apply */}
      <div className="absolute right-2 top-2 z-40 flex gap-1">
        <button
          className="rounded-sm bg-ink px-2 py-1 text-xs font-semibold text-cream"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onCancel?.();
          }}
        >
          Cancel
        </button>
        <button
          className="rounded-sm bg-gold px-2 py-1 text-xs font-semibold text-ink"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            finish();
          }}
        >
          Apply
        </button>
      </div>

      {mode === "rect" && (
        <>
          <div
            className="pointer-events-none absolute border-2 border-gold"
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: `${shape.w}%`,
              height: `${shape.h}%`,
            }}
          />
          <div
            className="absolute"
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: `${shape.w}%`,
              height: `${shape.h}%`,
              cursor: "move",
            }}
            onPointerDown={startMoveDrag}
          />
          {handles.map((h) => (
            <div
              key={h.id}
              className="absolute h-3 w-3 rounded-sm bg-gold"
              style={{
                left: `calc(${h.x}% - 6px)`,
                top: `calc(${h.y}% - 6px)`,
                cursor: h.cur,
              }}
              onPointerDown={(e) => startHandleDrag(e, h.id)}
            />
          ))}
        </>
      )}

      {mode === "polygon" && draftPoints && (
        <>
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {draftPoints.length >= 2 && (
              <polyline
                points={draftPoints.map(([x, y]) => `${x},${y}`).join(" ")}
                fill="rgba(212,175,55,0.18)"
                stroke="#d4af37"
                strokeWidth="0.4"
                vectorEffect="non-scaling-stroke"
              />
            )}
            {draftPoints.length >= 3 && (
              <line
                x1={draftPoints[draftPoints.length - 1][0]}
                y1={draftPoints[draftPoints.length - 1][1]}
                x2={draftPoints[0][0]}
                y2={draftPoints[0][1]}
                stroke="#d4af37"
                strokeWidth="0.4"
                strokeDasharray="2,2"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>
          {draftPoints.map(([x, y], i) => (
            <div
              key={i}
              className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold"
              style={{ left: `${x}%`, top: `${y}%`, cursor: "move" }}
              onPointerDown={(e) => startVertexDrag(e, i)}
            />
          ))}
          <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-sm bg-ink/90 px-2 py-1 text-xs text-cream">
            Click points on the shirt outline  Apply
          </div>
        </>
      )}
    </div>
  );
}