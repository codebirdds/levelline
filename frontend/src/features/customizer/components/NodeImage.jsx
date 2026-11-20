import { useId } from "react";
import { normalizeCrop, getCropBBox, isFullRect } from "../engine/cropUtils.js";
import { resolveImageSrc } from "../storage/assetStorage.js";

export default function NodeImage({ src, maskImage, crop, tint, className = "", style }) {
  const rawId = useId().replace(/[:]/g, "");
  const maskId = `mk-${rawId}`;
  const filterId = `fl-${rawId}`;
  const patternId = `pt-${rawId}`;
  const alphaMaskId = `am-${rawId}`;

  const resolved = resolveImageSrc(src);
  if (!resolved) return null;

  const resolvedMask = resolveImageSrc(maskImage || src);
  const tex = tint?.texture ? resolveImageSrc(tint.texture) : "";

  const c = normalizeCrop(crop);
  const isFull = isFullRect(c);
  const bbox = getCropBBox(c);

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

  if (isFull && !tint && !maskImage) {
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
          {!isFull && (
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
              <g filter={c.feather > 0 ? `url(#${filterId})` : undefined}>{shapeSvg}</g>
            </mask>
          )}
          
          {c.feather > 0 && (
            <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={c.feather / 10} />
            </filter>
          )}

          {(tint || maskImage) && (
            <mask id={alphaMaskId} mask-type="alpha">
              <image 
                href={resolvedMask} 
                x={imgX} 
                y={imgY} 
                width={imgW} 
                height={imgH} 
                preserveAspectRatio="none" 
              />
            </mask>
          )}

          {tex && (
            <pattern id={patternId} patternUnits="userSpaceOnUse" width="100" height="100">
              <image href={tex} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" />
            </pattern>
          )}
        </defs>
        
        <image
          href={resolved}
          x={imgX}
          y={imgY}
          width={imgW}
          height={imgH}
          preserveAspectRatio="none"
          mask={
            maskImage
              ? `url(#${alphaMaskId})`
              : (!isFull ? `url(#${maskId})` : undefined)
          }
        />

        {tint && (
          <g mask={!isFull ? `url(#${maskId})` : undefined}>
            <rect
              x="0"
              y="0"
              width="100"
              height="100"
              fill={tex ? `url(#${patternId})` : (tint.color || "transparent")}
              style={{ mixBlendMode: tint.blend || "multiply" }}
              mask={`url(#${alphaMaskId})`}
            />
          </g>
        )}
      </svg>
    </div>
  );
}
