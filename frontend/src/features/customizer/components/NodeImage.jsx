// src/features/customizer/components/NodeImage.jsx
import { useId } from "react";
import { normalizeCrop, getCropBBox, isFullRect } from "../engine/cropUtils.js";
import { resolveImageSrc } from "../storage/assetStorage.js";

export default function NodeImage({ src, crop, tint, className = "", style }) {
  const rawId = useId().replace(/[:]/g, "");
  const maskId = `mk-${rawId}`;
  const filterId = `fl-${rawId}`;
  const patternId = `pt-${rawId}`;
  const alphaMaskId = `am-${rawId}`;

  const resolved = resolveImageSrc(src);
  if (!resolved) return null;

  const tex = tint?.texture ? resolveImageSrc(tint.texture) : "";

  const c = normalizeCrop(crop);
  const isFull = isFullRect(c);
  const bbox = getCropBBox(c);

  // Image positioning inside the 0-100 viewBox
  const imgX = (-bbox.x * 100) / bbox.w;
  const imgY = (-bbox.y * 100) / bbox.h;
  const imgW = 10000 / bbox.w;
  const imgH = 10000 / bbox.h;

  const toVB = (x, y) => [
    ((x - bbox.x) * 100) / bbox.w,
    ((y - bbox.y) * 100) / bbox.h,
  ];

  const shapeSvg = c.type === "polygon" ? (
    <polygon
      points={c.points.map(([x, y]) => {
        const [vx, vy] = toVB(x, y);
        return `${vx},${vy}`;
      }).join(" ")}
      fill="white"
    />
  ) : (
    <rect x="0" y="0" width="100" height="100" fill="white" />
  );

  // Optimization: If no tint AND full crop, use a simple <img>
  if (isFull && !tint) {
    return (
      <img
        src={resolved}
        draggable={false}
        className={`h-full w-full select-none ${className}`}
        style={{ objectFit: "fill", pointerEvents: "none", ...style }}
      />
    );
  }

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{ pointerEvents: "none", ...style }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          {/* Crop Mask (Rect or Polygon) */}
          {!isFull && (
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
              <g filter={c.feather > 0 ? `url(#${filterId})` : undefined}>{shapeSvg}</g>
            </mask>
          )}
          
          {/* Feather Filter */}
          {c.feather > 0 && (
            <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={c.feather / 10} />
            </filter>
          )}

          {/* 🔥 THE FIX: Alpha Mask (Uses the PNG's own transparency) */}
          {tint && (
            <mask id={alphaMaskId} mask-type="alpha">
              <image 
                href={resolved} 
                x={imgX} 
                y={imgY} 
                width={imgW} 
                height={imgH} 
                preserveAspectRatio="none" 
              />
            </mask>
          )}

          {/* Texture Pattern (if image is uploaded) */}
          {tex && (
            <pattern id={patternId} patternUnits="userSpaceOnUse" width="100" height="100">
              <image href={tex} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" />
            </pattern>
          )}
        </defs>
        
        {/* 1. Base Image */}
        <image
          href={resolved}
          x={imgX}
          y={imgY}
          width={imgW}
          height={imgH}
          preserveAspectRatio="none"
          mask={!isFull ? `url(#${maskId})` : undefined}
        />

        {/* 2. Tint / Fabric Layer */}
        {tint && (
          <g mask={!isFull ? `url(#${maskId})` : undefined}>
            <rect
              x="0"
              y="0"
              width="100"
              height="100"
              fill={tex ? `url(#${patternId})` : (tint.color || "transparent")}
              style={{ mixBlendMode: tint.blend || "multiply" }}
              // 🔥 Apply Alpha Mask so it only covers the shirt, not the white box
              mask={`url(#${alphaMaskId})`}
            />
          </g>
        )}
      </svg>
    </div>
  );
}