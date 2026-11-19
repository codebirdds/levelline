import { useEffect, useRef, useState } from "react";
import { resolveImageSrc } from "../storage/assetStorage.js";
import { nodeBoxStyle } from "../engine/coordinateUtils.js";

const FADE = 350;

/**
 * Fabric rendering: the node image keeps ALL its shading/seams/folds. On top sits a colour/texture layer that is
 *  - clipped to the garment piece by a CSS mask (the node's own alpha, or an explicit `fabricMask` region mask), so
 *    nothing ever colours outside the garment, and
 *  - blended with `multiply` (configurable), so shadows and stitching stay visible instead of a flat overlay.
 */
function Layer({ src, tint, opacity }) {
  const mask = tint ? resolveImageSrc(tint.mask) || src : "";
  const tex = tint?.texture ? resolveImageSrc(tint.texture) : "";
  return (
    <div className="absolute inset-0" style={{ opacity, transition: `opacity ${FADE}ms ease`, isolation: "isolate" }}>
      <img src={src} alt="" draggable={false} className="absolute inset-0 size-full select-none" />
      {tint && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: tint.color,
            backgroundImage: tex ? `url("${tex}")` : "none",
            backgroundSize: `${tint.tile}cqw`,
            backgroundBlendMode: "multiply",
            mixBlendMode: tint.blend,
            WebkitMaskImage: `url("${mask}")`,
            maskImage: `url("${mask}")`,
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            transition: "background-color .45s ease",
          }}
        />
      )}
    </div>
  );
}

/**
 * One layer of the garment. Only THIS node animates when its geometry/visibility changes,
 * and a new image is preloaded then cross-faded (no flash, no slideshow).
 */
export default function GarmentNode({ node, canvas, interactive, onPointerDown }) {
  const src = resolveImageSrc(node.image);
  const [layers, setLayers] = useState({ cur: src, prev: "", shown: true });
  const timer = useRef(null);

  useEffect(() => {
    if (src === layers.cur) return undefined;
    let alive = true;
    const swap = () => {
      if (!alive) return;
      setLayers((l) => ({ cur: src, prev: l.cur, shown: false }));
      requestAnimationFrame(() => requestAnimationFrame(() => alive && setLayers((l) => ({ ...l, shown: true }))));
      clearTimeout(timer.current);
      timer.current = setTimeout(() => alive && setLayers((l) => ({ ...l, prev: "" })), FADE + 60);
    };
    if (!src) { swap(); return () => { alive = false; }; }
    const img = new Image();
    img.onload = swap;
    img.onerror = swap;
    img.src = src;
    return () => { alive = false; };
  }, [src]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => clearTimeout(timer.current), []);

  const crop = node.crop || { top: 0, right: 0, bottom: 0, left: 0 };
  const clipPath = (crop.top || crop.right || crop.bottom || crop.left) 
    ? `inset(${crop.top}% ${crop.right}% ${crop.bottom}% ${crop.left}%)` 
    : undefined;

  // Apply flip to the transform
  const scaleX = node.flipX ? -1 : 1;
  const scaleY = node.flipY ? -1 : 1;
  const transform = `scaleX(${scaleX}) scaleY(${scaleY}) rotate(${node.rotation || 0}deg)`;

  const ease = "cubic-bezier(.22,1,.36,1)";
  return (
    <div
      data-node-id={node.id}
      onPointerDown={node.visible ? onPointerDown : undefined}
      className="absolute"
      style={{
        ...nodeBoxStyle(node, canvas),
        zIndex: node.zIndex,
        opacity: node.visible ? 1 : 0,
        pointerEvents: interactive && node.visible ? "auto" : "none",
        cursor: interactive ? (node.locked ? "not-allowed" : "move") : "default",
         transform,
        clipPath,
        transition: `left .45s ${ease}, top .45s ${ease}, width .45s ${ease}, height .45s ${ease}, transform .45s ${ease}, opacity .3s ease`,
        touchAction: interactive ? "none" : undefined,
      }}
    >
      {layers.prev && <Layer src={layers.prev} tint={node.tint} opacity={layers.shown ? 0 : 1} />}
      {layers.cur && <Layer src={layers.cur} tint={node.tint} opacity={layers.shown ? 1 : 0} />}
    </div>
  );
}
