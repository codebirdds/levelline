import { useEffect, useRef } from "react";
import GarmentNode from "./GarmentNode.jsx";
import { moveBox, nodeBoxStyle, pointerToUnits, resizeBox } from "../engine/coordinateUtils.js";
import { resolveImageSrc } from "../storage/assetStorage.js";

const HANDLES = { nw: "left-0 top-0 cursor-nwse-resize", n: "left-1/2 top-0 cursor-ns-resize", ne: "right-0 top-0 cursor-nesw-resize", e: "right-0 top-1/2 cursor-ew-resize", se: "right-0 bottom-0 cursor-nwse-resize", s: "left-1/2 bottom-0 cursor-ns-resize", sw: "left-0 bottom-0 cursor-nesw-resize", w: "left-0 top-1/2 cursor-ew-resize" };

/**
 * THE shared garment renderer (admin editor, customer page, cart, previews).
 * It only draws `nodes` in canvas units (percent-based => responsive). Editing is opt-in via `onSelect`.
 *   editableIds: restrict which nodes can be dragged/resized (undefined = all unlocked nodes)
 */
export default function GarmentCanvas({
  canvas, nodes, guideImage, selectedId, editableIds,
  onSelect, onGeometryChange, onGeometryCommit, className = "", style,
}) {
  debugger
  const wrap = useRef(null);
  const drag = useRef(null);
  const live = useRef({});
  live.current = { canvas, onGeometryChange, onGeometryCommit };
  const interactive = !!onSelect;
  const selected = nodes.find((n) => n.id === selectedId);
  const canEdit = (n) => !n.locked && (!editableIds || editableIds.includes(n.id));

  const handlers = useRef(null);
  if (!handlers.current) {
    const move = (e) => {
      const d = drag.current;
      if (!d || !wrap.current) return;
      const { canvas: c, onGeometryChange: change } = live.current;
      const { dx, dy } = pointerToUnits(e.clientX - d.sx, e.clientY - d.sy, wrap.current.getBoundingClientRect(), c);
      if (!d.moved && Math.abs(e.clientX - d.sx) + Math.abs(e.clientY - d.sy) < 3) return;
      d.moved = true;
      change?.(d.id, d.mode === "move" ? moveBox(d.start, dx, dy) : resizeBox(d.mode, d.start, dx, dy));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      if (drag.current?.moved) live.current.onGeometryCommit?.();
      drag.current = null;
    };
    handlers.current = { move, up };
  }
  useEffect(() => () => {
    window.removeEventListener("pointermove", handlers.current.move);
    window.removeEventListener("pointerup", handlers.current.up);
  }, []);

  const start = (e, node, mode) => {
    if (e.button !== undefined && e.button !== 0) return;
    e.stopPropagation();
    onSelect(node.id);
    if (!canEdit(node)) return;
    drag.current = { id: node.id, mode, sx: e.clientX, sy: e.clientY, moved: false, start: { x: node.x, y: node.y, width: node.width, height: node.height, rotation: node.rotation || 0 } };
    window.addEventListener("pointermove", handlers.current.move);
    window.addEventListener("pointerup", handlers.current.up);
  };

  return (
    <div
      ref={wrap}
      onPointerDown={interactive ? () => onSelect(null) : undefined}
      className={`relative select-none ${className}`}
      style={{ aspectRatio: `${canvas.width} / ${canvas.height}`, containerType: "inline-size", ...style }}
    >
      {guideImage && <img src={resolveImageSrc(guideImage)} alt="" draggable={false} className="pointer-events-none absolute inset-0 size-full object-contain opacity-25" />}
      {nodes.map((n) => (
        <GarmentNode key={n.id} node={n} canvas={canvas} interactive={interactive} onPointerDown={interactive ? (e) => start(e, n, "move") : undefined} />
      ))}
      {interactive && selected && (
        <div
          className={`pointer-events-none absolute border-[1.5px] ${canEdit(selected) ? "border-gold" : "border-dashed border-subtle"}`}
          style={{ ...nodeBoxStyle(selected, canvas), zIndex: 100000, transform: selected.rotation ? `rotate(${selected.rotation}deg)` : undefined }}
        >
          {canEdit(selected) && Object.entries(HANDLES).map(([h, pos]) => (
            <span
              key={h}
              onPointerDown={(e) => start(e, selected, h)}
              className={`pointer-events-auto absolute size-2.5 -translate-x-1/2 -translate-y-1/2 border border-ink bg-gold ${pos}`}
              style={{ touchAction: "none" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
