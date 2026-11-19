import { useRef } from "react";
import NodeImage from "./NodeImage.jsx";
import CropSelector from "./CropSelector.jsx";
import ExtendSelector from "./ExtendSelector.jsx";

export default function GarmentCanvas({
  canvas,
  nodes,
  guideImage,
  selectedId,
  onSelect,
  onGeometryChange,
  className = "",
  style,
  cropMode = false,
  onCropChange,
  onCropCancel,
  extendMode = false,
  onExtendChange,
  onExtendCancel,
}) {
  const rootRef = useRef(null);
  const dragRef = useRef(null);
  const ratio = canvas.width / canvas.height;

  const toUnits = (clientX, clientY) => {
    const r = rootRef.current.getBoundingClientRect();
    return {
      x: ((clientX - r.left) / r.width) * canvas.width,
      y: ((clientY - r.top) / r.height) * canvas.height,
    };
  };

  const startDrag = (e, node, mode) => {
    if (node.locked || cropMode || extendMode) return;
    e.stopPropagation();
    onSelect?.(node.id);
    const p = toUnits(e.clientX, e.clientY);
    dragRef.current = {
      id: node.id,
      mode,
      startX: p.x,
      startY: p.y,
      startNode: { x: node.x, y: node.y, width: node.width, height: node.height },
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const moveDrag = (e) => {
    const d = dragRef.current;
    if (!d) return;
    const p = toUnits(e.clientX, e.clientY);
    const dx = p.x - d.startX;
    const dy = p.y - d.startY;
    if (d.mode === "move") {
      onGeometryChange?.(d.id, {
        x: Math.round(d.startNode.x + dx),
        y: Math.round(d.startNode.y + dy),
      });
    } else {
      onGeometryChange?.(d.id, {
        width: Math.max(1, Math.round(d.startNode.width + dx)),
        height: Math.max(1, Math.round(d.startNode.height + dy)),
      });
    }
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  return (
    <div
      ref={rootRef}
      className={`relative select-none ${className}`}
      style={{ aspectRatio: ratio, ...style }}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      {guideImage && (
        <img
          src={guideImage}
          className="pointer-events-none absolute inset-0 h-full w-full opacity-30"
          style={{ objectFit: "contain" }}
          draggable={false}
        />
      )}

      {[...nodes]
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((node) => {
          if (!node.visible) return null;
          const active = node.id === selectedId;
          return (
            <div
              key={node.id}
              className="absolute"
              style={{
                left: `${(node.x / canvas.width) * 100}%`,
                top: `${(node.y / canvas.height) * 100}%`,
                width: `${(node.width / canvas.width) * 100}%`,
                height: `${(node.height / canvas.height) * 100}%`,
                transform: `rotate(${node.rotation || 0}deg) scaleX(${node.flipX ? -1 : 1}) scaleY(${node.flipY ? -1 : 1})`,
                zIndex: node.zIndex,
                cursor: node.locked ? "not-allowed" : (cropMode || extendMode) ? "default" : "move",
                outline: active && !cropMode && !extendMode ? "2px solid rgba(212,175,55,0.9)" : "none",
              }}
              onPointerDown={(e) => startDrag(e, node, "move")}
            >
              <NodeImage src={node.image} maskImage={node.maskImage} crop={node.crop} tint={node.tint} />
              {active && !node.locked && !cropMode && !extendMode && (
                <div
                  className="absolute -bottom-1.5 -right-1.5 h-3 w-3 cursor-nwse-resize rounded-sm bg-gold"
                  onPointerDown={(e) => startDrag(e, node, "resize")}
                />
              )}

              {cropMode && active && (
                <CropSelector
                  crop={node.crop}
                  onCommit={(c) => onCropChange?.(node.id, c)}
                  onCancel={onCropCancel}
                />
              )}
            </div>
          );
        })}

      {extendMode && selectedId && nodes.find(n => n.id === selectedId) && (
        <ExtendSelector
          node={nodes.find((n) => n.id === selectedId)}
          canvas={canvas}
          onCommit={(rect) => onExtendChange?.(selectedId, rect)}
          onCancel={onExtendCancel}
        />
      )}
    </div>
  );
}
